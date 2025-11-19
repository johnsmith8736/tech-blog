---
title: '使用 Next.js 构建现代 Web 应用'
date: '2025-06-25'
excerpt: 'Next.js 是一个强大的 React 框架，用于构建快速、用户友好的静态和动态网站。'
---

## **为什么选择 Next.js?**

**Next.js 提供了许多开箱即用的功能，让开发变得更加简单高效：**

- **混合渲染**: 支持服务端渲染 (SSR) 和静态站点生成 (SSG)。
- **文件系统路由**: `src/app` 目录下的文件结构自动映射为路由。
- **API 路由**: 轻松创建后端 API 端点。
- **代码分割**: 自动进行代码分割，只加载必要的 JavaScript。

## **创建一个页面**

**在 `src/app` 目录下创建一个新的文件夹，例如 `about`，然后在其中添加一个 `page.tsx` 文件：**

```typescript
// src/app/about/page.tsx

export default function AboutPage() {
  return (
    <div>
      <h1>关于我们</h1>
      <p>这是一个使用 Next.js 构建的博客。</p>
    </div>
  );
}
```

**现在，访问 `/about` 路径，你就能看到这个新页面了。**

## **结论**

**Next.js 是构建高性能 React 应用的绝佳选择。它简化了许多复杂的配置，让开发者可以专注于业务逻辑。**
