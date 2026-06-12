import { Link } from 'react-router-dom';
import { Github, Mail, ArrowRight, Globe, Server, Cpu, Code2 } from 'lucide-react';
import { SeoMeta } from '../components/SeoMeta';
import { ScrollReveal } from '../components/ScrollReveal';
import { author } from '../data/author';
import { onlinePosts } from '../data/posts';

const techStack = [
  { name: 'Linux', icon: Server },
  { name: 'Docker', icon: Cpu },
  { name: 'Kubernetes', icon: Globe },
  { name: 'TypeScript', icon: Code2 },
  { name: 'Python', icon: Code2 },
  { name: 'React', icon: Code2 },
  { name: 'Go', icon: Code2 },
  { name: 'Cloud', icon: Globe },
];

export function HomePage() {
  return (
    <div className="post-page">
      <SeoMeta path="/" />

      {/* Hero Section */}
      <ScrollReveal>
      <section className="home-hero">
        <p className="eyebrow">ENCRYPTED // PUBLIC KEY DETECTED</p>
        <div className="home-hero-content">
          <img src={author.avatarUrl} alt={author.name} className="home-hero-avatar" />
          <div className="home-hero-text">
            <h1>{author.name}</h1>
            <p className="handle">{author.handle}</p>
            <p>{author.bio}</p>
          </div>
        </div>
        <div className="hero-links">
          <a href="https://github.com/johnsmith8736" target="_blank" rel="noopener noreferrer" className="hero-link">
            <Github size={16} />
            <span>GitHub</span>
          </a>
          <a href="https://t.me/stanleychan87" target="_blank" rel="noopener noreferrer" className="hero-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21.5 2.5L2.5 10.5L9.5 13.5L12.5 20.5L21.5 2.5Z"/><path d="M9.5 13.5L15.5 8.5"/></svg>
            <span>Telegram</span>
          </a>
          <a href="https://x.com/stanleychan87" target="_blank" rel="noopener noreferrer" className="hero-link" aria-label="X/Twitter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span>X/Twitter</span>
          </a>
          <a href="mailto:johnsmith874436@gmail.com" className="hero-link">
            <Mail size={16} />
            <span>Email</span>
          </a>
        </div>
        <div className="hero-cta">
          <Link to="/feed" className="cta-button cta-button--primary">
            <span>READ THE BLOG</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      </ScrollReveal>

      {/* Featured Posts Section */}
      <ScrollReveal delay={100}>
      <section className="home-section">
        <h2 className="home-section-title">HIGHLIGHTED // SIGNALS</h2>
        <div className="featured-grid">
          {onlinePosts.slice(0, 4).map((post) => (
            <Link
              key={post.slug}
              to={`/posts/${post.slug}`}
              className="post-card"
              style={{ textDecoration: 'none' }}
            >
              <div className="post-meta">
                <span>{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h3 style={{ margin: '8px 0', fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)' }}>{post.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#a0a0a5' }}>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
      </ScrollReveal>

      {/* Tech Stack Section */}
      <ScrollReveal delay={300}>
      <section className="home-section">
        <h2 className="home-section-title">STACK // VERSIONED</h2>
        <div className="tech-stack-grid">
          {techStack.map((tech) => (
            <div key={tech.name} className="tech-stack-item">
              <tech.icon size={24} />
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </section>
      </ScrollReveal>

      </div>
  );
}