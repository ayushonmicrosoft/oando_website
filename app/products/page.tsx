import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { PRODUCTS_PAGE_COPY } from "@/data/site/routeCopy";

const PILLAR_ICONS = {
  "check-circle": CheckCircle2,
  clock: Clock3,
  shield: ShieldCheck,
} as const;

export default function ProductsPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={PRODUCTS_PAGE_COPY.heroTitle}
        subtitle={PRODUCTS_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/products/60x30-workstation-1.webp"
      />

      <section className="container px-6 py-18 2xl:px-0 md:py-22">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="typ-label mb-4 text-neutral-700">{PRODUCTS_PAGE_COPY.strategyKicker}</p>
            <h2 className="typ-section max-w-3xl text-neutral-950">
              {PRODUCTS_PAGE_COPY.strategyTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-800">
              {PRODUCTS_PAGE_COPY.strategyDescription}
            </p>
            <div className="mt-6 space-y-3">
              {PRODUCTS_PAGE_COPY.featureBullets.map((item) => (
                <p key={item} className="text-base text-neutral-800">
                  - {item}
                </p>
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-300">
            <Image
              src="/images/catalog/oando-workstations--deskpro/image-1.webp"
              alt="Workspace product category showcase"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <CategoryGrid />

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-10 max-w-3xl">
            <p className="typ-label mb-4 text-neutral-700">{PRODUCTS_PAGE_COPY.whyKicker}</p>
            <h2 className="typ-section text-neutral-950">{PRODUCTS_PAGE_COPY.whyTitle}</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PRODUCTS_PAGE_COPY.pillars.map((pillar) => {
              const Icon = PILLAR_ICONS[pillar.icon];
              return (
              <article key={pillar.title} className="rounded-xl border border-neutral-300 bg-white p-6">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-2xl font-light tracking-tight text-neutral-950">{pillar.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-800">{pillar.detail}</p>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-16">
        <div className="container px-6 2xl:px-0">
          <div className="rounded-2xl border border-neutral-300 bg-neutral-50 p-8 md:p-10">
            <p className="typ-label mb-4 text-neutral-700">{PRODUCTS_PAGE_COPY.consultKicker}</p>
            <h2 className="typ-section max-w-3xl text-neutral-950">
              {PRODUCTS_PAGE_COPY.consultTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-800">
              {PRODUCTS_PAGE_COPY.consultDescription}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                {PRODUCTS_PAGE_COPY.consultPrimaryCta}
              </Link>
              <Link href="/planning" className="btn-outline">
                {PRODUCTS_PAGE_COPY.consultSecondaryCta}
              </Link>
              <Link href="/planning" className="btn-outline">
                {PRODUCTS_PAGE_COPY.consultTertiaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-14">
        <div className="container px-6 2xl:px-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="typ-label text-neutral-700">{PRODUCTS_PAGE_COPY.confidenceKicker}</p>
            <Link href="/compare" className="link-arrow">
              {PRODUCTS_PAGE_COPY.confidenceCta}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
            {PRODUCTS_PAGE_COPY.clients.map((client) => (
              <p
                key={client}
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-center text-sm font-medium text-neutral-800"
              >
                {client}
              </p>
            ))}
          </div>
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
