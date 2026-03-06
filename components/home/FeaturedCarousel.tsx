"use client";

import { type KeyboardEvent, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_PRODUCTS = [
  {
    id: "fluid-x",
    name: "Fluid X",
    category: "Ergonomic Seating",
    image: "/images/catalog/oando-seating--fluid-x/image-1.webp",
    link: "/products/seating/oando-seating--fluid-x",
  },
  {
    id: "deskpro",
    name: "DeskPro",
    category: "Workstations",
    image: "/images/catalog/oando-workstations--deskpro/image-1.webp",
    link: "/products/workstations/oando-workstations--deskpro",
  },
] as const;

export function FeaturedCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    const frameId = window.requestAnimationFrame(onSelect);
    return () => {
      window.cancelAnimationFrame(frameId);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!emblaApi) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      emblaApi.scrollPrev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      emblaApi.scrollNext();
    }
  }

  return (
    <section className="w-full bg-neutral-50 py-16 md:py-24" aria-label="Featured products carousel">
      <div className="container px-6 2xl:px-0">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="typ-label mb-3 text-neutral-700">Featured products</p>
            <h2 className="typ-section text-neutral-900">Built for active work floors.</h2>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              data-testid="featured-prev"
              aria-label="Previous featured product"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              data-testid="featured-next"
              aria-label="Next featured product"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <Link
              href="/products"
              className="link-arrow typ-label"
            >
              Browse full catalog
            </Link>
          </div>
        </div>

        <div
          ref={emblaRef}
          className="overflow-hidden"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Featured products"
        >
          <div className="flex">
            {HERO_PRODUCTS.map((product) => (
              <div key={product.id} className="min-w-0 flex-[0_0_100%] pr-4 md:flex-[0_0_50%] md:pr-6">
                <Link
                  href={product.link}
                  className="group relative block overflow-hidden rounded-2xl bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent p-6">
                      <p className="typ-label mb-1 text-white/70">{product.category}</p>
                      <h3 className="typ-section tracking-tight text-white">{product.name}</h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between sm:hidden">
          <div className="flex items-center gap-2">
            {HERO_PRODUCTS.map((product, index) => (
              <button
                key={product.id}
                type="button"
                data-testid={`featured-dot-${index}`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={selectedIndex === index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  selectedIndex === index ? "bg-neutral-900" : "bg-neutral-300"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="featured-prev-mobile"
              aria-label="Previous featured product"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              data-testid="featured-next-mobile"
              aria-label="Next featured product"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="link-arrow typ-label"
          >
            Browse full catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
