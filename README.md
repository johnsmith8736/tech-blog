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
- Highlight.js - 代码语法高亮

## 特色功能

- 🎨 GitHub 风格的语法高亮
- 🌙 深色主题设计
- 📱 响应式布局
- 🔍 智能搜索功能
- ⚡ 静态站点生成
- 🚀 自动部署

## License

MIT License

Copyright (c) 2025 Stanley Chan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
