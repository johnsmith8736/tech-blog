"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface PostData {
  id: string;
  date: string;
  title: string;
  excerpt: string;
}

interface SearchablePostListProps {
  allPostsData: PostData[];
}

export default function SearchablePostList({ allPostsData }: SearchablePostListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(allPostsData);

  useEffect(() => {
    const results = allPostsData.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(results);
  }, [searchTerm, allPostsData]);

  return (
    <section>
      <input
        type="text"
        placeholder="搜索文章..."
        className="w-full p-3 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(({ id, date, title, excerpt }) => (
          <article key={id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-3xl font-bold hover:text-blue-600 dark:hover:text-blue-400">
              <Link href={`/posts/${id}`}>{title}</Link>
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 my-2">
              <time dateTime={date}>{date}</time>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
