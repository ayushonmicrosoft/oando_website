"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_PROCESS_CONTENT } from "@/data/site/homepage";

export function ProcessSection() {
  return (
    <section className="home-section home-section--sand py-18 md:py-24">
      <div className="home-shell">
        <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="home-kicker mb-4 text-neutral-700">{HOMEPAGE_PROCESS_CONTENT.kicker}</p>
            <h2 className="home-heading max-w-3xl">
              {HOMEPAGE_PROCESS_CONTENT.title}
            </h2>
            <p className="typ-lead mt-4 max-w-2xl text-neutral-700">
              {HOMEPAGE_PROCESS_CONTENT.description}
            </p>
          </div>
          <Link href={HOMEPAGE_PROCESS_CONTENT.cta.href} className="home-btn-primary self-start md:self-auto">
            {HOMEPAGE_PROCESS_CONTENT.cta.label} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {HOMEPAGE_PROCESS_CONTENT.steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.07, duration: 0.5, ease: "easeOut" }}
              className="home-step-card group"
            >
              <p className="home-step-card__step">Step {index + 1}</p>
              <p className="mb-2 text-xl font-normal leading-tight tracking-tight text-neutral-950">
                {step.title}
              </p>
              <p className="text-base leading-relaxed text-neutral-700">{step.detail}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="home-chip home-chip--accent">{step.sla}</span>
                <span className="home-step-card__meta">{step.deliverable}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
