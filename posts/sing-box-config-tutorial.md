# sing-box 配置教程

本项目提供了一系列适用于 `sing-box` 的通用配置文件，涵盖了 AnyTLS、ChatGPT 代理和 Reality 协议等多种应用场景，旨在帮助初学者和高级用户快速上手。

---

## 1. 安装方法

**1. 官方安装 (推荐)**

从 `sing-box` 官方发布页面下载适用于您系统的预编译包，解压后即可使用。

**2. Linux 一键安装 (以 x86_64 为例)**

```bash
wget https://github.com/SagerNet/sing-box/releases/latest/download/sing-box-linux-amd64.tar.gz
tar -xzvf sing-box-linux-amd64.tar.gz
cd sing-box-*
sudo mv sing-box /usr/local/bin/
sing-box version
```

**3. 其他平台**

请参考官方文档。

---

## 2. 配置文件说明

**1. AnyTLS (TLS 相关配置)**

*   `client-config-anytls-1.12.0(Android).json`: 适用于 Android 客户端，包含 DNS、入站（tun/mixed）、出站（anytls、direct）、路由等详细设置。
*   `server-config-anytls-1.12.0.json`: 适用于服务器，监听 443 端口，支持 Reality，并包含详细的填充、TLS 和用户认证设置。

**2. ChatGPT (ChatGPT 代理配置)**

*   `1.12.0/chatgpt-client-1.12.0 (Android).json`: 专为 Android 客户端优化的 ChatGPT/OpenAI 代理配置，自动分流 OpenAI 流量，并支持 Reality 协议。
*   `1.12.0/chatgpt-server-1.12.0.json`: 支持 VLESS + Reality 的服务器配置，内置 WireGuard (warp) 出站，自动分流 OpenAI/Abema 流量。

*注意：不同版本的文件夹（如 1.10.0, 1.11.0）适用于不同 `sing-box` 版本，请选择与您的客户端/服务器版本匹配的配置。*

**3. Reality (Reality 协议配置)**

*   `1.12.0/client-config-vless-reality-1.12.0(Android).json`: 适用于使用 VLESS + Reality 协议的 Android 客户端，包含详细的路由规则和自动切换支持。
*   `1.12.0/server-config-vless-reality-1.12.0.json`: 服务器配置，监听 443 端口以支持 Reality 协议，并包含详细的用户和 TLS 设置。

---

## 3. 如何使用

1.  **选择合适的配置文件**：根据您的系统（Android/Linux）、用途（客户端/服务器）和协议（AnyTLS/Reality/ChatGPT）选择。
2.  **修改必要参数**：服务器地址、端口、UUID/密码、`public_key`/`short_id` 等必须与您的服务器实际信息匹配。DNS 和路由规则可按需自定义。
3.  **运行 sing-box**：
    ```bash
    sing-box run -c /path/to/your-config.json
    ```
4.  **客户端建议**：
    *   **Android**: 推荐使用 SagerNet 或 sing-box for Android。
    *   **Windows/Mac/Linux**: 直接使用官方二进制文件。

---

## 4. 常见问题与建议

*   **配置错误？**
    使用 `sing-box check -c your-config.json` 检查配置文件格式。
*   **Reality 连接失败？**
    检查 `public_key`、`short_id` 和 `server_name` 是否与服务器匹配，并确保端口已开放。
*   **路由不生效？**
    检查 `route/rule_set` 配置，并确保规则文件可以正常下载。
*   **更多问题？**
    请参考 `sing-box` 官方文档或提交 issue。

---

## 5. 贡献

欢迎通过 Pull Request 或 Issue 改进配置和教程。

> 本项目仅用于学习和交流，请勿用于非法活动。
