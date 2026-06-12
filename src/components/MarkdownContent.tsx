import { Check, Copy } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { MarkdownBlock } from '../types/blog';

type MarkdownContentProps = {
  blocks: MarkdownBlock[];
};

export function MarkdownContent({ blocks }: MarkdownContentProps) {
  return (
    <div className="article-body">
      {blocks.map((block, index) => (
        <MarkdownBlockView block={block} key={`${block.type}-${index}`} />
      ))}
    </div>
  );
}

function MarkdownBlockView({ block }: { block: MarkdownBlock }) {
  if (block.type === 'heading') {
    const HeadingTag = `h${block.level}` as 'h1' | 'h2' | 'h3' | 'h4';
    const id = block.text.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, '-').replace(/(^-|-$)/g, '');
    return <HeadingTag id={id}>{renderInline(block.text)}</HeadingTag>;
  }

  if (block.type === 'paragraph') {
    return <p>{renderInline(block.text)}</p>;
  }

  if (block.type === 'quote') {
    return <blockquote>{renderInline(block.text)}</blockquote>;
  }

  if (block.type === 'list') {
    const ListTag = block.ordered ? 'ol' : 'ul';
    return (
      <ListTag>
        {block.items.map((item) => (
          <li key={item}>{renderInline(item)}</li>
        ))}
      </ListTag>
    );
  }

  if (block.type === 'code') {
    return <CodeBlock code={block.code} language={block.language} />;
  }

  return <hr />;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{language}</span>
        <button type="button" onClick={copyCode} aria-label="Copy code">
          {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function renderInline(text: string) {
  const parts: ReactNode[] = [];
  const tokenPattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(text)) !== null) {
    if (match.index > cursor) {
      parts.push(text.slice(cursor, match.index));
    }

    const token = match[0];

    if (token.startsWith('**')) {
      parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      parts.push(<code key={match.index}>{token.slice(1, -1)}</code>);
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        parts.push(
          <a href={linkMatch[2]} key={match.index} rel="noopener noreferrer" target="_blank">
            {linkMatch[1]}
          </a>,
        );
      }
    }

    cursor = match.index + token.length;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}
