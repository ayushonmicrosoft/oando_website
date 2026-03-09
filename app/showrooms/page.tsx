import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { BrandStatement } from "@/components/home/BrandStatement";
import { CollaborationSection } from "@/components/home/CollaborationSection";
import { ClientQuote } from "@/components/home/ClientQuote";
import { Teaser } from "@/components/home/Teaser";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import {
  SHOWROOMS_CLIENTS,
  SHOWROOMS_HIGHLIGHTS,
  SHOWROOMS_PAGE_COPY,
} from "@/data/site/routeCopy";
import { getBusinessStats } from "@/lib/businessStats";
import { formatKpiAsOf, formatKpiValuePlus } from "@/lib/kpiFormat";

export default async function ShowroomsPage() {
  const { stats } = await getBusinessStats();
  const asOfLabel = formatKpiAsOf(stats.asOfDate);

  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={SHOWROOMS_PAGE_COPY.heroTitle}
        subtitle={SHOWROOMS_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/hero/dmrc-hero.webp"
      />

      <section className="w-full border-y border-neutral-200 bg-white py-16 md:py-20">
        <div className="container px-6 2xl:px-0">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <p className="typ-label text-neutral-700">{SHOWROOMS_PAGE_COPY.trustedKicker}</p>
            <p className="typ-label text-neutral-700">{asOfLabel}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-neutral-300 bg-neutral-50 px-6 py-5">
              <p className="typ-stat text-neutral-950">{formatKpiValuePlus(stats.clientOrganisations)}</p>
              <p className="mt-2 text-sm font-medium text-neutral-800">Client organisations</p>
            </div>
            <div className="rounded-xl border border-neutral-300 bg-neutral-50 px-6 py-5">
              <p className="typ-stat text-neutral-950">{formatKpiValuePlus(stats.projectsDelivered)}</p>
              <p className="mt-2 text-sm font-medium text-neutral-800">Projects delivered</p>
            </div>
            <div className="rounded-xl border border-neutral-300 bg-neutral-50 px-6 py-5">
              <p className="typ-stat text-neutral-950">{formatKpiValuePlus(stats.sectorsServed)}</p>
              <p className="mt-2 text-sm font-medium text-neutral-800">Sectors served</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-10">
            <p className="typ-label mb-3 text-neutral-700">{SHOWROOMS_PAGE_COPY.aboutKicker}</p>
            <h2 className="typ-section max-w-3xl text-neutral-950">{SHOWROOMS_PAGE_COPY.aboutTitle}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-800">
              {SHOWROOMS_PAGE_COPY.aboutDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <p className="typ-label mb-5 text-neutral-700">{SHOWROOMS_PAGE_COPY.clientsKicker}</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {SHOWROOMS_CLIENTS.map((client) => (
              <div
                key={client}
                className="rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold text-neutral-800"
              >
                {client}
              </div>
            ))}
          </div>
          <Link href="/trusted-by" className="link-arrow mt-6">
            {SHOWROOMS_PAGE_COPY.clientsCta}
          </Link>
        </div>
      </section>

      <section className="w-full bg-white py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <p className="typ-label mb-5 text-neutral-700">{SHOWROOMS_PAGE_COPY.highlightsKicker}</p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {SHOWROOMS_HIGHLIGHTS.map((item) => (
              <article key={item.title} className="rounded-xl border border-neutral-300 bg-neutral-50 p-6">
                <h3 className="text-2xl font-light tracking-tight text-neutral-950">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-800">{item.detail}</p>
              </article>
            ))}
          </div>
          <Link href="/portfolio" className="link-arrow mt-6">
            {SHOWROOMS_PAGE_COPY.highlightsCta}
          </Link>
        </div>
      </section>

      <FeaturedCarousel />
      <BrandStatement />
      <CollaborationSection />
      <Teaser
        title={SHOWROOMS_PAGE_COPY.sustainabilityTitle}
        subtitle={SHOWROOMS_PAGE_COPY.sustainabilitySubtitle}
        description={SHOWROOMS_PAGE_COPY.sustainabilityDescription}
        linkText={SHOWROOMS_PAGE_COPY.sustainabilityCta}
        linkUrl="/sustainability"
        imageSrc="/projects/OMC-Porbandar/IMG_3498.webp"
        imageAlt="Sustainable office furniture project"
        lightMode
      />
      <ClientQuote />

      <ContactTeaser />
    </section>
  );
}
