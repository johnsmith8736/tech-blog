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
        className="w-36 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-100 shadow-lg transition-all duration-300 sm:w-44 lg:w-52 focus:w-60 focus:outline-none border border-slate-500/35 bg-slate-900/70 backdrop-blur-sm placeholder:text-slate-500 focus:border-cyan-300/80 focus:bg-slate-900/95"
        style={{ letterSpacing: "0.1em" }}
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-cyan-300 transition-colors hover:scale-110 hover:text-amber-300"
        aria-label="Search"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
}
