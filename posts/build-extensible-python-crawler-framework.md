---
title: "从零到一：构建你自己的Python爬虫框架（含代理池+异常重试）"
date: "2025-07-18"
description: "超越简单脚本，本文将指导你从零开始，构建一个类似Scrapy的、可扩展的Python爬虫框架。你将学习到模块化设计、数据流控制，并亲手实现代理池集成和自动异常重试等高级功能。"
---

## 前言：我们为什么要“造轮子”？

Python的世界里已经有了像Scrapy这样成熟且强大的爬虫框架。那么，为什么我们还要费心去构建自己的框架呢？

答案是：**为了深入理解爬虫的本质。**

通过亲手构建一个迷你框架，你将不再仅仅是API的调用者，而是架构的思考者。你将清晰地看到一个URL请求如何流转、数据如何被解析、异常如何被处理。这个过程将极大地提升你的编程内功和系统设计能力。

## 一、框架架构设计（The Big Picture）

我们的框架将由五个核心组件构成，它们协同工作，完成数据的抓取、解析和存储。

![Crawler Framework Architecture](https://i.imgur.com/u3A4s4g.png)
*（迷你爬虫框架数据流图）*

1.  **引擎 (Engine):** 控制中心，负责驱动所有组件，控制数据流。
2.  **调度器 (Scheduler):** 一个队列，负责管理所有待抓取的请求(Request)。
3.  **下载器 (Downloader):** 根据引擎的指令，执行网络请求，返回响应(Response)。**我们将在这里集成代理和重试逻辑。**
4.  **爬虫 (Spider):** 用户编写的业务逻辑，定义如何从特定网站提取数据(Item)和发现新的URL。
5.  **管道 (Pipeline):** 负责处理爬虫提取出的数据，例如存入数据库或写入文件。

## 二、代码实现：一步步构建

### 步骤 1: 定义数据容器 (Request & Item)

我们使用`dataclass`来创建清晰的数据结构。

```python
# objects.py
from dataclasses import dataclass, field
from typing import Callable

@dataclass
class Request:
    url: str
    callback: Callable  # 解析函数
    retry_times: int = 3 # 默认重试次数

@dataclass
class Item:
    data: dict = field(default_factory=dict)
```

### 步骤 2: 调度器 (Scheduler)

一个简单的先进先出(FIFO)队列即可。

```python
# scheduler.py
from collections import deque

class Scheduler:
    def __init__(self):
        self.queue = deque()

    def add_request(self, request):
        self.queue.append(request)

    def get_request(self):
        return self.queue.popleft()

    def is_empty(self):
        return len(self.queue) == 0
```

### 步骤 3: 下载器 (Downloader) - 集成代理与重试

这是框架的“脏活累活”担当。

```python
# downloader.py
import requests

PROXY_POOL_URL = 'http://127.0.0.1:5555/get'

def get_proxy():
    try:
        response = requests.get(PROXY_POOL_URL)
        if response.status_code == 200:
            return response.json().get('proxy')
    except requests.ConnectionError:
        return None

class Downloader:
    def fetch(self, request):
        print(f"Downloading: {request.url}")
        proxy = get_proxy()
        proxies = {
            'http': f'http://{proxy}',
            'https': f'https://{proxy}',
        } if proxy else None

        try:
            response = requests.get(request.url, proxies=proxies, timeout=15)
            if response.status_code == 200:
                return response.text
            return None # 其他状态码也视为失败
        except (requests.RequestException, requests.exceptions.ReadTimeout) as e:
            print(f"Download error: {e}")
            return None
```

### 步骤 4: 爬虫基类 (BaseSpider) 和 管道 (Pipeline)

```python
# spider.py
class BaseSpider:
    def start_requests(self):
        raise NotImplementedError

# pipeline.py
import json

class JsonPipeline:
    def open_spider(self):
        self.file = open('items.jsonl', 'w', encoding='utf-8')

    def process_item(self, item):
        line = json.dumps(item.data, ensure_ascii=False) + "\n"
        self.file.write(line)
        return item

    def close_spider(self):
        self.file.close()
```

### 步骤 5: 引擎 (Engine) - 串联一切

引擎是整个框架的核心，它的逻辑清晰地展现了我们的设计。

```python
# engine.py
from .scheduler import Scheduler
from .downloader import Downloader
from .objects import Request

class Engine:
    def __init__(self, spider, pipeline):
        self.scheduler = Scheduler()
        self.downloader = Downloader()
        self.spider = spider
        self.pipeline = pipeline

    def run(self):
        self.pipeline.open_spider()
        
        # 启动请求
        for req in self.spider.start_requests():
            self.scheduler.add_request(req)

        while not self.scheduler.is_empty():
            request = self.scheduler.get_request()
            html_content = self.downloader.fetch(request)

            if html_content:
                # 下载成功，交给spider解析
                for result in request.callback(html_content):
                    if isinstance(result, Request):
                        self.scheduler.add_request(result)
                    else: # 是Item
                        self.pipeline.process_item(result)
            elif request.retry_times > 0:
                # 下载失败，执行重试
                request.retry_times -= 1
                print(f"Retrying {request.url}, {request.retry_times} attempts left")
                self.scheduler.add_request(request)
            else:
                print(f"Failed to fetch {request.url} after multiple retries.")

        self.pipeline.close_spider()
```

## 三、实战演练

现在，我们用刚刚搭好的框架来爬取`quotes.toscrape.com`。

```python
# run_spider.py
from engine import Engine
from spider import BaseSpider
from pipeline import JsonPipeline
from objects import Request, Item
from bs4 import BeautifulSoup

class QuotesSpider(BaseSpider):
    def start_requests(self):
        yield Request(url='http://quotes.toscrape.com', callback=self.parse)

    def parse(self, html_content):
        soup = BeautifulSoup(html_content, 'html.parser')
        for quote in soup.find_all('div', class_='quote'):
            item = Item()
            item.data['text'] = quote.find('span', class_='text').get_text()
            item.data['author'] = quote.find('small', class_='author').get_text()
            yield item

        # 寻找下一页
        next_page = soup.find('li', class_='next')
        if next_page:
            next_url = 'http://quotes.toscrape.com' + next_page.find('a')['href']
            yield Request(url=next_url, callback=self.parse)

if __name__ == '__main__':
    spider = QuotesSpider()
    pipeline = JsonPipeline()
    engine = Engine(spider, pipeline)
    engine.run()
```

## 四、总结与展望

恭喜你！你已经成功构建了一个功能虽简但五脏俱全的爬虫框架。通过这个过程，你应该对Scrapy等成熟框架的设计思想有了更深刻的理解。

**未来可扩展的方向：**

*   **并发支持:** 使用`asyncio`或多线程/多进程改造下载器，实现并发请求，大幅提升效率。
*   **中间件 (Middleware):** 在引擎和各组件之间加入中间件层，用于统一处理请求头、Cookie、用户代理等。
*   **更智能的调度:** 实现基于请求优先级的调度器。

造轮子的目的不是重复，而是创造性的理解。希望这个迷你框架能成为你通往高级爬虫工程师之路的一块坚实基石。

```