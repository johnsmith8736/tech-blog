import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getAdjacentPosts,
  findValidSection,
  generateExcerpt,
  getPostData,
  getRelatedPosts,
  getSortedPostsData,
  highlightBlock,
  inferSectionAndSubsection,
  normalizeToSlug,
  renderPostContent,
} from '../src/lib/posts.ts';

test('generateExcerpt strips markdown formatting and collapses extra whitespace', () => {
  const markdown = `
# Title

Paragraph with [a link](https://example.com), **bold text**, and \`inline code\`.

![image](https://example.com/a.png)

\`\`\`js
console.log('hidden');
\`\`\`
`;

  assert.equal(
    generateExcerpt(markdown),
    'Title Paragraph with a link, bold text, and inline code.',
  );
});

test('normalizeToSlug normalizes mixed case labels into stable slugs', () => {
  assert.equal(normalizeToSlug('  Python Tutorials  '), 'python-tutorials');
  assert.equal(normalizeToSlug('Home Network / Wi-Fi'), 'home-network-wi-fi');
});

test('findValidSection accepts friendly labels and falls back to a default subsection', () => {
  assert.deepEqual(findValidSection('Python'), {
    section: 'python',
    subsection: 'web-scraping',
  });

  assert.deepEqual(findValidSection('Networking', 'Unknown Child'), {
    section: 'networking',
    subsection: 'proxy',
  });
});

test('inferSectionAndSubsection classifies representative post topics', () => {
  assert.deepEqual(
    inferSectionAndSubsection('Python Requests Web Scraping Guide', ['python', 'requests'], 'Tutorial'),
    { section: 'python', subsection: 'web-scraping' },
  );

  assert.deepEqual(
    inferSectionAndSubsection('Arch Linux Wayland Setup', ['linux'], 'Guide'),
    { section: 'linux', subsection: 'arch-linux' },
  );

  assert.deepEqual(
    inferSectionAndSubsection('Cloudflare Tunnel VPN for VPS', ['networking'], 'Infrastructure'),
    { section: 'networking', subsection: 'vps' },
  );
});

test('highlightBlock preserves explicit languages and annotates the code fence', () => {
  const html = highlightBlock('const value = 1;', 'language-javascript');

  assert.match(html, /<pre data-lang="javascript">/);
  assert.match(html, /class="hljs language-javascript"/);
});

test('renderPostContent sanitizes inline HTML and highlights fenced code blocks', () => {
  const html = renderPostContent(`
<script>alert('xss')</script>

## 示例代码

\`\`\`json
{"safe": true}
\`\`\`
`);

  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /<h2 id="示例代码">/);
  assert.match(html, /<pre data-lang="json">/);
  assert.match(html, /language-json/);
});

test('getPostData extracts h2 and h3 headings for in-article navigation', () => {
  const post = getPostData('python-web-scraping-beginners-guide');

  assert.ok(post);
  assert.ok(post.headings);
  assert.ok(post.headings!.length > 0);
  assert.ok(post.headings!.every((heading) => heading.level === 2 || heading.level === 3));
  assert.ok(post.headings!.every((heading) => heading.id.length > 0));
});

test('getSortedPostsData exposes normalized search metadata for posts', () => {
  const [latestPost] = getSortedPostsData();

  assert.ok(latestPost);
  assert.equal(typeof latestPost.readingTimeMinutes, 'number');
  assert.ok(latestPost.readingTimeMinutes! >= 1);
  assert.equal(typeof latestPost.searchText, 'string');
  assert.ok(latestPost.searchText!.includes(latestPost.title));
});

test('getPostData normalizes publish dates to YYYY-MM-DD when possible', () => {
  const post = getPostData('python-web-scraping-beginners-guide');

  assert.ok(post);
  assert.match(post.date, /^\d{4}-\d{2}-\d{2}$/);
});

test('getRelatedPosts returns distinct posts ranked from the same knowledge area', () => {
  const relatedPosts = getRelatedPosts('python-web-scraping-beginners-guide', 3);

  assert.ok(relatedPosts.length > 0);
  assert.equal(relatedPosts.some((post) => post.slug === 'python-web-scraping-beginners-guide'), false);
  assert.equal(relatedPosts.every((post) => post.section === 'python'), true);
});

test('getAdjacentPosts returns neighboring posts from the sorted archive', () => {
  const posts = getSortedPostsData();
  const middlePost = posts[1];

  assert.ok(middlePost);

  const adjacent = getAdjacentPosts(middlePost.slug);

  assert.equal(adjacent.newerPost?.slug, posts[0].slug);
  assert.equal(adjacent.olderPost?.slug, posts[2].slug);
});
