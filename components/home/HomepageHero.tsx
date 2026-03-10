"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { HOMEPAGE_HERO_CONTENT } from "@/data/site/homepage";

export function HomepageHero() {
  const titleLines = HOMEPAGE_HERO_CONTENT.title.filter((line) => line.trim().length > 0);

  function openGuidedPlanner() {
    window.dispatchEvent(new CustomEvent("oando-assistant:open"));
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-neutral-900 flex items-center justify-center">
      {/* ─── Background & Overlay ─── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/titan-patna-hq.webp"
          alt={HOMEPAGE_HERO_CONTENT.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center grayscale-[10%]"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-brightness-[0.8]" />
      </div>

      {/* ─── Centered Content ─── */}
      <div className="home-shell relative z-10 w-full px-6 text-center">
        <div className="mx-auto max-w-4xl">
          <Reveal y={24} delay={0.08}>
            <h1 className="typ-display mb-6 text-white font-normal leading-[1.05] tracking-tight">
              {titleLines.map((line, index) => (
                <span key={line} className="block">
                  {index === titleLines.length - 1 ? (
                    <em className="not-italic italic font-serif opacity-95">{line}</em>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>
          </Reveal>
          


          <Reveal y={12} delay={0.24}>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <Link
                href={HOMEPAGE_HERO_CONTENT.secondaryCta.href}
                className="inline-flex min-h-[56px] items-center justify-center rounded-sm bg-white px-10 text-sm font-medium uppercase tracking-[0.1em] text-neutral-900 transition-all hover:bg-white/90 hover:scale-[1.02]"
              >
                {HOMEPAGE_HERO_CONTENT.secondaryCta.label}
                <span className="ml-2">→</span>
              </Link>
              
              <button
                type="button"
                onClick={openGuidedPlanner}
                className="inline-flex min-h-[56px] items-center justify-center rounded-sm border border-white/30 bg-white/10 px-10 text-sm font-medium uppercase tracking-[0.1em] text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/50"
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
