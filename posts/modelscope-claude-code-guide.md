# 免费使用魔搭（ModelScope）Anthropic 兼容 API 配置 Claude Code 指南
## 目录

1. 第一章：准备工作——获取魔搭 Access Token

2. 第二章：核心——Anthropic API 兼容接口的使用

3. 第三章：手把手教你配置 Claude Code，免费调用魔搭 API！



## 第一章：准备工作——获取魔搭 Access Token

要开始使用魔搭的 Anthropic 兼容 API 服务，你首先需要拥有一个魔搭账号，并获取你的专属访问令牌（Access Token）。这个令牌是你在魔搭平台上的身份凭证，用于验证你的 API 请求。

### 操作步骤

1. **注册与登录**：访问 [魔搭官网](https://modelscope.cn)，点击右上角的"注册"或"登录"按钮。你可以选择手机号注册、邮箱注册或通过阿里云账号登录。

2. **绑定阿里云账号（重要）**：魔搭的免费推理 API 由阿里云提供算力支持。为了确保你能正常使用，你的 ModelScope 账号必须绑定阿里云账号。如果尚未绑定，系统会引导你完成绑定流程。

3. **获取 Access Token**：登录成功后，点击页面右上角的头像，进入"个人中心"或直接访问 [我的 Access Token 页面](https://modelscope.cn/my/myaccesstoken)。在这里，你可以生成、查看和管理你的 Access Token。请妥善保管你的 Token，因为它相当于你的 API 密钥。

> **重要提示**：你的 Access Token 通常以 `ms-` 开头。在配置 Claude Code 时，请务必去掉 `ms-` 前缀，只保留实际的密钥部分！例如，如果你的 Token 是 `ms-abcdef123456`，那么在配置时只填写 `abcdef123456`。


## 第二章：核心——Anthropic API 兼容接口的使用

魔搭 API-Inference 现在也支持与 Anthropic API 兼容的调用方式，为 Anthropic 生态的用户提供了极大的便利。

> **重要提示**：魔搭官方声明，Anthropic API 兼容调用方式当前正处于 **Beta 测试阶段**。这意味着功能可能仍在完善中，如果你在使用过程中遇到任何问题，请务必联系魔搭官方提供反馈，共同推动其成熟。

### 2.1 安装 Anthropic SDK

在使用 Python 进行调用之前，你需要安装 Anthropic 的官方 SDK：

```bash
pip install anthropic
```

### 2.2 Anthropic 兼容接口调用范例详解

Anthropic API 的设计哲学与 OpenAI 略有不同，它更强调 `messages` 的结构和 `max_tokens` 的明确限制。魔搭的兼容接口完美复刻了这些特性。

#### 2.2.1 流式调用（Streaming）

流式调用能够实时获取模型生成的内容，提升用户体验。

```python
import anthropic

# 1. 初始化Anthropic客户端
client = anthropic.Anthropic(
    api_key="MODELSCOPE_ACCESS_TOKEN",  # 请替换成您的ModelScope Access Token
    base_url="https://api-inference.modelscope.cn"  # 指向魔搭API-Inference服务
)

# 2. 发送流式消息请求
with client.messages.stream(  # 使用stream方法进行流式调用
    model="Qwen/Qwen2.5-7B-Instruct",  # 魔搭上的模型ID，例如Qwen/Qwen2.5-7B-Instruct
    messages=[  # 消息列表，遵循Anthropic的role/content格式
        {"role": "user", "content": "write a python quicksort"}
    ],
    max_tokens=1024  # 明确指定最大生成token数，Anthropic API的强制要求
) as stream:
    for text in stream.text_stream:  # 遍历流中的文本块
        print(text, end="", flush=True)
```

#### 2.2.2 非流式调用（Non-Streaming）

非流式调用会等待模型生成完整响应后一次性返回。

```python
import anthropic

# 1. 初始化Anthropic客户端
client = anthropic.Anthropic(
    api_key="MODELSCOPE_ACCESS_TOKEN",  # 请替换成您的ModelScope Access Token
    base_url="https://api-inference.modelscope.cn"  # 指向魔搭API-Inference服务
)

# 2. 发送非流式消息请求
message = client.messages.create(  # 使用create方法进行非流式调用
    model="Qwen/Qwen2.5-7B-Instruct",  # 魔搭上的模型ID
    messages=[{"role": "user", "content": "write a python quicksort"}],
    max_tokens=1024  # 明确指定最大生成token数
)
print(message.content[0].text)  # 访问响应内容
```

### 关键适配点与详解

1. **base_url**：这是魔搭 API-Inference 的 Anthropic 兼容服务地址，固定为 `https://api-inference.modelscope.cn`。请注意，不带 `/v1/` 后缀。

2. **api_key**：替换为你从魔搭个人中心获取的 Access Token。

3. **model**：使用魔搭上开源模型的 Model ID，例如 `Qwen/Qwen2.5-7B-Instruct`。你可以在魔搭的模型详情页右侧找到对应的 Model ID。

4. **messages**：遵循 Anthropic 的 Messages API 格式。Anthropic API 通常只支持 `user` 和 `assistant` 两种角色，且消息序列必须以 `user` 角色开始，并交替出现。

5. **max_tokens**：这是 Anthropic API 的一个重要特性，它强制要求你明确指定模型生成响应的最大 token 数量。这有助于控制成本和响应长度。

> **更多 Anthropic API 用法**：魔搭的兼容接口旨在尽可能地模拟 Anthropic 官方 API 的行为。因此，如果你需要了解更多高级用法、参数设置或错误处理，强烈建议参考 [Anthropic API 官方文档](https://docs.anthropic.com/en/api)。


## 第三章：手把手教你配置 Claude Code，免费调用魔搭 API！

这正是本文的核心！对于依赖 Anthropic API 的 AI 编程助手，如 Claude Code，魔搭的 Anthropic 兼容接口意味着你可以免费、无缝地将其后端切换到魔搭平台。

Claude Code 通常会通过读取环境变量或配置文件来获取 Anthropic API 的配置信息。魔搭的兼容性正是利用了这一点。

### 配置步骤详解

#### 1. 获取魔搭 API Key

确保你已经从魔搭平台获取了你的 Access Token。

> **重要**：在配置 Claude Code 时，请注意**去掉 Access Token 开头的 `ms-` 前缀**！例如，如果你的 Token 是 `ms-abcdef123456`，那么在配置时只填写 `abcdef123456`。

#### 2. 找到 Claude Code 的配置文件 `settings.json`

这个文件通常位于你的用户目录下。

- **Windows 平台**：打开文件管理器，在地址栏输入：
  ```
  notepad C:\Users\你的用户名\.claude\settings.json
  ```
  （请将"你的用户名"替换为你的实际 Windows 用户名）

- **Linux/Mac 平台**：打开终端，输入命令：
  ```bash
  vim ~/.claude/settings.json
  ```
  （你也可以使用其他文本编辑器，如 `nano` 或 `code`）

> 如果文件不存在，系统可能会提示你创建。

#### 3. 修改 `settings.json` 文件内容

打开 `settings.json` 文件后，复制粘贴以下内容到文件中。如果文件已存在内容，请确保将其合并，特别是 `"env"` 部分。

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api-inference.modelscope.cn",
    "ANTHROPIC_AUTH_TOKEN": "7ad***************",
    "ANTHROPIC_MODEL": "Qwen/Qwen3-Coder-480B-A35B-Instruct",
    "ANTHROPIC_SMALL_FAST_MODEL": "Qwen/Qwen3-Coder-480B-A35B-Instruct"
  },
  "permissions": {
    "allow": [],
    "deny": []
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'About to write a file'"
          }
        ]
      }
    ]
  }
}
```


*本文档整理自用户提供的教程内容，用于在 tech-blog 项目中发布。*
