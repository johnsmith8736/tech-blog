import test from 'node:test';
import assert from 'node:assert/strict';

import {
  findValidSection,
  generateExcerpt,
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

\`\`\`json
{"safe": true}
\`\`\`
`);

  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /<pre data-lang="json">/);
  assert.match(html, /language-json/);
});
