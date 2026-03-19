'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import { PostData } from '@/lib/posts';

interface PostListProps {
  initialPosts: PostData[];
}

export default function PostList({ initialPosts }: PostListProps) {
  const [displayedPosts, setDisplayedPosts] = useState(initialPosts.slice(0, 10));

  useEffect(() => {
    setDisplayedPosts(initialPosts.slice(0, 10));
  }, [initialPosts]);

  const loadMore = () => {
    setDisplayedPosts((prev) => [
      ...prev,
      ...initialPosts.slice(prev.length, prev.length + 10),
    ]);
  };
  const hasMore = displayedPosts.length < initialPosts.length;

  return (
    <div className="space-y-5">
      <div className="glass-panel edge-frame flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-slate-400">Archive Feed</p>
          <p className="text-sm text-slate-200">
            Showing <span className="font-bold text-cyan-100">{displayedPosts.length}</span> of{' '}
            <span className="font-bold text-cyan-100">{initialPosts.length}</span> transmissions
          </p>
        </div>

        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">
          Compact list with progressive loading
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
            className="glass-panel edge-frame panel-sheen rounded-full px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-100 transition-all hover:border-cyan-200/60 hover:text-amber-200"
          >
            LOAD MORE TRANSMISSIONS
          </button>
        </div>
      )}
    </div>
  );
}
