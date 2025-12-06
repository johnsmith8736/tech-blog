// Polyfill for localStorage in server environment
if (typeof window === "undefined") {
  (global as any).localStorage = {
    getItem: (key: string) => null,
    setItem: (key: string, value: string) => { },
    removeItem: (key: string) => { }
  };
}

import type { Metadata } from "next";
import { Orbitron, Exo_2 } from "next/font/google";
import { getSortedPostsData } from '@/lib/posts';

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-orbitron"
});

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-exo2"
});
import "./globals.css";
import Link from 'next/link';
import Image from 'next/image';
import HeaderSearch from '@/app/components/HeaderSearch';
import Sidebar from '@/app/components/Sidebar';



export const metadata: Metadata = {
  title: "Tech Blog - Stanley Chan",
  description: "一个关于Python爬虫和计算机技术的博客",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allPostsData = getSortedPostsData();

  return (
    <html lang="zh-CN" className={`${orbitron.variable} ${exo2.variable}`}>
      <body className={`${exo2.className} antialiased bg-background text-foreground overflow-x-hidden`}>
        {/* Mobile Header (Visible only on small screens) */}
        <header className="lg:hidden border-b border-neon-cyan/30 bg-background/98 backdrop-blur-xl sticky top-0 z-50 p-4 flex justify-between items-center">
          <span className="text-xl font-mono font-bold tracking-tight">
            <span className="text-neon-cyan">ATLASSC</span><span className="text-neon-pink">.NET</span>
          </span>
          <HeaderSearch />
        </header>

        {/* Desktop Search - Fixed Top Right */}
        <div className="hidden lg:block fixed top-4 right-4 z-50">
          <HeaderSearch />
        </div>

        {/* Main Container - Centered */}
        <div className="min-h-screen flex justify-center">
          <div className="w-full max-w-[1400px] flex flex-col lg:flex-row">
            <Sidebar postCount={allPostsData.length} />
            
            <main className="flex-1 min-h-screen relative crt-scanlines">
              {/* Enhanced Scanline Overlay */}
              <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(0,240,255,0.03),rgba(255,0,110,0.02),rgba(0,240,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none" style={{ backgroundSize: '100% 4px, 6px 100%' }}></div>

              <div className="relative z-20 max-w-5xl mx-auto px-8 sm:px-12 lg:px-16 py-12 lg:py-16">
                {children}
              </div>

              <footer className="border-t border-neon-cyan/20 mt-12 py-6 px-8">
                <div className="text-center">
                  <p className="text-neon-cyan/70 font-mono text-xs uppercase tracking-wider">
                    © 2077 ATLASSC.NET // NO RIGHTS RESERVED // POWERED BY GEMINI
                  </p>
                  <div className="mt-2 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-mono">
                    Netwatch Protocol v.2.55 // Secure Connection
                  </div>
                </div>
              </footer>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
