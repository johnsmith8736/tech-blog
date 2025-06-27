# Cloudflare Pages 部署指南

## 概述
这个指南将帮助你将 Next.js 前端部署到 Cloudflare Pages，同时保持 Django 后端的 API 功能。

## 1. Django 后端配置

### 安装 CORS 支持
在后端目录中安装 django-cors-headers：

```bash
cd backend
pip install django-cors-headers
```

### 更新 Django 设置
在 `backend/techblog_backend/settings.py` 中添加以下配置：

```python
# 在 INSTALLED_APPS 中添加
INSTALLED_APPS = [
    # ... 其他应用
    'corsheaders',
    # ... 其他应用
]

# 在 MIDDLEWARE 的最顶部添加
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    # ... 其他中间件
]

# 添加 CORS 配置
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # 开发环境
    "https://your-site.pages.dev",  # 替换为你的 Cloudflare Pages 域名
]

# 或者在开发阶段允许所有来源（不推荐生产环境）
# CORS_ALLOW_ALL_ORIGINS = True

# 允许的请求头
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'x-api-key',
]
```

### 更新 requirements.txt
在 `backend/requirements.txt` 中添加：
```
django-cors-headers
```

## 2. 前端配置

### 环境变量
在 Cloudflare Pages 中设置以下环境变量：
- `NEXT_PUBLIC_API_URL`: 你的 Django 后端 API 地址（例如：`https://your-backend.com/api`）

### 构建设置
- 构建命令：`npm run build`
- 构建输出目录：`out`
- Node.js 版本：18 或更高

## 3. 部署步骤

### 方法一：通过 Git 集成（推荐）
1. **推送代码到 GitHub**：
   ```bash
   git add .
   git commit -m "Prepare for Cloudflare Pages deployment"
   git push origin main
   ```

2. **在 Cloudflare Dashboard 中创建 Pages 项目**：
   - 登录 Cloudflare Dashboard
   - 进入 "Pages" 部分
   - 点击 "Create a project"
   - 选择 "Connect to Git"

3. **连接 GitHub 仓库**：
   - 授权 Cloudflare 访问你的 GitHub
   - 选择你的博客仓库

4. **配置构建设置**：
   - 项目名称：`tech-blog`（或你喜欢的名称）
   - 生产分支：`main`
   - 框架预设：`Next.js (Static HTML Export)`
   - 构建命令：`npm run build`
   - 构建输出目录：`out`
   - Root directory：`/`（根目录）

5. **添加环境变量**：
   在 "Environment variables" 部分添加：
   - `NEXT_PUBLIC_API_URL`: 你的 Django 后端 API 地址
   - `NODE_VERSION`: `18`

6. **部署**：
   - 点击 "Save and Deploy"
   - 等待构建完成

### 方法二：直接上传
1. **本地构建**：
   ```bash
   npm run build
   ```

2. **上传到 Cloudflare Pages**：
   - 在 Cloudflare Dashboard 中选择 "Upload assets"
   - 将 `out` 目录的内容打包上传

## 4. 注意事项

1. **API 端点**：确保你的 Django 后端部署在可公开访问的地址
2. **CORS 配置**：必须正确配置 CORS，否则前端无法访问 API
3. **环境变量**：在 Cloudflare Pages 中正确设置 `NEXT_PUBLIC_API_URL`
4. **静态导出**：项目已配置为静态导出模式，所有页面都会在客户端渲染

## 5. 故障排除

### 常见问题
1. **CORS 错误**：检查 Django 后端的 CORS 配置
2. **API 无法访问**：确认 `NEXT_PUBLIC_API_URL` 环境变量设置正确
3. **构建失败**：检查 Node.js 版本和依赖项

### 调试步骤
1. 检查浏览器开发者工具的网络标签
2. 查看 Cloudflare Pages 的构建日志
3. 确认后端 API 可以直接访问

## 6. 部署后的配置

### 更新 Django 后端 CORS 设置
部署完成后，你需要更新 Django 后端的 CORS 设置，将 Cloudflare Pages 的域名添加到允许列表中：

```python
# 在 settings.py 中更新
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # 开发环境
    "https://your-project-name.pages.dev",  # 替换为实际的 Cloudflare Pages 域名
    "https://your-custom-domain.com",  # 如果使用自定义域名
]
```

### 自定义域名（可选）
1. 在 Cloudflare Pages 项目设置中添加自定义域名
2. 更新 DNS 记录指向 Cloudflare
3. 更新 Django 后端的 CORS 设置

### 环境变量管理
- 开发环境：使用 `.env.local` 文件
- 生产环境：在 Cloudflare Pages 设置中配置环境变量

## 7. 项目结构说明

```
tech-blog/
├── src/                    # Next.js 前端源码
├── backend/               # Django 后端
├── out/                   # 构建输出（部署到 Cloudflare Pages）
├── public/               # 静态资源
├── posts/                # Markdown 文章（如果有）
├── .env.local           # 本地环境变量
├── .env.example         # 环境变量示例
├── next.config.ts       # Next.js 配置
├── wrangler.toml        # Cloudflare 配置
└── DEPLOYMENT_GUIDE.md  # 本部署指南
```

## 8. 重要提醒

1. **API 端点**：确保 Django 后端部署在可公开访问的地址
2. **CORS 配置**：必须正确配置，否则前端无法访问 API
3. **环境变量**：生产环境的 API URL 必须正确设置
4. **路由变更**：文章链接现在使用 `/post?slug=article-slug` 格式
5. **客户端渲染**：所有数据都在客户端加载，确保 API 响应速度
