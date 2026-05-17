export type AuthorMetric = {
  label: string;
  value: string;
};

export type AuthorProfile = {
  name: string;
  handle: string;
  url: string;
  role: string;
  bio: string;
  avatarUrl: string;
  metrics: AuthorMetric[];
};

export type MarkdownBlock =
  | {
      type: 'heading';
      level: 1 | 2 | 3 | 4;
      text: string;
    }
  | {
      type: 'paragraph' | 'quote';
      text: string;
    }
  | {
      type: 'list';
      ordered: boolean;
      items: string[];
    }
  | {
      type: 'code';
      language: string;
      code: string;
    }
  | {
      type: 'divider';
    };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  status: 'online' | 'draft' | 'archived';
  tags: string[];
  body: MarkdownBlock[];
};
