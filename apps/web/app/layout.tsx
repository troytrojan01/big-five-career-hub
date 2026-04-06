import type { Metadata } from "next";

import "./globals.css";

import { PostHogProvider } from "@/components/posthog-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Big Five Career Hub",
    template: "%s | Big Five Career Hub",
  },
  description:
    "Search curated official jobs from Amazon, Apple, Google, Meta, and Microsoft, then prepare with company-specific interview guides and hiring resources.",
  openGraph: {
    title: "Big Five Career Hub",
    description:
      "Big Tech job search and interview prep focused on Amazon, Apple, Google, Meta, and Microsoft.",
    url: absoluteUrl(),
    siteName: "Big Five Career Hub",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: absoluteUrl(),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans text-ink">
        <PostHogProvider />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
