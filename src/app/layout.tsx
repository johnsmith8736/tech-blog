import type { Metadata } from "next";
import { Playfair_Display, Open_Sans } from "next/font/google";

const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair-display" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${openSans.className} bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200`}>
        <header className="container mx-auto px-4 pt-8 pb-4 max-w-4xl flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-playfair-display">
            <Link href="/">Tech Blog</Link>
          </h1>
          <nav className="space-x-4">
            <a href="https://github.com/johnsmith8736" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">GitHub</a>
            <a href="https://instagram.com/izumi.misaki87" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Instagram</a>
            <a href="mailto:johnsmith874436@gmail.com" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Email</a>
            <a href="https://www.youtube.com/@stanleychan87" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">YouTube</a>
            <a href="https://your-tip-me-link.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-semibold">打赏我</a>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  );
}
