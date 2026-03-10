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
    <section className="home-hero">
      <div className="home-hero__media">
        <Image
          src="/images/hero/titan-patna-hq.webp"
          alt={HOMEPAGE_HERO_CONTENT.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="home-hero__overlay" />
        <div className="home-hero__fade" />
      </div>

      <div className="home-hero__shell flex w-full items-center">
        <div className="home-hero__content max-w-4xl py-24 md:py-32">
          <Reveal y={28} delay={0.08}>
            <h1 className="typ-display mb-6 md:mb-8 text-neutral-950 font-normal tracking-tight">
              {titleLines.map((line, index) => (
                <span key={line} className="block">
                  {line}
                  {index < titleLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>
          </Reveal>
          {hasDescription ? (
            <Reveal y={18} delay={0.16}>
              <p className="typ-lead mb-10 max-w-2xl text-neutral-700 md:mb-12">
                {HOMEPAGE_HERO_CONTENT.description}
              </p>
            </Reveal>
          ) : null}
          <Reveal y={12} delay={0.24}>
            <div className="flex flex-wrap gap-4">
              <Link
                href={HOMEPAGE_HERO_CONTENT.secondaryCta.href}
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-neutral-900 px-8 py-3 text-sm font-medium tracking-[0.03em] text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                {HOMEPAGE_HERO_CONTENT.secondaryCta.label}
              </Link>
              <button
                type="button"
                onClick={openGuidedPlanner}
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-white border border-neutral-300 px-8 py-3 text-sm font-medium tracking-[0.03em] text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
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
