"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function HeaderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <label htmlFor="header-search" className="sr-only">
        Search posts
      </label>
      <input
        id="header-search"
        type="text"
        placeholder="SEARCH..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="w-36 sm:w-44 lg:w-52 focus:w-60 px-3 py-1.5 text-[10px] font-mono border border-neon-cyan/30 bg-background/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan focus:bg-background/95 transition-all duration-300 uppercase tracking-wider shadow-lg"
        style={{ letterSpacing: "0.1em" }}
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 text-neon-cyan hover:text-neon-pink transition-colors p-1 hover:scale-110"
        aria-label="Search"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
}
