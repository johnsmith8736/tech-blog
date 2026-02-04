"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PostData } from "@/lib/posts";

interface SearchablePostListProps {
  allPostsData: PostData[];
}

export default function SearchablePostList({ allPostsData }: SearchablePostListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const filteredPosts = useMemo(() => {
    if (!initialQuery) {
      return allPostsData;
    }

    const lowered = initialQuery.toLowerCase();
    return allPostsData.filter((post) =>
      post.title.toLowerCase().includes(lowered) ||
      post.excerpt.toLowerCase().includes(lowered)
    );
  }, [allPostsData, initialQuery]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    router.push("/");
  };

  return (
    <section className="space-y-6">
      <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="home-search" className="sr-only">
          Search posts
        </label>
        <div className="relative flex-1">
          <input
            id="home-search"
            type="text"
            placeholder="SEARCH TRANSMISSIONS..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full px-4 py-3 text-xs font-mono border border-neon-cyan/30 bg-background/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan focus:bg-background/95 transition-all duration-300 uppercase tracking-wider shadow-lg"
            style={{ letterSpacing: "0.1em" }}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neon-cyan hover:text-neon-pink transition-colors p-1.5 hover:scale-110"
            aria-label="Search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        {initialQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="px-4 py-3 text-xs font-mono border border-neon-cyan/30 bg-background/50 text-neon-cyan hover:border-neon-cyan hover:bg-background/80 transition-all duration-300 uppercase tracking-wider"
          >
            CLEAR
          </button>
        )}
      </form>

      {initialQuery && (
        <div className="p-3 border border-neon-cyan/20 bg-background/30">
          <p className="text-xs font-mono text-muted-foreground">
            SEARCH RESULTS FOR &quot;<span className="text-neon-cyan font-bold">{initialQuery}</span>&quot; ::
            <span className="text-neon-cyan font-bold"> {filteredPosts.length}</span> TRANSMISSIONS FOUND
          </p>
        </div>
      )}

      <div className="space-y-0">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group relative w-full border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors duration-300"
          >
            <Link href={`/posts/${post.slug}`} className="block px-4 py-6 md:px-8 md:py-8">
              <div className="flex flex-col md:flex-row md:items-baseline md:gap-8">
                <div className="flex-shrink-0 font-mono text-xs md:text-sm text-gray-500 mb-2 md:mb-0 w-32">
                  {post.date}
                </div>

                <div className="flex-grow space-y-2">
                  <h2 className="text-xl md:text-2xl font-display font-bold text-gray-200 group-hover:text-cyber-yellow transition-colors duration-200">
                    {post.title}
                  </h2>

                  <div className="flex flex-wrap gap-2 md:gap-4 items-center text-xs font-mono text-gray-500 uppercase tracking-wide">
                    <span>{post.category || "TRANSMISSION"}</span>

                    {post.tags && post.tags.length > 0 && (
                      <>
                        <span className="text-gray-700">|</span>
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-cyber-blue group-hover:text-cyber-cyan transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </>
                    )}
                  </div>

                  {post.excerpt && (
                    <p className="font-mono text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl mt-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                <div className="hidden md:flex flex-shrink-0 text-gray-700 group-hover:text-cyber-yellow transition-colors duration-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  </svg>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && initialQuery && (
        <div className="text-center py-16 border border-neon-cyan/20 bg-background/30">
          <div className="max-w-md mx-auto space-y-4">
            <h3 className="text-lg font-mono font-bold text-neon-cyan">
              NO TRANSMISSIONS FOUND
            </h3>
            <p className="text-sm font-mono text-muted-foreground">
              SEARCH FOR &quot;<span className="text-neon-cyan font-bold">{initialQuery}</span>&quot; RETURNED ZERO RESULTS
            </p>
            <button
              type="button"
              onClick={clearSearch}
              className="inline-flex items-center gap-2 px-4 py-2 border border-neon-cyan/50 bg-background/50 text-neon-cyan font-mono text-xs hover:border-neon-cyan hover:bg-background/70 transition-all duration-300 uppercase tracking-wider"
            >
              VIEW ALL TRANSMISSIONS
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
