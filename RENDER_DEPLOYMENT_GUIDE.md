# 🚀 Render 部署指南

## 概述
本指南将帮你将 Django 后端部署到 Render，然后配置 Cloudflare Pages 前端连接到 Render 后端。

## 📋 准备工作

### 1. 确保代码已推送到 GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

## 🔧 部署 Django 后端到 Render

### 1. 创建 Render 账户
- 访问 https://render.com/
- 使用 GitHub 账户注册/登录

### 2. 创建 PostgreSQL 数据库
1. 在 Render Dashboard 中点击 "New +"
2. 选择 "PostgreSQL"
3. 配置数据库：
   ```
   Name: tech-blog-db
   Database: techblog
   User: techblog_user
   Region: Oregon (US West) 或离你最近的区域
   Plan: Free
   ```
4. 点击 "Create Database"
5. **保存数据库连接信息**（稍后需要）

### 3. 部署 Django Web 服务
1. 在 Render Dashboard 中点击 "New +"
2. 选择 "Web Service"
3. 连接你的 GitHub 仓库 `tech-blog`
4. 配置服务：

#### 基本设置
```
Name: tech-blog-api
Environment: Python 3
Region: Oregon (US West) 或与数据库相同区域
Branch: main
Root Directory: backend
```

#### 构建和部署设置
```
Build Command: pip install -r requirements.txt
Start Command: gunicorn techblog_backend.wsgi:application
```

#### 环境变量
在 "Environment Variables" 部分添加：

```
DATABASE_URL = [从步骤2中复制的数据库内部连接URL]
SECRET_KEY = your-secret-key-here-make-it-long-and-random
DEBUG = False
ALLOWED_HOSTS = your-app-name.onrender.com
```

**重要**: 
- `DATABASE_URL` 使用数据库的 "Internal Database URL"
- `SECRET_KEY` 生成一个长随机字符串
- `ALLOWED_HOSTS` 替换为你的实际 Render 应用域名

5. 点击 "Create Web Service"

### 4. 等待部署完成
- 首次部署可能需要 5-10 分钟
- 在 "Logs" 标签中查看部署进度
- 部署成功后，你会得到一个 URL，如：`https://your-app-name.onrender.com`

## 🔗 配置前端连接后端

### 1. 更新 Cloudflare Pages 环境变量
1. 登录 Cloudflare Dashboard
2. 进入你的 Pages 项目
3. 进入 "Settings" > "Environment variables"
4. 更新或添加：
   ```
   NEXT_PUBLIC_API_URL = https://your-app-name.onrender.com/api
   ```
5. 重新部署前端

### 2. 更新 Django CORS 设置
1. 获取你的 Cloudflare Pages 域名（如：`https://tech-blog.pages.dev`）
2. 在 Render 的环境变量中添加：
   ```
   CORS_ALLOWED_ORIGINS = http://localhost:3000,https://tech-blog.pages.dev
   ```
3. 重新部署后端

## ✅ 测试部署

### 1. 测试后端 API
访问：`https://your-app-name.onrender.com/api/posts/`
应该返回 JSON 格式的文章列表

### 2. 测试前端
访问你的 Cloudflare Pages 网站，确认：
- 页面正常加载
- 文章列表能够显示
- 搜索功能正常

## 📝 重要说明

### Render 免费层限制
- **数据库**: 90 天后删除（可以备份数据）
- **Web 服务**: 15 分钟无活动后休眠
- **带宽**: 每月 100GB

### 性能优化建议
1. **数据库连接**: 使用连接池
2. **静态文件**: 已配置 WhiteNoise 处理
3. **缓存**: 考虑添加 Redis 缓存（付费功能）

## 🔧 故障排除

### 常见问题

1. **构建失败**
   - 检查 `requirements.txt` 是否正确
   - 查看构建日志中的错误信息

2. **数据库连接错误**
   - 确认 `DATABASE_URL` 环境变量正确
   - 检查数据库是否在同一区域

3. **CORS 错误**
   - 确认 `CORS_ALLOWED_ORIGINS` 包含前端域名
   - 检查前端的 `NEXT_PUBLIC_API_URL` 是否正确

4. **服务休眠**
   - 免费层服务会在 15 分钟无活动后休眠
   - 首次访问可能需要 30 秒启动时间

### 调试步骤
1. 查看 Render 服务的 "Logs" 标签
2. 检查环境变量设置
3. 确认数据库连接状态
4. 测试 API 端点是否可访问

## 🎉 完成

部署成功后，你将拥有：
- Django 后端运行在 Render: `https://your-app-name.onrender.com`
- Next.js 前端运行在 Cloudflare Pages: `https://your-blog.pages.dev`
- 完整的博客系统，支持文章管理和搜索功能

恭喜！你的博客现在已经完全部署到云端了！🚀
