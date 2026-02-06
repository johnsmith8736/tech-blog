---
title: 'VLESS + WS + ENC + 固定 Argo + Xray + WARP（JP）'
date: '2025-12-15'
excerpt: '稳定解锁 Abema + TVer 的完整方案，使用固定 Cloudflare Argo Tunnel、Xray 和 WARP 日本出口，实现高稳定性和抗封锁。'
tags: ["VLESS", "WebSocket", "ArgoTunnel", "Xray", "WARP", "Japan"]
---

# VLESS + WS + ENC + 固定 Argo + Xray + WARP（JP）

> **目标**：稳定解锁 **Abema + TVer**，非流媒体自动直连（fallback to direct）

---

## 一、整体架构

```
客户端（v2rayN / v2rayNG / mihomo）
        |
   VLESS + WS + TLS
        |
Cloudflare 固定 Argo Tunnel（域名）
        |
      VPS (Xray)
        |
   WARP SOCKS5（日本）
        |
   Abema / TVer（解锁）
```

**核心思想**：

* **Cloudflare Argo** 负责入口（抗封锁、IP 稳定）
* **Xray sniffing + geosite** 精准识别流媒体
* **WARP（JP）** 提供日本家宽级出口
* **非流媒体 fallback 到 direct**，节省 WARP 资源

---

## 二、准备条件

### 1. VPS

* 任意地区（JP / SG / US 均可）
* 系统：Debian 11 / 12

### 2. 域名

* 已托管到 **Cloudflare**
* **Cloudflare Pro（必须，固定 Argo Tunnel）**

### 3. 客户端

* v2rayN / v2rayNG / mihomo（任选）

---

## 三、安装 Xray

```bash
bash <(curl -Ls https://raw.githubusercontent.com/XTLS/Xray-install/main/install-release.sh)
```

验证：

```bash
xray version
```

---

## 四、部署 WARP（日本出口，关键）

> ⚠️ **更新说明**：WARP 脚本已迁移至 **GitLab**：`https://gitlab.com/fscarmen/warp`。以下步骤已按新地址整理。

### 4.1 安装 WARP（官方脚本，GitLab）

项目地址：`https://gitlab.com/fscarmen/warp`

```bash
wget -N https://gitlab.com/fscarmen/warp/-/raw/main/menu.sh
chmod +x menu.sh
bash menu.sh
```

> 在菜单中选择 **WARP SOCKS5** 模式，并指定 **日本（JP）** 节点。

---

### 4.2 启动 WARP SOCKS5（日本）

若你使用脚本自动安装，通常会监听在本地 SOCKS5 端口（示例：`127.0.0.1:40000`）。

---

### 4.3 验证（必须）

```bash
curl --socks5 127.0.0.1:40000 https://ipinfo.io
```

确保：

* `country: JP`
* `org: Cloudflare, Inc.`

---

## 五、Xray 服务端配置（Abema + TVer 分流）

路径：`/usr/local/etc/xray/config.json`

```json
{
  "log": {
    "loglevel": "info"
  },
  "inbounds": [
    {
      "tag": "vless-ws",
      "listen": "127.0.0.1",
      "port": 10000,
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "1960de2f-7078-46df-b1d3-39f98f15683c"
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "ws",
        "security": "none",
        "wsSettings": {
          "path": "/ws"
        }
      },
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls"],
        "metadataOnly": false
      }
    }
  ],
  "outbounds": [
    {
      "tag": "direct",
      "protocol": "freedom"
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
          "geosite:abema",
          "geosite:tver",
          "abema.tv",
          "abema.io",
          "akamaized.net"
        ],
        "outboundTag": "warp"
      },
      {
        "type": "field",
        "domain": [
          "cloudflare.com",
          "dash.cloudflare.com",
          "developers.cloudflare.com"
        ],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "ip": [
          "geoip:private"
        ],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "network": "tcp,udp",
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

---

## 六、固定 Argo Tunnel 配置（详细教程）

> 本章节是**整套方案的核心**，用于实现：
>
> * 固定入口 IP（不随 VPS / Cloudflare 节点变化）
> * Cloudflare TLS 加密（即你说的 ENC）
> * 隐藏真实服务器 IP

---

### 6.1 什么是「固定 Argo Tunnel」？

普通 Cloudflare CDN：

* 依赖 DNS
* 节点可能漂移
* 某些地区会被 QoS

**固定 Argo Tunnel（Cloudflare Tunnel）**：

* VPS **主动** 连 Cloudflare
* 客户端永远只访问 Cloudflare
* 不暴露 VPS IP
* 支持 WebSocket / TCP / HTTP

👉 对 VLESS + WS 来说，是**最稳、最抗封锁**的入口方式。

---

### 6.2 安装 cloudflared

```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared-linux-amd64
mv cloudflared-linux-amd64 /usr/bin/cloudflared
```

验证：

```bash
cloudflared version
```

---

### 6.3 登录 Cloudflare（绑定账号）

```bash
cloudflared tunnel login
```

执行后会：

1. 打开浏览器
2. 选择你的 Cloudflare 账号
3. 授权 cloudflared

成功后会生成：

```bash
~/.cloudflared/cert.pem
```

---

### 6.4 创建固定 Tunnel

```bash
cloudflared tunnel create xray-stream
```

输出示例：

```
Tunnel credentials written to /etc/cloudflared/xxxxxxxx-xxxx.json
Tunnel ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

