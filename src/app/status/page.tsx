import Link from "next/link";

/**
 * Service status board. Static data for now — the point of this page is the
 * layout; wiring it to a real health endpoint is a follow-up.
 */
const SERVICES = [
  { name: "Checkout API", state: "Operational", latency: "82 ms", uptime: "99.99%" },
  { name: "Order Pipeline", state: "Operational", latency: "141 ms", uptime: "99.95%" },
  { name: "Search Index", state: "Degraded", latency: "612 ms", uptime: "99.21%" },
  { name: "Email Delivery", state: "Operational", latency: "204 ms", uptime: "99.90%" },
] as const;

const TONE: Record<string, string> = {
  Operational: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Degraded: "bg-amber-50 text-amber-700 ring-amber-200",
  Outage: "bg-red-50 text-red-700 ring-red-200",
};

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

      <ul className="mt-10 divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {SERVICES.map((service) => (
          <li key={service.name} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="font-medium text-black dark:text-zinc-50">{service.name}</p>
              <p className="mt-1 text-sm text-zinc-500">
                {service.latency} p95 · {service.uptime} uptime
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${
                TONE[service.state] ?? TONE.Outage
              }`}
            >
              {service.state}
            </span>
          </li>
        ))}
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
