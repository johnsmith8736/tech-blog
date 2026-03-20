"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function HeaderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSearch} className="group relative">
      <label htmlFor="header-search" className="sr-only">
        Search posts
      </label>
      <input
        id="header-search"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="w-36 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 pr-10 text-[12px] text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.18)] outline-none transition-all duration-300 placeholder:text-slate-500 focus:w-60 focus:border-cyan-200/50 focus:bg-white/[0.06] focus-visible:outline-none sm:w-44 lg:w-52"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-300 transition-colors hover:text-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-200/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:outline-none"
        aria-label="Search"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full ring-0 transition group-focus-within:ring-2 group-focus-within:ring-cyan-200/35 group-focus-within:ring-offset-2 group-focus-within:ring-offset-slate-950"
      />
    </form>
  );
}
