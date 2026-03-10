"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  src: string;
  location: string;
  headline: string;
  sub: string;
  ctas: Array<{
    label: string;
    href: string;
    variant: "primary" | "secondary";
  }>;
};

const slides: Slide[] = [
  {
    src: "/images/hero/titan-patna-hero.webp",
    location: "Titan Patna",
    headline: "Titan Patna\nCollaborative Office Design",
    sub: "Premium seating, meeting, and planning systems tailored for Titan's day-to-day collaboration and leadership workflows.",
    ctas: [
      {
        label: "Configure in 3D",
        href: "/planning?type=workstations",
        variant: "primary",
      },
      {
        label: "View products",
        href: "/products",
        variant: "secondary",
      },
    ],
  },
  {
    src: "/images/hero/tvs-patna-hero.webp",
    location: "TVS Patna",
    headline: "TVS Patna\nEngineered Workspaces",
    sub: "High-performance workstation planning delivered for TVS teams in Patna with ergonomic execution at enterprise scale.",
    ctas: [
      {
        label: "Configure in 3D",
        href: "/planning?type=workstations",
        variant: "primary",
      },
      {
        label: "View products",
        href: "/products",
        variant: "secondary",
      },
    ],
  },
];

export function HeroCarousel() {
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 6000,
        stopOnInteraction: false,
      }),
    [],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [indicatorKey, setIndicatorKey] = useState(0);

  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);

  const onMouseEnter = useCallback(() => autoplay.stop(), [autoplay]);
  const onMouseLeave = useCallback(() => autoplay.play(), [autoplay]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setIndicatorKey((prev) => prev + 1);
    };

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const activeSlide = slides[selectedIndex] || slides[0];

  return (
    <section
      className="hero-section relative w-full h-[92vh] min-h-155 overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label="Featured project highlights"
    >
      <div ref={emblaRef} className="overflow-hidden h-full">
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div key={slide.location} className="relative flex-[0_0_100%] h-full">
              <Image
                src={slide.src}
                alt={slide.location}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i < 2}
                loading={i < 2 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/55 to-black/80" />

      <div className="absolute inset-0 flex flex-col justify-end pb-14 md:pb-20 px-6 md:px-14 lg:px-20">
        <div className="max-w-350 w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSlide.location}-${selectedIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <p className="mb-3 text-xs md:text-sm tracking-[0.18em] uppercase text-white/85">
                {activeSlide.location}
              </p>

              <h1 className="text-[clamp(2rem,6vw,4rem)] leading-[1.05] tracking-tight text-white whitespace-pre-line max-w-4xl">
                {activeSlide.headline}
              </h1>

              <p className="mt-5 text-base leading-[1.6] text-white/92 max-w-2xl">
                {activeSlide.sub}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {activeSlide.ctas.map((cta) => (
                  <Link
                    key={cta.label}
                    href={cta.href}
                    className={
                      cta.variant === "primary"
                        ? "inline-flex items-center gap-2 bg-[#fdbb0a] text-neutral-900 text-sm font-semibold tracking-[0.08em] uppercase px-6 py-3 hover:bg-accent2 transition-colors"
                        : "inline-flex items-center gap-2 border border-white/85 text-white text-sm font-semibold tracking-[0.08em] uppercase px-6 py-3 hover:bg-white/10 transition-colors"
                    }
                  >
                    {cta.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center border border-white/35 text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={scrollNext}
        aria-label="Next slide"
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center border border-white/35 text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className="absolute bottom-6 left-6 md:left-14 lg:left-20 z-20 flex items-center gap-3">
        {slides.map((slide, i) => (
          <button
            key={slide.location}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
            aria-label={`Go to ${slide.location}`}
            aria-current={i === selectedIndex ? "true" : undefined}
          >
            <span className="relative block h-1 w-16 overflow-hidden rounded-full bg-white/30">
              {i === selectedIndex ? (
                <motion.span
                  key={`${selectedIndex}-${indicatorKey}`}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="absolute inset-y-0 left-0 bg-[#fdbb0a]"
                />
              ) : null}
            </span>
            <span className="hidden md:inline text-[11px] tracking-[0.16em] uppercase text-white/85">
              {slide.location}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
