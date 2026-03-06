---
title: "Python Web Scraping 入门教程"
date: "2026-03-06"
excerpt: "使用 requests 与 BeautifulSoup 快速上手 Python 网页抓取，包含代码示例与常见问题处理。"
tags: ["Python", "Web Scraping", "requests", "BeautifulSoup", "Crawler"]
category: "Python"
section: "python"
subsection: "web-scraping"
---


# Python Web Scraping 入门教程

Web Scraping（网页抓取）是一种自动从网站提取数据的技术。通过编写程序，我们可以自动访问网页并提取所需信息，例如新闻标题、商品价格或评论数据。

在本教程中，你将学习如何使用 **Python** 编写一个简单的网页爬虫。

---

# 为什么使用 Python 做 Web Scraping？

Python 是最流行的爬虫语言之一，原因包括：

* 语法简单，适合初学者
* 拥有丰富的爬虫库
* 社区资源丰富
* 适合数据分析和自动化

常见 Python 爬虫工具：

| 工具            | 作用         |
| ------------- | ---------- |
| requests      | 发送 HTTP 请求 |
| BeautifulSoup | 解析 HTML    |
| Scrapy        | 专业爬虫框架     |
| Selenium      | 模拟浏览器      |

本教程主要使用 **requests + BeautifulSoup**。

---

# 环境准备

首先安装需要的 Python 库：

```bash
pip install requests
pip install beautifulsoup4
```

如果你使用的是 Linux（例如 Arch Linux），也可以使用：

```bash
pip install requests beautifulsoup4
```

---

# 第一个 Python 爬虫

我们从抓取网页标题开始。

## 示例代码

```python
import requests
from bs4 import BeautifulSoup

url = "https://example.com"

response = requests.get(url)

soup = BeautifulSoup(response.text, "html.parser")

print(soup.title.text)
```

运行后会输出：

```
Example Domain
```

---

# 代码解释

### 1 发送 HTTP 请求

```python
response = requests.get(url)
```

这行代码会向网站发送请求，并获取网页内容。

---

### 2 获取 HTML 内容

```python
response.text
```

服务器返回的网页内容通常是 HTML。

例如：

```html
<html>
<head>
<title>Example Domain</title>
</head>
</html>
```

---

### 3 解析 HTML

```python
soup = BeautifulSoup(response.text, "html.parser")
```

BeautifulSoup 会把 HTML 转换为 Python 可以解析的结构。

---

### 4 提取数据

```python
soup.title.text
```

这行代码提取 `<title>` 标签中的文本。

---

# 抓取网页中的多个元素

假设网页中有多个标题：

```html
<h2>Article 1</h2>
<h2>Article 2</h2>
<h2>Article 3</h2>
```

我们可以使用：

```python
titles = soup.find_all("h2")

for title in titles:
    print(title.text)
```

输出：

```
Article 1
Article 2
Article 3
```

---

# 抓取网页链接

网页中的链接通常在 `<a>` 标签中：

```html
<a href="https://example.com">Example</a>
```

Python 爬虫代码：

```python
links = soup.find_all("a")

for link in links:
    print(link.get("href"))
```

输出：

```
https://example.com
```

---

# 保存抓取数据

我们可以把数据保存到 CSV 文件。

```python
import csv

titles = soup.find_all("h2")

with open("data.csv", "w") as f:
    writer = csv.writer(f)

    for title in titles:
        writer.writerow([title.text])
```

生成的 CSV 文件：

```
Article 1
Article 2
Article 3
```

---

# 添加浏览器 User-Agent

有些网站会阻止爬虫，需要模拟浏览器访问。

```python
headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)
```

这样网站会认为请求来自浏览器。

---

# 常见问题

## 1 网站返回 403

原因：

* 网站检测到爬虫

解决方法：

* 添加 User-Agent
* 使用代理 IP

---

## 2 页面内容为空

原因：

* 网站使用 JavaScript 动态加载

解决方法：

使用浏览器自动化工具，例如：

* Selenium
* Playwright

---

# 进阶学习

当你掌握基础爬虫后，可以学习更高级技术：

* Scrapy 爬虫框架
* Selenium 自动化
* 代理 IP
* 反反爬虫技术
* 分布式爬虫

---

# 总结

在本教程中，我们学习了：

* 什么是 Web Scraping
* 如何使用 Python 抓取网页
* 使用 BeautifulSoup 解析 HTML
* 提取标题和链接
* 保存数据

Python 爬虫是数据分析、自动化和 AI 领域的重要技能，非常值得学习。

