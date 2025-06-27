
import Showdown from 'showdown';
import showdownHighlight from 'showdown-highlight';

// 使用环境变量配置 API URL，支持开发和生产环境
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function getSortedPostsData() {
  try {
    const response = await fetch(`${API_URL}/posts/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const posts = await response.json();
    return posts.sort((a: { date: string }, b: { date: string }) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export async function getPostData(id: string) {
  try {
    const response = await fetch(`${API_URL}/posts/${id}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const posts = await response.json();
    if (posts.length === 0) {
      return null;
    }
    const post = posts[0];
    const converter = new Showdown.Converter({
      extensions: [showdownHighlight({ pre: true })],
    });
    const contentHtml = converter.makeHtml(post.content);
    return {
      ...post,
      contentHtml,
    };
  } catch (error) {
    console.error(`Failed to fetch post with id ${id}:`, error);
    return null;
  }
}

export async function getAllPostSlugs() {
  try {
    const response = await fetch(`${API_URL}/posts/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const posts = await response.json();
    return posts.map((post: { slug: string }) => ({
      params: {
        id: post.slug,
      },
    }));
  } catch (error) {
    console.error("Failed to fetch post slugs:", error);
    return [];
  }
}
