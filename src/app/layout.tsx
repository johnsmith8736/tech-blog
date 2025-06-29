import type { Metadata } from "next";
import { Playfair_Display, Open_Sans } from "next/font/google";

const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });
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
    <html lang="en" className={`${playfairDisplay.variable} ${openSans.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-dark.min.css" />
      </head>
      <body className={`${openSans.className} bg-background text-foreground`}>
        <header className="container mx-auto px-4 pt-8 pb-4 max-w-4xl flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/avatar.jpg" alt="Avatar" width={40} height={40} className="rounded-full mr-3" />
            <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 font-playfair-display">
              <Link href="/">Tech Blog</Link>
            </h1>
          </div>
          <nav className="space-x-4 flex items-center">
            <a href="https://github.com/johnsmith8736" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">GitHub</a>
            <a href="https://instagram.com/izumi.misaki87" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">Instagram</a>
            <a href="mailto:johnsmith874436@gmail.com" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">Email</a>
            <a href="https://www.youtube.com/@stanleychan87" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">YouTube</a>
            <HeaderSearch />
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  );
}
