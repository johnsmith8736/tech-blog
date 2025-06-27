import Link from 'next/link';
import Image from 'next/image';
// Force rebuild to ensure all posts are picked up
import { getSortedPostsData } from '@/lib/posts';

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allPostsData.map(({ id, date, title, excerpt }) => (
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