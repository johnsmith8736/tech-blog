

import type { Metadata } from "next";
import { Inter, Rajdhani, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import Header from "@/components/Header";
import CyberSidebar from "@/components/CyberSidebar";
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
  preload: true,
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "tech blog",
    "linux tutorials",
    "python tutorials",
    "networking guides",
    "systems engineering",
    "self-hosting",
  ],
  authors: [{ name: SITE_AUTHOR }],
  creator: SITE_AUTHOR,
  publisher: SITE_AUTHOR,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${rajdhani.variable} ${shareTechMono.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none';" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0b1220" />
      </head>
      <body className="bg-background text-foreground antialiased selection:bg-yellow-300/70 selection:text-slate-950">
        <Header />

        <main className="relative z-10 min-h-screen pt-24 pb-16 md:pt-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[-12%] top-[-8%] h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />
            <div className="absolute right-[-8%] top-[12%] h-80 w-80 rounded-full bg-yellow-200/8 blur-3xl" />
            <div className="absolute bottom-[-10%] left-[25%] h-72 w-72 rounded-full bg-cyan-300/6 blur-3xl" />
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
              <div className="flex-1 min-w-0 w-full">
                {children}
              </div>

              <div className="w-full lg:sticky lg:top-28 lg:w-auto">
                <CyberSidebar />
              </div>
            </div>
          </div>
        </main>

        <footer className="terminal-rule relative z-10 border-t border-yellow-300/10 bg-[#090a11]/85">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="data-label text-[10px] text-slate-400">
              © 2077 tech.grid // no rights reserved // powered by next.js
            </div>
            <div className="data-label text-[10px] text-yellow-100">
              netwatch protocol v.2.55 // secure connection
            </div>
          </div>
        </footer>

        <div className="pointer-events-none fixed bottom-4 right-4 z-50 hidden md:block">
          <div className="animate-float-pulse rounded-full border border-yellow-300/15 bg-slate-950/70 px-3 py-1 data-label text-[10px] text-slate-300 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            datalink stable // v.2.0.5
          </div>
        </div>
      </body>
    </html>
  );
}
