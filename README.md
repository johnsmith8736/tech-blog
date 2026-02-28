# Tech Blog

基于 Next.js 15（App Router）的静态技术博客，支持 Markdown 写作、代码高亮、搜索过滤与 SEO 元数据。

## 功能

- Markdown 文章渲染（`gray-matter` + `showdown`）
- 代码块语法高亮（`highlight.js`，自动/指定语言）
- HTML 安全清洗（`DOMPurify` + `jsdom`）
- 首页文章筛选与搜索
- 静态导出（`next export` 模式，输出到 `out/`）
- SEO 支持（Open Graph、Twitter Card、JSON-LD）

## 技术栈

- Next.js 15
- React 19
- TypeScript 5
- Tailwind CSS 4

## 快速开始

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:3000`

## 可用脚本

- `npm run dev`：本地开发（Turbopack）
- `npm run build`：生产构建并静态导出
- `npm run start`：启动 Next.js 生产服务（非静态托管场景）
- `npm run lint`：运行 ESLint
- `npm run analyze`：构建并启用 bundle 分析

## 环境变量

在 `.env.local` 中配置：

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

用于生成站点 `metadataBase` 与文章页 JSON-LD URL。未配置时会使用默认值 `https://your-blog.com`。

## 文章编写

在 `posts/` 目录新增 `.md` 文件，文件名即 slug（例如 `my-first-post.md`）。

推荐 frontmatter：

```markdown
---
title: "文章标题"
date: "2026-02-28"
excerpt: "文章摘要（可选，不填会自动截取正文）"
tags: ["nextjs", "typescript"]
category: "Web"
---

正文内容...
```

字段说明：

- `title`：文章标题（必填）
- `date`：发布日期，建议使用 `YYYY-MM-DD`
- `excerpt`：摘要（可选）
- `tags`：标签数组（可选）
- `category`：分类（可选）

## 项目结构

```text
.
├── posts/                  # Markdown 文章
├── public/                 # 静态资源（manifest、sitemap、图片等）
├── src/
│   ├── app/                # 页面与路由（App Router）
│   ├── components/         # UI 组件
│   └── lib/posts.ts        # 文章读取、解析、排序与 HTML 转换
├── next.config.ts          # Next.js 配置（output: 'export'）
└── package.json
```

## 部署说明

项目已启用 `output: 'export'`，执行 `npm run build` 后生成静态文件到 `out/`，可直接部署到 Cloudflare Pages、Netlify、Nginx 静态站点等平台。

## License

MIT，详见 [LICENSE](./LICENSE)。
