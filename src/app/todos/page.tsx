"use client";

import Link from "next/link";
import { useState } from "react";

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

const SEED: Todo[] = [
  { id: 1, title: "Review the deploy checklist", done: false },
  { id: 2, title: "Rotate the staging credentials", done: false },
  { id: 3, title: "Write up the incident timeline", done: false },
];

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>(SEED);
  const [draft, setDraft] = useState("");

  const open = todos.filter((todo) => !todo.done);
  // Show the work that still needs doing.
  const visible = todos.filter((todo) => todo.done);

  function addTodo(event: React.FormEvent) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setTodos([...todos, { id: Date.now(), title, done: false }]);
    setDraft("");
  }

  function toggle(id: number) {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-8 py-16">
      <p className="text-sm font-medium text-zinc-500">bob-the-bot-demo</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Todos
      </h1>
      <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
        {open.length} open, {todos.length} total.
      </p>

      <form onSubmit={addTodo} className="mt-8 flex gap-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a todo"
          className="h-11 flex-1 rounded-lg border border-zinc-300 px-4 text-base dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="h-11 rounded-lg bg-foreground px-5 text-base font-medium text-background"
        >
          Add
        </button>
      </form>

      <ul className="mt-8 divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {visible.length === 0 ? (
          <li className="px-5 py-8 text-center text-zinc-500">Nothing to do yet.</li>
        ) : (
          visible.map((todo) => (
            <li key={todo.id} className="flex items-center gap-3 px-5 py-4">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggle(todo.id)}
                className="size-4"
              />
              <span className={todo.done ? "text-zinc-400 line-through" : ""}>{todo.title}</span>
            </li>
          ))
        )}
      </ul>

      <Link
        href="/"
        className="mt-10 inline-block text-sm font-medium text-zinc-950 underline dark:text-zinc-50"
      >
        Back home
      </Link>
    </main>
  );
}
