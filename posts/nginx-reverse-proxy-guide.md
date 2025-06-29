---
title: 'Nginx 反向代理配置详解'
date: '2025-06-24'
excerpt: '学习如何使用 Nginx 作为反向代理，来提高你的 Web 应用的性能、安全性和可扩展性。'
---

## **什么是反向代理？**

**反向代理是位于客户端和后端服务之间的一台服务器。它可以将客户端的请求转发到一个或多个后端服务器，并将响应返回给客户端，就好像它自己就是源服务器一样。**

## **基础配置**

**下面是一个将所有到 `your_domain.com` 的请求转发到本地运行在 3000 端口的应用的 Nginx 配置示例。**

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### **关键指令**

- **`listen`**: 指定监听的端口。
- **`server_name`**: 匹配请求的域名。
- **`location /`**: 匹配所有请求路径。
- **`proxy_pass`**: 将请求转发到的后端服务地址。

## **优点**

- **负载均衡**: 将流量分发到多个后端服务器。
- **增强安全**: 隐藏后端服务器的 IP 地址。
- **SSL 终端**: 集中处理 SSL 加密。
- **缓存静态内容**: 减轻后端服务器的压力。
