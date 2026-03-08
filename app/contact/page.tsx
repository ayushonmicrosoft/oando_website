import { MapPin, Phone, Mail } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { CustomerQueryForm } from "@/components/contact/CustomerQueryForm";

export default function ContactPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="Contact us"
        subtitle="Share your workspace requirement and our team will respond with next steps."
        showButton={false}
        backgroundImage="/images/hero/tvs-patna-enhanced.webp"
      />
      <section className="container px-6 2xl:px-0 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h3 className="typ-section text-neutral-950">Office and support contacts</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div className="font-light text-neutral-800">
                  <p className="mb-1 font-medium text-neutral-950">Corporate office</p>
                  <p>401, Jagat Trade Centre</p>
                  <p>Frazer Road</p>
                  <p>Patna - 800 013</p>
                  <p>India</p>
                  <p className="mb-1 mt-4 font-medium text-neutral-950">Showroom</p>
                  <p>One and Only Furniture Pvt Ltd</p>
                  <p>Opp Patliputra Telephone Exchange</p>
                  <p>North Industrial Estate Road</p>
                  <p>Patna - 800 010</p>
                  <p>India</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-primary" />
                <a
                  href="tel:+919835630940"
                  className="font-light text-neutral-800 transition-colors hover:text-primary"
                >
                  +91 98356 30940 (Get a quote)
                </a>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-primary" />
                <a
                  href="tel:+919031022875"
                  className="font-light text-neutral-800 transition-colors hover:text-primary"
                >
                  +91 90310 22875 (Enquiries)
                </a>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-primary" />
                <a
                  href="mailto:sales@oando.co.in"
                  className="font-light text-neutral-800 transition-colors hover:text-primary"
                >
                  sales@oando.co.in
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-8 md:border-t-0 md:border-l md:pl-16 md:pt-0">
            <CustomerQueryForm />
          </div>
        </div>
      </section>
    </section>
  );
}
