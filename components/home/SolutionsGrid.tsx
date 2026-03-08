import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CAPABILITIES = [
  {
    title: "Ergonomic Seating",
    outcome:
      "Task and executive seating tuned for posture support, long-hour comfort, and dependable after-sales coverage.",
    href: "/products/seating",
    image: "/images/catalog/oando-seating--fluid-x/image-1.webp",
    accentClass: "bg-primary",
  },
  {
    title: "Scalable Workstations",
    outcome:
      "Modular systems that scale team by team with practical cable management and planning-friendly layouts.",
    href: "/products/workstations",
    image: "/images/catalog/oando-workstations--deskpro/image-1.webp",
    accentClass: "bg-primary/90",
  },
  {
    title: "Secure Storage Systems",
    outcome:
      "Lockers, pedestals, and cabinets built for secure daily use with efficient footprint planning.",
    href: "/products/storages",
    image: "/images/catalog/oando-storage--metal-storages/image-1.webp",
    accentClass: "bg-primary/80",
  },
  {
    title: "Collaboration Zones",
    outcome:
      "Flexible settings for huddles and client meetings without breaking operational flow.",
    href: "/products/soft-seating",
    image: "/images/products/imported/cocoon/image-1.webp",
    accentClass: "bg-primary/70",
  },
] as const;

export function SolutionsGrid() {
  return (
    <section className="w-full bg-white py-16 md:py-24" aria-labelledby="featured-products-heading">
      <div className="container px-6 2xl:px-0">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5 md:mb-14">
          <div>
            <p className="typ-label mb-4 text-neutral-700">Product lines</p>
            <h2 id="featured-products-heading" className="typ-section max-w-2xl text-neutral-950">
              Choose products by workspace need.
            </h2>
          </div>
          <Link
            href="/compare"
            className="link-arrow"
          >
            Compare product options
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-3 scrollbar-hide lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-7 lg:overflow-visible lg:px-0 lg:pb-0">
          {CAPABILITIES.map((cap) => (
            <article
              key={cap.title}
              className="group flex min-w-[84vw] snap-start flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white sm:min-w-[70vw] lg:min-w-0"
            >
              <div className={`h-1.5 w-full ${cap.accentClass}`} />

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

              <div className="flex flex-1 flex-col px-6 py-8 md:px-8">
                <Link
                  href={cap.href}
                  className="w-fit"
                >
                  <h3 className="typ-section mb-3 text-primary transition-colors group-hover:text-primary-hover">
                    {cap.title}
                  </h3>
                </Link>
                <p className="text-lg leading-relaxed text-neutral-800">{cap.outcome}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Link href="/products" className="link-arrow">
            Browse full catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="block text-xs font-semibold uppercase tracking-[0.22em] text-neutral-700 lg:hidden">
            Swipe to browse categories
          </p>
        </div>
      </div>
    </section>
  );
}
