import { Leaf, Recycle, Lightbulb } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { ContactTeaser } from "@/components/shared/ContactTeaser";
import { Newsletter } from "@/components/shared/Newsletter";

export default function SustainabilityPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="Thinking Green."
        subtitle="Sustainability is deeply rooted in our corporate philosophy. For us, sustainable action means thinking about tomorrow, today."
        showButton={false}
        backgroundImage="/images/products/imported/halo/image-1.webp"
      />

      <section className="container px-6 py-24 2xl:px-0">
        <div className="mx-auto mb-20 max-w-4xl space-y-8 text-center">
          <h2 className="typ-h1 text-neutral-900">
            Our Responsibility for the <span className="text-primary italic">Future.</span>
          </h2>
          <p className="text-base leading-relaxed text-neutral-600 md:text-lg">
            Sustainable furniture construction starts with the selection of materials and does not
            end with production. We take a holistic view of our ecological footprint.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          <div className="group space-y-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/8 transition-colors group-hover:bg-primary/15">
              <Leaf className="h-10 w-10 text-primary" />
            </div>
            <h3 className="typ-h3 border-l-2 border-primary pl-4 text-neutral-900">
              Eco-friendly materials
            </h3>
            <p className="text-base leading-relaxed text-neutral-600 md:text-lg">
              We use responsibly sourced wood and low-emission materials that reduce impact
              without compromising durability.
            </p>
          </div>

          <div className="group space-y-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/8 transition-colors group-hover:bg-primary/15">
              <Recycle className="h-10 w-10 text-primary" />
            </div>
            <h3 className="typ-h3 border-l-2 border-primary pl-4 text-neutral-900">
              Circular economy
            </h3>
            <p className="text-base leading-relaxed text-neutral-600 md:text-lg">
              Our products are designed to be disassembled and recycled. Up to 98% of materials
              can return to the cycle in a closed-loop system.
            </p>
          </div>

          <div className="group space-y-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/8 transition-colors group-hover:bg-primary/15">
              <Lightbulb className="h-10 w-10 text-primary" />
            </div>
            <h3 className="typ-h3 border-l-2 border-primary pl-4 text-neutral-900">
              Energy efficiency
            </h3>
            <p className="text-base leading-relaxed text-neutral-600 md:text-lg">
              Our production workflow prioritizes efficient energy use and cleaner power sources
              across operations.
            </p>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div>
            <h2 className="typ-h2 mb-6 text-neutral-900">Our Eco-Score System</h2>
            <p className="mb-6 text-base leading-relaxed text-neutral-600 md:text-lg">
              Transparency is the foundation of structural change. We use an Eco-Score rating (1
              to 10) for every product in our catalog. This metric evaluates the complete lifecycle
              of our furniture systems.
            </p>
            <ul className="space-y-4 text-base text-neutral-600 md:text-lg">
              <li className="flex gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
                  1
                </span>
                <span>
                  <strong>Materials:</strong> Preference for recycled aluminum, responsibly
                  sourced woods, and post-consumer plastics.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
                  2
                </span>
                <span>
                  <strong>Manufacturing:</strong> Partnering with local factories to reduce transit
                  emissions significantly.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
                  3
                </span>
                <span>
                  <strong>Longevity:</strong> Heavy-duty construction and verified quality
                  benchmarks help keep products out of landfills for longer.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-8 rounded-2xl border border-neutral-100 bg-neutral-50 p-10 md:p-12">
            <div>
              <h3 className="typ-h3 mb-2 text-neutral-900">Eco-Score: 8+</h3>
              <p className="text-base text-neutral-600">
                Products in this range use a majority of recycled or renewable materials, are
                produced with lower freight impact, and are designed for long service life.
              </p>
            </div>
            <div className="h-px bg-neutral-200" />
            <div>
              <h3 className="typ-h3 mb-2 text-neutral-900">Eco-Score: 5-7</h3>
              <p className="text-base text-neutral-600">
                These products meet core environmental baselines with selected sustainable inputs,
                safer adhesives, and replaceable wear components.
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-24 overflow-hidden rounded-3xl bg-neutral-900 p-12 text-white">
          <div className="absolute -mr-32 -mt-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl right-0 top-0" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-12 md:flex-row">
            <div className="max-w-xl">
              <h3 className="typ-h2 mb-4 text-white">Verified sustainability</h3>
              <p className="text-base leading-relaxed text-white/75 md:text-lg">
                Our sustainability program is tracked with independent benchmarks and regular
                internal quality audits.
              </p>
            </div>
            <div className="flex items-center gap-8 rounded-2xl bg-white/5 p-8 backdrop-blur-sm">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 text-center text-xs uppercase tracking-[0.12em] text-white/85">
                Low emission
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 text-center text-xs uppercase tracking-[0.12em] text-white/85">
                Responsible source
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 text-center text-xs uppercase tracking-[0.12em] text-white/85">
                Long life
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <ContactTeaser />
    </section>
  );
}
