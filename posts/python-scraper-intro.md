---
title: 'Python 爬虫入门指南'
date: '2025-06-26'
excerpt: '本文将带你了解 Python 爬虫的基础知识，并使用 requests 和 BeautifulSoup 库编写你的第一个爬虫。'
---

## 什么是网络爬虫？

网络爬虫（又称为网络蜘蛛、网络机器人）是一种自动抓取互联网信息的程序。它们被广泛用于搜索引擎、数据挖掘、价格监控等领域。

## 准备工作

在开始之前，请确保你已经安装了 Python。然后，我们需要安装两个核心库：

- **requests**: 用于发送 HTTP 请求，获取网页内容。
- **BeautifulSoup**: 用于解析 HTML 和 XML 文档，提取所需数据。

你可以使用 pip 来安装它们：

```bash
pip install requests beautifulsoup4
```

## 编写你的第一个爬虫

我们的目标是抓取一个示例网站的标题。

```python
import requests
from bs4 import BeautifulSoup

# 目标 URL
url = 'http://example.com/'

# 发送 GET 请求
response = requests.get(url)

# 解析 HTML
soup = BeautifulSoup(response.text, 'html.parser')

# 提取标题
title = soup.find('h1').text

print(f'网站标题是: {title}')
```

就是这么简单！你已经成功编写并运行了你的第一个网络爬虫。
