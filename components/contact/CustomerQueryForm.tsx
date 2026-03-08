"use client";

import { FormEvent, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type PreferredContact = "any" | "email" | "whatsapp" | "phone";

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  preferredContact: PreferredContact;
  message: string;
};

type SubmitResult = {
  queryId: string;
  followUp: {
    email: string | null;
    whatsapp: string | null;
  };
};

const initialState: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  preferredContact: "any",
  message: "",
};

const PRIMARY_QUOTE_PHONE_DISPLAY = "+91 98356 30940";
const PRIMARY_QUOTE_PHONE_LINK = "tel:+919835630940";

export function CustomerQueryForm() {
  const pathname = usePathname();
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SubmitResult | null>(null);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.message.trim().length > 0 &&
      (form.email.trim().length > 0 || form.phone.trim().length > 0)
    );
  }, [form]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!canSubmit) {
      setError("Add name, message, and at least email or phone.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/customer-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "website-contact",
          sourcePath: pathname,
        }),
      });

      const json = (await response.json()) as
        | { error?: string; queryId?: string; followUp?: SubmitResult["followUp"] }
        | undefined;

      if (!response.ok || !json?.queryId || !json.followUp) {
        setError(json?.error || "Unable to submit right now.");
        return;
      }

      setResult({ queryId: json.queryId, followUp: json.followUp });
      setForm(initialState);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <p className="text-sm text-neutral-600">
        Fields marked <span className="font-semibold text-primary">*</span> are required. Share
        either email or phone and we will respond within 1 business day.
      </p>
      <div>
        <label htmlFor="name" className="mb-2 block typ-label text-neutral-500">
          Name <span className="text-primary">*</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-3 outline-none transition-colors focus:border-primary placeholder:text-neutral-400"
          required
        />
      </div>
      <div>
        <label htmlFor="company" className="mb-2 block typ-label text-neutral-500">
          Company
        </label>
        <input
          id="company"
          type="text"
          placeholder="Company Name (optional)"
          value={form.company}
          onChange={(event) => setForm({ ...form, company: event.target.value })}
          className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-3 outline-none transition-colors focus:border-primary placeholder:text-neutral-400"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-2 block typ-label text-neutral-500">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-3 outline-none transition-colors focus:border-primary placeholder:text-neutral-400"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-2 block typ-label text-neutral-500">
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+91..."
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-3 outline-none transition-colors focus:border-primary placeholder:text-neutral-400"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="preferredContact"
          className="mb-2 block typ-label text-neutral-500"
        >
          Preferred Contact
        </label>
        <select
          id="preferredContact"
          value={form.preferredContact}
          onChange={(event) =>
            setForm({
              ...form,
              preferredContact: event.target.value as PreferredContact,
            })
          }
          className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-3 outline-none transition-colors focus:border-primary placeholder:text-neutral-400"
        >
          <option value="any">Any</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="phone">Phone</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block typ-label text-neutral-500">
          Message <span className="text-primary">*</span>
        </label>
        <textarea
          id="message"
          placeholder="What do you need for your workspace?"
          rows={4}
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          className="w-full border-0 border-b border-neutral-300 bg-transparent px-0 py-3 outline-none transition-colors focus:border-primary placeholder:text-neutral-400"
          required
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="space-y-3 border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p>
            Query submitted. Reference: <span className="font-medium">{result.queryId}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {result.followUp.email ? (
              <a
                href={result.followUp.email}
                className="inline-flex items-center border border-emerald-400 px-3 py-1.5 text-xs font-medium uppercase tracking-wide"
              >
                Reply by Email
              </a>
            ) : null}
            {result.followUp.whatsapp ? (
              <a
                href={result.followUp.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center border border-emerald-400 px-3 py-1.5 text-xs font-medium uppercase tracking-wide"
              >
                Reply on WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send - we respond within 1 business day"}
        </button>
        <p className="text-sm text-neutral-600">
          Prefer to speak now?{" "}
          <a
            href={PRIMARY_QUOTE_PHONE_LINK}
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Call {PRIMARY_QUOTE_PHONE_DISPLAY}
          </a>
          .
        </p>
      </div>
    </form>
  );
}
