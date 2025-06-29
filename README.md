# Tech Blog

一个基于 Next.js 的静态技术博客，部署在 Cloudflare Pages 上。

## 特性

- 📝 Markdown 文章支持
- 🎨 响应式设计
- 🔍 文章搜索功能
- ⚡ 静态生成，快速加载
- 🌐 部署在 Cloudflare Pages

## 项目结构

```
├── src/
│   ├── app/          # Next.js App Router 页面
│   └── lib/          # 工具函数
├── posts/            # Markdown 文章
├── public/           # 静态资源
├── next.config.ts    # Next.js 配置
├── wrangler.toml     # Cloudflare Pages 配置
└── package.json      # 项目依赖
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建静态文件
npm run build
```

## 部署

项目配置为自动部署到 Cloudflare Pages：
- 推送到 `main` 分支自动触发部署
- 构建命令：`npm run build`
- 输出目录：`out`

## 添加文章

在 `posts/` 目录下创建 `.md` 文件，文件头部需要包含 frontmatter：

```markdown
---
title: "文章标题"
date: "2024-01-01"
excerpt: "文章摘要"
---

文章内容...
```

## 技术栈

- Next.js 15 - React 框架
- TypeScript - 类型安全
- Tailwind CSS - 样式框架
- Gray Matter - Frontmatter 解析
- Showdown - Markdown 转 HTML
