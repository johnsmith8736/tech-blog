---
title: "OpenClaw 安装指南（Linux / macOS）"
date: "2026-03-15"
excerpt: "基于 OpenClaw Getting Started，记录在 Linux/macOS 上安装与首次运行的最短路径。"
tags: ["OpenClaw", "CLI", "Linux", "macOS", "Installation"]
category: "Tools"
section: "openclaw"
subsection: "install"
---


# OpenClaw 安装指南（Linux / macOS）

本文基于官方 Getting Started，总结 Linux 与 macOS 上安装 OpenClaw 的最短路径，并记录常用的验证与可选项。

---

# 前置条件

官方要求 Node 22 或更高版本，建议先确认本机版本。

```bash
node --version
```

---

# 安装 OpenClaw（Linux / macOS）

官方推荐使用安装脚本。

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

---

# 运行初始化向导

安装完成后运行 onboarding 向导，它会配置鉴权、Gateway 设置与可选渠道。

```bash
openclaw onboard --install-daemon
```

---

# 验证 Gateway 与控制台

检查服务状态。

```bash
openclaw gateway status
```

打开 Control UI。

```bash
openclaw dashboard
```

如果需要手动访问，默认在网关主机的 `http://127.0.0.1:18789/`。

---

# 可选：前台运行与测试消息

前台运行 Gateway，便于快速测试或排查。

```bash
openclaw gateway --port 18789
```

发送一条测试消息（需要已配置渠道）。

```bash
openclaw message send --target +15555550123 --message "Hello from OpenClaw"
```

---

# 常用环境变量

当你以服务账户运行或需要自定义配置/状态目录时，可以使用以下变量。

* `OPENCLAW_HOME`：设置内部路径解析使用的 Home 目录。
* `OPENCLAW_STATE_DIR`：覆盖状态目录。
* `OPENCLAW_CONFIG_PATH`：覆盖配置文件路径。
