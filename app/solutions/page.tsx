import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { PartnershipBanner } from "@/components/home/PartnershipBanner";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { SOLUTIONS_DELIVERY_STEPS, SOLUTIONS_PAGE_COPY } from "@/data/site/routeCopy";

export const metadata: Metadata = {
  title: `${SOLUTIONS_PAGE_COPY.metadataTitle} | One and Only Furniture`,
  description: SOLUTIONS_PAGE_COPY.metadataDescription,
};

export default function SolutionsPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={SOLUTIONS_PAGE_COPY.heroTitle}
        subtitle={SOLUTIONS_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/hero/hero-2.webp"
      />

      <PartnershipBanner />

      <section className="container px-6 py-18 md:py-22 2xl:px-0">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="typ-label mb-4 text-neutral-700">{SOLUTIONS_PAGE_COPY.deliveryKicker}</p>
            <h2 className="typ-section max-w-3xl text-neutral-950">{SOLUTIONS_PAGE_COPY.deliveryTitle}</h2>
            <p className="mt-4 text-lg leading-relaxed text-neutral-800">
              {SOLUTIONS_PAGE_COPY.deliveryDescription}
            </p>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-neutral-200">
            <Image
              src="/images/hero/hero-1.webp"
              alt="Workspace planning and delivery"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-16">
        <div className="container px-6 2xl:px-0">
          <div className="stats-block grid grid-cols-2 gap-4 md:grid-cols-4">
            {SOLUTIONS_PAGE_COPY.stats.map((item) => (
              <div key={item.label} className="rounded-xl border border-neutral-200 bg-white p-5 text-center">
                <p className="typ-stat text-primary">{item.value}</p>
                <p className="stats-block__label mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-10">
            <p className="typ-label mb-4 text-neutral-700">{SOLUTIONS_PAGE_COPY.processKicker}</p>
            <h2 className="typ-section text-neutral-950">{SOLUTIONS_PAGE_COPY.processTitle}</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {SOLUTIONS_DELIVERY_STEPS.map((step) => (
              <article key={step.title} className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                <div className="relative aspect-16/10 border-b border-neutral-200">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="typ-h3 text-neutral-950">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700">{step.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-16">
        <div className="container px-6 2xl:px-0">
          <div className="rounded-xl border border-neutral-300 bg-white p-7 md:p-9">
            <p className="typ-label mb-4 text-neutral-700">{SOLUTIONS_PAGE_COPY.planningKicker}</p>
            <h2 className="typ-section max-w-3xl text-neutral-950">{SOLUTIONS_PAGE_COPY.planningTitle}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-800">
              {SOLUTIONS_PAGE_COPY.planningDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                {SOLUTIONS_PAGE_COPY.planningPrimaryCta}
              </Link>
              <Link href="/products" className="btn-outline">
                {SOLUTIONS_PAGE_COPY.planningSecondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
