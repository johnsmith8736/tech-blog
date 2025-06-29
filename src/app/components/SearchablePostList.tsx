"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
  const [searchTerm, setSearchTerm] = useState('');

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
      {/* 搜索框 */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="搜索文章..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(({ id, date, title, excerpt, slug }) => (
          <article key={id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-3xl font-bold hover:text-blue-600 dark:hover:text-blue-400">
              <Link href={`/posts/${slug}`}>{title}</Link>
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              <time dateTime={date}>{date}</time>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{excerpt}</p>
          </article>
        ))}
      </div>

      {/* 无结果提示 */}
      {filteredPosts.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">没有找到匹配的文章</p>
        </div>
      )}
    </section>
  );
}