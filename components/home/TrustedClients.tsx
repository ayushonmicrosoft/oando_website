import Link from "next/link";
import { HOMEPAGE_TRUSTED_CLIENTS_CONTENT } from "@/data/site/homepage";

export function TrustedClients() {
  return (
    <section className="w-full border-t border-neutral-100 bg-white py-16 md:py-20">
      <div className="container px-6 2xl:px-0">
        <p className="mb-10 text-center text-xs uppercase tracking-[0.3em] text-neutral-400">
          {HOMEPAGE_TRUSTED_CLIENTS_CONTENT.kicker}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {HOMEPAGE_TRUSTED_CLIENTS_CONTENT.clients.map((client) => (
            <div
              key={client.name}
              title={client.name}
              className="select-none text-2xl font-bold tracking-tight text-neutral-200 transition-colors duration-300 hover:text-neutral-400 md:text-3xl"
            >
              {client.abbr}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-neutral-900"
          >
            {HOMEPAGE_TRUSTED_CLIENTS_CONTENT.cta}
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
