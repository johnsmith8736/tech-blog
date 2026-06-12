import { useEffect, useState } from 'react';
import type { MarkdownBlock } from '../types/blog';

type TocItem = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  blocks: MarkdownBlock[];
};

export function TableOfContents({ blocks }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  const items: TocItem[] = blocks
    .filter((b): b is MarkdownBlock & { type: 'heading' } => b.type === 'heading')
    .filter((b) => b.level >= 2 && b.level <= 4)
    .map((b) => ({
      id: b.text.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, '-').replace(/(^-|-$)/g, ''),
      text: b.text,
      level: b.level,
    }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav className="toc-sidebar" aria-label="Table of contents">
      <span className="toc-title">CONTENTS</span>
      <ul className="toc-list">
        {items.map((item) => (
          <li key={item.id} className={`toc-item toc-item--h${item.level}${activeId === item.id ? ' toc-item--active' : ''}`}>
            <a href={`#${item.id}`} onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
            }}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}