import { parsePostMarkdown } from '../lib/markdown';

const markdownFiles = import.meta.glob<string>('/posts/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

export const posts = Object.entries(markdownFiles)
  .map(([filePath, markdown]) => parsePostMarkdown(filePath, markdown))
  .sort((a, b) => b.date.localeCompare(a.date));

export const onlinePosts = posts.filter((post) => post.status === 'online');
