import Image from 'next/image';
import { getSortedPostsData } from '@/lib/posts';
import SearchablePostList from '@/app/components/SearchablePostList';
import { Suspense } from 'react';

export default function HomePage() {
  const allPostsData = getSortedPostsData();

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

      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchablePostList allPostsData={allPostsData} />
      </Suspense>
    </section>
  );
}