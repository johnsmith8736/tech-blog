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
            className="px-6 py-2 bg-cyber-blue text-black font-mono uppercase tracking-wide hover:bg-cyber-cyan transition-colors"
          >
            LOAD MORE TRANSMISSIONS
          </button>
        </div>
      )}
    </div>
  );
}
