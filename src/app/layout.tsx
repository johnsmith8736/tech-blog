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
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 max-w-5xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Image 
                    src="/avatar.jpg" 
                    alt="Avatar" 
                    width={32} 
                    height={32} 
                    className="rounded-full ring-2 ring-border" 
                  />
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                      <Link href="/" className="hover:text-primary transition-colors">
                        Tech Blog
                      </Link>
                    </h1>
                    <p className="text-sm text-muted-foreground">Stanley Chan</p>
                  </div>
                </div>
                <nav className="flex items-center space-x-6">
                  <div className="hidden md:flex items-center space-x-6">
                    <a 
                      href="https://github.com/johnsmith8736" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                    >
                      GitHub
                    </a>
                    <a 
                      href="https://instagram.com/izumi.misaki87" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                    >
                      Instagram
                    </a>
                    <a 
                      href="mailto:johnsmith874436@gmail.com" 
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                    >
                      Email
                    </a>
                    <a 
                      href="https://www.youtube.com/@stanleychan87" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                    >
                      YouTube
                    </a>
                  </div>
                  <HeaderSearch />
                </nav>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-6 py-12 max-w-5xl">
            {children}
          </main>
          <footer className="border-t border-border mt-20">
            <div className="container mx-auto px-6 py-8 max-w-5xl">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-sm text-muted-foreground">
                  © 2024 Stanley Chan. 分享Python爬虫和计算机技术
                </p>
                <div className="flex items-center space-x-4 md:hidden">
                  <a 
                    href="https://github.com/johnsmith8736" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    GitHub
                  </a>
                  <a 
                    href="https://instagram.com/izumi.misaki87" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Instagram
                  </a>
                  <a 
                    href="mailto:johnsmith874436@gmail.com" 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Email
                  </a>
                  <a 
                    href="https://www.youtube.com/@stanleychan87" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
