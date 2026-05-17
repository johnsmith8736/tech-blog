import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Post } from '../types/blog';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-card">
      <div className="post-meta">
        <span>{post.category}</span>
        <span>{post.date}</span>
        <span>{post.readTime}</span>
      </div>
      <div className="post-heading">
        <h2>
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>
        <Link className="open-post" to={`/posts/${post.slug}`} aria-label={`Open ${post.title}`}>
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <p>{post.excerpt}</p>
      <div className="tag-row">
        {post.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}
