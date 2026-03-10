import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_SOLUTIONS_CONTENT } from "@/data/site/homepage";

export function SolutionsGrid() {
  return (
    <section className="home-section home-section--sand py-16 md:py-20" aria-labelledby="featured-products-heading">
      <div className="home-shell">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 md:mb-12">
          <div>
            <p className="typ-label mb-4 text-neutral-700">{HOMEPAGE_SOLUTIONS_CONTENT.kicker}</p>
            <h2 id="featured-products-heading" className="typ-section max-w-2xl text-neutral-950">
              {HOMEPAGE_SOLUTIONS_CONTENT.title}
            </h2>
          </div>
          <Link
            href="/compare"
            className="home-link-arrow"
          >
            {HOMEPAGE_SOLUTIONS_CONTENT.compareCta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-3 scrollbar-hide lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-7 lg:overflow-visible lg:px-0 lg:pb-0">
          {HOMEPAGE_SOLUTIONS_CONTENT.capabilities.map((cap) => (
            <article
              key={cap.title}
              className="group flex min-w-[84vw] snap-start flex-col overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white sm:min-w-[70vw] lg:min-w-0"
            >
              <Link
                href={cap.href}
                className="relative block aspect-16/10 w-full overflow-hidden bg-neutral-100"
                aria-label={`Open ${cap.title}`}
              >
                <Image
                  src={cap.image}
                  alt={cap.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </Link>

                <div className="flex flex-1 flex-col px-5 py-5 md:px-6 md:py-6">
                <Link
                  href={cap.href}
                  className="w-fit"
                >
                  <h3 className="text-[1.3rem] tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-600">
                    {cap.title}
                  </h3>
                </Link>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-700">{cap.outcome}</p>
                <div className="mt-5 text-sm text-neutral-900">Explore route</div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Link href="/products" className="home-link-arrow">
            {HOMEPAGE_SOLUTIONS_CONTENT.catalogCta}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="block text-xs font-normal tracking-[0.04em] text-neutral-700 lg:hidden">
            {HOMEPAGE_SOLUTIONS_CONTENT.mobileHint}
          </p>
        </div>
      </div>
    </section>
  );
}
