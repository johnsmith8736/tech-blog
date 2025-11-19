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
        <div className="mb-8 p-4 bg-muted rounded-lg border border-border">
          <p className="text-muted-foreground">
            搜索 "<span className="font-medium text-foreground">{searchTerm}</span>" 的结果：
            <span className="font-medium text-foreground">{filteredPosts.length}</span> 篇文章
          </p>
        </div>
      )}

      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPosts.map(({ id, date, title, excerpt, slug }) => (
          <article
            key={id}
            className="group relative border border-border/40 rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 bg-background/40 backdrop-blur-md overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

            {/* Border Gradient on Hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/10 transition-colors duration-500 pointer-events-none"></div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <time
                  dateTime={date}
                  className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>

              <h2 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                <Link href={`/posts/${slug}`} className="block focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {title}
                </Link>
              </h2>

              <p className="text-muted-foreground leading-relaxed line-clamp-3 text-sm md:text-base">
                {excerpt}
              </p>

              <div className="pt-4 flex items-center justify-between border-t border-border/30 mt-4">
                <span className="inline-flex items-center text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                  阅读更多
                  <svg
                    className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <span>技术文章</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 无结果提示 */}
      {filteredPosts.length === 0 && searchTerm && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">没有找到相关文章</h3>
            <p className="text-muted-foreground">
              没有找到匹配 "<span className="font-medium text-foreground">{searchTerm}</span>" 的文章
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              查看所有文章
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}