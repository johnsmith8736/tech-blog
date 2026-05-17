# Tech Blog

Vite + React + TypeScript + React Router 博客骨架。

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Static Routing

This project uses React Router with `createBrowserRouter`, so static hosts need an SPA fallback for deep links such as `/posts/designing-operational-interfaces`.

The included `public/_redirects` file supports Netlify-style hosting:

```text
/* /index.html 200
```

For other static hosts, configure the equivalent fallback so unknown routes return `index.html`.

## Structure

- `src/data/author.ts`: 作者与站点占位资料
- `src/data/posts.ts`: 占位文章数据
- `src/types/blog.ts`: 博客数据类型
- `src/components`: 页面组件
- `src/pages`: 路由页面
