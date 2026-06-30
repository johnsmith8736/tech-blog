---
title: 'VMess + WS + 固定 Tunnel + Xray + 官方 WARP（JP）'
date: '2026-02-25'
excerpt: '使用 Cloudflare 固定 Tunnel + Xray + 官方 WARP（JP）的稳定方案，解锁 Abema 和 TVer，并按规则分流。'
tags: ["VMess", "WebSocket", "CloudflareTunnel", "Xray", "WARP", "Japan"]
category: "Network"
---
# VMess + WS + 固定 Tunnel + Xray + 官方 WARP（JP）
## 目录

1. 一、整体架构

2. 二、准备条件

3. 三、安装 Xray

4. 四、部署 **官方 WARP（日本出口）**

5. 五、Xray 服务端配置（Abema + TVer 分流）

6. 六、固定 Cloudflare Tunnel 配置（无需 CLI 生成）

7. 七、客户端配置（VMess）

8. 八、解锁验证

9. 九、常见问题排查

10. 十、总结


## 一、整体架构

客户端（v2rayN / v2rayNG / mihomo）  
  |  
VMess + WS + TLS  
  |  
Cloudflare 固定 Tunnel（域名）  
  |  
VPS (Xray)  
  |  
官方 WARP SOCKS5（日本出口）  
  |  
Abema / TVer（解锁）

**核心思想：**

- Cloudflare 固定 Tunnel 负责入口（抗封锁、IP 稳定）
- Xray sniffing + geosite 精准识别流媒体
- 官方 WARP 提供日本出口（家宽级别 IP）
- 非流媒体 fallback 到 direct，节省 WARP 资源



ID: VMESS-WS-ARGO-WARP-JP

#VMess  
#WebSocket  
#CloudflareTunnel  
#Xray  
#WARP  
#Japan

VMess + WS + 固定 Tunnel + Xray + 官方 WARP（JP）  
目标：稳定解锁 Abema + TVer，非流媒体自动直连（fallback to direct）


## 二、准备条件

1. **VPS**  
   任意地区（JP / SG / US 均可）  
   系统：Debian 11 / 12

2. **域名**  
   已托管到 Cloudflare  
   Cloudflare Pro（必须，固定 Tunnel）

3. **客户端**  
   v2rayN / v2rayNG / mihomo（任选）


## 三、安装 Xray

```bash
bash <(curl -Ls https://raw.githubusercontent.com/XTLS/Xray-install/main/install-release.sh)
```

验证：

```bash
xray version
```


## 四、部署 **官方 WARP（日本出口）**

⚠️ 注意：下面使用 Cloudflare 官方的 `warp-cli` 命令，不再使用第三方脚本。

### 4.1 安装官方 WARP 客户端

官方提供 Linux 客户端包，可以通过官方包仓库安装：

```bash
# 添加 Cloudflare WARP 官方包仓库
curl -fsSL https://pkg.cloudflareclient.com/pubkey.gpg | sudo gpg --yes --dearmor --output /usr/share/keyrings/cloudflare-warp-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/cloudflare-warp-archive-keyring.gpg] https://pkg.cloudflareclient.com/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflare-client.list

# 更新并安装
sudo apt update
sudo apt install cloudflare-warp
```

📌 此安装方式来自官方文档，可确保你获取到最新且受支持的 WARP 客户端。([Cloudflare Docs][1])


### 4.2 注册并启动 WARP

首次运行时需要注册：

```bash
warp-cli registration new

warp-cli registration show
```

执行后它会输出一个链接，将其在浏览器中打开并完成 Cloudflare 登陆/授权（若是 headless 服务器，请复制链接到本地浏览器）。


### 4.3 启用代理模式并连接

我们要启用 **SOCKS5 代理模式** 让 Xray 使用：

```bash
warp-cli mode proxy
warp-cli connect
```

检查状态：

```bash
warp-cli status
```

正常连接后 WARP 会在本地开启一个 SOCKS5 代理（默认监听 `127.0.0.1:40000`）。([Cloudflare Docs][1])

📌 如果需要自定义端口，则：

```bash
warp-cli proxy port 10808
```

此时监听变为：

```
127.0.0.1:10808
```


### 4.4 验证 WARP 是否有效

可用 curl 测试：

```bash
curl https://www.cloudflare.com/cdn-cgi/trace --socks5 127.0.0.1:40000
```

若输出中 `warp=on` 则表示成功通过官方 WARP 网络。([Cloudflare Docs][1])


## 五、Xray 服务端配置（Abema + TVer 分流）

路径：`/usr/local/etc/xray/config.json`

