import { MapPin, Mail } from "lucide-react";
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
      <section className="contact-shell">
        <div className="contact-summary">
          <div className="contact-card border-none bg-transparent p-0 shadow-none">
            <div className="contact-channel mb-6">
              <MapPin className="contact-channel__icon" />
              <div>
                <p className="contact-channel__label">Service region</p>
                <p className="contact-card__meta">{SITE_CONTACT.regionLine}</p>
              </div>
            </div>
            
            <div className="contact-channel">
              <Mail className="contact-channel__icon" />
              <div>
                <p className="contact-channel__label">Email</p>
                <a href={`mailto:${SITE_CONTACT.salesEmail}`} className="contact-channel__link">
                  {SITE_CONTACT.salesEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-panel">
          <CustomerQueryForm />
        </div>
      </section>
    </section>
  );
}
