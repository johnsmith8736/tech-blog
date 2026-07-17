---
title: "Claude Code 接入 NVIDIA NIM 配置指南（Arch Linux + LiteLLM）"
date: "2026-07-17"
excerpt: "本指南详细介绍如何在 Arch Linux 上配置 LiteLLM 代理，将 Claude Code 与 NVIDIA NIM 的模型集成，实现免费调用各种开源大模型。"
category: "AI"
tags: [Claude Code, NVIDIA NIM, LiteLLM, AI, Arch Linux]
status: online
---

# Claude Code 接入 NVIDIA NIM（build.nvidia.com）配置指南（Arch Linux + LiteLLM）

## 目录结构约定

本指南统一使用 `~/litellm/` 作为 LiteLLM 相关文件的存放目录：

```
~/litellm/
├── litellm_config.yaml   # 模型路由配置
└── litellm.env            # API 密钥（权限 600）
```

## 架构说明

```
Claude Code  →  本地 LiteLLM 代理 (localhost:4000)  →  NVIDIA NIM (integrate.api.nvidia.com)
  (Anthropic协议)      (协议转换)                         (OpenAI协议)
```

Claude Code 原生只支持 Anthropic Messages API 协议（`/v1/messages`），而 NVIDIA NIM 提供的是 OpenAI Chat Completions 兼容协议（`/v1/chat/completions`），两者格式不兼容，需要 LiteLLM 做本地协议转换，不能直接改 `ANTHROPIC_BASE_URL` 就接通。

NVIDIA NIM 上托管了大量开源/第三方模型（DeepSeek、Llama、Qwen、GLM 等），很多带有 **Free Endpoint**（免费额度），适合先测试效果。

---

## 一、在 Arch Linux 上安装 LiteLLM

Arch 默认 Python 版本较新（如 3.14），部分依赖（`orjson`/`pyo3-ffi`）尚未跟上，直接用 pipx 安装容易编译失败。推荐用 **uv** 指定较低 Python 版本安装：

```bash
yay -S uv
uv python install 3.12
uv tool install 'litellm[proxy]' --python 3.12
```

确认安装成功：

```bash
which litellm
litellm --version
```

如果 `which litellm` 找不到命令，运行 `uv tool update-shell` 后重开终端。

---

## 二、获取 NVIDIA API Key

1. 访问想用的模型页面，例如：
   - https://build.nvidia.com/z-ai/glm-5.2
   - https://build.nvidia.com/deepseek-ai/deepseek-v4-flash
2. 点击页面上的 **"Get API Key" / "Generate API Key"**
3. 生成一个 `nvapi-` 开头的密钥

> 模型 ID 就是页面 URL 路径本身，例如 `z-ai/glm-5.2`、`deepseek-ai/deepseek-v4-flash`，官方 curl 示例里 `model` 字段用的就是这个字符串。

---

## 三、创建目录与配置文件

```bash
mkdir -p ~/litellm
nano ~/litellm/litellm_config.yaml
```

内容（以 GLM-5.2 为例）：

```yaml
model_list:
  - model_name: claude-3-5-sonnet-20241022
    litellm_params:
      model: openai/z-ai/glm-5.2
      api_base: https://integrate.api.nvidia.com/v1
      api_key: os.environ/NVIDIA_API_KEY
      drop_params: true

  - model_name: claude-3-5-haiku-20241022
    litellm_params:
      model: openai/z-ai/glm-5.2
      api_base: https://integrate.api.nvidia.com/v1
      api_key: os.environ/NVIDIA_API_KEY
      drop_params: true

  - model_name: claude-opus-4-8
    litellm_params:
      model: openai/z-ai/glm-5.2
      api_base: https://integrate.api.nvidia.com/v1
      api_key: os.environ/NVIDIA_API_KEY
      drop_params: true

litellm_settings:
  drop_params: true

general_settings:
  master_key: sk-my-local-proxy-key   # 自定义密钥，供 Claude Code 与本地代理鉴权
```

**要点说明：**
- `model:` 字段格式固定为 `openai/厂商名/模型名`，`openai/` 前缀是 LiteLLM 的路由标识，表示"这是走 OpenAI 协议的模型"，后面 `厂商名/模型名` 才是真正传给 NVIDIA 接口的模型字符串。
- 想换其他 NVIDIA 模型（比如 DeepSeek V4 Flash），把三处 `model:` 一致改成 `openai/deepseek-ai/deepseek-v4-flash` 即可，其他配置不用动。
- `drop_params: true` 用于自动丢弃 NVIDIA 不认识的多余参数，避免兼容性报错。

---

## 四、创建密钥文件

```bash
nano ~/litellm/litellm.env
```

内容（格式 `变量名=值`，不需要 `export`，不需要引号）：

