'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import { PostData } from '@/lib/posts';

interface PostListProps {
  initialPosts: PostData[];
}

const POSTS_PER_PAGE = 10;

export default function PostList({ initialPosts }: PostListProps) {
  const [displayedPosts, setDisplayedPosts] = useState(initialPosts.slice(0, POSTS_PER_PAGE));
  const currentPage = Math.max(1, Math.ceil(displayedPosts.length / POSTS_PER_PAGE));
  const totalPages = Math.max(1, Math.ceil(initialPosts.length / POSTS_PER_PAGE));

  useEffect(() => {
    setDisplayedPosts(initialPosts.slice(0, POSTS_PER_PAGE));
  }, [initialPosts]);

  const loadMore = () => {
    setDisplayedPosts((prev) => [
      ...prev,
      ...initialPosts.slice(prev.length, prev.length + POSTS_PER_PAGE),
    ]);
  };
  const hasMore = displayedPosts.length < initialPosts.length;

  return (
    <div className="space-y-5">
      <div className="glass-panel edge-frame flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="data-label text-[10px] text-slate-400">Latest transmissions</p>
          <p className="text-sm text-slate-200">
            Showing <span className="font-medium text-white">{displayedPosts.length}</span> of{' '}
            <span className="font-medium text-white">{initialPosts.length}</span> indexed packets
          </p>
        </div>

        <div className="data-label text-[10px] text-cyan-100">
          Page {currentPage} / {totalPages} {'//'} live feed
        </div>
      </div>

      <div className="space-y-4">
        {displayedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="py-6 text-center">
          <button
            onClick={loadMore}
            type="button"
            className="glass-panel edge-frame panel-sheen rounded-full px-6 py-2.5 data-label text-[11px] text-slate-100 transition-all hover:border-yellow-300/40 hover:text-white"
            aria-label={`Load ${Math.min(POSTS_PER_PAGE, initialPosts.length - displayedPosts.length)} more posts`}
          >
            next_sector
          </button>
        </div>
      )}
    </div>
  );
}
