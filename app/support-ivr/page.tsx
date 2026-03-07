import { VisualIVR } from "@/components/support/VisualIVR";
import { Hero } from "@/components/home/Hero";

export default function SupportPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="Support Center"
        subtitle="How can we help you today? Navigate our visual menu to find the right contact."
        showButton={false}
        backgroundImage="/images/hero/hero-3.webp"
      />
      <section className="container px-6 2xl:px-0 py-12 md:py-20">
        <VisualIVR />
      </section>
    </section>
  );
}

