"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface PostData {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
}

interface SearchablePostListProps {
  allPostsData: PostData[];
}

export default function SearchablePostList({ allPostsData }: SearchablePostListProps) {
  const [filteredPosts, setFilteredPosts] = useState(allPostsData);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('q') || '';

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPosts(allPostsData);
      return;
    }

    const results = allPostsData.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(results);
  }, [searchTerm, allPostsData]);

  return (
    <section>
      {/* 搜索结果提示 */}
      {searchTerm && (
        <div className="mb-6 p-3 border border-neon-cyan/20 bg-background/30">
          <p className="text-xs font-mono text-muted-foreground">
            SEARCH RESULTS FOR &quot;<span className="text-neon-cyan font-bold">{searchTerm}</span>&quot; ::
            <span className="text-neon-cyan font-bold"> {filteredPosts.length}</span> TRANSMISSIONS FOUND
          </p>
        </div>
      )}

      {/* 文章列表 */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPosts.map(({ id, date, title, excerpt, slug }) => (
          <article
            key={id}
            className="group relative border border-neon-cyan/20 bg-background/30 p-6 hover:border-neon-cyan/50 hover:bg-background/50 transition-all duration-300"
          >
            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <time
                  dateTime={date}
                  className="text-xs font-mono text-neon-cyan"
                >
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }).replace(/\//g, '.')}
                </time>
              </div>

              <h2 className="text-lg font-mono font-bold group-hover:text-neon-cyan transition-colors duration-300">
                <Link
                  href={`/${new Date(date).getFullYear()}/${(new Date(date).getMonth() + 1).toString().padStart(2, '0')}/${new Date(date).getDate().toString().padStart(2, '0')}/${slug}`}
                  className="block focus:outline-none text-foreground"
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  {title}
                </Link>
              </h2>

              <p className="text-xs text-foreground/70 font-mono leading-relaxed line-clamp-2">
                {excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* 无结果提示 */}
      {
        filteredPosts.length === 0 && searchTerm && (
          <div className="text-center py-16 border border-neon-cyan/20 bg-background/30">
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-lg font-mono font-bold text-neon-cyan">
                NO TRANSMISSIONS FOUND
              </h3>
              <p className="text-sm font-mono text-muted-foreground">
                SEARCH FOR &quot;<span className="text-neon-cyan font-bold">{searchTerm}</span>&quot; RETURNED ZERO RESULTS
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 border border-neon-cyan/50 bg-background/50 text-neon-cyan font-mono text-xs hover:border-neon-cyan hover:bg-background/70 transition-all duration-300 uppercase tracking-wider"
              >
                VIEW ALL TRANSMISSIONS
                <span>→</span>
              </Link>
            </div>
          </div>
        )
      }
    </section >
  );
}