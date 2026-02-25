
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Showdown from 'showdown';
import hljs from 'highlight.js/lib/common';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { cache } from 'react';

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

        return {
          id: 0,
          slug,
          date: matterResult.data.date,
          title: matterResult.data.title,
          excerpt,
          content: matterResult.content,
          tags: matterResult.data.tags || [],
          category: matterResult.data.category || '',
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
      tags: matterResult.data.tags || [],
      category: matterResult.data.category || '',
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
