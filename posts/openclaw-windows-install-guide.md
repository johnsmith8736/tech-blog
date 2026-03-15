---
title: "OpenClaw 安装指南（Windows）"
date: "2026-03-15"
excerpt: "基于 OpenClaw Getting Started，记录在 Windows PowerShell 下安装与首次运行的最短路径，并补充执行策略设置。"
tags: ["OpenClaw", "CLI", "Windows", "PowerShell", "Installation"]
category: "Tools"
section: "openclaw"
subsection: "install"
---

# OpenClaw 安装指南（Windows）

本文基于官方 Getting Started 的 Windows PowerShell 步骤，补充首次安装时需要的 PowerShell 执行策略设置，帮助你在 Windows 上完成 OpenClaw 的安装、初始化与验证。

---

# 前置条件

官方建议使用 Node 24，兼容 Node 22 LTS（22.16+）。如果不确定版本，先检查本机 Node：

```powershell
node --version
```

---

# Step 1：设置 PowerShell 执行策略（首次安装必做）

如果你是第一次安装 OpenClaw，请先执行以下两条命令。它们会为当前用户启用脚本执行，并在当前 PowerShell 进程内临时放行脚本运行，避免安装脚本自动闪退。

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

---

# Step 2：安装 OpenClaw（Windows PowerShell）

官方推荐通过 PowerShell 安装脚本完成安装：

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

---

# Step 3：运行初始化向导

安装完成后，运行 onboarding 向导，配置鉴权、Gateway 设置与可选渠道：

```powershell
openclaw onboard --install-daemon
```

---

# Step 4：检查 Gateway 状态

如果安装了服务，Gateway 应该已经启动：

```powershell
openclaw gateway status
```

---

# Step 5：打开 Control UI

启动控制面板，如果界面可访问，说明 Gateway 已准备就绪：

```powershell
openclaw dashboard
```

---

# 可选：前台运行 Gateway（排障用）

需要快速验证或排障时，可以将 Gateway 前台运行：

```powershell
openclaw gateway --port 18789
```

---

# 安装完成后你将获得

- 一个正在运行的 Gateway
- 已完成鉴权配置
- 可访问的 Control UI 或已连接渠道

---

# 参考来源

- OpenClaw Getting Started（Windows PowerShell）
