'use client';

import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { PostData } from '@/lib/posts';

interface SearchPageProps {
  query: string;
  posts: PostData[];
}

export default function SearchPage({ query, posts }: SearchPageProps) {
  return (
    <div className="space-y-0">
      <div className="glass-panel edge-frame mb-10 p-6 md:p-8">
        <div className="mb-4 flex items-center gap-4">
          <Link href="/" className="text-sm font-mono uppercase tracking-[0.18em] text-cyan-100 transition-colors hover:text-white">
            ← Back to archive
          </Link>
        </div>
        <h1 className="mb-4 font-display text-4xl font-semibold text-white md:text-5xl">
          Search results
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
          Found {posts.length} result{posts.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
        </p>
      </div>

      <div className="space-y-0">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="space-y-4 py-12 text-center">
          <div className="font-mono text-slate-400">
            No matching posts found.
          </div>
          <Link href="/" className="glass-panel edge-frame inline-block px-6 py-2 font-mono uppercase tracking-[0.16em] text-cyan-100 transition-colors hover:text-white">
            View all posts
          </Link>
        </div>
      )}
    </div>
  );
}
