"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { HOMEPAGE_HERO_CONTENT } from "@/data/site/homepage";

export function HomepageHero() {
  const hasDescription = HOMEPAGE_HERO_CONTENT.description.trim().length > 0;
  const titleLines = HOMEPAGE_HERO_CONTENT.title.filter((line) => line.trim().length > 0);

  function openGuidedPlanner() {
    window.dispatchEvent(new CustomEvent("oando-assistant:open"));
  }

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-neutral-100 flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/titan-patna-hq.webp"
          alt={HOMEPAGE_HERO_CONTENT.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center grayscale-[20%] opacity-90 transition-all duration-[1.5s] ease-out"
        />
      </div>

      <div className="home-shell relative z-10 w-full pt-16">
        <div className="max-w-2xl bg-white/70 backdrop-blur-md p-10 md:p-14 rounded-3xl border border-white/40 shadow-[0_32px_80px_-40px_rgba(0,0,0,0.15)]">
          <Reveal y={28} delay={0.08}>
            <h1 className="typ-display mb-6 text-neutral-950 font-normal leading-[1.1] tracking-tighter">
              {titleLines.map((line, index) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </Reveal>
          {hasDescription ? (
            <Reveal y={18} delay={0.16}>
              <p className="text-lg md:text-xl font-light leading-relaxed text-neutral-800 mb-10 max-w-lg">
                {HOMEPAGE_HERO_CONTENT.description}
              </p>
            </Reveal>
          ) : null}
          <Reveal y={12} delay={0.24}>
            <div className="flex flex-wrap gap-4">
              <Link
                href={HOMEPAGE_HERO_CONTENT.secondaryCta.href}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-neutral-950 px-10 py-3 text-sm font-medium tracking-wide text-white transition-all hover:bg-neutral-800 hover:scale-[1.02] active:scale-95"
              >
                {HOMEPAGE_HERO_CONTENT.secondaryCta.label}
              </Link>
              <button
                type="button"
                onClick={openGuidedPlanner}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white/80 border border-neutral-200 px-10 py-3 text-sm font-medium tracking-wide text-neutral-900 backdrop-blur-sm transition-all hover:bg-white hover:border-neutral-400 hover:scale-[1.02] active:scale-95"
              >
                {HOMEPAGE_HERO_CONTENT.primaryCta.label}
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
