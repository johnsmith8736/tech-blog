// Polyfill for localStorage in server environment
if (typeof window === "undefined") {
  (global as any).localStorage = {
    getItem: (key: string) => null,
    setItem: (key: string, value: string) => { },
    removeItem: (key: string) => { }
  };
}

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
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
});

export const metadata: Metadata = {
  title: "Tech.blog",
  description: "Tech Blog System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${shareTechMono.variable}`}>
      <body className="font-mono bg-background text-foreground antialiased selection:bg-cyber-cyan selection:text-black">
        <Header />

        <main className="min-h-screen pt-24 pb-12 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Main Content Area */}
              <div className="flex-1 w-full min-w-0">
                {children}
              </div>

              {/* Sidebar Area */}
              <div className="hidden lg:block">
                <CyberSidebar />
              </div>
            </div>
          </div>
        </main>

        <div className="fixed bottom-4 right-4 z-50 pointer-events-none hidden md:block">
          <div className="text-[10px] text-gray-700 font-mono tracking-widest uppercase writing-vertical-rl transform rotate-180">
            System Ready // V.2.0.4
          </div>
        </div>
      </body>
    </html>
  );
}
