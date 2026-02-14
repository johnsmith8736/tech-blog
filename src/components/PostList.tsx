'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import { PostData } from '@/lib/posts';

interface PostListProps {
  initialPosts: PostData[];
}

export default function PostList({ initialPosts }: PostListProps) {
  const [displayedPosts, setDisplayedPosts] = useState(initialPosts.slice(0, 10));
  const [hasMore, setHasMore] = useState(initialPosts.length > 10);

  useEffect(() => {
    setDisplayedPosts(initialPosts.slice(0, 10));
    setHasMore(initialPosts.length > 10);
  }, [initialPosts]);

  const loadMore = () => {
    const nextPosts = initialPosts.slice(displayedPosts.length, displayedPosts.length + 10);
    setDisplayedPosts(prev => [...prev, ...nextPosts]);
    if (displayedPosts.length + nextPosts.length >= initialPosts.length) {
      setHasMore(false);
    }
  };

  return (
    <div className="space-y-0">
      {displayedPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasMore && (
        <div className="text-center py-8">
          <button
            onClick={loadMore}
            className="glass-panel edge-frame px-6 py-2 font-mono text-xs uppercase tracking-[0.18em] text-cyan-100 transition-all hover:border-cyan-200/60 hover:text-amber-200"
          >
            LOAD MORE TRANSMISSIONS
          </button>
        </div>
      )}
    </div>
  );
}
