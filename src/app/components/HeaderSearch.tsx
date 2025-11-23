"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeaderSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="SEARCH..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-32 sm:w-40 focus:sm:w-48 px-3 py-1.5 text-xs terminal-text border border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyber-cyan transition-all duration-300 clip-corner uppercase"
        style={{ letterSpacing: '0.05em' }}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-cyber-cyan transition-colors p-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
}
