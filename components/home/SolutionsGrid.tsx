import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_SOLUTIONS_CONTENT } from "@/data/site/homepage";

export function SolutionsGrid() {
  return (
    <section className="home-section bg-white py-16 md:py-20" aria-labelledby="featured-products-heading">
      <div className="home-shell">
        {/* Header row */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 md:mb-12">
          <div>
            <p className="typ-label mb-3 text-neutral-500">{HOMEPAGE_SOLUTIONS_CONTENT.kicker}</p>
            <h2 id="featured-products-heading" className="typ-section text-neutral-950">
              {HOMEPAGE_SOLUTIONS_CONTENT.title}
            </h2>
          </div>
          <Link href="/compare" className="home-link-arrow">
            {HOMEPAGE_SOLUTIONS_CONTENT.compareCta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 4-column compact grid */}
        <div className="grid grid-cols-2 gap-px border border-neutral-200 bg-neutral-200 lg:grid-cols-4">
          {HOMEPAGE_SOLUTIONS_CONTENT.capabilities.map((cap) => (
            <Link
              key={cap.title}
              href={cap.href}
              className="group flex flex-col bg-white transition-colors duration-200 hover:bg-neutral-50"
            >
              {/* Image — square crop */}
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
                <Image
                  src={cap.image}
                  alt={cap.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>

              {/* Text */}
              <div className="px-5 py-5">
                <h3 className="text-base font-normal tracking-tight text-neutral-950 group-hover:text-neutral-600">
                  {cap.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{cap.outcome}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-colors group-hover:text-neutral-700">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/products" className="home-link-arrow">
            {HOMEPAGE_SOLUTIONS_CONTENT.catalogCta}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="block text-xs text-neutral-400 lg:hidden">
            {HOMEPAGE_SOLUTIONS_CONTENT.mobileHint}
          </p>
        </div>
      </div>
    </section>
  );
}
