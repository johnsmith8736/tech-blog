---
title: 'Python 爬虫入门指南'
date: '2025-06-26'
excerpt: '本文将带你了解 Python 爬虫的基础知识，并使用 requests 和 BeautifulSoup 库编写你的第一个爬虫。'
---

以下是一个简洁的 Python 爬虫入门指南，适合初学者快速上手。我们将使用 Python 的 `requests` 库获取网页内容，并使用 `BeautifulSoup` 解析 HTML，提取所需数据。

---

### **一、准备工作**
1. **安装必要的库**
   在终端或命令行运行以下命令安装所需的库：
   ```bash
   pip install requests beautifulsoup4
   ```
   - `requests`：用于发送 HTTP 请求，获取网页内容。
   - `beautifulsoup4`：用于解析 HTML，提取数据。

2. **选择目标网站**
   - 选择一个简单的静态网页作为练习目标，例如一个公开的新闻网站或维基百科页面。
   - 注意：爬虫需遵守目标网站的 `robots.txt` 规则和法律规定，避免频繁请求导致被封禁。

---

### **二、基本爬虫代码示例**
以下是一个简单的爬虫程序，爬取维基百科页面中所有标题（`<h2>` 标签）的内容。

```python
import requests
from bs4 import BeautifulSoup

# 1. 发送 HTTP 请求获取网页内容
url = "https://en.wikipedia.org/wiki/Python_(programming_language)"
response = requests.get(url)

# 2. 检查请求是否成功
if response.status_code == 200:
    print("网页请求成功！")
else:
    print("请求失败，状态码：", response.status_code)
    exit()

# 3. 解析网页内容
soup = BeautifulSoup(response.text, "html.parser")

# 4. 提取所有 <h2> 标签的内容
headings = soup.find_all("h2")

# 5. 输出提取的标题
for heading in headings:
    print(heading.text)
```

**代码说明**：
- `requests.get(url)`：发送 GET 请求获取网页内容。
- `BeautifulSoup(response.text, "html.parser")`：将网页的 HTML 内容解析为可操作的对象。
- `soup.find_all("h2")`：查找所有 `<h2>` 标签，提取标题文本。

---

### **三、爬虫开发步骤**
1. **确定目标**：
   - 明确要爬取的数据（如标题、链接、图片等）。
   - 检查网页的 HTML 结构（右键 → 检查元素）。

2. **发送请求**：
   - 使用 `requests` 库发送 GET 或 POST 请求。
   - 添加 headers（如 User-Agent）模拟浏览器，防止被拦截：
     ```python
     headers = {
         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124"
     }
     response = requests.get(url, headers=headers)
     ```

3. **解析数据**：
   - 使用 `BeautifulSoup` 查找特定标签、类或 ID。
   - 示例：提取所有超链接（`<a>` 标签）：
     ```python
     links = soup.find_all("a")
     for link in links:
         href = link.get("href")
         if href:
             print(href)
     ```

4. **存储数据**：
   - 将爬取的数据保存到文件（如 CSV、JSON）或数据库。
   - 示例：保存到 CSV 文件：
     ```python
     import csv
     with open("headings.csv", "w", newline="", encoding="utf-8") as file:
         writer = csv.writer(file)
         writer.writerow(["Heading"])
         for heading in headings:
             writer.writerow([heading.text])
     ```

5. **处理动态网页**（可选）：
   - 如果目标网站使用 JavaScript 动态加载内容，`requests` 和 `BeautifulSoup` 可能无法获取数据。
   - 解决方案：使用 `selenium` 或 `playwright` 模拟浏览器操作。
   - 安装 `selenium`：
     ```bash
     pip install selenium
     ```
   - 示例代码：
     ```python
     from selenium import webdriver
     from selenium.webdriver.chrome.service import Service
     from webdriver_manager.chrome import ChromeDriverManager

     driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
     driver.get(url)
     print(driver.page_source)  # 获取动态加载的页面内容
     driver.quit()
     ```

---

### **四、注意事项**
1. **遵守法律和道德**：
   - 查看目标网站的 `robots.txt`（如 `https://example.com/robots.txt`），遵守其限制。
   - 不要对服务器进行高频请求，建议设置请求间隔：
     ```python
     import time
     time.sleep(2)  # 每次请求间隔 2 秒
     ```

2. **异常处理**：
   - 处理网络错误、页面不存在等问题：
     ```python
     try:
         response = requests.get(url, timeout=5)
         response.raise_for_status()  # 检查请求是否成功
     except requests.exceptions.RequestException as e:
         print("请求出错：", e)
     ```

3. **反爬机制**：
   - 一些网站会检测爬虫，需模拟真实用户行为（如添加 headers、随机 User-Agent）。
   - 使用 `fake-useragent` 库生成随机 User-Agent：
     ```bash
     pip install fake-useragent
     ```
     ```python
     from fake_useragent import UserAgent
     ua = UserAgent()
     headers = {"User-Agent": ua.random}
     ```

4. **数据清洗**：
   - 爬取的数据可能包含多余的空白或无关内容，使用字符串方法（如 `strip()`）或正则表达式清理。

---

### **五、进阶学习建议**
1. **学习 CSS 选择器和 XPath**：
   - 使用 `soup.select()` 支持 CSS 选择器：
     ```python
     titles = soup.select("h2 > span.mw-headline")  # 选择 h2 下的 span 标签
     ```
   - 使用 `lxml` 或 `parsel` 支持 XPath 提取。

2. **爬取 API**：
   - 许多网站提供公开 API（如 Twitter、Reddit），直接获取 JSON 数据更高效。
   - 示例：请求 JSON 数据：
     ```python
     response = requests.get("https://api.example.com/data")
     data = response.json()
     ```

3. **使用爬虫框架**：
   - 学习 `Scrapy` 框架，适合大规模爬取：
     ```bash
     pip install scrapy
     ```
   - Scrapy 提供强大的爬虫管理、并发处理和数据存储功能。

4. **处理登录**：
   - 使用 `requests.Session()` 模拟登录，处理 cookies：
     ```python
     session = requests.Session()
     login_data = {"username": "user", "password": "pass"}
     session.post("https://example.com/login", data=login_data)
     ```

---

### **六、推荐资源**
- **文档**：
  - [Requests 官方文档](https://requests.readthedocs.io/en/latest/)
  - [BeautifulSoup 官方文档](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
  - [Scrapy 官方文档](https://docs.scrapy.org/en/latest/)
- **教程**：
  - B 站或 YouTube 的 Python 爬虫入门视频。
  - 《Web Scraping with Python》书籍。
- **实践项目**：
  - 爬取新闻网站的标题和摘要。
  - 爬取电商网站的商品价格和评论。

---

通过以上步骤，你可以快速入门 Python 爬虫！
