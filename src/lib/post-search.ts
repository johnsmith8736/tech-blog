import type { PostData } from './posts.ts';

export interface PostSearchFilters {
  query?: string;
  section?: string;
  subsection?: string;
}

function tokenizeQuery(query: string) {
  return normalizeSearchValue(query)
    .split(/\s+/)
    .filter(Boolean);
}

function normalizeSearchValue(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9+#./_-]+/g, ' ')
    .trim();
}

function buildSearchCorpus(post: PostData) {
  return post.searchText || [
    post.title,
    post.excerpt,
    post.category,
    post.section,
    post.subsection,
    ...(post.tags ?? []),
  ]
    .filter(Boolean)
    .join(' ');
}

function matchesAllTokens(post: PostData, tokens: string[]) {
  const searchCorpus = buildSearchCorpus(post);
  const normalizedCorpus = normalizeSearchValue(searchCorpus);
  const words = normalizedCorpus.split(/\s+/).filter(Boolean);
  const rawCorpus = searchCorpus.toLowerCase();

  return tokens.every((token) => {
    if (/[+#./_-]/.test(token)) {
      return rawCorpus.includes(token);
    }

    return words.some((word) => word === token || word.startsWith(token));
  });
}

export function filterPosts(posts: PostData[], filters: PostSearchFilters) {
  const query = filters.query || '';
  const section = filters.section || '';
  const subsection = filters.subsection || '';
  const hasSectionFilter = Boolean(section);
  const tokens = tokenizeQuery(query);

  if (tokens.length === 0 && !hasSectionFilter) {
    return posts;
  }

  return posts.filter((post) => {
    const matchesSearch = tokens.length === 0
      ? true
      : matchesAllTokens(post, tokens);

    const matchesSection = !hasSectionFilter
      ? true
      : (post.section === section && (!subsection || post.subsection === subsection));

    return matchesSearch && matchesSection;
  });
}
