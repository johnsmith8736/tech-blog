import { ArrowLeft } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { MarkdownContent } from '../components/MarkdownContent';
import { onlinePosts } from '../data/posts';

export function PostPage() {
  const { slug } = useParams();
  const post = onlinePosts.find((item) => item.slug === slug);

  if (!post) {
    return <Navigate to="/" replace />;
  }

  return (
    <article className="post-page">
      <Link className="back-link" to="/">
        <ArrowLeft size={17} aria-hidden="true" />
        Back to feed
      </Link>
      <div className="post-meta">
        <span>{post.category}</span>
        <span>{post.date}</span>
        <span>{post.readTime}</span>
      </div>
      <h2>{post.title}</h2>
      <p className="lead">{post.excerpt}</p>
      <MarkdownContent blocks={post.body} />
    </article>
  );
}
