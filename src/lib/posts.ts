
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Showdown from 'showdown';
import hljs from 'highlight.js/lib/common';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { cache } from 'react';
import { SITE_SECTIONS } from './site-structure.ts';

const postsDirectory = path.join(process.cwd(), 'posts');
const excerptMaxLength = 200;

const converter = new Showdown.Converter({
  tables: true,
  strikethrough: true,
  tasklists: true,
  ghCodeBlocks: true,
  simpleLineBreaks: true,
  ghCompatibleHeaderId: true,
  requireSpaceBeforeHeadingText: true,
  openLinksInNewWindow: true,
  ghMentions: false,
  extensions: [],
});

const dompurify = DOMPurify(new JSDOM('').window);
const codeBlockWithLangRegex = /<pre><code class="([^"]*)">([\s\S]*?)<\/code><\/pre>/g;
const codeBlockNoLangRegex = /<pre><code>([\s\S]*?)<\/code><\/pre>/g;

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function generateExcerpt(markdown: string) {
  const plainText = markdown
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italic
    .replace(/`{3}[\s\S]*?`{3}/g, '') // Remove code blocks
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/\s+/g, ' ') // Collapse whitespace from markdown formatting
    .trim();

  return plainText.slice(0, excerptMaxLength) + (plainText.length > excerptMaxLength ? '...' : '');
}

export function highlightBlock(code: string, lang?: string) {
  const decodedCode = decodeHtmlEntities(code);
  const cleanLang = lang ? lang.replace(/^language-/, '') : '';

  if (cleanLang && hljs.getLanguage(cleanLang)) {
    const highlighted = hljs.highlight(decodedCode, { language: cleanLang });
    return `<pre data-lang="${cleanLang}"><code class="hljs language-${cleanLang}">${highlighted.value}</code></pre>`;
  }

  const highlighted = hljs.highlightAuto(decodedCode);
  let detectedLang = highlighted.language || 'text';

  if (detectedLang === 'text' || !detectedLang) {
    try {
      JSON.parse(decodedCode.trim());
      detectedLang = 'json';
      const jsonHighlighted = hljs.highlight(decodedCode, { language: 'json' });
      return `<pre data-lang="json"><code class="hljs language-json">${jsonHighlighted.value}</code></pre>`;
    } catch (error) {
      // Keep auto-detected result.
    }
  }

  return `<pre data-lang="${detectedLang}"><code class="hljs language-${detectedLang}">${highlighted.value}</code></pre>`;
}

export interface PostData {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content?: string;
  contentHtml?: string;
  tags?: string[];
  category?: string;
  section?: string;
  subsection?: string;
  readingTimeMinutes?: number;
  searchText?: string;
}

interface PostFrontmatter {
  title?: unknown;
  date?: unknown;
  excerpt?: unknown;
  tags?: unknown;
  category?: unknown;
  section?: unknown;
  subsection?: unknown;
}

export function normalizeToSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function findValidSection(sectionValue?: string, subsectionValue?: string) {
  const sectionSlug = sectionValue ? normalizeToSlug(sectionValue) : '';
  const subsectionSlug = subsectionValue ? normalizeToSlug(subsectionValue) : '';
  const section = SITE_SECTIONS.find((item) => item.slug === sectionSlug);

  if (!section) {
    return null;
  }

  if (!subsectionSlug) {
    return {
      section: section.slug,
      subsection: section.children[0]?.slug,
    };
  }

  const subsection = section.children.find((child) => child.slug === subsectionSlug);
  return {
    section: section.slug,
    subsection: subsection?.slug || section.children[0]?.slug,
  };
}

export function inferSectionAndSubsection(title: string, tags: string[], category: string) {
  const joined = `${title} ${tags.join(' ')} ${category}`.toLowerCase();

  if (/\b(python|django|flask|scrapy|beautifulsoup|pandas|selenium)\b/.test(joined)) {
    if (/\b(scrap|scraping|crawler|crawl|beautifulsoup|scrapy)\b/.test(joined)) {
      return { section: 'python', subsection: 'web-scraping' };
    }
    if (/\b(automate|automation|bot|workflow)\b/.test(joined)) {
      return { section: 'python', subsection: 'automation' };
    }
    if (/\b(script|cli|tool)\b/.test(joined)) {
      return { section: 'python', subsection: 'python-scripts' };
    }
    return { section: 'python', subsection: 'python-tutorials' };
  }

  if (/\b(arch|linux|pacman|systemd|bash|zsh|wayland|steam|proton)\b/.test(joined)) {
    if (/\b(arch|pacman|aur)\b/.test(joined)) {
      return { section: 'linux', subsection: 'arch-linux' };
    }
    if (/\b(game|gaming|steam|proton|lutris)\b/.test(joined)) {
      return { section: 'linux', subsection: 'linux-gaming' };
    }
    if (/\b(server|nginx|apache|systemd|docker)\b/.test(joined)) {
      return { section: 'linux', subsection: 'linux-server' };
    }
    return { section: 'linux', subsection: 'linux-tools' };
  }

  if (/\b(network|proxy|vless|xray|warp|wireguard|tunnel|vpn|vps|cloudflare|self-host|router|openwrt|dns|home network)\b/.test(joined)) {
    if (/\b(vps|aws|gcp|linode|digitalocean)\b/.test(joined)) {
      return { section: 'networking', subsection: 'vps' };
    }
    if (/\b(self-host|selfhost|docker|homelab|nas)\b/.test(joined)) {
      return { section: 'networking', subsection: 'self-hosted' };
    }
    if (/\b(home network|router|openwrt|lan|wifi)\b/.test(joined)) {
      return { section: 'networking', subsection: 'home-network' };
    }
    return { section: 'networking', subsection: 'proxy' };
  }

  return { section: 'tutorials', subsection: 'step-by-step-guides' };
}

