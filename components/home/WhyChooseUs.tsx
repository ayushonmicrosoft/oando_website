"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Leaf, Activity } from "lucide-react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { HOMEPAGE_WHY_CHOOSE_US_CONTENT } from "@/data/site/homepage";

const ICON_MAP = {
  activity: Activity,
  shield: ShieldCheck,
  leaf: Leaf,
  zap: Zap,
} as const;

export function WhyChooseUs() {
  const { ref, isVisible } = useInViewOnce();

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div
          ref={ref}
          className={`reveal-on-scroll mb-16 max-w-3xl ${isVisible ? "visible" : ""}`}
        >
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
            {HOMEPAGE_WHY_CHOOSE_US_CONTENT.kicker}
          </p>
          <h2 className="mb-6 text-3xl tracking-tight text-neutral-900 md:text-4xl">
            {HOMEPAGE_WHY_CHOOSE_US_CONTENT.titleLead}
            <br />
            <span className="italic text-primary">{HOMEPAGE_WHY_CHOOSE_US_CONTENT.titleEmphasis}</span>
          </h2>
          <p className="text-lg leading-relaxed text-neutral-500">
            {HOMEPAGE_WHY_CHOOSE_US_CONTENT.description}
          </p>
          <ul className="mt-8 flex flex-wrap gap-4">
            {HOMEPAGE_WHY_CHOOSE_US_CONTENT.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-0 border-t border-neutral-200 md:grid-cols-2 lg:grid-cols-4">
          {HOMEPAGE_WHY_CHOOSE_US_CONTENT.features.map((feature, index) => {
            const Icon = ICON_MAP[feature.icon];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group border-b border-neutral-200 p-8 transition-colors hover:bg-neutral-50 lg:border-b-0 lg:border-r last:border-r-0"
              >
                <div className="mb-6 text-neutral-900 transition-colors group-hover:text-primary">
                  <Icon className="h-8 w-8" strokeWidth={1} />
                </div>
                <h3 className="mb-3 text-xl font-medium tracking-tight text-neutral-900">
                  {feature.title}
                </h3>
                <p className="text-[15px] font-light leading-relaxed text-neutral-500">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
