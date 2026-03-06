---
title: "Using XPath for Web Scraping（使用 XPath 进行网页爬取）"
date: "2026-03-06"
excerpt: "在 Python 爬虫中使用 lxml + XPath 精准提取网页元素，包含语法、示例与实战代码。"
tags: ["Python", "Web Scraping", "XPath", "lxml", "Crawler"]
category: "Python"
section: "python"
subsection: "web-scraping"
---


# Using XPath for Web Scraping（使用 XPath 进行网页爬取）

在 Web Scraping（网页爬虫）中，我们不仅可以使用 **BeautifulSoup** 或 **CSS 选择器** 来提取网页数据，还可以使用 **XPath**。

XPath 是一种非常强大的查询语言，可以用来在 HTML 或 XML 文档中精确定位元素。许多专业爬虫框架（例如 **Scrapy**）都大量使用 XPath。

本文将介绍如何在 Python 爬虫中使用 XPath。

---

# 什么是 XPath

XPath（XML Path Language）是一种用于在 XML 或 HTML 文档中定位节点的语言。

它类似于文件系统路径，例如：

```
/html/body/div
```

意思是：

```
html → body → div
```

XPath 的主要作用：

* 查找 HTML 元素
* 提取网页数据
* 精确定位网页结构

---

# 安装 lxml

在 Python 中，通常使用 **lxml** 库来解析 HTML 并使用 XPath。

安装：

```bash
pip install lxml
```

导入：

```python
from lxml import etree
```

---

# 解析 HTML 文档

首先获取网页 HTML，然后解析。

示例：

```python
import requests
from lxml import etree

url = "https://example.com"

response = requests.get(url)

html = etree.HTML(response.text)

print(html)
```

这里：

* `etree.HTML()` 用于解析 HTML
* 返回一个 DOM 树结构

---

# 使用 XPath 获取元素

使用 `.xpath()` 方法可以查询元素。

示例：

```python
html.xpath("//h1")
```

这会返回页面中所有 `<h1>` 标签。

---

# 获取网页标题

例如网页结构：

```html
<h1>Example Domain</h1>
```

Python：

```python
title = html.xpath("//h1/text()")

print(title)
```

输出：

```
['Example Domain']
```

如果只想获取字符串：

```python
print(title[0])
```

---

# 获取所有链接

网页中的链接通常在 `<a>` 标签中。

示例：

```python
links = html.xpath("//a/@href")

for link in links:
    print(link)
```

解释：

```
 //a      所有 a 标签
 @href    href 属性
```

---

# XPath 基本语法

| XPath                  | 含义                 |
| ---------------------- | ------------------ |
| `//div`                | 所有 div 元素          |
| `//a/@href`            | 所有链接               |
| `//p/text()`           | p 标签文本             |
| `//div[@class="news"]` | class 为 news 的 div |

---

# 根据属性查找

HTML 示例：

```html
<div class="article">
  <h2>News Title</h2>
</div>
```

XPath：

```python
html.xpath('//div[@class="article"]')
```

获取标题：

```python
html.xpath('//div[@class="article"]/h2/text()')
```

---

# 使用 contains()

有些 class 可能包含多个值：

```html
<div class="article news">
```

XPath：

```python
html.xpath('//div[contains(@class,"article")]')
```

---

# 使用索引

XPath 也可以选择第几个元素。

例如：

```python
html.xpath('//a[1]')
```

表示 **第一个 a 标签**。

获取文本：

```python
html.xpath('(//a/text())[1]')
```

---

# 完整爬虫示例

下面是一个使用 XPath 的简单爬虫：

```python
import requests
from lxml import etree

url = "https://example.com"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)

html = etree.HTML(response.text)

# 获取标题
title = html.xpath("//title/text()")

print("网页标题:", title[0])

# 获取所有链接
links = html.xpath("//a/@href")

for link in links:
    print(link)
```

运行后会输出：

```
网页标题: Example Domain
https://www.iana.org/domains/example
```

---

# XPath vs CSS Selector

| 方法           | 优点   | 缺点    |
| ------------ | ---- | ----- |
| CSS Selector | 简单易学 | 功能较少  |
| XPath        | 功能强大 | 语法稍复杂 |

一般来说：

* **简单爬虫** → CSS 选择器
* **复杂爬虫** → XPath

---

# XPath 的优点

XPath 在 Web Scraping 中非常强大，因为：

* 可以精确定位元素
* 支持复杂查询
* 支持文本匹配
* 支持属性筛选
* Scrapy 框架默认支持 XPath

---

# 总结

在 Python 爬虫开发中：

1. 使用 **requests** 获取网页
2. 使用 **lxml** 解析 HTML
3. 使用 **XPath** 提取数据

掌握 XPath 可以让你更高效地抓取网页数据。

