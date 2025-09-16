// src/app/dashboard/about/page.tsx
export const dynamic = "force-static";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {children}
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <section className="rounded-3xl border bg-white p-6 md:p-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Pill>About</Pill>
            <Pill>AASTU</Pill>
            <Pill>ECE — Computer Stream</Pill>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Betelhem Alemu &amp; Abraham Hailegebriel
          </h1>
          <p className="max-w-2xl text-sm text-gray-600">
            Electrical &amp; Computer Engineering (Computer Stream) students at Addis Ababa
            Science and Technology University, focused on building reliable software for
            industry—clean UIs, secure APIs, and trustworthy data.
          </p>
        </div>
      </section>

      {/* Focus & Current Work (skills removed) */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-900">Focus</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>• SCADA-style dashboards &amp; telemetry</li>
            <li>• REST APIs &amp; authentication</li>
            <li>• Data modeling &amp; billing workflows</li>
          </ul>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-900">Current Work</h3>
          <p className="mt-3 text-sm text-gray-700">
            Full-stack SCADA prototype with secure login, device/reading management, and
            production-grade billing powered by Prisma &amp; PostgreSQL.
          </p>
        </div>
      </section>

      {/* Call to action */}
      <section className="rounded-2xl border bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-900">Let’s connect</div>
            <p className="text-sm text-gray-600">
              Interested in collaborating or reviewing our work? We’re happy to share a demo.
            </p>
          </div>
          <a
            href="/connect"
            className="inline-flex items-center justify-center rounded-xl border bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
          >
            Get in touch
          </a>
        </div>
      </section>
    </div>
  );
}
