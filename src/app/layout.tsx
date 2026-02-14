

import type { Metadata } from "next";
import { Rajdhani, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/atom-one-dark.css";
import Header from "@/components/Header";
import CyberSidebar from "@/components/CyberSidebar";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://your-blog.com"),
  title: "Tech Blog | Cyberpunk Tech Insights",
  description: "Explore cutting-edge technology, programming tutorials, and cyberpunk-inspired insights. Stay ahead with in-depth articles on software development, AI, cybersecurity, and more.",
  keywords: ["tech blog", "programming", "cyberpunk", "technology", "software development", "tutorials"],
  authors: [{ name: "Tech Blogger" }],
  openGraph: {
    title: "Tech Blog | Cyberpunk Tech Insights",
    description: "Explore cutting-edge technology, programming tutorials, and cyberpunk-inspired insights.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Blog | Cyberpunk Tech Insights",
    description: "Explore cutting-edge technology, programming tutorials, and cyberpunk-inspired insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${shareTechMono.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none';" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00f0ff" />
      </head>
      <body className="font-mono bg-background text-foreground antialiased selection:bg-cyan-300/70 selection:text-slate-900">
        <Header />

        <main className="relative z-10 min-h-screen pt-24 pb-16 md:pt-28">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
              {/* Main Content Area */}
              <div className="flex-1 w-full min-w-0">
                {children}
              </div>

              {/* Sidebar Area */}
              <div className="w-full lg:sticky lg:top-28 lg:w-auto">
                <CyberSidebar />
              </div>
            </div>
          </div>
        </main>

        <div className="pointer-events-none fixed bottom-4 right-4 z-50 hidden md:block">
          <div className="animate-float-pulse rounded border border-slate-500/30 bg-slate-900/70 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-slate-400">
            System Ready // V.2.0.5
          </div>
        </div>
      </body>
    </html>
  );
}
