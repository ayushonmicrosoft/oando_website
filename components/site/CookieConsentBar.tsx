"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_COOKIE = "oando_cookie_consent";
const CONSENT_ACCEPTED = "accepted";
const CONSENT_REJECTED = "rejected";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 days

const SEO_COOKIE_KEYS = [
  "oando_seo_landing",
  "oando_seo_referrer",
  "oando_seo_source",
  "oando_seo_medium",
  "oando_seo_campaign",
  "oando_seo_term",
  "oando_seo_content",
  "oando_seo_locale",
] as const;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  if (!entry) return null;
  return decodeURIComponent(entry.slice(prefix.length));
}

function writeCookie(name: string, value: string, maxAge: number) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
}

function inferSource(referrer: string): string {
  const host = referrer.toLowerCase();
  if (!host) return "direct";
  if (host.includes("google.")) return "google";
  if (host.includes("bing.")) return "bing";
  if (host.includes("yahoo.")) return "yahoo";
  if (host.includes("duckduckgo.")) return "duckduckgo";
  if (host.includes("instagram.")) return "instagram";
  if (host.includes("facebook.")) return "facebook";
  if (host.includes("linkedin.")) return "linkedin";

  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "referral";
  }
}

function setSeoCookies() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const landing = `${window.location.pathname}${window.location.search}`.slice(0, 512);
  const referrer = document.referrer || "direct";
  const source = (params.get("utm_source") || inferSource(referrer)).slice(0, 100);
  const medium = (params.get("utm_medium") || (source === "direct" ? "none" : "referral")).slice(
    0,
    100,
  );
  const campaign = (params.get("utm_campaign") || "").slice(0, 120);
  const term = (params.get("utm_term") || "").slice(0, 120);
  const content = (params.get("utm_content") || "").slice(0, 120);
  const locale = document.documentElement.lang || "en-IN";

  writeCookie("oando_seo_landing", landing, COOKIE_MAX_AGE_SECONDS);
  writeCookie("oando_seo_referrer", referrer.slice(0, 512), COOKIE_MAX_AGE_SECONDS);
  writeCookie("oando_seo_source", source, COOKIE_MAX_AGE_SECONDS);
  writeCookie("oando_seo_medium", medium, COOKIE_MAX_AGE_SECONDS);
  writeCookie("oando_seo_campaign", campaign, COOKIE_MAX_AGE_SECONDS);
  writeCookie("oando_seo_term", term, COOKIE_MAX_AGE_SECONDS);
  writeCookie("oando_seo_content", content, COOKIE_MAX_AGE_SECONDS);
  writeCookie("oando_seo_locale", locale.slice(0, 20), COOKIE_MAX_AGE_SECONDS);
}

function clearSeoCookies() {
  for (const key of SEO_COOKIE_KEYS) {
    clearCookie(key);
  }
}

export function CookieConsentBar() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const value = readCookie(CONSENT_COOKIE);
    if (value === CONSENT_ACCEPTED) {
      setSeoCookies();
    }
  }, []);

  const consent = typeof document === "undefined" ? null : readCookie(CONSENT_COOKIE);

  const acceptAll = () => {
    writeCookie(CONSENT_COOKIE, CONSENT_ACCEPTED, COOKIE_MAX_AGE_SECONDS);
    setSeoCookies();
    setDismissed(true);
  };

  const rejectOptional = () => {
    writeCookie(CONSENT_COOKIE, CONSENT_REJECTED, COOKIE_MAX_AGE_SECONDS);
    clearSeoCookies();
    setDismissed(true);
  };

  if (dismissed || consent) return null;

  return (
    <section
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 shadow-[0_-12px_28px_-24px_rgba(15,23,42,0.65)] backdrop-blur"
    >
      <div className="container px-4 py-3 sm:px-6 md:py-4 2xl:px-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          <p className="max-w-3xl text-[13px] leading-5 text-neutral-700 md:text-sm md:leading-relaxed">
            We use essential cookies and optional analytics & attribution cookies to improve
            discoverability and user journeys. See our{" "}
          <Link href="/privacy" className="font-semibold text-primary hover:underline">
            Privacy Policy
          </Link>
            .
          </p>
          <div className="grid shrink-0 grid-cols-2 gap-2 md:flex">
            <button
              type="button"
              onClick={rejectOptional}
              className="min-h-10 rounded-full border border-neutral-300 px-3 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-500 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:min-h-11 md:px-4 md:text-sm"
            >
              Reject Optional
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="min-h-10 rounded-full bg-primary px-3 text-xs font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:min-h-11 md:px-4 md:text-sm"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
