import type { Metadata } from "next";
import TodoList from "@/components/todo-list";

export const metadata: Metadata = {
  title: "Todos",
  description: "A simple todo list that persists to your browser.",
};

export default function TodosPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Todos</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Add tasks, check them off, and remove the ones you no longer need.
          Everything is saved locally in your browser.
        </p>
      </header>
      <TodoList />
    </main>
  );
}
