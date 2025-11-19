// Polyfill for localStorage in server environment
if (typeof window === "undefined") {
  (global as any).localStorage = {
    getItem: (key: string) => null,
    setItem: (key: string, value: string) => { },
    removeItem: (key: string) => { }
  };
}

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });
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
    <html lang="zh-CN" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-background text-foreground">
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6 h-16 max-w-5xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full opacity-0 group-hover:opacity-50 blur transition duration-500"></div>
                    <Image
                      src="/avatar.jpg"
                      alt="Avatar"
                      width={36}
                      height={36}
                      className="relative rounded-full ring-2 ring-background transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight group-hover:text-primary transition-colors">
                      Tech Blog
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      Stanley Chan
                    </span>
                  </div>
                </Link>
              </div>

              <nav className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-6">
                  {[
                    { name: 'GitHub', href: 'https://github.com/johnsmith8736' },
                    { name: 'Instagram', href: 'https://instagram.com/izumi.misaki87' },
                    { name: 'YouTube', href: 'https://www.youtube.com/@stanleychan87' },
                  ].map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                    >
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                    </a>
                  ))}
                  <a
                    href="mailto:johnsmith874436@gmail.com"
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                  >
                    Email
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                  </a>
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
          <footer className="border-t border-border/40 mt-20 bg-muted/20 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-12 max-w-5xl">
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="flex items-center space-x-6">
                  {[
                    { name: 'GitHub', href: 'https://github.com/johnsmith8736' },
                    { name: 'Instagram', href: 'https://instagram.com/izumi.misaki87' },
                    { name: 'YouTube', href: 'https://www.youtube.com/@stanleychan87' },
                  ].map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="sr-only">{item.name}</span>
                      {/* Simple text fallback or icons could go here, keeping text for now but styled minimally */}
                      <span className="text-sm font-medium">{item.name}</span>
                    </a>
                  ))}
                  <a
                    href="mailto:johnsmith874436@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="text-sm font-medium">Email</span>
                  </a>
                </div>
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Stanley Chan. Built with Next.js & Tailwind CSS.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
