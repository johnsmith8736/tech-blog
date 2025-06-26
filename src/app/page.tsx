import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function HomePage() {
  const allPostsData = getSortedPostsData();

  return (
    <section>
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight">Tech Blog</h1>
        <p className="text-gray-500 mt-3">分享Python爬虫和计算机技术</p>
        {process.env.NEXT_PUBLIC_ENABLE_NEW_POST_UI === 'true' && (
          <div className="mt-6">
            <Link href="/new-post" className="text-blue-600 hover:underline text-lg font-medium">
              + 新增文章
            </Link>
          </div>
        )}
      </header>

      <div className="space-y-10">
        {allPostsData.map(({ id, date, title, excerpt }) => (
          <article key={id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
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