import type { MarkdownBlock, Post } from '../types/blog';

type FrontMatter = {
  title?: string;
  date?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  status?: Post['status'];
};

const frontMatterPattern = /^---\n([\s\S]*?)\n---\n?/;

export function parsePostMarkdown(filePath: string, rawMarkdown: string): Post {
  const { frontMatter, content } = extractFrontMatter(rawMarkdown);
  const body = parseMarkdownBlocks(content);
  const title = frontMatter.title ?? findTitle(body) ?? filenameToTitle(filePath);

  return {
    slug: filenameToSlug(filePath),
    title,
    excerpt: frontMatter.excerpt ?? findExcerpt(body),
    date: frontMatter.date ?? '2026-01-01',
    readTime: estimateReadTime(content),
    category: frontMatter.category ?? 'Network',
    status: frontMatter.status ?? 'online',
    tags: frontMatter.tags ?? [],
    body,
  };
}

function extractFrontMatter(markdown: string) {
  const match = markdown.match(frontMatterPattern);

  if (!match) {
    return {
      frontMatter: {} as FrontMatter,
      content: markdown.trim(),
    };
  }

  return {
    frontMatter: parseFrontMatter(match[1]),
    content: markdown.slice(match[0].length).trim(),
  };
}

function parseFrontMatter(source: string): FrontMatter {
  return source.split('\n').reduce<FrontMatter>((metadata, line) => {
    const separatorIndex = line.indexOf(':');

    if (separatorIndex === -1) {
      return metadata;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = normalizeValue(line.slice(separatorIndex + 1).trim());

    if (key === 'tags') {
      metadata.tags = parseTags(value);
      return metadata;
    }

    if (key === 'status' && isPostStatus(value)) {
      metadata.status = value;
      return metadata;
    }

    if (key === 'title' || key === 'date' || key === 'excerpt' || key === 'category') {
      metadata[key] = value;
    }

    return metadata;
  }, {});
}

function parseTags(value: string) {
  if (!value.startsWith('[') || !value.endsWith(']')) {
    return value ? [value] : [];
  }

  return value
    .slice(1, -1)
    .split(',')
    .map((tag) => normalizeValue(tag.trim()))
    .filter(Boolean);
}

function normalizeValue(value: string) {
  return value.replace(/^['"]|['"]$/g, '');
}

function isPostStatus(value: string): value is Post['status'] {
  return value === 'online' || value === 'draft' || value === 'archived';
}

export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const paragraph: string[] = [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let index = 0;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraph.join(' ').trim() });
      paragraph.length = 0;
    }
  };

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      index += 1;
      continue;
    }

    const fenceMatch = trimmed.match(/^```(\w+)?/);
    if (fenceMatch) {
      flushParagraph();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push({
        type: 'code',
        language: fenceMatch[1] ?? 'text',
        code: codeLines.join('\n'),
      });
      index += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length as 1 | 2 | 3 | 4,
        text: headingMatch[2].trim(),
      });
      index += 1;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      flushParagraph();
      blocks.push({ type: 'divider' });
      index += 1;
      continue;
    }

    if (trimmed.startsWith('>')) {
      flushParagraph();
      const quoteLines: string[] = [];

      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }

      blocks.push({ type: 'quote', text: quoteLines.join(' ').trim() });
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (unorderedMatch || orderedMatch) {
      flushParagraph();
      const ordered = Boolean(orderedMatch);
      const items: string[] = [];

      while (index < lines.length) {
        const itemLine = lines[index].trim();
        const itemMatch = ordered ? itemLine.match(/^\d+\.\s+(.+)$/) : itemLine.match(/^[-*]\s+(.+)$/);

        if (!itemMatch) {
          break;
        }

        items.push(itemMatch[1].trim());
        index += 1;
      }

      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    paragraph.push(trimmed);
    index += 1;
  }

  flushParagraph();
  return blocks;
}

function findTitle(blocks: MarkdownBlock[]) {
  const heading = blocks.find((block) => block.type === 'heading' && block.level === 1);
  return heading?.type === 'heading' ? heading.text : undefined;
}

function findExcerpt(blocks: MarkdownBlock[]) {
  const paragraph = blocks.find((block) => block.type === 'paragraph' || block.type === 'quote');
  const text = paragraph && 'text' in paragraph ? paragraph.text : '';
  return text.length > 150 ? `${text.slice(0, 147)}...` : text;
}

function estimateReadTime(content: string) {
  const latinWords = content.match(/[A-Za-z0-9_]+/g)?.length ?? 0;
  const cjkChars = content.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const estimatedWords = latinWords + cjkChars / 2;
  return `${Math.max(1, Math.ceil(estimatedWords / 220))} min`;
}

function filenameToTitle(filePath: string) {
  return decodeURIComponent(filePath.split('/').pop()?.replace(/\.md$/, '') ?? 'Untitled');
}

function filenameToSlug(filePath: string) {
  const filename = filenameToTitle(filePath);
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
