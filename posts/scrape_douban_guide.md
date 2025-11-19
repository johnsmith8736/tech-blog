---
title: '爬取豆瓣电影 Top 250 并存为 Excel 文件'
date: '2024-07-18'
---

# 爬取豆瓣电影 Top 250 并存为 Excel 文件

本文档将详细解释如何使用 Python 爬取豆瓣电影 Top 250 的数据，并将结果存储为 Excel 文件。

## 功能概述

本教程将引导您完成以下任务：

1.  发送网络请求到豆瓣电影 Top 250 的每一个页面。
2.  使用 BeautifulSoup 解析返回的 HTML 内容。
3.  提取每部电影的标题。
4.  将所有电影标题存储到 Excel 文件中。

## 环境准备

在运行代码之前，请确保您已经安装了以下 Python 库：

-   `requests`: 用于发送 HTTP 请求。
-   `beautifulsoup4`: 用于解析 HTML 和 XML 文档。
-   `pandas`: 用于数据处理和分析，这里我们用它来创建和导出 Excel 文件。
-   `openpyxl`: `pandas` 在写入 `.xlsx` 文件时需要此库。

您可以使用 `pip` 来安装这些库：

```bash
pip install requests beautifulsoup4 pandas openpyxl
```

## 代码详解

### 1. 导入所需库

```python
import requests
from bs4 import BeautifulSoup
import pandas as pd
import os
```

-   `requests`: 用来获取网页内容。
-   `BeautifulSoup`: 用来从网页中提取数据。
-   `pandas`: 用来处理数据并将其写入 Excel 文件。
-   `os`: 用来进行文件和目录操作，例如创建文件夹。

### 2. 模拟浏览器行为

```python
headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
}
```

为了防止被网站识别为爬虫并屏蔽，我们设置了 `User-Agent` 请求头，模拟成一个普通的浏览器用户。

### 3. 循环爬取所有页面

豆瓣 Top 250 列表分布在 10 个页面上，每个页面显示 25 部电影。URL 的规律是通过 `start` 参数来控制分页，例如 `start=0` 是第一页，`start=25` 是第二页，以此类推。

```python
titles = []  # 初始化一个空列表来存储标题

for start_num in range(0, 250, 25):
    # 构造每一页的 URL
    url = f"https://movie.douban.com/top250?start={start_num}"
    
    # 发送请求
    response = requests.get(url, headers=headers)
    html = response.text
    
    # 解析 HTML
    soup = BeautifulSoup(html, 'html.parser')
    
    # 提取标题
    all_titles = soup.find_all("span", attrs={"class": "title"})
    for title in all_titles:
        title_string = title.string
        # 过滤掉非主标题的斜杠部分
        if "/" not in title_string:
            titles.append(title_string.strip())
```

-   我们使用一个 `for` 循环，`range(0, 250, 25)` 会生成 `0, 25, 50, ..., 225`，正好对应每一页的 `start` 参数。
-   `requests.get()` 发送请求并获取返回的 HTML。
-   `BeautifulSoup(html, 'html.parser')` 创建一个 BeautifulSoup 对象来解析 HTML。
-   `soup.find_all("span", attrs={"class": "title"})` 会找到所有 `class` 属性为 `title` 的 `<span>` 标签，这些标签里包含了电影的中英文名。
-   我们只保留了不包含 `/` 的标题，这通常是电影的中文主标题。

### 4. 存储到 Excel 文件

```python
# 定义输出目录和文件名
output_dir = 'output'
os.makedirs(output_dir, exist_ok=True)  # 确保目录存在
output_path = os.path.join(output_dir, 'douban_top250.xlsx')

# 使用 pandas 创建 DataFrame
df = pd.DataFrame({'Movie Title': titles})

# 将 DataFrame 保存为 Excel 文件
df.to_excel(output_path, index=False)

print(f"成功将数据保存到 {output_path}")
```

-   我们首先创建一个名为 `output` 的文件夹来存放结果。
-   `pd.DataFrame()` 将我们之前收集的标题列表转换成一个 pandas DataFrame。
-   `df.to_excel()` 方法将 DataFrame 写入到一个 Excel 文件中。`index=False` 参数表示在输出的 Excel 中不包含 DataFrame 的索引列。

## 完整代码

```python
import requests
from bs4 import BeautifulSoup
import pandas as pd
import os

def scrape_douban_top250():
    """
    爬取豆瓣电影 Top 250 的标题并保存到 Excel 文件。
    """
    # 设置请求头，模拟浏览器
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
    }

    titles = []  # 存储电影标题

    # 循环遍历10个页面
    for start_num in range(0, 250, 25):
        print(f"正在爬取第 {start_num // 25 + 1} 页...")
        url = f"https://movie.douban.com/top250?start={start_num}"
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()  # 如果请求失败则抛出异常
            html = response.text
            soup = BeautifulSoup(html, 'html.parser')

            # 查找所有 class="title" 的 span 标签
            all_titles = soup.find_all("span", attrs={"class": "title"})
            for title in all_titles:
                title_string = title.string
                # 过滤掉包含'/'的标题（通常是外文名或别名）
                if title_string and "/" not in title_string:
                    titles.append(title_string.strip())
        
        except requests.RequestException as e:
            print(f"请求页面失败: {e}")
            continue

    # --- 数据存储 ---
    if titles:
        output_dir = 'output'
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, 'douban_top250.xlsx')

        # 创建 DataFrame
        df = pd.DataFrame({'Movie Title': titles})
        
        # 保存到 Excel
        df.to_excel(output_path, index=False)
        
        print(f"任务完成！成功爬取 {len(titles)} 个电影标题。")
        print(f"数据已保存到: {output_path}")
    else:
        print("未能爬取到任何电影标题。")

if __name__ == '__main__':
    scrape_douban_top250()
```

## 如何运行

1.  将上述完整代码保存为一个 Python 文件（例如 `scrape_douban.py`）。
2.  打开终端或命令行，进入文件所在目录。
3.  运行脚本：`python scrape_douban.py`

脚本执行完毕后，您会在同级目录下看到一个名为 `output` 的文件夹，其中包含了 `douban_top250.xlsx` 文件。

## 输出结果

生成的 `douban_top250.xlsx` 文件会包含一列名为 "Movie Title" 的数据，列出了从豆瓣网站上爬取的所有电影标题。