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
        <div className="mb-6">
          <p className="text-gray-400">
            搜索 "{searchTerm}" 的结果：{filteredPosts.length} 篇文章
          </p>
        </div>
      )}

      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(({ id, date, title, excerpt, slug }) => (
          <article key={id} className="bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-gray-700">
            <h2 className="text-3xl font-bold text-blue-400 hover:text-blue-300">
              <Link href={`/posts/${slug}`}>{title}</Link>
            </h2>
            <div className="text-sm text-gray-400 mt-2">
              <time dateTime={date}>{date}</time>
            </div>
            <p className="text-gray-300 leading-relaxed">{excerpt}</p>
          </article>
        ))}
      </div>

      {/* 无结果提示 */}
      {filteredPosts.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-400">没有找到匹配 "{searchTerm}" 的文章</p>
          <Link href="/" className="text-blue-400 hover:underline hover:text-blue-300 mt-2 inline-block">
            查看所有文章
          </Link>
        </div>
      )}
    </section>
  );
}