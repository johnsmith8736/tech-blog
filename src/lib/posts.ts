
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Showdown from 'showdown';
import hljs from 'highlight.js/lib/common';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { cache } from 'react';
import { SITE_SECTIONS } from '@/lib/site-structure';

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

function generateExcerpt(markdown: string) {
  const plainText = markdown
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italic
    .replace(/`{3}[\s\S]*?`{3}/g, '') // Remove code blocks
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();

  return plainText.slice(0, excerptMaxLength) + (plainText.length > excerptMaxLength ? '...' : '');
}

function highlightBlock(code: string, lang?: string) {
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
}

function normalizeToSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function findValidSection(sectionValue?: string, subsectionValue?: string) {
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

function inferSectionAndSubsection(title: string, tags: string[], category: string) {
  const joined = `${title} ${tags.join(' ')} ${category}`.toLowerCase();

  if (/\b(python|django|flask|scrapy|beautifulsoup|pandas|selenium)\b/.test(joined)) {
    if (/\b(scrap|crawler|crawl|beautifulsoup|scrapy)\b/.test(joined)) {
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

export const getSortedPostsData = cache(function getSortedPostsData(): PostData[] {
  try {
    // 获取 posts 目录下的所有文件名
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        // 移除文件扩展名作为 slug
        const slug = fileName.replace(/\.md$/, '');

        // 读取 markdown 文件内容
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // 使用 gray-matter 解析文章的 frontmatter
        const matterResult = matter(fileContents);

        const excerpt = matterResult.data.excerpt || generateExcerpt(matterResult.content);
        const tags = matterResult.data.tags || [];
        const category = matterResult.data.category || '';
        const assigned = findValidSection(matterResult.data.section, matterResult.data.subsection)
          || inferSectionAndSubsection(matterResult.data.title, tags, category);

        return {
          id: 0,
          slug,
          date: matterResult.data.date,
          title: matterResult.data.title,
          excerpt,
          content: matterResult.content,
          tags,
          category,
          section: assigned.section,
          subsection: assigned.subsection,
        };
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
    const matterResult = matter(fileContents);

    let contentHtml = converter.makeHtml(matterResult.content);
    const tags = matterResult.data.tags || [];
    const category = matterResult.data.category || '';
    const assigned = findValidSection(matterResult.data.section, matterResult.data.subsection)
      || inferSectionAndSubsection(matterResult.data.title, tags, category);

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
    contentHtml = contentHtml.replace(codeBlockNoLangRegex, (match, code) => {
      try {
        return highlightBlock(code);
      } catch (error) {
        console.error('Highlight error:', error);
        return match;
      }
    });

    return {
      id: 1, // 对于单个文章，ID 不太重要
      slug,
      date: matterResult.data.date,
      title: matterResult.data.title,
      excerpt: matterResult.data.excerpt || generateExcerpt(matterResult.content),
      content: matterResult.content,
      contentHtml,
      tags,
      category,
      section: assigned.section,
      subsection: assigned.subsection,
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