function resolvePostAssignment(title: string, tags: string[], category: string, section?: string, subsection?: string) {
  return findValidSection(section, subsection) || inferSectionAndSubsection(title, tags, category);
}

function toCleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function toTagList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function normalizePostDate(value: unknown) {
  const rawValue = toCleanString(value);

  if (!rawValue) {
    return '';
  }

  const parsed = new Date(rawValue);

  if (Number.isNaN(parsed.getTime())) {
    return rawValue;
  }

  return parsed.toISOString().slice(0, 10);
}

function estimateReadingTimeMinutes(content: string) {
  const wordCount = content
    .replace(/`{3}[\s\S]*?`{3}/g, ' ')
    .replace(/`(.+?)`/g, '$1')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / 200));
}

function createSearchText({
  title,
  excerpt,
  tags,
  category,
  section,
  subsection,
}: Pick<PostData, 'title' | 'excerpt' | 'tags' | 'category' | 'section' | 'subsection'>) {
  return [
    title,
    excerpt,
    category,
    section,
    subsection,
    ...(tags ?? []),
  ]
    .filter(Boolean)
    .join(' ');
}

function parsePostFile(slug: string, fileContents: string): PostData {
  const matterResult = matter(fileContents);
  const metadata = matterResult.data as PostFrontmatter;
  const title = toCleanString(metadata.title) || slug.replace(/-/g, ' ');
  const tags = toTagList(metadata.tags);
  const category = toCleanString(metadata.category);
  const excerpt = toCleanString(metadata.excerpt) || generateExcerpt(matterResult.content);
  const assigned = resolvePostAssignment(
    title,
    tags,
    category,
    toCleanString(metadata.section),
    toCleanString(metadata.subsection),
  );

  return {
    id: 0,
    slug,
    date: normalizePostDate(metadata.date),
    title,
    excerpt,
    content: matterResult.content,
    tags,
    category,
    section: assigned.section,
    subsection: assigned.subsection,
    readingTimeMinutes: estimateReadingTimeMinutes(matterResult.content),
    searchText: createSearchText({
      title,
      excerpt,
      tags,
      category,
      section: assigned.section,
      subsection: assigned.subsection,
    }),
  };
}

export function renderPostContent(markdown: string) {
  let contentHtml = converter.makeHtml(markdown);

  // Sanitize HTML to prevent XSS
  contentHtml = dompurify.sanitize(contentHtml);

  // 使用 highlight.js 进行语法高亮，GitHub 风格
  contentHtml = contentHtml.replace(codeBlockWithLangRegex, (match, lang, code) => {
    try {
      return highlightBlock(code, lang);
    } catch (error) {
      console.error('Highlight error:', error);
      return match;
    }
  });

  // 处理没有语言标识的代码块
  return contentHtml.replace(codeBlockNoLangRegex, (match, code) => {
    try {
      return highlightBlock(code);
    } catch (error) {
      console.error('Highlight error:', error);
      return match;
    }
  });
}

export const getSortedPostsData = cache(function getSortedPostsData(): PostData[] {
  try {
    // 获取 posts 目录下的所有文件名
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return parsePostFile(slug, fileContents);
      });

    // 按日期排序
    const sorted = allPostsData.sort((a, b) => {
      const timeA = Date.parse(a.date);
      const timeB = Date.parse(b.date);
      const safeA = Number.isNaN(timeA) ? 0 : timeA;
      const safeB = Number.isNaN(timeB) ? 0 : timeB;
      return safeB - safeA;
    });

    return sorted.map((post, index) => ({
      ...post,
      id: index + 1,
    }));
  } catch (error) {
    console.error("Failed to read posts:", error);
    return [];
  }
});

export const getPostData = cache(function getPostData(slug: string): PostData | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const post = parsePostFile(slug, fileContents);
    const contentHtml = renderPostContent(post.content || '');

    return {
      ...post,
      id: 1,
      contentHtml,
    };
  } catch (error) {
    console.error(`Failed to read post ${slug}:`, error);
    return null;
  }
});

export function getAllPostSlugs() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => ({
        params: {
          slug: fileName.replace(/\.md$/, ''),
        },
      }));
  } catch (error) {
    console.error("Failed to get post slugs:", error);
    return [];
  }
}
