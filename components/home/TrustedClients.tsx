import Link from "next/link";
import Image from "next/image";
import { HOMEPAGE_TRUSTED_CLIENTS_CONTENT } from "@/data/site/homepage";

export function TrustedClients() {
  return (
    <section className="w-full border-t border-neutral-100 bg-white py-16 md:py-24">
      <div className="container px-6 2xl:px-0">
        <p className="mb-12 text-center text-xs uppercase tracking-[0.3em] font-medium text-neutral-400">
          {HOMEPAGE_TRUSTED_CLIENTS_CONTENT.kicker}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 md:gap-x-20">
          {HOMEPAGE_TRUSTED_CLIENTS_CONTENT.clients.map((client) => (
            <div
              key={client.name}
              title={client.name}
              className="relative h-12 w-32 md:h-16 md:w-36 transition-all duration-300 opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
            >
              <Image
                src={client.src}
                alt={`${client.name} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 120px, 150px"
              />
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
