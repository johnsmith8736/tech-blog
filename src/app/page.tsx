import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function HomePage() {
  const allPostsData = getSortedPostsData();

  return (
    <section>
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight">Tech Blog</h1>
        <p className="text-gray-500 mt-3">分享Python爬虫和计算机技术</p>
        
      </header>

      <div className="space-y-10">
        {allPostsData.map(({ id, date, title, excerpt }) => (
          <article key={id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
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