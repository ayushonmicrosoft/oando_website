import Link from "next/link";
import { ClientBadge, type ClientBadgeData } from "@/components/ClientBadge";
import { HOMEPAGE_OUR_WORK_CONTENT } from "@/data/site/homepage";
import { formatTrustedClientsFooter } from "@/lib/kpiFormat";

const FEATURED_CLIENTS: ClientBadgeData[] = [...HOMEPAGE_OUR_WORK_CONTENT.featuredClients];

interface OurWorkProps {
  clientCount: number;
}

export function OurWork({ clientCount }: OurWorkProps) {
  return (
    <section className="w-full border-t border-neutral-200 bg-neutral-50 py-20 md:py-28">
      <div className="container-wide">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
              {HOMEPAGE_OUR_WORK_CONTENT.kicker}
            </p>
            <h2 className="text-3xl leading-tight tracking-tight text-neutral-900 md:text-4xl">
              {HOMEPAGE_OUR_WORK_CONTENT.title}
            </h2>
          </div>
          <Link
            href="/projects"
            className="shrink-0 border-b border-neutral-300 pb-1 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
          >
            {HOMEPAGE_OUR_WORK_CONTENT.cta} -
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {FEATURED_CLIENTS.map((client) => (
            <ClientBadge key={client.name} {...client} />
          ))}
        </div>

        <p data-testid="kpi-clients-footer" className="mt-8 text-center text-xs font-medium tracking-wide text-neutral-400">
          {formatTrustedClientsFooter(clientCount)}
        </p>
      </div>
    </section>
  );
}
