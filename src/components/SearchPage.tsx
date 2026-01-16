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
      <div className="mb-12 border-b border-white/10 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/" className="text-cyber-cyan hover:text-cyber-yellow transition-colors">
            ← BACK TO TRANSMISSIONS
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          SEARCH RESULTS
        </h1>
        <p className="text-gray-400 font-mono">
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
          <div className="text-gray-500 font-mono">
            {/**/}NO MATCHING TRANSMISSIONS FOUND.
          </div>
          <Link href="/" className="inline-block px-6 py-2 bg-cyber-blue text-black font-mono uppercase tracking-wide hover:bg-cyber-cyan transition-colors">
            VIEW ALL TRANSMISSIONS
          </Link>
        </div>
      )}
    </div>
  );
}