请记下：

* **Tunnel Name**：`xray-stream`
* **Tunnel ID**：`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

### 6.5 绑定域名到 Tunnel（DNS 自动创建）

```bash
cloudflared tunnel route dns xray-stream stream.xxxxx.xxx.xx
```

说明：

* Cloudflare 会自动创建一条 **CNAME**
* 指向 `xxxx.cfargotunnel.com`
* 你无需手动改 DNS

---

### 6.6 编写 Tunnel 配置文件（重点）

路径：`/etc/cloudflared/config.yml`

```yaml
tunnel: xray-stream
credentials-file: /etc/cloudflared/7fa0080c-acb9-46af-9185-c46ad7aa69c4.json

ingress:
  - hostname: stream.xxxxx.xxx.xx
    service: http://127.0.0.1:10000
  - service: http_status:404
```

字段解释：

| 字段               | 含义                 |
| ---------------- | ------------------ |
| tunnel           | Tunnel 名称          |
| credentials-file | Tunnel ID 对应的 json |
| hostname         | 客户端访问的域名           |
| service          | 实际转发到的本地服务         |

⚠️ **这里的端口必须和 Xray inbound 一致**。

---

### 6.7 启动 Tunnel（systemd，推荐）

```bash
cloudflared service install
systemctl daemon-reload
systemctl restart cloudflared
systemctl enable cloudflared
```

查看状态：

```bash
systemctl status cloudflared
```

实时日志：

```bash
journalctl -u cloudflared -f
```

看到 `Connection registered` 即成功。

---

### 6.8 Argo Tunnel 常见错误排查

| 现象              | 原因                    |
| --------------- | --------------------- |
| 502 Bad Gateway | ingress 端口写错          |
| 404             | WS Path 不一致           |
| 能连但不通           | Xray 未监听 127.0.0.1    |
| 连不上             | Tunnel ID / json 路径错误 |

---

### 6.9 为什么不用临时 Argo？

| 对比项   | 临时 Argo | 固定 Argo |
| ----- | ------- | ------- |
| 稳定性   | ❌       | ✅       |
| IP 固定 | ❌       | ✅       |
| 适合长期  | ❌       | ✅       |
| 流媒体   | ❌       | ✅       |

👉 **流媒体 + 长期使用 = 必须固定 Argo**

---

### 6.10 与 VLESS-WS-ENC 的关系

* TLS 加密发生在：

  * 客户端 ⇄ Cloudflare
* VPS ⇄ Cloudflare：

  * WebSocket 明文（本地/隧道）

这正是 **ENC 的本质**：

> **Cloudflare 作为加密与混淆层**

```

---

## 七、客户端配置（VLESS）

| 项目 | 值 |
|---|---|
| 协议 | VLESS |
| 地址 | stream.xxxxx.xxx.xx |
| 端口 | 443 |
| UUID | 1960de2f-7078-46df-b1d3-39f98f15683c |
| 传输 | WS |
| WS Path | /ws |
| TLS | 开启 |
| SNI | stream.xxxxx.xxx.xx |
| 加密 | none |

> 客户端 **不要写分流规则**，全部由服务端处理。

---

## 八、解锁验证

- **Abema**：<https://abema.tv>
- **TVer**：<https://tver.jp>

能直接播放即成功。

---

## 九、常见问题排错

| 问题 | 原因 |
|---|---|
| 地区限制 | WARP 非 JP |
| 首页能进，视频失败 | sniffing 未启用 |
| 所有流量走 WARP | fallback 规则错误 |
| 502 | Argo ingress 端口错误 |

---

## 十、总结

这是一套 **高稳定、抗封锁、可长期使用** 的日本流媒体方案：

- Cloudflare 入口
- 家宽级日本出口
- 自动分流
- 不依赖 VPS IP 质量

适合长期使用 Abema / TVer。

```
