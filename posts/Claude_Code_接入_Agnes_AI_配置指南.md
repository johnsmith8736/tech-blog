# Claude Code 接入 Agnes AI 配置指南（Arch Linux + LiteLLM）

## 背景

Claude Code 原生只支持 Anthropic Messages API 协议（`/v1/messages`），而 Agnes AI 提供的是 OpenAI Chat Completions 协议（`/v1/chat/completions`）。两者请求格式不兼容，无法直接在 `~/.claude/settings.json` 里改个 `ANTHROPIC_BASE_URL` 就接通。

解决方案：用 **LiteLLM** 作为本地代理层，负责协议翻译——接收 Claude Code 发来的 Anthropic 格式请求，转换成 OpenAI 格式转发给 Agnes，再把响应转换回来。

架构示意：

```
Claude Code  →  本地 LiteLLM 代理 (localhost:4000)  →  Agnes AI (apihub.agnes-ai.com)
  (Anthropic协议)      (协议转换)                        (OpenAI协议)
```

---

## 一、安装 LiteLLM

Arch Linux 默认 Python 版本较新（3.14），部分依赖（如 `orjson`/`pyo3-ffi`）尚不支持，直接用 pipx 安装可能编译失败。推荐用 **uv** 指定较低 Python 版本安装：

```bash
yay -S uv
uv python install 3.12
uv tool install 'litellm[proxy]' --python 3.12
```

安装完成后确认命令可用：

```bash
which litellm
litellm --version
```

（如果找不到命令，运行 `uv tool update-shell` 后重开终端）

---

## 二、编写 LiteLLM 配置文件

创建 `~/litellm_config.yaml`：

```yaml
model_list:
  - model_name: claude-3-5-sonnet-20241022
    litellm_params:
      model: openai/agnes-2.0-flash
      api_base: https://apihub.agnes-ai.com/v1
      api_key: os.environ/AGNES_API_KEY
      allowed_openai_params: ["thinking", "context_management"]

  - model_name: claude-3-5-haiku-20241022
    litellm_params:
      model: openai/agnes-2.0-flash
      api_base: https://apihub.agnes-ai.com/v1
      api_key: os.environ/AGNES_API_KEY
      allowed_openai_params: ["thinking", "context_management"]

  - model_name: claude-opus-4-8
    litellm_params:
      model: openai/agnes-2.0-flash
      api_base: https://apihub.agnes-ai.com/v1
      api_key: os.environ/AGNES_API_KEY
      allowed_openai_params: ["thinking", "context_management"]

litellm_settings:
  drop_params: true    # 自动丢弃 Agnes 不认识的参数，避免兼容性报错

general_settings:
  master_key: sk-my-local-proxy-key   # 自定义密钥，供 Claude Code 与本地代理鉴权
```

> 说明：Claude Code 内部分 Opus / Sonnet / Haiku 三档模型调用，这里全部映射到同一个 Agnes 模型 `agnes-2.0-flash`。

---

## 三、手动测试（先跑通再做成服务）

```bash
export AGNES_API_KEY="你的Agnes密钥"
litellm --config ~/litellm_config.yaml --port 4000
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
      "content": "你好！我是 Agnes-2.0-Flash..."
    }
  }]
}
```

测试通过后，回到第一个终端按 `Ctrl+C` 停止手动运行的进程，准备做成后台服务。

---

## 四、配置为 systemd 用户级服务（开机自启常驻）

### 1. 创建 service 文件

```bash
mkdir -p ~/.config/systemd/user
nano ~/.config/systemd/user/litellm.service
```

内容（注意把路径替换为你自己 `which litellm` 的实际结果）：

```ini
[Unit]
Description=LiteLLM Proxy for Agnes AI
After=network-online.target
Wants=network-online.target

[Service]
Environment=AGNES_API_KEY=你的Agnes密钥
ExecStart=/home/arch/.local/bin/litellm --config /home/arch/litellm_config.yaml --port 4000
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

## 五、配置 Claude Code 指向本地代理

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

## 六、验证

```bash
claude
/status
```

确认 `Anthropic base URL` 显示为 `http://localhost:4000`，然后正常对话测试即可。

---

## 注意事项

- **密钥安全**：Agnes API Key 属于敏感信息，不要在聊天记录、公开仓库或截图中明文暴露。如曾意外泄露，建议立即在 Agnes 后台作废旧密钥并重新生成。
- **成本告警提示（可忽略）**：启动时出现的 `WARNING: register_model ... not in built-in cost map` 只是 LiteLLM 没有该自定义模型的官方计费数据，不影响实际调用功能。
- **工具调用（tool use）稳定性**：第三方 OpenAI 兼容网关在处理 Claude Code 的工具调用（文件读写、命令执行等）时偶尔可能不稳定，如遇到异常行为，可先检查 LiteLLM 日志排查是格式问题还是网络问题。
