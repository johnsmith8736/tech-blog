import test from 'node:test';
import assert from 'node:assert/strict';

import { filterPosts } from '../src/lib/post-search.ts';
import type { PostData } from '../src/lib/posts.ts';

const posts: PostData[] = [
  {
    id: 1,
    slug: 'python-web-scraping',
    date: '2026-03-10',
    title: 'Python Web Scraping Guide',
    excerpt: 'Learn Python scraping with requests and BeautifulSoup.',
    section: 'python',
    subsection: 'web-scraping',
  },
  {
    id: 2,
    slug: 'arch-wayland',
    date: '2026-03-09',
    title: 'Arch Linux Wayland Setup',
    excerpt: 'A practical Linux desktop setup walkthrough.',
    section: 'linux',
    subsection: 'arch-linux',
  },
  {
    id: 3,
    slug: 'cloudflare-vps',
    date: '2026-03-08',
    title: 'Cloudflare Tunnel for VPS',
    excerpt: 'Networking notes for a proxy running on a VPS.',
    section: 'networking',
    subsection: 'vps',
  },
];

test('filterPosts returns every post when no filters are provided', () => {
  assert.deepEqual(filterPosts(posts, {}), posts);
});

test('filterPosts matches case-insensitive full-word query tokens across title and excerpt', () => {
  const result = filterPosts(posts, { query: 'python scraping' });

  assert.deepEqual(result.map((post) => post.slug), ['python-web-scraping']);
});

test('filterPosts requires every query token to match the same post', () => {
  const result = filterPosts(posts, { query: 'python vps' });

  assert.deepEqual(result, []);
});

test('filterPosts narrows results by section and subsection', () => {
  const result = filterPosts(posts, {
    section: 'networking',
    subsection: 'vps',
  });

  assert.deepEqual(result.map((post) => post.slug), ['cloudflare-vps']);
});

test('filterPosts combines text search with section filters', () => {
  const result = filterPosts(posts, {
    query: 'linux setup',
    section: 'linux',
  });

  assert.deepEqual(result.map((post) => post.slug), ['arch-wayland']);
});

test('filterPosts treats regex-like characters as plain text', () => {
  const result = filterPosts([
    {
      id: 4,
      slug: 'c-plus-plus',
      date: '2026-03-07',
      title: 'C++ Debugging Notes',
      excerpt: 'Escaping special characters in search should stay literal.',
      section: 'tutorials',
      subsection: 'step-by-step-guides',
    },
  ], { query: 'c++' });

  assert.deepEqual(result.map((post) => post.slug), ['c-plus-plus']);
});
