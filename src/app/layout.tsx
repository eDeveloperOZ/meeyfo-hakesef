import type { Metadata } from "next";
import { Noto_Sans_Hebrew } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "../components/footer";
import { SiteHeader } from "../components/site-header";
import { siteConfig } from "../../config/site";
import "./globals.css";

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew"],
  variable: "--font-hebrew",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteConfig.canonicalUrl ? new URL(siteConfig.canonicalUrl) : undefined,
  title: {
    default: `${siteConfig.nameHe} — שקיפות במימון מפלגות`,
    template: `%s | ${siteConfig.nameHe}`,
  },
  description: siteConfig.descriptionHe,
  openGraph: {
    locale: "he_IL",
    type: "website",
    siteName: siteConfig.nameHe,
    title: siteConfig.nameHe,
    description: siteConfig.taglineHe,
    images: [
      {
        url: "/og-share.png",
        width: 1200,
        height: 630,
        alt: "איור של ספר חשבונות שקוף המחבר מסמכי מקור למוסדות ציבור",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.nameHe,
    description: siteConfig.taglineHe,
    images: ["/og-share.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={notoSansHebrew.variable}>
        <a className="skip-link" href="#main-content">
          דילוג לתוכן המרכזי
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        {siteConfig.analyticsEnabled && <Analytics />}
      </body>
    </html>
  );
}
