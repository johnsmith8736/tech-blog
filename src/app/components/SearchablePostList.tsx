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
        <div className="mb-6 p-4 bg-secondary/50 border border-border clip-corner">
          <p className="text-xs terminal-text" style={{ color: 'var(--muted-foreground)' }}>
            SEARCH RESULTS FOR &quot;<span className="font-bold" style={{ color: 'var(--cyber-yellow)' }}>{searchTerm}</span>&quot; ::
            <span className="font-bold" style={{ color: 'var(--cyber-cyan)' }}> {filteredPosts.length}</span> TRANSMISSIONS FOUND
          </p>
        </div>
      )}

      {/* 文章列表 */}
      <div className="grid grid-cols-1 gap-1">
        {filteredPosts.map(({ id, date, title, excerpt, slug }) => (
          <article
            key={id}
            className="group relative border border-border bg-secondary/30 p-6 clip-corner transition-all duration-300 hover:border-cyber-cyan/50 hover:bg-secondary/50"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <time
                  dateTime={date}
                  className="text-xs terminal-text"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }).replace(/\//g, '::')}
                </time>
                <span className="text-xs terminal-text px-2 py-1 border border-border clip-corner" style={{ color: 'var(--cyber-cyan)' }}>
                  TECH
                </span>
              </div>

              <h2 className="text-xl font-bold terminal-text group-hover:text-cyber-yellow transition-colors">
                <Link
                  href={`/${new Date(date).getFullYear()}/${(new Date(date).getMonth() + 1).toString().padStart(2, '0')}/${new Date(date).getDate().toString().padStart(2, '0')}/${slug}`}
                  className="block focus:outline-none text-white group-hover:text-cyber-yellow transition-colors"
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  {title}
                </Link>
              </h2>

              <p className="text-sm text-gray-400 line-clamp-2">
                {excerpt}
              </p>

              <div className="pt-3 flex items-center justify-between border-t border-border/30">
                <span className="inline-flex items-center text-xs terminal-text group-hover:text-cyber-cyan transition-colors" style={{ color: 'var(--cyber-yellow)' }}>
                  READ MORE &gt;&gt;
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 无结果提示 */}
      {filteredPosts.length === 0 && searchTerm && (
        <div className="text-center py-16 border border-border bg-secondary/30 clip-corner">
          <div className="max-w-md mx-auto space-y-4">
            <h3 className="text-lg font-bold terminal-text" style={{ color: 'var(--cyber-yellow)' }}>
              NO TRANSMISSIONS FOUND
            </h3>
            <p className="text-sm terminal-text" style={{ color: 'var(--muted-foreground)' }}>
              SEARCH FOR &quot;<span className="font-bold" style={{ color: 'var(--cyber-cyan)' }}>{searchTerm}</span>&quot; RETURNED ZERO RESULTS
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-cyber-yellow text-background terminal-text text-xs hover:bg-cyber-cyan transition-colors clip-corner"
            >
              VIEW ALL TRANSMISSIONS
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}