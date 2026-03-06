---
title: "Parsing HTML with BeautifulSoup（使用 BeautifulSoup 解析 HTML）"
date: "2026-03-06"
excerpt: "学习使用 BeautifulSoup 解析 HTML，掌握 find/find_all、CSS 选择器、属性与文本提取。"
tags: ["Python", "Web Scraping", "BeautifulSoup", "HTML", "Parsing"]
category: "Python"
section: "python"
subsection: "web-scraping"
---


# Parsing HTML with BeautifulSoup（使用 BeautifulSoup 解析 HTML）

在 Python Web Scraping（网页爬虫）中，获取网页 HTML 只是第一步。真正重要的是 **解析 HTML 并提取我们需要的数据**。

**BeautifulSoup** 是 Python 中最流行的 HTML 解析库之一，它可以帮助我们轻松从网页中提取信息。

---

# 什么是 BeautifulSoup

BeautifulSoup 是一个用于解析 HTML 和 XML 文档的 Python 库。

它可以将 HTML 文档转换成 **树形结构（DOM Tree）**，从而方便我们查找和提取数据。

BeautifulSoup 常用于：

* 提取网页标题
* 获取文章内容
* 抓取图片链接
* 获取商品信息
* 解析新闻列表

---

# 安装 BeautifulSoup

首先需要安装 BeautifulSoup。

```bash
pip install beautifulsoup4
```

同时建议安装 **lxml 解析器**（速度更快）：

```bash
pip install lxml
```

导入库：

```python
from bs4 import BeautifulSoup
```

---

# 创建 BeautifulSoup 对象

通常我们会先使用 **requests** 获取网页 HTML。

示例：

```python
import requests
from bs4 import BeautifulSoup

url = "https://example.com"

response = requests.get(url)

soup = BeautifulSoup(response.text, "html.parser")

print(soup)
```

这里：

* `response.text` 是网页 HTML
* `"html.parser"` 是 Python 内置解析器

---

# 获取网页标题

获取 `<title>` 标签内容：

```python
print(soup.title)
```

输出：

```html
<title>Example Domain</title>
```

如果只想获取文本：

```python
print(soup.title.text)
```

---

# 查找 HTML 元素

BeautifulSoup 提供了多种查找方法。

## find()

查找 **第一个匹配元素**

```python
soup.find("h1")
```

示例：

```python
title = soup.find("h1")

print(title.text)
```

---

## find_all()

查找 **所有匹配元素**

```python
soup.find_all("a")
```

示例：

```python
links = soup.find_all("a")

for link in links:
    print(link.get("href"))
```

这段代码会输出所有链接。

---

# 根据属性查找

很多时候需要根据 **class 或 id** 查找元素。

示例 HTML：

```html
<div class="article">
  <h2>News Title</h2>
</div>
```

查找：

```python
soup.find("div", class_="article")
```

注意：

`class` 是 Python 关键字，所以要写成：

```python
class_
```

---

# 使用 CSS 选择器

BeautifulSoup 也支持 **CSS 选择器**。

使用 `select()`：

```python
soup.select("a")
```

查找 class：

```python
soup.select(".article")
```

查找 id：

```python
soup.select("#main")
```

示例：

```python
links = soup.select("a")

for link in links:
    print(link.text)
```

---

# 获取 HTML 属性

例如获取链接地址：

```html
<a href="https://example.com">Visit</a>
```

Python：

```python
link = soup.find("a")

print(link["href"])
```

或者：

```python
print(link.get("href"))
```

---

# 获取文本内容

获取标签中的文本：

```python
tag.text
```

示例：

```python
paragraph = soup.find("p")

print(paragraph.text)
```

---

# 完整示例：抓取网页标题和所有链接

```python
import requests
from bs4 import BeautifulSoup

url = "https://example.com"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)

soup = BeautifulSoup(response.text, "html.parser")

# 获取标题
print("网页标题:", soup.title.text)

# 获取所有链接
links = soup.find_all("a")

for link in links:
    print(link.get("href"))
```

运行后会输出网页标题和所有链接。

---

# BeautifulSoup 常用方法

| 方法         | 作用         |
| ---------- | ---------- |
| find()     | 查找第一个元素    |
| find_all() | 查找所有元素     |
| select()   | 使用 CSS 选择器 |
| get()      | 获取属性       |
| text       | 获取文本内容     |

---

# BeautifulSoup 的优点

BeautifulSoup 受欢迎的原因：

* 简单易用
* 文档丰富
* 支持多种解析器
* 与 Requests 完美配合
* 非常适合初学者学习爬虫

---

# 总结

在 Python Web Scraping 中：

1. **Requests** 用来获取网页 HTML
2. **BeautifulSoup** 用来解析 HTML
3. 提取网页中的数据

掌握 BeautifulSoup 后，你就可以开始编写真正的网页爬虫。

