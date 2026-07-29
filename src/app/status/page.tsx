import Link from "next/link";

import { StatusCard } from "./StatusCard";

const SERVICES = [
  { name: "Checkout API", state: "Operational", latency: "82 ms", uptime: "99.99%" },
  { name: "Order Pipeline", state: "Operational", latency: "141 ms", uptime: "99.95%" },
  { name: "Search Index", state: "Degraded", latency: "612 ms", uptime: "99.21%" },
  { name: "Email Delivery", state: "Operational", latency: "204 ms", uptime: "99.90%" },
] as const;

export default function StatusPage() {
  const degraded = SERVICES.filter((service) => service.state !== "Operational").length;

  return (
    <main className="mx-auto w-full max-w-3xl px-8 py-16">
      <p className="text-sm font-medium text-zinc-500">bob-the-bot-demo</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Service status
      </h1>
      <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
        {degraded === 0
          ? "All systems operational."
          : `${degraded} of ${SERVICES.length} services are not fully operational.`}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {SERVICES.map((service) => (
          <StatusCard
            key={service.name}
            name={service.name}
            state={service.state}
            latency={service.latency}
            uptime={service.uptime}
          />
        ))}
      </div>

      <Link
        href="/"
        className="mt-10 inline-block text-sm font-medium text-zinc-950 underline dark:text-zinc-50"
      >
        Back home
      </Link>
    </main>
  );
}
