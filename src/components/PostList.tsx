import type { Post } from '../types/blog';
import { PostCard } from './PostCard';

type PostListProps = {
  posts: Post[];
};

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <span>NO TRANSMISSIONS FOUND</span>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
