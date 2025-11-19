---
title: "Scrapy 实战教程：10分钟构建你的第一个新闻数据爬虫"
date: "2025-07-18"
description: "本教程专为初学者设计，将带你使用强大的Scrapy框架，在10分钟内从零开始构建一个功能完整的新闻爬虫，并抓取真实数据，让你快速体验到Python爬虫的魅力和效率。"
---

## 前言：Scrapy为何如此高效？

Scrapy是一个为了爬取网站并提取结构化数据而设计的应用程序框架。把它想象成一套用于建造爬虫的“乐高”积木：它为你提供了所有必需的模块（网络请求、数据解析、存储等），你只需像拼图一样将它们组合起来，就能快速构建出强大、高效的爬虫，而无需关心底层复杂的实现细节。

准备好了吗？让我们开始计时！

## 第1步：安装 Scrapy (耗时: 1分钟)

打开你的终端，运行以下命令：

```bash
pip install scrapy
```

## 第2步：创建你的爬虫项目 (耗时: 1分钟)

Scrapy提供了一个便捷的命令来生成整个项目框架。

```bash
scrapy startproject my_news_crawler
cd my_news_crawler
```

执行后，你会看到一个如下结构的文件夹，Scrapy已经为你搭好了所有架子：

```
my_news_crawler/
    scrapy.cfg
    my_news_crawler/
        __init__.py
        items.py         # 定义数据结构的地方
        middlewares.py
        pipelines.py     # 处理数据的地方
        settings.py      # 配置文件
        spiders/         # 存放爬虫代码的地方
            __init__.py
```

## 第3步：定义你的“数据容器” (Item) (耗时: 2分钟)

我们需要告诉Scrapy，我们想抓取哪些数据。打开 `my_news_crawler/items.py` 文件，修改它：

```python
# items.py
import scrapy

class NewsItem(scrapy.Item):
    # define the fields for your item here like:
    title = scrapy.Field()  # 新闻标题
    url = scrapy.Field()    # 新闻链接
    source = scrapy.Field() # 新闻来源
```

这就像定义了一个数据模板，稍后我们会用抓取到的数据来填充它。

## 第44步：编写你的第一个爬虫 (Spider) (耗时: 4分钟)

这是最核心的一步。让我们创建一个爬虫来抓取 Hacker News (`news.ycombinator.com`) 上的新闻标题和链接。

在终端中，使用Scrapy的命令来生成一个爬虫模板：

```bash
scrapy genspider hackernews news.ycombinator.com
```

现在，打开 `my_news_crawler/spiders/hackernews.py` 文件，你会看到一个基本的模板。让我们来修改它，实现真正的抓取逻辑：

```python
# spiders/hackernews.py
import scrapy
from my_news_crawler.items import NewsItem

class HackernewsSpider(scrapy.Spider):
    name = "hackernews"
    allowed_domains = ["news.ycombinator.com"]
    start_urls = ["https://news.ycombinator.com/"]

    def parse(self, response):
        # 使用CSS选择器定位到所有新闻条目
        news_list = response.css('tr.athing')

        for news in news_list:
            item = NewsItem()
            # 提取标题和链接
            title_element = news.css('.titleline > a')
            item['title'] = title_element.css('::text').get()
            item['url'] = title_element.css('::attr(href)').get()
            item['source'] = 'Hacker News'
            
            # 将填充好的数据交给Scrapy引擎处理
            yield item

        # 寻找下一页链接并继续爬取
        next_page = response.css('.morelink::attr(href)').get()
        if next_page is not None:
            # response.follow会自动处理相对URL
            yield response.follow(next_page, callback=self.parse)
```

**代码解释:**

*   `parse` 方法是Scrapy默认的回调函数，当`start_urls`中的请求完成后，返回的响应会作为参数传给它。
*   我们使用`response.css()`配合CSS选择器来精准地定位数据。
*   `yield item` 是关键，它将抓取到的单条数据返回给Scrapy引擎，引擎会决定是存入文件还是交给Pipeline处理。
*   `yield response.follow(...)` 则实现了自动翻页的功能。

## 第5步：运行爬虫并收获数据 (耗时: 2分钟)

一切准备就绪！回到你的终端，运行你的爬虫：

```bash
scrapy crawl hackernews -o hackernews_data.json
```

*   `scrapy crawl hackernews` 是运行名为 `hackernews` 的爬虫。
*   `-o hackernews_data.json` 是一个神奇的参数，它告诉Scrapy将所有抓取到的数据自动保存为JSON格式的文件。

命令执行完毕后，检查你的项目文件夹，你会发现多了一个 `hackernews_data.json` 文件，里面已经整齐地存放着你刚刚抓取的所有新闻数据！

## 总结：10分钟，你做到了！

恭喜！在短短10分钟内，你已经从零开始，利用Scrapy构建并运行了一个功能完整的新闻爬虫。你体验了Scrapy的自动化项目构建、强大的选择器、以及便捷的数据输出功能。

这仅仅是一个开始。Scrapy的强大之处还在于它的数据管道(Pipelines)可以让你进行复杂的数据清洗和存储，而中间件(Middlewares)则能让你更精细地控制请求和响应。继续探索吧，数据的世界正向你敞开大门！
