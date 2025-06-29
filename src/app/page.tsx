import Image from 'next/image';
import SearchablePostList from '@/app/components/SearchablePostList';
import { Suspense } from 'react';
import { getSortedPostsData, PostData } from '@/lib/posts';

export default async function HomePage() {
  // 直接获取文章数据（服务端渲染）
  const allPostsData: PostData[] = getSortedPostsData();

  return (
    <section>
      <header className="bg-black text-blue-400 py-20 mb-16 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <Image src="/avatar.jpg" alt="Avatar" width={96} height={96} className="rounded-full mr-6" />
          <div>
            <h1 className="text-6xl font-extrabold tracking-tight mb-2 text-blue-400">Tech Blog</h1>
            <p className="text-xl text-blue-300">分享Python爬虫和计算机技术</p>
          </div>
        </div>
        <p className="text-lg text-blue-300">
          欢迎来到我的技术博客！我在这里分享关于Python爬虫、网络安全和各种计算机技术的文章。
          希望我的内容能帮助你学习和成长。
        </p>
      </header>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      }>
        <SearchablePostList allPostsData={allPostsData} />
      </Suspense>
    </section>
  );
}