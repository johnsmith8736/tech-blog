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
            className="group border border-border rounded-lg p-6 transition-all duration-200 hover:shadow-md hover:border-primary/20 bg-background"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <time 
                  dateTime={date} 
                  className="text-sm text-muted-foreground font-medium"
                >
                  {new Date(date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              
              <h2 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
                <Link href={`/posts/${slug}`} className="block">
                  {title}
                </Link>
              </h2>
              
              <p className="text-muted-foreground leading-relaxed line-clamp-3">
                {excerpt}
              </p>
              
              <div className="pt-2">
                <Link 
                  href={`/posts/${slug}`}
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors"
                >
                  阅读更多
                  <svg 
                    className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </Link>
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