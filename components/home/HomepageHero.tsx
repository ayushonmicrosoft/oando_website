"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { HOMEPAGE_HERO_CONTENT } from "@/data/site/homepage";

export function HomepageHero() {
  const hasDescription = HOMEPAGE_HERO_CONTENT.description.trim().length > 0;
  const titleLines = HOMEPAGE_HERO_CONTENT.title.filter((line) => line.trim().length > 0);
  const hasDeliveryTitle = HOMEPAGE_HERO_CONTENT.deliverySummary.title.trim().length > 0;
  const hasDeliveryDescription = HOMEPAGE_HERO_CONTENT.deliverySummary.description.trim().length > 0;
  const hasPrimaryEyebrow = HOMEPAGE_HERO_CONTENT.eyebrowPrimary.trim().length > 0;

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

      <div className="home-hero__shell">
        <div className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12">
          <div className="home-hero__content max-w-3xl">
            {hasPrimaryEyebrow ? (
              <Reveal y={10} delay={0.02}>
                <div className="mb-5">
                  <span className="home-note-chip">{HOMEPAGE_HERO_CONTENT.eyebrowPrimary}</span>
                </div>
              </Reveal>
            ) : null}
            <Reveal y={12} delay={0.04}>
              <div className="mb-4">
                <span className="typ-label text-neutral-700">
                  {HOMEPAGE_HERO_CONTENT.eyebrowSecondary}
                </span>
              </div>
            </Reveal>
            <Reveal y={28} delay={0.08}>
              <h1 className="typ-display mb-5 max-w-[12ch] text-neutral-950 md:mb-6">
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
                <p className="typ-lead mb-8 max-w-2xl text-neutral-700 md:mb-10">
                  {HOMEPAGE_HERO_CONTENT.description}
                </p>
              </Reveal>
            ) : null}
            <Reveal y={12} delay={0.24}>
              <div className="home-actions">
                <button
                  type="button"
                  onClick={openGuidedPlanner}
                  className="btn-hero-primary"
                >
                  {HOMEPAGE_HERO_CONTENT.primaryCta.label}
                </button>
                <Link
                  href={HOMEPAGE_HERO_CONTENT.secondaryCta.href}
                  className="btn-hero-secondary"
                >
                  {HOMEPAGE_HERO_CONTENT.secondaryCta.label}
                </Link>
              </div>
            </Reveal>
            <Reveal y={10} delay={0.3}>
              <div className="hero-proof-row">
                {HOMEPAGE_HERO_CONTENT.proofCards.map((card) => (
                  <div key={card.label} className="home-proof-card home-proof-card--glass">
                    <p className="home-proof-card__label home-proof-card__label--glass">{card.label}</p>
                    <p className="home-proof-card__value home-proof-card__value--glass">{card.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal y={20} delay={0.3}>
            <aside className="home-panel home-panel--glass home-panel--elevated max-w-md lg:ml-auto">
              <p className="home-panel__kicker home-panel__kicker--muted">
                {HOMEPAGE_HERO_CONTENT.deliverySummary.kicker}
              </p>
              {hasDeliveryTitle ? (
                <h2 className="typ-section mt-3 text-neutral-950">
                  {HOMEPAGE_HERO_CONTENT.deliverySummary.title}
                </h2>
              ) : null}
              {hasDeliveryDescription ? (
                <p className="home-panel__copy">
                  {HOMEPAGE_HERO_CONTENT.deliverySummary.description}
                </p>
              ) : null}
              <div className="mt-5 space-y-4 border-t border-neutral-200 pt-4">
                {HOMEPAGE_HERO_CONTENT.deliveryRows.map((row) => (
                  <div key={row.label} className="grid gap-1 sm:grid-cols-[92px_1fr] sm:gap-3">
                    <p className="text-sm tracking-[0.03em] text-neutral-500">{row.label}</p>
                    <p className="text-base leading-relaxed text-neutral-800">{row.value}</p>
                  </div>
                ))}
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
