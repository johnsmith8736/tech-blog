---
title: "轻松扩展 Gemini CLI：MCP 服务配置实战指南"
date: "2025-07-17"
---

# 轻松扩展 Gemini CLI：MCP 服务配置实战指南

## 前言：为你的 Gemini CLI 插上翅膀

[Google 的 Gemini CLI](https://gemini.google.com/cli) 是一个强大的命令行工具，它将 Gemini 模型的强大能力直接带入了我们的终端。自 2025 年 6 月发布以来，凭借其对 Gemini 2.5 Pro 的支持和高达 100 万 token 的上下文窗口，它已成为处理大型代码库、执行自动化任务和进行多模态内容生成的利器。

然而，Gemini CLI 的真正潜力在于其可扩展性。通过 **MCP (Model Context Protocol)**，我们可以为其接入各种外部工具和服务，极大地增强其功能。MCP 协议定义了一套标准接口，允许 AI 与本地或远程工具（如代码编辑器、搜索引擎、项目管理工具等）无缝协作。

本教程将手把手带你配置三个非常实用的 MCP 服务：`context7`、`taskmaster-ai` 和 `sequential-thinking`，让你的 Gemini CLI 变得更加智能和高效。

- **Context7**: 让 AI 能即时查询和理解各种开发库的官方文档。
- **Taskmaster-AI**: 将 AI 变为一个强大的项目管理助手。
- **Sequential-Thinking**: 赋予 AI 结构化的思考能力，以解决复杂问题。

## 准备工作

在开始之前，请确保你已经成功安装了 Gemini CLI。

## 配置步骤

配置过程的核心是修改 Gemini CLI 的设置文件。

### 1. 定位并编辑 `settings.json`

首先，我们需要找到 Gemini CLI 的配置文件。它通常位于你的用户主目录下的 `.gemini` 文件夹中。

打开终端，执行以下命令来编辑该文件（你可以使用任何你喜欢的文本编辑器，如 `vim`, `nano` 或 `VS Code`）：

```bash
# 推荐使用 VS Code 或其他图形化编辑器
code ~/.gemini/settings.json

# 或者使用终端编辑器
vim ~/.gemini/settings.json
```

### 2. 添加 MCP 服务配置

在 `settings.json` 文件中，找到 `mcpServers` 字段（如果不存在，可以手动创建一个），然后将下面的 JSON 代码块粘贴进去。

**注意**: 请将 `taskmaster-ai` 配置中的 `你的api key` 替换为你自己的 Google API 密钥。

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp"
      ]
    },
    "taskmaster-ai": {
      "command": "npx",
      "args": [
        "-y",
        "--package=task-master-ai",
        "task-master-ai"
      ],
      "env": {
        "GOOGLE_API_KEY": "你的api key"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ]
    }
  }
}
```

修改完毕后，保存并关闭文件。

## 验证配置

现在，让我们来验证服务是否配置成功。

1.  在终端中启动 Gemini CLI：

    ```bash
    gemini
    ```

2.  进入 Gemini CLI 环境后，输入 `/mcp` 命令并按回车：

    ```
    /mcp
    ```

如果一切顺利，你将看到以下输出，表明所有服务都已准备就绪：

```
ℹ Configured MCP servers:
 
  🟢 context7 - Ready (2 tools)
    - resolve-library-id
    - get-library-docs

  🟢 taskmaster-ai - Ready (34 tools)
    - initialize_project
    - models
    - rules
    - ... (and 31 more)

  🟢 sequential-thinking - Ready (1 tools)
    - sequentialthinking
```

看到这个界面，恭喜你！你的 Gemini CLI 现在已经具备了文档查询、项目管理和结构化思考的超能力。

## 结语

通过简单的几步配置，我们成功地利用 MCP 协议扩展了 Gemini CLI 的功能。这只是一个开始，MCP 生态系统正在不断发展，未来将有更多强大的工具可以集成。

现在就去试试新功能吧！你可以试着问它：
- `> /t resolve-library-id: "react"` (使用 context7 查询库)
- `> /t add_task: prompt="写一篇关于如何配置MCP的博客"` (使用 taskmaster-ai 创建任务)

希望这篇指南对你有帮助，欢迎探索并分享你发现的更多有趣用法！