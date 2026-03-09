import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { SITE_CONTACT } from "@/data/site/contact";
import { DOWNLOADS_PAGE_COPY, DOWNLOADS_RESOURCE_CATEGORIES } from "@/data/site/routeCopy";

export default function DownloadsPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={DOWNLOADS_PAGE_COPY.heroTitle}
        subtitle={DOWNLOADS_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/hero/hero-3.webp"
      />

      <section className="w-full bg-white py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-10">
            <p className="typ-label mb-4 text-neutral-700">{DOWNLOADS_PAGE_COPY.resourceKicker}</p>
            <h2 className="typ-section max-w-3xl text-neutral-950">
              {DOWNLOADS_PAGE_COPY.resourceTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {DOWNLOADS_RESOURCE_CATEGORIES.map((item) => (
              <article key={item.title} className="rounded-xl border border-neutral-300 bg-neutral-50 p-6">
                <h3 className="text-2xl font-light tracking-tight text-neutral-950">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-neutral-800">{item.detail}</p>
                <Link href={item.href} className="link-arrow mt-5">
                  {item.cta}
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-neutral-300 bg-white p-6">
            <p className="typ-label mb-3 text-neutral-700">{DOWNLOADS_PAGE_COPY.urgentKicker}</p>
            <p className="text-base leading-relaxed text-neutral-800">
              {DOWNLOADS_PAGE_COPY.urgentDescription}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                {DOWNLOADS_PAGE_COPY.primaryCta}
              </Link>
              <Link
                href={`mailto:${SITE_CONTACT.salesEmail}`}
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-neutral-400 bg-white px-6 py-3 text-sm font-semibold tracking-[0.08em] text-neutral-900 transition-colors hover:border-neutral-900 hover:bg-neutral-50"
              >
                {DOWNLOADS_PAGE_COPY.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
