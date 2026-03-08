import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ContactTeaser } from "@/components/shared/ContactTeaser";

export const metadata: Metadata = {
  title: "Workspace Planning Approach | One and Only Furniture",
  description:
    "See how One and Only Furniture plans, specifies, and delivers workspace projects from brief to after-sales support.",
};

const DELIVERY_STEPS = [
  {
    title: "Brief and business requirements",
    detail:
      "We align on team structure, workflow priorities, budget range, and decision checkpoints.",
    image: "/images/catalog/oando-workstations--deskpro/image-1.webp",
  },
  {
    title: "Layout, specification, and BOQ",
    detail:
      "Design options are translated into practical category selections and quantity plans for approval.",
    image: "/images/catalog/oando-tables--curvivo-meet/image-1.webp",
  },
  {
    title: "Execution and handover support",
    detail:
      "Delivery, installation, and warranty onboarding are managed with clear communication and accountability.",
    image: "/images/catalog/oando-soft-seating--accent/image-1.webp",
  },
] as const;

const STATS = [
  { value: "14+", label: "Years in workspace projects" },
  { value: "120+", label: "Projects delivered" },
  { value: "250+", label: "Client organizations served" },
  { value: "20+", label: "Cities supported" },
] as const;

export default function SolutionsPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="How we deliver workspace projects"
        subtitle="A structured approach for planning, procurement alignment, execution, and support."
        showButton={false}
        backgroundImage="/images/hero/hero-2.webp"
      />

      <section className="container px-6 py-18 2xl:px-0 md:py-22">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="typ-label mb-4 text-neutral-700">Delivery model</p>
            <h2 className="typ-section max-w-3xl text-neutral-950">
              Built for teams that need predictability and speed.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-neutral-800">
              Every project is managed through clear scope definition, practical planning outputs,
              and accountable on-site execution. The result is smoother approvals and fewer
              surprises during rollout.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-300">
            <Image
              src="/images/hero/hero-1.webp"
              alt="Workspace planning and delivery"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-16">
        <div className="container px-6 2xl:px-0">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((item) => (
              <div key={item.label} className="rounded-xl border border-neutral-200 bg-white p-5 text-center">
                <p className="typ-stat text-primary">{item.value}</p>
                <p className="stats-block__label mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-18 md:py-22">
        <div className="container px-6 2xl:px-0">
          <div className="mb-10">
            <p className="typ-label mb-4 text-neutral-700">Process detail</p>
            <h2 className="typ-section text-neutral-950">Three phases from brief to handover.</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {DELIVERY_STEPS.map((step) => (
              <article key={step.title} className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                <div className="relative aspect-16/10 border-b border-neutral-200">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="typ-h3 text-neutral-950">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700">{step.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full border-y border-neutral-200 bg-neutral-50 py-16">
        <div className="container px-6 2xl:px-0">
          <div className="rounded-xl border border-neutral-300 bg-white p-7 md:p-9">
            <p className="typ-label mb-4 text-neutral-700">Start planning</p>
            <h2 className="typ-section max-w-3xl text-neutral-950">
              Discuss your project brief with our planning team.
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-neutral-800">
              Share site details, timelines, and seat count. We will suggest a practical approach
              for products, layout, and execution.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Request planning call
              </Link>
              <Link href="/products" className="btn-outline">
                Browse product categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ContactTeaser />
    </section>
  );
}
