# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vite + React + TypeScript blog with a cyberpunk aesthetic. Posts are written as Markdown files in the `/posts` directory and parsed at build time into a typed AST.

## Commands

```bash
npm install     # Install dependencies
npm run dev     # Start dev server (Vite)
npm run build   # TypeScript check (tsc -b) + Vite build
npm run preview # Preview production build locally
```

## Architecture

### Posts System

Posts are Markdown files in `/posts/*.md` with YAML frontmatter, loaded at build time via `import.meta.glob` in `src/data/posts.ts`.

**Frontmatter structure** (all fields optional with defaults):
```yaml
---
title: "Post Title"           # Defaults to filename
date: "2026-01-01"           # Defaults to "2026-01-01"
excerpt: "Summary text"       # Auto-extracted from first paragraph if omitted
category: "Network"           # Defaults to "Network"
tags: [tag1, tag2]            # Array format; defaults to []
status: online                # online | draft | archived (filters display)
---
```

**Post loading flow**:
1. `import.meta.glob` eagerly imports all `/posts/*.md` as raw strings
2. `parsePostMarkdown()` in `src/lib/markdown.ts` extracts frontmatter and parses content
3. Posts sorted by date (newest first)
4. `onlinePosts` export filters to `status: 'online'` only

**Markdown parsing** (`src/lib/markdown.ts`):
- Custom parser converts Markdown → `MarkdownBlock[]` typed AST
- Supported block types: `heading` (1-4), `paragraph`, `quote`, `code`, `list` (ordered/unordered), `divider`
- Read time estimation handles both Latin words and CJK characters
- Slug generation from filename: lowercase, strips non-alphanumeric (preserves CJK), replaces spaces with hyphens

**Types** (`src/types/blog.ts`): `Post`, `AuthorProfile`, `MarkdownBlock` (union type)

### Routing

React Router v7 with `createBrowserRouter` in `src/main.tsx`:

```
/                    → FeedPage (post list, client-side ?q= search)
/posts/:slug         → PostPage (single post by slug)
```

`App.tsx` shell layout:
```
<Header />
<main className="layout">
  <aside className="sidebar">
    <AuthorPanel />
    <NavigationPanel />
    <NeuralActivity />
    <SystemStatus />
  </aside>
  <section className="content-frame">
    <Outlet />  ← Page content renders here
  </section>
</main>
<Footer />
```

### Component Structure

**Pages** (`src/pages/`):
- `FeedPage.tsx` — Main post list with pagination and `?q=` search
- `PostPage.tsx` — Single post view, matches slug against `onlinePosts`

**Components** (`src/components/`):
- `Header.tsx` — Top navigation bar
- `PostList.tsx` — Renders list of `PostCard` components
- `PostCard.tsx` — Individual post preview card
- `Pagination.tsx` — Page navigation for feed
- `MarkdownContent.tsx` — Renders `MarkdownBlock[]` AST to React elements
- `AuthorPanel.tsx` — Sidebar author profile card
- `NavigationPanel.tsx` — Sidebar category/tag navigation
- `NeuralActivity.tsx` — Animated sidebar visualization
- `SystemStatus.tsx` — Sidebar status indicators
- `Footer.tsx` — Site footer

### Styling

Cyberpunk aesthetic with glassmorphism effect:
- CSS custom properties defined in `:root` (`src/styles.css`)
- Key colors: `--cyber-cyan`, `--cyber-magenta`, `--cyber-red`, `--cyber-green`
- Glassmorphism panels with `backdrop-filter: blur(24px)`
- Ambient orbs and grid background patterns
- Monospace font stack: 'Share Tech Mono', 'Inter', system monospace

### Static Hosting

Client-side routing requires SPA fallback. Configure all routes to return `index.html`:
```
/*  /index.html  200
```
The `public/_redirects` file handles Netlify. Other hosts need equivalent configuration.
