---
title: 'Python爬虫入门：10分钟抓取豆瓣读书标题'
date: '2025-07-24'
tags: ['Python', 'Web Scraping', 'Beginner']
---

你是否曾想过, 如何用代码自动从网站上获取信息？这就是网络爬虫的魔力！作为一名程序员, 掌握爬虫技术能让你轻松获取海量数据, 无论是进行市场分析, 还是构建个人项目, 都大有裨益.

本篇教程将作为你Python爬虫学习的起点. 我将通过一个非常简单的实例, 带你用不到20行代码, 从零开始编写一个真正的网络爬虫, 抓取[豆瓣读书](https://book.douban.com/)首页的标题.

准备好了吗？让我们开始吧！

### 准备工作: 安装必要的库

在开始之前, 我们需要安装两个Python爬虫的利器：

1.  `requests`: 它能帮你像浏览器一样访问网页.
2.  `BeautifulSoup`: 它能帮你从网页的HTML代码中轻松提取出你想要的数据.

打开你的终端 (命令行工具), 输入以下命令来安装它们:

```bash
pip install requests
pip install beautifulsoup4
```

### 核心代码: 抓取豆瓣读书标题

下面是我们的全部代码. 你可以先将它完整地复制到一个名为 `douban_title_scraper.py` 的文件中, 然后我会逐行解释它的作用.

```python
# 爬虫入门：抓取豆瓣读书首页标题

# 1. 导入需要的库
# requests: 负责发送网络请求，从网站获取HTML源代码，就像你的浏览器一样。
import requests
# BeautifulSoup: 负责解析HTML代码，让我们能方便地提取出需要的数据。
from bs4 import BeautifulSoup

# 2. 定义要抓取的目标URL
# 我们把要访问的网址存储在一个变量里，方便管理。
url = 'https://book.douban.com/'

# 3. 设置请求头 (Headers)
# 网站为了防止被恶意爬虫攻击，会检查访问者的身份。
# User-Agent是请求头的一部分，它告诉网站我们是什么样的浏览器。
# 模仿成一个真实的浏览器，可以提高抓取成功的概率。
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

# 4. 发送网络请求
# 使用requests.get()方法向目标url发送一个GET请求。
# 这就像在浏览器地址栏输入网址后按回车。
# 我们把服务器返回的响应内容存储在response变量里。
print("正在向豆瓣读书发送请求...")
response = requests.get(url, headers=headers)
print("请求成功！")

# 5. 检查响应状态码
# HTTP状态码200表示请求成功。
# 在进行下一步前，最好先检查一下确保我们成功获取了页面。
if response.status_code == 200:
    print(f"服务器响应正常 (状态码: {response.status_code})")

    # 6. 解析HTML内容
    # response.text是服务器返回的HTML源代码（字符串格式）。
    # 我们用BeautifulSoup来解析它，'html.parser'是Python内置的解析器。
    # 解析后，我们就可以用soup对象来操作HTML元素了。
    soup = BeautifulSoup(response.text, 'html.parser')

    # 7. 提取页面标题
    # soup.title可以获取HTML中<title>标签的内容。
    # .string可以提取标签内的文本。
    page_title = soup.title.string

    # 8. 打印结果
    # 将我们提取到的标题打印出来。
    print("\n--- 抓取结果 ---")
    print(f"网页标题是: {page_title}")
    print("--------------------")

else:
    # 如果状态码不是200，说明请求可能出错了。
    print(f"请求失败，状态码: {response.status_code}")

```

### 代码详解

*   **第1-5行**: 导入我们需要的`requests`和`BeautifulSoup`库.
*   **第8行**: 我们定义了一个`url`变量, 存储了我们要抓取的网页地址.
*   **第11-15行**: 这里我们定义了一个`headers`. 简单来说, 它是为了模拟成一个真实的浏览器去访问网站, 从而避免被网站拒绝访问. `User-Agent`就是我们"伪装"的身份.
*   **第18-21行**: 这是最核心的一步. 我们使用`requests.get()`函数, 传入`url`和`headers`, 向豆瓣的服务器发送了一个请求. 服务器返回的响应, 我们保存在了`response`变量中.
*   **第24行**: 我们通过检查`response.status_code`来判断请求是否成功. `200`是HTTP协议中表示"成功"的状态码.
*   **第28行**: `response.text`包含了网页的完整HTML源代码. 我们把它交给`BeautifulSoup`来解析, 方便我们后续的提取工作.
*   **第32-34行**: `BeautifulSoup`解析后, 我们可以很方便地用`soup.title.string`来直接获取网页`<title>`标签里的文本内容.
*   **第37-40行**: 最后, 我们将抓取到的标题打印出来.
*   **第42-44行**: 如果`status_code`不是200, 我们就打印出错误信息.

### 运行脚本, 查看结果

在终端中, 切换到你保存`douban_title_scraper.py`文件的目录, 然后运行它:

```bash
python douban_title_scraper.py
```

如果一切顺利, 你会看到类似下面的输出:

```
正在向豆瓣读书发送请求...
请求成功！
服务器响应正常 (状态码: 200)

--- 抓取结果 ---
网页标题是: 豆瓣读书
--------------------
```

恭喜你！你已经成功编写并运行了你的第一个Python爬虫！

### 总结与展望

在本教程中, 我们学习了:
*   如何使用`requests`库获取网页内容.
*   如何使用`BeautifulSoup`库解析HTML并提取数据.
*   理解了`User-Agent`等请求头的基本作用.

这只是爬虫世界的冰山一角. 接下来, 你可以尝试:
*   抓取其他网站的标题.
*   尝试提取正文内容, 而不仅仅是标题.
*   学习如何抓取一个列表页面的所有文章链接.

希望这篇入门教程能点燃你对网络爬虫的兴趣. 祝你编程愉快！