```
NVIDIA_API_KEY=nvapi-你的密钥
LITELLM_USE_CHAT_COMPLETIONS_URL_FOR_ANTHROPIC_MESSAGES=true
```

锁定文件权限：

```bash
chmod 600 ~/litellm/litellm.env
```

如果该目录纳入了 git 版本控制，记得加入 `.gitignore`：

```bash
echo "litellm.env" >> ~/litellm/.gitignore
```

---

## 五、手动测试（先跑通再做成服务）

```bash
export NVIDIA_API_KEY="nvapi-你的密钥"
litellm --config ~/litellm/litellm_config.yaml --port 4000
```

看到 `Uvicorn running on http://0.0.0.0:4000` 说明启动成功。

新开一个终端窗口测试：

```bash
curl http://localhost:4000/v1/chat/completions \
  -H "Authorization: Bearer sk-my-local-proxy-key" \
  -H "Content-Type: application/json" \
  -d '{"model": "claude-3-5-sonnet-20241022", "messages": [{"role": "user", "content": "你好"}]}'
```

返回类似以下结构即代表连通成功：

```json
{
  "choices": [{
    "message": {
      "content": "你好！我是..."
    }
  }]
}
```

测试通过后，回到第一个终端按 `Ctrl+C` 停止手动运行的进程，准备做成后台服务。

---

## 六、配置为 systemd 用户级服务（开机自启常驻）

### 1. 创建 service 文件

```bash
mkdir -p ~/.config/systemd/user
nano ~/.config/systemd/user/litellm.service
```

内容（**注意 `ExecStart=` 和 `EnvironmentFile=` 必须用绝对路径，不能写 `~`**，请替换成实际用户名）：

```ini
[Unit]
Description=LiteLLM Proxy for NVIDIA NIM
After=network-online.target
Wants=network-online.target

[Service]
EnvironmentFile=/home/arch/litellm/litellm.env
ExecStart=/home/arch/.local/bin/litellm --config /home/arch/litellm/litellm_config.yaml --port 4000
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

### 2. 启用并启动

```bash
systemctl --user daemon-reload
systemctl --user enable --now litellm.service
```

### 3. 检查状态与日志

```bash
systemctl --user status litellm.service
journalctl --user -u litellm.service -f
```

### 4. 允许不登录也能自启（linger）

```bash
sudo loginctl enable-linger arch    # 替换成实际用户名
loginctl show-user arch | grep Linger    # 确认输出 Linger=yes
```

---

## 七、配置 Claude Code 指向本地代理

编辑 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:4000",
    "ANTHROPIC_AUTH_TOKEN": "sk-my-local-proxy-key",
    "ANTHROPIC_MODEL": "claude-3-5-sonnet-20241022",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-3-5-haiku-20241022",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4-8"
  }
}
```

---

## 八、验证

```bash
claude
/status
```

确认 `Anthropic base URL` 显示为 `http://localhost:4000`，然后正常对话测试。

---

## 九、切换 NVIDIA NIM 上的其他模型

只需修改 `~/litellm/litellm_config.yaml` 里的 `model:` 字段，例如换成 DeepSeek V4 Flash：

```yaml
      model: openai/deepseek-ai/deepseek-v4-flash
```

改完后重启服务：

```bash
# 手动模式
pkill -f litellm
litellm --config ~/litellm/litellm_config.yaml --port 4000

# systemd 模式
systemctl --user daemon-reload
systemctl --user restart litellm.service
```

> **常见坑**：切换模型后一定要确认旧进程已完全停止（`ps aux | grep litellm` 确认无残留），否则请求可能仍打到旧进程、旧模型上，容易误判为"没生效"。

---

## 十、常见问题排查

- **改了配置文件，测试结果还是旧模型**：多半是旧的 litellm 进程没杀干净，占用了端口。先 `pkill -f litellm` 确认无残留进程，再重新启动。
- **提示 Invalid model**：说明模型 ID 拼写不对，或该模型已不在 NVIDIA NIM 目录里，去 build.nvidia.com 对应模型页面核实准确的模型字符串。
- **`WARNING: register_model ... not in built-in cost map`**：可以忽略，只是 LiteLLM 没有该自定义模型的官方计费数据，不影响实际调用功能。
- **免费额度限速**：NVIDIA NIM 免费层通常有速率限制（如 40RPM 左右），高峰期可能排队较慢，属正常现象。

---

## 安全提醒

- NVIDIA API Key 属于敏感信息，不要在聊天记录、公开仓库或截图中明文暴露。
- 密钥文件务必 `chmod 600`，并加入 `.gitignore`（如果目录有 git 版本控制）。
- 如密钥曾意外泄露，应立即在 NVIDIA 后台作废旧密钥并重新生成。
