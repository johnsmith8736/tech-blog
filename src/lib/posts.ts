
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Showdown from 'showdown';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const postsDirectory = path.join(process.cwd(), 'posts');

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

export function getSortedPostsData(): PostData[] {
  try {
    // 获取 posts 目录下的所有文件名
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName, index) => {
        // 移除文件扩展名作为 slug
        const slug = fileName.replace(/\.md$/, '');

        // 读取 markdown 文件内容
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // 使用 gray-matter 解析文章的 frontmatter
        const matterResult = matter(fileContents);

        let excerpt = matterResult.data.excerpt;
        if (!excerpt) {
          // Generate excerpt from content if missing
          const content = matterResult.content;
          // Remove markdown syntax (basic)
          const plainText = content
            .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
            .replace(/#{1,6}\s/g, '') // Remove headers
            .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
            .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italic
            .replace(/`{3}[\s\S]*?`{3}/g, '') // Remove code blocks
            .replace(/`(.+?)`/g, '$1') // Remove inline code
            .replace(/\n/g, ' ') // Replace newlines with spaces
            .trim();

          excerpt = plainText.slice(0, 200) + (plainText.length > 200 ? '...' : '');
        }

        return {
          id: index + 1,
          slug,
          date: matterResult.data.date,
          title: matterResult.data.title,
          excerpt: excerpt,
          content: matterResult.content,
          tags: matterResult.data.tags || [],
          category: matterResult.data.category || 'Uncategorized',
        };
      });

    // 按日期排序
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error("Failed to read posts:", error);
    return [];
  }
}

export function getPostData(slug: string): PostData | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // 使用 Showdown 将 markdown 转换为 HTML
    const converter = new Showdown.Converter({
      tables: true,
      strikethrough: true,
      tasklists: true,
      ghCodeBlocks: true,
      ghMentions: false,
      extensions: [],
    });

    let contentHtml = converter.makeHtml(matterResult.content);

    // Sanitize HTML to prevent XSS
    const window = new JSDOM('').window;
    const DOMPurifyServer = DOMPurify(window);
    contentHtml = DOMPurifyServer.sanitize(contentHtml);

    // 使用 highlight.js 进行语法高亮，GitHub 风格
    contentHtml = contentHtml.replace(/<pre><code class="([^"]*)">([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
      try {
        const decodedCode = code
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        // 清理语言名称
        const cleanLang = lang ? lang.replace(/^language-/, '') : '';

        if (cleanLang && hljs.getLanguage(cleanLang)) {
          const highlighted = hljs.highlight(decodedCode, { language: cleanLang });
          return `<pre data-lang="${cleanLang}"><code class="hljs language-${cleanLang}">${highlighted.value}</code></pre>`;
        } else {
          // 尝试自动检测语言，特别处理 JSON
          const highlighted = hljs.highlightAuto(decodedCode);
          let detectedLang = highlighted.language || 'text';

          // 如果自动检测失败，尝试检测是否为 JSON
          if (detectedLang === 'text' || !detectedLang) {
            try {
              JSON.parse(decodedCode.trim());
              detectedLang = 'json';
              const jsonHighlighted = hljs.highlight(decodedCode, { language: 'json' });
              return `<pre data-lang="json"><code class="hljs language-json">${jsonHighlighted.value}</code></pre>`;
            } catch (e) {
              // 不是有效的 JSON，继续使用自动检测的结果
            }
          }

          return `<pre data-lang="${detectedLang}"><code class="hljs language-${detectedLang}">${highlighted.value}</code></pre>`;
        }
      } catch (error) {
        console.error('Highlight error:', error);
        return match;
      }
    });

    // 处理没有语言标识的代码块
    contentHtml = contentHtml.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
      try {
        const decodedCode = code
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        // 尝试自动检测语言
        const highlighted = hljs.highlightAuto(decodedCode);
        let detectedLang = highlighted.language || 'text';

        // 如果自动检测失败，尝试检测是否为 JSON
        if (detectedLang === 'text' || !detectedLang) {
          try {
            JSON.parse(decodedCode.trim());
            detectedLang = 'json';
            const jsonHighlighted = hljs.highlight(decodedCode, { language: 'json' });
            return `<pre data-lang="json"><code class="hljs language-json">${jsonHighlighted.value}</code></pre>`;
          } catch (e) {
            // 不是有效的 JSON，继续使用自动检测的结果
          }
        }

        return `<pre data-lang="${detectedLang}"><code class="hljs language-${detectedLang}">${highlighted.value}</code></pre>`;
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
      excerpt: matterResult.data.excerpt,
      content: matterResult.content,
      contentHtml,
    };
  } catch (error) {
    console.error(`Failed to read post ${slug}:`, error);
    return null;
  }
}

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

export function getAllPostPaths() {
  try {
    const posts = getSortedPostsData();
    return posts.map(post => {
      try {
        const date = new Date(post.date);
        // 检查日期是否有效
        if (isNaN(date.getTime())) {
          console.error(`Invalid date for post ${post.slug}: ${post.date}`);
          // 使用当前日期作为后备
          const now = new Date();
          return {
            params: {
              year: now.getFullYear().toString(),
              month: (now.getMonth() + 1).toString().padStart(2, '0'),
              day: now.getDate().toString().padStart(2, '0'),
              slug: post.slug,
            }
          };
        }
        return {
          params: {
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
            slug: post.slug,
          }
        };
      } catch (error) {
        console.error(`Error processing post ${post.slug}:`, error);
        // 使用当前日期作为后备
        const now = new Date();
        return {
          params: {
            year: now.getFullYear().toString(),
            month: (now.getMonth() + 1).toString().padStart(2, '0'),
            day: now.getDate().toString().padStart(2, '0'),
            slug: post.slug,
          }
        };
      }
    });
  } catch (error) {
    console.error("Failed to get post paths:", error);
    return [];
  }
}
