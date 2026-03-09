import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ClientBadge } from "@/components/ClientBadge";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { ABOUT_PAGE_COPY } from "@/data/site/routeCopy";
import { TRUSTED_BY_CLIENTS, TRUSTED_BY_STATS } from "@/data/site/proof";

export default function AboutPage() {
  const featuredClients = TRUSTED_BY_CLIENTS.slice(0, 8);

  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={ABOUT_PAGE_COPY.heroTitle}
        subtitle={ABOUT_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/hero/hero-1.webp"
      />

      <section className="container px-6 py-18 2xl:px-0 md:py-22">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-16/11 overflow-hidden rounded-2xl border border-neutral-200">
            <Image
              src="/images/hero/hero-2.webp"
              alt="Workspace delivery by One and Only Furniture"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-5">
            <p className="typ-label text-neutral-700">{ABOUT_PAGE_COPY.sectionKicker}</p>
            <h2 className="typ-section text-neutral-950">{ABOUT_PAGE_COPY.sectionTitle}</h2>
            {ABOUT_PAGE_COPY.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-neutral-800 md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-16">
        <div className="container px-6 2xl:px-0">
          <div className="stats-block grid grid-cols-2 gap-4 md:grid-cols-4">
            {TRUSTED_BY_STATS.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-neutral-200 bg-white p-6 text-center"
              >
                <p className="typ-stat text-primary">{item.value}</p>
                <p className="stats-block__label mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container px-6 py-18 2xl:px-0 md:py-22">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="typ-label mb-3 text-neutral-700">{ABOUT_PAGE_COPY.confidenceKicker}</p>
            <h2 className="typ-section text-neutral-950">{ABOUT_PAGE_COPY.confidenceTitle}</h2>
          </div>
          <Link href="/trusted-by" className="btn-outline">
            {ABOUT_PAGE_COPY.confidenceCta}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredClients.map((client) => (
            <ClientBadge key={client.name} {...client} />
          ))}
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
