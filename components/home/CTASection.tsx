"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_CTA_SECTION_CONTENT } from "@/data/site/homepage";

export function CTASection() {
  return (
    <section className="border-t border-neutral-800 bg-neutral-900 py-24 text-white">
      <div className="container mx-auto px-6 text-center lg:px-12">
        <h2 className="mb-6 text-4xl font-light md:text-5xl">
          {HOMEPAGE_CTA_SECTION_CONTENT.titleLead}{" "}
          <span className="italic text-neutral-400">{HOMEPAGE_CTA_SECTION_CONTENT.titleEmphasis}</span>{" "}
          {HOMEPAGE_CTA_SECTION_CONTENT.titleTail}
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-neutral-400">
          {HOMEPAGE_CTA_SECTION_CONTENT.description}
        </p>
        <Link
          href={HOMEPAGE_CTA_SECTION_CONTENT.cta.href}
          className="inline-flex items-center gap-2 bg-white px-8 py-4 font-medium uppercase tracking-widest text-neutral-900 transition-colors hover:bg-neutral-100"
        >
          {HOMEPAGE_CTA_SECTION_CONTENT.cta.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
