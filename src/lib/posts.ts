
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Showdown from 'showdown';
import hljs from 'highlight.js';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content?: string;
  contentHtml?: string;
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

        return {
          id: index + 1,
          slug,
          date: matterResult.data.date,
          title: matterResult.data.title,
          excerpt: matterResult.data.excerpt,
          content: matterResult.content,
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
      ghMentionsLink: false,
      extensions: [],
    });

    let contentHtml = converter.makeHtml(matterResult.content);

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
          id: fileName.replace(/\.md$/, ''),
        },
      }));
  } catch (error) {
    console.error("Failed to get post slugs:", error);
    return [];
  }
}
