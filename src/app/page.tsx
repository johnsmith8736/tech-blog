'use client';

import Image from 'next/image';
import SearchablePostList from '@/app/components/SearchablePostList';
import { Suspense, useEffect, useState } from 'react';
import { getSortedPostsData } from '@/lib/posts';

// Define the Post type based on your Django Post model
interface PostData {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
}

export default function HomePage() {
  const [allPostsData, setAllPostsData] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const posts = await getSortedPostsData();
        setAllPostsData(posts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <section>
      <header className="bg-primary text-white py-20 mb-16 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <Image src="/avatar.jpg" alt="Avatar" width={96} height={96} className="rounded-full mr-6" />
          <div>
            <h1 className="text-6xl font-extrabold tracking-tight mb-2">Tech Blog</h1>
            <p className="text-xl opacity-80">分享Python爬虫和计算机技术</p>
          </div>
        </div>
        <p className="text-lg">
          欢迎来到我的技术博客！我在这里分享关于Python爬虫、网络安全和各种计算机技术的文章。
          希望我的内容能帮助你学习和成长。
        </p>
      </header>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">加载文章中...</p>
        </div>
      ) : (
        <Suspense fallback={<div>Loading search results...</div>}>
          <SearchablePostList allPostsData={allPostsData} />
        </Suspense>
      )}
    </section>
  );
}