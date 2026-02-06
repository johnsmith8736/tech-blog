---
title: "手动搭建固定 Argo Tunnel + Xray + WebSocket + v2rayNG 配置教程（详细版）"
date: "2026-02-06"
excerpt: "基于 2025 年 12 月最佳实践，手动配置固定域名 Cloudflare Tunnel（Argo Tunnel）+ Xray VLESS-WebSocket，全流程搭建与排错。"
tags: ["ArgoTunnel", "Cloudflare", "Xray", "VLESS", "WebSocket", "v2rayNG"]
category: "Network"
---

# 手动搭建固定 Argo Tunnel + Xray + WebSocket + v2rayNG 配置教程（详细版）

本教程基于2025年12月当前的最佳实践，完全**手动配置**，不依赖任何一键脚本。实现**固定域名 Cloudflare Tunnel（Argo Tunnel）** + **Xray 核心的 VLESS-WebSocket** 协议。

### 方案优势
- **固定域名**：永久子域名（如 `argo.yourdomain.com`），重启不变化。
- **WebSocket 协议**：标准 WebSocket 协议，完美兼容 Cloudflare CDN 和 Tunnel。
- **Argo Tunnel**：隐藏真实 VPS IP，利用 Cloudflare 全球 CDN 加速，无需开放任何端口。
- **TLS 加密**：由 Cloudflare Edge 提供全程 TLS 加密，安全无忧。

整个过程约需 **30-60 分钟**，适合有基本 Linux 命令经验的用户。

## 前置要求

- **VPS**  
  推荐 Ubuntu 22.04 / 24.04 LTS，干净 IP（未被污染）。最低配置：1核1GB内存。  
  检查 IP：访问 https://www.ip.sb

- **Cloudflare 账号 + 域名**  
  免费账号即可。域名必须已添加到 Cloudflare，并完成 **NS 解析切换**（在域名注册商处将 NS 改为 Cloudflare 提供的两个）。

- **客户端**  
  Android 手机安装最新版 **v2rayNG**（GitHub 下载：https://github.com/2dust/v2rayNG/releases，版本 ≥ 1.8.x）。

- **工具**  
  SSH 客户端、文本编辑器（如 `nano`）。

## 步骤 1：Cloudflare Dashboard 创建固定 Tunnel 并获取 Token

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)。
2. 进入 **Zero Trust** → **Networks** → **Tunnels**（首次可能需创建免费团队）。
3. 点击 **Create a tunnel**。
4. 选择 **Cloudflared**，输入隧道名称（如 `fixed-argo-reality`），点击 **Save tunnel**。
5. 在安装页面：
   - 复制下方提供的 **Tunnel token**（长字符串，以 `eyJ...` 开头），**务必保存**。
   - 复制安装命令（稍后在 VPS 使用）。
6. 点击 **Next**，配置 **Public Hostname**：
   - **Subdomain**：输入子域名（如 `argo`）。
   - **Domain**：选择你的域名（最终域名：`argo.yourdomain.com`）。
   - **Type**：选择 **HTTP**。
   - **URL**：填写 `localhost:443`。
   - 高级设置：
     - 可选勾选 **No TLS Verify**（HTTP 模式下通常不需要）。
     - 可选勾选 **Argo Smart Routing**（提升全球路由速度）。
7. 点击 **Save tunnel**。

> 此时你的固定域名已创建，流量将转发到 VPS 的 `localhost:443`。

## 步骤 2：VPS 上安装并运行 Cloudflared（固定 Tunnel）

