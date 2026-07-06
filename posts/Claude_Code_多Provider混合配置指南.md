# Claude Code 多 Provider 混合配置指南（LiteLLM）

## 架构说明

```
Claude Code  →  本地 LiteLLM 代理 (localhost:4000)  →  多家 Provider（Mistral / NVIDIA / Groq / OpenRouter / Agnes / DeepSeek...）
  (Anthropic协议)      (统一入口 + 协议转换)              (各自的 API 格式)
```

一份配置文件里注册好多个 provider，Claude Code 通过 `/model` 命令随时动态切换，不需要改配置文件、不需要重启。

---

## 一、完整配置文件 `~/litellm_config.yaml`

```yaml
model_list:
  # ---- Mistral ----
  - model_name: mistral-small
    litellm_params:
      model: mistral/mistral-small-latest
      api_key: os.environ/MISTRAL_API_KEY
      drop_params: true

  # ---- NVIDIA NIM: GLM-5.2 ----
  - model_name: nvidia-glm
    litellm_params:
      model: openai/z-ai/glm-5.2
      api_base: https://integrate.api.nvidia.com/v1
      api_key: os.environ/NVIDIA_API_KEY
      drop_params: true

  # ---- NVIDIA NIM: DeepSeek V4 Flash ----
  - model_name: nvidia-deepseek
    litellm_params:
      model: openai/deepseek-ai/deepseek-v4-flash
      api_base: https://integrate.api.nvidia.com/v1
      api_key: os.environ/NVIDIA_API_KEY
      drop_params: true

  # ---- Groq (免费额度大，速度快) ----
  - model_name: groq-llama
    litellm_params:
      model: groq/llama-3.3-70b-versatile
      api_key: os.environ/GROQ_API_KEY
      drop_params: true

  # ---- OpenRouter 免费模型 ----
  - model_name: openrouter-free
    litellm_params:
      model: openrouter/meta-llama/llama-3.3-70b-instruct:free
      api_key: os.environ/OPENROUTER_API_KEY
      drop_params: true

  # ---- Agnes AI ----
  - model_name: agnes-flash
    litellm_params:
      model: openai/agnes-2.0-flash
      api_base: https://apihub.agnes-ai.com/v1
      api_key: os.environ/AGNES_API_KEY
      allowed_openai_params: ["thinking", "context_management"]
      drop_params: true

  # ---- DeepSeek 官方（也可直接用其原生 Anthropic 接口，这里放进来是为了统一用 /model 切换）----
  - model_name: deepseek-official
    litellm_params:
      model: openai/deepseek-chat
      api_base: https://api.deepseek.com/v1
      api_key: os.environ/DEEPSEEK_API_KEY
      drop_params: true

litellm_settings:
  drop_params: true

general_settings:
  master_key: sk-my-local-proxy-key
```

> **注意**：没申请的 provider，把对应的 `model_list` 条目删掉或注释掉，避免启动时因缺少环境变量而报警告。

---

## 二、API Key 管理

### 方式一：手动测试（临时，仅当前终端有效）

```bash
export MISTRAL_API_KEY="你的Mistral密钥"
export NVIDIA_API_KEY="nvapi-你的密钥"
export GROQ_API_KEY="gsk_你的密钥"
export OPENROUTER_API_KEY="sk-or-v1-你的密钥"
export AGNES_API_KEY="你的Agnes密钥"
export DEEPSEEK_API_KEY="sk-你的DeepSeek密钥"
```

### 方式二：长期使用（推荐，配合 systemd）

**1. 创建独立的密钥文件**

```bash
mkdir -p ~/.config
nano ~/.config/litellm.env
```

内容（格式 `变量名=值`，不需要 `export`，不需要引号）：

```
MISTRAL_API_KEY=你的Mistral密钥
NVIDIA_API_KEY=nvapi-你的密钥
GROQ_API_KEY=gsk_你的密钥
OPENROUTER_API_KEY=sk-or-v1-你的密钥
AGNES_API_KEY=你的Agnes密钥
DEEPSEEK_API_KEY=sk-你的DeepSeek密钥
```

**2. 锁定文件权限**

```bash
chmod 600 ~/.config/litellm.env
```

**3. 如有 git 版本控制，加入 `.gitignore`**

```bash
echo "litellm.env" >> ~/.gitignore
```

---

## 三、systemd 用户级常驻服务（Arch Linux）

创建 `~/.config/systemd/user/litellm.service`：

```ini
[Unit]
Description=LiteLLM Proxy (Multi-Provider)
After=network-online.target
Wants=network-online.target

[Service]
EnvironmentFile=/home/arch/.config/litellm.env
ExecStart=/home/arch/.local/bin/litellm --config /home/arch/litellm_config.yaml --port 4000
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

> 路径请替换成 `which litellm` 的实际输出，以及你的实际用户名。

启用并启动：

```bash
systemctl --user daemon-reload
systemctl --user enable --now litellm.service
```

检查状态与日志：

```bash
systemctl --user status litellm.service
journalctl --user -u litellm.service -f
```

开机不登录也能自启：

```bash
sudo loginctl enable-linger arch    # 替换成实际用户名
```

---

## 四、配置 Claude Code

编辑 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:4000",
    "ANTHROPIC_AUTH_TOKEN": "sk-my-local-proxy-key",
    "ANTHROPIC_MODEL": "mistral-small"
  }
}
```

`ANTHROPIC_MODEL` 可以填 `model_list` 里任意一个 `model_name`，作为默认启动模型。

---

## 五、在 Claude Code 里动态切换模型

进入 `claude` 后，直接用 `/model` 命令切换，无需重启、无需改配置：

```
/model mistral-small
/model nvidia-glm
/model nvidia-deepseek
/model groq-llama
/model openrouter-free
/model agnes-flash
/model deepseek-official
```

---

## 六、单独测试某个模型

把 curl 请求里的 `model` 字段换成对应的 `model_name` 即可：

```bash
curl http://localhost:4000/v1/chat/completions \
  -H "Authorization: Bearer sk-my-local-proxy-key" \
  -H "Content-Type: application/json" \
  -d '{"model": "groq-llama", "messages": [{"role": "user", "content": "你好"}]}'
```

---

## 七、常见问题排查

- **改了配置文件，测试结果还是旧模型**：大概率是旧的 litellm 进程没杀干净，占用了端口。先 `pkill -f litellm` 确认没有残留进程（`ps aux | grep litellm`），再重新启动。
- **提示 Invalid model**：说明该 provider 的模型 ID 拼写不对或已下线，建议直接查询该 provider 的 `/v1/models` 接口获取账号下真实可用的模型列表。
- **工具调用（tool use）失败或参数为空**：部分第三方 OpenAI 兼容网关（如某些通过 OpenRouter 中转的模型）未完整实现流式工具调用，如果 Claude Code 的文件操作/命令执行异常，可切换到官方直连或其他 provider。

---

## 安全提醒

- API Key 属于敏感信息，切勿在聊天记录、公开仓库、截图中明文暴露。
- 密钥文件务必 `chmod 600`，且加入 `.gitignore`。
- 如密钥曾意外泄露，应立即在对应平台后台作废并重新生成。
