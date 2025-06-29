
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Showdown from 'showdown';
import showdownHighlight from 'showdown-highlight';

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
      extensions: [showdownHighlight({ pre: true })],
    });
    const contentHtml = converter.makeHtml(matterResult.content);

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
