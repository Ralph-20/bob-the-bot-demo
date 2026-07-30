"use client";

import { useState, useSyncExternalStore } from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const STORAGE_KEY = "todos";
const EMPTY: Todo[] = [];

// localStorage-backed store. useSyncExternalStore subscribes to it, which keeps
// reads hydration-safe: the server snapshot is always empty and the client only
// diverges after mount, avoiding a hydration mismatch.
const todoStore = (() => {
  let cache: Todo[] = EMPTY;
  const listeners = new Set<() => void>();

  function read(): Todo[] {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return EMPTY;
      const parsed: unknown = JSON.parse(stored);
      return Array.isArray(parsed) ? (parsed as Todo[]) : EMPTY;
    } catch {
      // Corrupt or unavailable storage — fall back to empty rather than crash.
      return EMPTY;
    }
  }

  return {
    subscribe(listener: () => void) {
      // Seed the cache from storage on first client subscription.
      cache = read();
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY) {
          cache = read();
          listener();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot(): Todo[] {
      return cache;
    },
    getServerSnapshot(): Todo[] {
      return EMPTY;
    },
    set(updater: (prev: Todo[]) => Todo[]) {
      cache = updater(cache);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
      listeners.forEach((l) => l());
    },
  };
})();

export default function TodoList() {
  const todos = useSyncExternalStore(
    todoStore.subscribe,
    todoStore.getSnapshot,
    todoStore.getServerSnapshot,
  );
  const [draft, setDraft] = useState("");

  function addTodo() {
    const text = draft.trim();
    if (!text) return;
    todoStore.set((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, done: false },
    ]);
    setDraft("");
  }

  function toggleTodo(id: string) {
    todoStore.set((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  }

  function deleteTodo(id: string) {
    todoStore.set((prev) => prev.filter((todo) => todo.id !== id));
  }

  const remaining = todos.filter((todo) => !todo.done).length;

  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo"
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:placeholder:text-zinc-500"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Add
        </button>
      </form>

      {todos.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">No todos yet.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Mark "${todo.text}" as ${todo.done ? "not done" : "done"}`}
                className="h-4 w-4 shrink-0 accent-zinc-900 dark:accent-zinc-100"
              />
              <span
                className={`flex-1 text-sm ${
                  todo.done
                    ? "text-zinc-400 line-through"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {todo.text}
              </span>
              <button
                type="button"
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete "${todo.text}"`}
                className="shrink-0 rounded px-2 py-1 text-xs font-medium text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <footer className="border-t border-zinc-200 pt-3 text-sm text-zinc-500 dark:border-zinc-800">
          {remaining} {remaining === 1 ? "item" : "items"} remaining
        </footer>
      )}
    </div>
  );
}