1. SSH 登录 VPS，更新系统：
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install curl wget sudo -y
   ```

2. 安装 Cloudflared（AMD64 示例）：
   ```bash
   curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared.deb
   ```
   > ARM64 用户下载 `cloudflared-linux-arm64` 并手动放置到 `/usr/local/bin/` 并赋予执行权限。

3. 验证安装：
   ```bash
   cloudflared --version
   ```

4. 使用 Token 安装并启动服务（推荐方式）：
   ```bash
   sudo cloudflared service install 你的完整TOKEN字符串
   sudo systemctl start cloudflared
   sudo systemctl enable cloudflared    # 开机自启
   sudo systemctl status cloudflared    # 检查状态（应为 active）
   ```

5. 查看实时日志：
   ```bash
   journalctl -u cloudflared -f
   ```

6. 测试：浏览器访问 `argo.yourdomain.com`，应显示连接尝试（此时 Xray 未启动，可能 502）。

## 步骤 3：安装并配置 Xray（VLESS + WebSocket）

1. 安装 Xray（官方脚本）：
   ```bash
   bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install
   ```

2. 生成密钥：
   ```bash
   xray uuid                  # 生成 UUID，复制保存
   xray x25519                # 生成 privateKey 和 publicKey，分别保存
   openssl rand -hex 8        # 生成 shortId（可多生成几个）
   ```

3. 编辑配置文件：
   ```bash
   sudo nano /usr/local/etc/xray/config.json
   ```

   粘贴以下内容（替换对应字段）：
   ```json
{
  "log": {
    "loglevel": "info"
  },
  "inbounds": [
    {
      "tag": "vless-ws",
      "listen": "0.0.0.0",
      "port": 443,
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "807c3635-f4be-4a2d-9f50-f70aa8f6d02d",
            "flow": ""
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "path": "/807c3635-f4be-4a2d-9f50-f70aa8f6d02d-vw"
        }
      },
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls",
          "quic"
        ],
        "metadataOnly": false
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {
        "domainStrategy": "UseIPv4"
      }
    }
  ]
}
   ```

4. 验证配置并启动：
   ```bash
   xray run -test -c /usr/local/etc/xray/config.json   # 测试无报错
   sudo systemctl start xray
   sudo systemctl enable xray
   sudo systemctl status xray
   journalctl -u xray -f    # 查看日志
    ```


5. 启用 BBR 拥塞控制：
   ```bash
   echo "net.core.default_qdisc=fq" | sudo tee -a /etc/sysctl.conf
   echo "net.ipv4.tcp_congestion_control=bbr" | sudo tee -a /etc/sysctl.conf

   # 应用更改
   sudo sysctl -p

   # 验证是否开启 (应输出 tcp_bbr)
   lsmod | grep bbr
   ```

6. 优选 CF IP：
   https://github.com/XIU2/CloudflareSpeedTest

## 步骤 4：在 v2rayNG 客户端配置

1. 打开 v2rayNG → 点击右上角 **+** → **手动输入** → **VLESS**。
2. 填写以下字段：

   | 项目               | 内容                                      |
   |--------------------|-------------------------------------------|
   | 备注               | 随意（如 Fixed-Argo-WS）                  |
   | 地址               | argo.yourdomain.com                       |
   | 端口               | 443                                       |
   | 用户 ID            | 你的 UUID                                 |
   | 流控               | **留空**                                  |
   | 加密               | none                                      |
   | 传输协议           | **ws**                                    |
   | 伪装类型           | none                                      |
   | 伪装域名           | argo.yourdomain.com                       |
   | 路径               | **/ws**                                   |
   | 底层传输安全       | **tls**                                   |
   | 跳过证书验证       | false                                     |

3. 高级设置（无需额外配置 REALITY）：
   - 无需配置 PublicKey / ShortId。
   - 确保 **路径** 正确填写为 `/ws`。

4. 保存 → 选择节点 → 点击连接。
5. 测试：访问 YouTube、Google，检查 IP 是否变为 VPS 地区。

## 常见问题排查

- **Tunnel 不通**：检查 `journalctl -u cloudflared`，确认 Token 正确、Dashboard Tunnel 状态为 Healthy。
- **Xray 启动失败**：查看 `/var/log/xray/error.log`，常见密钥格式错误或端口占用。
- **客户端连不上**：确认 Fingerprint 为 chrome、ShortId 匹配、SNI 未被墙（可换 `www.bing.com`）。
- **速度慢**：开启 Argo Smart Routing；检查 VPS 带宽。
- **被封锁**：更换伪装站点、ShortId、publicKey/privateKey 对。
- **更新软件**：
  - Cloudflared：`sudo cloudflared update`
  - Xray：重新运行安装脚本加 `--force`

## 结语

此方案在2025年12月仍为高安全性、高隐蔽性的主流自建方式。固定域名 + REALITY + Argo Tunnel 组合几乎无明显特征可被探测。配置完成后定期维护密钥与伪装站点即可长期稳定使用。

**安全使用，理性上网！**
