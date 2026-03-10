import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site/Header";
import { SiteFooter } from "@/components/site/Footer";
import { CookieConsentBar } from "@/components/site/CookieConsentBar";
import dynamic from "next/dynamic";
import QueryProvider from "@/app/providers/QueryProvider";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { ciscoSans } from "@/lib/fonts";
import { SITE_URL } from "@/lib/siteUrl";
import { buildLocalBusinessJsonLd, buildSiteMetadata } from "@/data/site/seo";

const DynamicBotWrapper = dynamic(() => import("@/components/bot/DynamicBotWrapper"));

export const metadata: Metadata = buildSiteMetadata(SITE_URL);

const LOCAL_BUSINESS_JSON_LD = buildLocalBusinessJsonLd(SITE_URL);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${ciscoSans.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD),
          }}
        />
      </head>
      <body className="antialiased bg-white selection:bg-primary selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-9999 focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Skip to main content
        </a>
        <QueryProvider>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <CookieConsentBar />
          <DynamicBotWrapper />
          <WhatsAppCTA />
        </QueryProvider>
      </body>
    </html>
  );
}
