// Polyfill for localStorage in server environment
if (typeof window === "undefined") {
  (global as any).localStorage = {
    getItem: (key: string) => null,
    setItem: (key: string, value: string) => { },
    removeItem: (key: string) => { }
  };
}

import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";

const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" });
import "./globals.css";
import Link from 'next/link';
import Image from 'next/image';
import HeaderSearch from '@/app/components/HeaderSearch';



export const metadata: Metadata = {
  title: "Tech Blog - Stanley Chan",
  description: "一个关于Python爬虫和计算机技术的博客",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${robotoMono.variable}`}>
      <body className={`${robotoMono.className} antialiased`}>
        <div className="min-h-screen bg-background text-foreground">
          <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
            <div className="container mx-auto px-6 h-16 max-w-6xl flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-3 group">
                  <span className="text-xl font-bold tracking-wider glitch terminal-text" style={{ color: 'var(--cyber-yellow)' }}>
                    TECH.BLOG
                  </span>
                </Link>
              </div>

              <nav className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-6">
                  {[
                    { name: 'FEED', href: '/' },
                    { name: 'GITHUB', href: 'https://github.com/johnsmith8736' },
                    { name: 'YOUTUBE', href: 'https://www.youtube.com/@stanleychan87' },
                  ].map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-xs font-bold terminal-text text-muted-foreground hover:text-cyber-cyan transition-colors clip-corner px-3 py-1.5 hover:bg-cyber-cyan/10"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="pl-2 border-l border-border/50">
                  <HeaderSearch />
                </div>
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-6 py-12 max-w-5xl">
            {children}
          </main>
          <footer className="border-t border-border mt-20 bg-background">
            <div className="container mx-auto px-6 py-8 max-w-6xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                <div className="terminal-text text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  ENCRYPTED // PUBLIC KEY DETECTED
                </div>
                <div className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} TECH.BLOG // NO RIGHTS RESERVED // POWERED BY NEXT.JS
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
