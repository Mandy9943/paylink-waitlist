import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://paylinks.ro";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "PayLinks",
  title: {
    default: "PayLinks — Acceptă plăți online rapid",
    template: "%s · PayLinks",
  },
  description:
    "Acceptă plăți online în 30 de secunde. Ideal pentru freelanceri, servicii locale, creatori și ONG-uri.",
  keywords: [
    "plăți online",
    "freelanceri",
    "servicii",
    "creatori",
    "ONG",
    "donatii",
    "link de plată",
    "Romania",
  ],
  authors: [{ name: "PayLinks" }],
  creator: "PayLinks",
  publisher: "PayLinks",
  generator: "Next.js",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "PayLinks — Acceptă plăți online rapid",
    description:
      "Fii printre primii care acceptă plăți online în 30 de secunde. Perfect pentru freelanceri, servicii locale, creatori și ONG-uri.",
    siteName: "PayLinks",
    locale: "ro_RO",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "PayLinks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PayLinks — Acceptă plăți online rapid",
    description:
      "Fii printre primii care acceptă plăți online în 30 de secunde. Perfect pentru freelanceri, servicii locale, creatori și ONG-uri.",
    images: [
      {
        url: "/placeholder.jpg",
        alt: "PayLinks",
      },
    ],
  },

  category: "technology",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>

        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="7d2153ba-ce5f-408c-bd55-7cad0f52ba39"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
