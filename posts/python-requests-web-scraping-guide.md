---
title: "Web Scraping with Python Requests（使用 Python Requests 进行网页爬取）"
date: "2026-03-06"
excerpt: "使用 Python Requests 进行网页爬取的入门指南，涵盖请求、状态码、Headers、JSON 与 BeautifulSoup 配合。"
tags: ["Python", "Web Scraping", "Requests", "HTTP", "BeautifulSoup"]
category: "Python"
section: "python"
subsection: "web-scraping"
---


# Web Scraping with Python Requests（使用 Python Requests 进行网页爬取）

在 Python 爬虫开发中，**Requests** 是最常用的 HTTP 请求库之一。它可以帮助我们向网站发送请求并获取网页数据，是 Web Scraping 的基础工具。

本文将介绍如何使用 Python Requests 进行网页爬取。

---

# 什么是 Requests

Requests 是一个简单而强大的 Python HTTP 库，可以用来发送各种 HTTP 请求，例如：

* GET
* POST
* PUT
* DELETE

使用 Requests 可以轻松获取网页的 HTML 内容，然后再使用 HTML 解析库（例如 BeautifulSoup）提取数据。

---

# 安装 Requests

首先需要安装 Requests 库。

```bash
pip install requests
```

安装完成后可以在 Python 中导入：

```python
import requests
```

---

# 发送第一个 HTTP 请求

最简单的爬虫就是发送一个 GET 请求获取网页内容。

```python
import requests

url = "https://example.com"

response = requests.get(url)

print(response.text)
```

运行后，程序会输出网页的 HTML 源代码。

---

# HTTP 响应对象

Requests 返回的是一个 **Response 对象**，里面包含很多有用的信息。

示例：

```python
import requests

response = requests.get("https://example.com")

print(response.status_code)
print(response.headers)
print(response.text)
```

常见属性：

| 属性                   | 说明         |
| -------------------- | ---------- |
| response.status_code | HTTP 状态码   |
| response.text        | 网页 HTML 内容 |
| response.headers     | HTTP 响应头   |
| response.url         | 最终访问的 URL  |

---

# HTTP 状态码

当发送请求时，服务器会返回状态码：

| 状态码 | 含义    |
| --- | ----- |
| 200 | 请求成功  |
| 301 | 永久重定向 |
| 404 | 页面不存在 |
| 500 | 服务器错误 |

示例：

```python
import requests

response = requests.get("https://example.com")

if response.status_code == 200:
    print("请求成功")
else:
    print("请求失败")
```

---

# 添加请求头（Headers）

有些网站会检测浏览器请求，如果没有浏览器的 **User-Agent**，可能会拒绝访问。

因此通常需要添加请求头。

示例：

```python
import requests

url = "https://example.com"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)

print(response.text)
```

---

# 发送 POST 请求

某些网站（例如登录表单）需要使用 POST 请求。

示例：

```python
import requests

url = "https://httpbin.org/post"

data = {
    "username": "test",
    "password": "123456"
}

response = requests.post(url, data=data)

print(response.text)
```

---

# 处理 JSON 数据

很多网站 API 返回的是 JSON 格式。

Requests 可以直接解析 JSON。

```python
import requests

url = "https://api.github.com"

response = requests.get(url)

data = response.json()

print(data)
```

---

# 设置请求超时

如果服务器响应很慢，可以设置超时时间。

```python
import requests

response = requests.get("https://example.com", timeout=5)
```

如果 5 秒内没有响应，请求会自动终止。

---

# 使用 Requests + BeautifulSoup 爬取网页

Requests 负责获取网页内容，而 BeautifulSoup 负责解析 HTML。

示例：

```python
import requests
from bs4 import BeautifulSoup

url = "https://example.com"

response = requests.get(url)

soup = BeautifulSoup(response.text, "html.parser")

print(soup.title.text)
```

---

# 一个简单的网页爬虫示例

下面是一个完整的简单爬虫：

```python
import requests
from bs4 import BeautifulSoup

url = "https://example.com"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)

soup = BeautifulSoup(response.text, "html.parser")

title = soup.title.text

print("网页标题:", title)
```

运行后会输出网页标题。

---

# Requests 的优点

Requests 在 Python 爬虫中非常受欢迎，原因包括：

* API 简单易用
* 支持 HTTPS
* 自动处理 cookies
* 支持 session
* 与 BeautifulSoup 完美配合

---

# 总结

通过本文你学会了：

* 使用 Requests 发送 HTTP 请求
* 处理响应数据
* 添加请求头
* 发送 POST 请求
* 解析 JSON
* 与 BeautifulSoup 配合爬取网页

Requests 是 Python 爬虫开发的基础库，掌握它之后可以继续学习更高级的爬虫框架，例如 Scrapy。