```json
{
  "log": {
    "loglevel": "info"
  },

  "inbounds": [
    {
      "tag": "vmess-ws-in",
      "listen": "127.0.0.1",
      "port": 10086,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "2365cfb0-e649-48a7-a39b-bb49090c9bfd",
            "alterId": 0
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "security": "none",
        "wsSettings": {
          "path": "/vmess-tunnel"
        }
      },
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls", "quic"]
      }
    }
  ],

  "outbounds": [
    {
      "tag": "direct",
      "protocol": "freedom",
      "settings": {}
    },

    {
      "tag": "warp",
      "protocol": "socks",
      "settings": {
        "servers": [
          {
            "address": "127.0.0.1",
            "port": 40000
          }
        ]
      }
    }
  ],

  "routing": {
    "domainStrategy": "IPIfNonMatch",
    "rules": [
      {
        "type": "field",
        "domain": [
          "domain:abema.tv",
          "domain:tver.jp",
          "geosite:abema",
          "geosite:tver",
          "keyword:abema",
          "keyword:tver"
        ],
        "outboundTag": "warp"
      },

      {
        "type": "field",
        "ip": [
          "geoip:private"
        ],
        "outboundTag": "direct"
      }
    ]
  }
}
```

启动：

```bash
systemctl restart xray
systemctl enable xray
```


## 六、固定 Cloudflare Tunnel 配置（无需 CLI 生成）

本章节详解如何在 **Cloudflare Dashboard** 上创建固定 Tunnel（替代原来的 CLI 创建流程）：

### 6.1 什么是固定 Tunnel

固定 Tunnel 是 Cloudflare Zero Trust 的 Cloudflare Tunnel 功能（原 Argo Tunnel）。它使你的 VPS 实例与 Cloudflare 网络建立长连接，且不暴露真实 IP。适合长期运行 VMess+WebSocket。([anyun.org][2])


### 6.2 在 Cloudflare Dashboard 创建 Tunnel

1. 登录 Cloudflare → **Zero Trust** 控制面板
2. 菜单：**Network → Connectors → Tunnels**
3. 点击 **Create a Tunnel** → 输入名称（如 `xray-stream`）
4. 保存后 Dashboard 会给出 **安装命令 / Token**


安装 cloudflared

```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared-linux-amd64
mv cloudflared-linux-amd64 /usr/bin/cloudflared
```

验证：

```bash
cloudflared version
```


### 6.3 运行 Tunnel（VPS）

复制 Dashboard 生成的命令，如：

```bash
sudo cloudflared service install <dashboard-provided-token>
```

这会让 VPS 连接到 Cloudflare 固定 Tunnel。


### 6.4 配置域名

在 Dashboard 给 Tunnel 绑定 Hostname（如 `stream.example.com`），并设置对应转发到：

```
http://127.0.0.1:10086
```

确保路径与 Xray inbound 匹配（`/vmess-tunnel`）。


### 6.5 以系统服务启动 Tunnel

使用 cloudflared 提供的 systemd 脚本：

```bash

systemctl daemon-reload
systemctl restart cloudflared
systemctl enable cloudflared
```

查看状态：

```bash
systemctl status cloudflared
```


## 七、客户端配置（VMess）

| 项目        | 值                                    |
| --------- | ------------------------------------ |
| 协议        | VMess                                |
| 地址        | stream.example.com                   |
| 端口        | 443                                  |
| UUID      | 2365cfb0-e649-48a7-a39b-bb49090c9bfd |
| alterId   | 0                                    |
| 传输        | WS                                   |
| WS Path   | /vmess-tunnel                        |
| TLS       | 开启                                   |
| SNI       | stream.example.com                   |
| 加密（安全）   | auto                                 |

> 客户端无需写分流规则，全由服务端处理。


## 八、解锁验证

* **Abema**：[https://abema.tv](https://abema.tv)
* **TVer**：[https://tver.jp](https://tver.jp)

能直接播放即表示成功。


## 九、常见问题排查

| 问题              | 原因                                   |
| --------------- | ------------------------------------ |
| 地区限制            | WARP 未成功连接或非 JP                      |
| 首页可进，视频失败       | sniffing 未正确启用                       |
| 502 Bad Gateway | Tunnel ingress 或服务端口写错               |
| 无法连接            | Tunnel ID / Token / cloudflared 配置错误 |
| 客户端提示 ID 不匹配   | UUID 或 alterId 与服务端不一致               |


## 十、总结

这是一套 **可长期稳定使用的日本流媒体解锁方案**：

* 使用 **Cloudflare 固定 Tunnel** 作为入口
* Xray 提供代理分流
* 官方 **WARP SOCKS5** 提供日本出口
* 非流媒体自动 fallback

与 VLESS 方案相比，VMess 协议使用 AES 或 ChaCha20 加密传输，适合对安全性要求更高的场景。

[1]: https://developers.cloudflare.com/warp-client/get-started/linux/?utm_source=chatgpt.com "Linux desktop client · Cloudflare WARP client docs"
[2]: https://anyun.org/a/xitongwendang/2023/1228/15568.html?utm_source=chatgpt.com "CloudFlare Argo Tunnel教程 | 安云网 – AnYun.ORG"
