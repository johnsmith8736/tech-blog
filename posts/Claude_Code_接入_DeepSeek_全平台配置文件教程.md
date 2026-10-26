---
title: "Claude Code 接入 DeepSeek 全平台配置文件教程（Linux / macOS / Windows）"
date: "2026-10-26"
excerpt: "用配置文件把 Claude Code 接到 DeepSeek：写入 ~/.claude/settings.json 的 env，并在 ~/.claude.json 顶层加入 hasCompletedOnboarding 跳过登录引导，附 Linux、macOS、Windows 三端写法。"
category: "AI"
tags: [Claude Code, DeepSeek, 配置文件, Linux, macOS, Windows]
status: online
---

# Claude Code 接入 DeepSeek 全平台配置文件教程（Linux / macOS / Windows）

## 一、准备工作

- 在 [DeepSeek 开放平台](https://platform.deepseek.com/api_keys) 创建 API Key，形如 `sk-xxxxxxxx`。
- 安装 Node.js 18+ 和 Claude Code：

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

Windows 还需要安装 [Git for Windows](https://git-scm.com/download/win)。

## 二、需要写入的两个文件

Claude Code 会从 `~/.claude/settings.json` 的 `env` 字段读取环境变量，把 DeepSeek 的地址、密钥和模型写在这里即可持久生效。同时在 `~/.claude.json` 顶层加入 `"hasCompletedOnboarding": true`，跳过首次启动的登录引导。

> `hasCompletedOnboarding` 只跳过引导界面，真正完成鉴权的是 `settings.json` 里的 `ANTHROPIC_AUTH_TOKEN`，两处都要配置。

各平台路径：

- Linux：`/home/<用户名>/.claude/settings.json`、`/home/<用户名>/.claude.json`
- macOS：`/Users/<用户名>/.claude/settings.json`、`/Users/<用户名>/.claude.json`
- Windows：`C:\Users\<用户名>\.claude\settings.json`、`C:\Users\<用户名>\.claude.json`
- WSL：使用 WSL 内部的 Linux 家目录，不要写 `/mnt/c/Users/...`

## 三、Linux / macOS

### 3.1 写入 settings.json

先创建配置目录：

```bash
mkdir -p ~/.claude
```

如果 `~/.claude/settings.json` 不存在，直接写入：

```bash
cat > ~/.claude/settings.json <<'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "sk-YOUR_DEEPSEEK_API_KEY",
    "ANTHROPIC_MODEL": "deepseek-flash[1m]",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-flash[1m]",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-flash[1m]",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-flash",
    "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-flash",
    "CLAUDE_CODE_EFFORT_LEVEL": "max",
    "CLAUDE_CODE_AUTO_COMPACT_WINDOW": "786432"
  }
}
EOF

chmod 600 ~/.claude/settings.json
```

如果文件已经存在，不要覆盖，用编辑器把上面的 `ANTHROPIC_*` 和 `CLAUDE_CODE_*` 键合并进已有的 `env` 对象；没有 `env` 就新增一个。`env` 里的值必须全部是字符串。

### 3.2 写入 .claude.json

如果 `~/.claude.json` 不存在，直接写入：

```bash
cat > ~/.claude.json <<'EOF'
{
  "hasCompletedOnboarding": true
}
EOF

chmod 600 ~/.claude.json
```

如果文件已经存在，不要覆盖，用编辑器打开，在最外层花括号内加一行：

```text
"hasCompletedOnboarding": true
```

注意 JSON 逗号：这一行后面还有其他字段时，行尾要加逗号；它是最后一个字段时不要加。

### 3.3 启动验证

```bash
cd ~/your-project
claude
```

进入后可以用 `/status` 查看当前模型和 API 地址，或者直接测试：

```bash
claude -p "只回复：DeepSeek 配置成功"
```

## 四、Windows（PowerShell）

### 4.1 写入 settings.json

如果 `C:\Users\<用户名>\.claude\settings.json` 不存在，执行：

```powershell
New-Item -ItemType Directory -Force "$HOME\.claude" | Out-Null

$json = @'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "sk-YOUR_DEEPSEEK_API_KEY",
    "ANTHROPIC_MODEL": "deepseek-flash[1m]",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "deepseek-flash[1m]",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "deepseek-flash[1m]",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "deepseek-flash",
    "CLAUDE_CODE_SUBAGENT_MODEL": "deepseek-flash",
    "CLAUDE_CODE_EFFORT_LEVEL": "max",
    "CLAUDE_CODE_AUTO_COMPACT_WINDOW": "786432"
  }
}
'@

[System.IO.File]::WriteAllText("$HOME\.claude\settings.json", $json, (New-Object System.Text.UTF8Encoding($false)))
```

如果文件已经存在，不要覆盖，把对应的键合并进已有的 `env` 对象。

### 4.2 写入 .claude.json

如果 `C:\Users\<用户名>\.claude.json` 不存在，执行：

```powershell
$json = @'
{
  "hasCompletedOnboarding": true
}
'@

[System.IO.File]::WriteAllText("$HOME\.claude.json", $json, (New-Object System.Text.UTF8Encoding($false)))
```

如果文件已经存在，不要覆盖，用编辑器在最外层加入 `"hasCompletedOnboarding": true`，并注意逗号。

### 4.3 启动验证

```powershell
cd C:\path\to\your-project
claude
```

测试：

```powershell
claude -p "只回复：DeepSeek 配置成功"
```

如果在 WSL 里运行 Claude Code，请回到第三节，用 Linux 路径写入 WSL 家目录。Windows 版和 WSL 版读取的是各自的配置文件。

## 五、配置项说明

- `ANTHROPIC_BASE_URL`：`https://api.deepseek.com/anthropic`，必须保留 `/anthropic`。
- `ANTHROPIC_AUTH_TOKEN`：DeepSeek API Key 原文，不要加 `Bearer ` 前缀。
- `ANTHROPIC_MODEL`：默认模型 `deepseek-flash[1m]`。
- `ANTHROPIC_DEFAULT_OPUS_MODEL`、`ANTHROPIC_DEFAULT_SONNET_MODEL`：`/model opus` 和 `/model sonnet` 时使用 `deepseek-flash[1m]`。
- `ANTHROPIC_DEFAULT_HAIKU_MODEL`：`/model haiku` 时使用 `deepseek-flash`。
- `CLAUDE_CODE_SUBAGENT_MODEL`：子代理模型 `deepseek-flash`。
- `CLAUDE_CODE_EFFORT_LEVEL`：`max`。
- `CLAUDE_CODE_AUTO_COMPACT_WINDOW`：`786432`，在 JSON 中要写成字符串。

参考：[DeepSeek 官方 Claude Code 接入文档](https://api-docs.deepseek.com/zh-cn/quick_start/agent_integrations/claude_code/)
