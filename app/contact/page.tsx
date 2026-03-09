import { MapPin, Phone, Mail } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { CustomerQueryForm } from "@/components/contact/CustomerQueryForm";
import { SITE_CONTACT } from "@/data/site/contact";
import { CONTACT_PAGE_COPY } from "@/data/site/routeCopy";

export default function ContactPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title={CONTACT_PAGE_COPY.heroTitle}
        subtitle={CONTACT_PAGE_COPY.heroSubtitle}
        showButton={false}
        backgroundImage="/images/hero/tvs-patna-enhanced.webp"
      />
      <section className="container px-6 2xl:px-0 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h3 className="typ-section text-neutral-950">{CONTACT_PAGE_COPY.sectionTitle}</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div className="font-light text-neutral-800">
                  {CONTACT_PAGE_COPY.offices.map((office, index) => (
                    <div key={office.title} className={index === 0 ? "" : "mt-4"}>
                      <p className="mb-1 font-medium text-neutral-950">{office.title}</p>
                      {office.lines.map((line) => (
                        <p key={`${office.title}-${line}`}>{line}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-primary" />
                <a
                  href={`tel:${SITE_CONTACT.salesPhone.replace(/\s+/g, "")}`}
                  className="font-light text-neutral-800 transition-colors hover:text-primary"
                >
                  {SITE_CONTACT.salesPhone} (Get a quote)
                </a>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-primary" />
                <a
                  href={`tel:${SITE_CONTACT.supportPhone.replace(/\s+/g, "")}`}
                  className="font-light text-neutral-800 transition-colors hover:text-primary"
                >
                  {SITE_CONTACT.supportPhone} (Enquiries)
                </a>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-primary" />
                <a
                  href={`mailto:${SITE_CONTACT.salesEmail}`}
                  className="font-light text-neutral-800 transition-colors hover:text-primary"
                >
                  {SITE_CONTACT.salesEmail}
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
