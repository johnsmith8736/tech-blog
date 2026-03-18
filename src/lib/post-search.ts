import type { PostData } from './posts.ts';

export interface PostSearchFilters {
  query?: string;
  section?: string;
  subsection?: string;
}

function tokenizeQuery(query: string) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function matchesAllTokens(text: string, tokens: string[]) {
  const lowered = text.toLowerCase();

  return tokens.every((token) => {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = /^[a-z0-9_]+$/i.test(token)
      ? `\\b${escaped}\\b`
      : escaped;
    const regex = new RegExp(pattern, 'i');
    return regex.test(lowered);
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
      : (matchesAllTokens(post.title, tokens) || matchesAllTokens(post.excerpt, tokens));

    const matchesSection = !hasSectionFilter
      ? true
      : (post.section === section && (!subsection || post.subsection === subsection));

    return matchesSearch && matchesSection;
  });
}
