'use client';

import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { PostData } from '@/lib/posts';

interface SearchPageProps {
  query: string;
  posts: PostData[];
  allPosts: PostData[];
}

export default function SearchPage({ query, posts, allPosts }: SearchPageProps) {
  return (
    <div className="space-y-0">
      <div className="glass-panel edge-frame mb-10 p-6 md:p-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/" className="text-cyan-200 transition-colors hover:text-amber-200">
            ← BACK TO TRANSMISSIONS
          </Link>
        </div>
        <h1 className="mb-4 text-4xl font-display font-bold text-white md:text-5xl">
          SEARCH RESULTS
        </h1>
        <p className="font-mono text-slate-300">
          Found {posts.length} result{posts.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
        </p>
      </div>

      <div className="space-y-0">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="py-12 text-center space-y-4">
          <div className="font-mono text-slate-400">
            {/**/}NO MATCHING TRANSMISSIONS FOUND.
          </div>
          <Link href="/" className="glass-panel edge-frame inline-block px-6 py-2 font-mono uppercase tracking-[0.16em] text-cyan-100 transition-colors hover:text-amber-200">
            VIEW ALL TRANSMISSIONS
          </Link>
        </div>
      )}
    </div>
  );
}
