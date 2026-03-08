---
title: 'sing-box 1.13.0+ 使用服务端 wgcf + WARP 解锁 AbemaTV 和 ChatGPT/OpenAI 教程'
date: '2026-03-08'
excerpt: '使用 sing-box 1.13.0+ 在 VPS 服务端部署 wgcf + WARP，为 AbemaTV 与 ChatGPT/OpenAI 提供基于 VLESS + Reality 的服务端分流方案。'
tags: ["sing-box", "VLESS", "Reality", "WARP", "wgcf", "AbemaTV", "ChatGPT", "OpenAI"]
category: "Network"
section: "networking"
subsection: "proxy"
---

# sing-box 1.13.0+ 使用服务端 `wgcf + WARP` 解锁 `AbemaTV` 和 `ChatGPT/OpenAI` 教程

本文目标：

- VPS 服务端使用 `VLESS + Reality`
- `wgcf` 部署在 VPS 服务端
- VPS 服务端额外配置一个 `WARP(WireGuard)` 出站
- `AbemaTV` 和 `ChatGPT/OpenAI` 相关流量在服务端走 `WARP`
- 手机端只导入一个普通 `VLESS + Reality` 节点

这篇教程对应的是“服务端挂 WARP 出口”方案，不是“客户端本机挂 WARP”方案。

## 1. 原理说明

这套方案的流量走向是：

- 普通国外网站：`手机 -> VPS(VLESS + Reality) -> 目标网站`
- `AbemaTV/OpenAI`：`手机 -> VPS(VLESS + Reality) -> VPS 上的 WARP -> 目标网站`

也就是说：

- 手机本机不跑 `wgcf`
- 手机本机不配 `WARP`
- `WARP` 只部署在 VPS 服务端
- 服务端根据域名规则把指定流量转给 `WARP`

## 2. 环境准备

你需要准备：

- 一台公网 VPS
- VPS 已安装 `sing-box 1.13.0+`
- VPS 可以运行 `wgcf`
- 手机上有支持 `VLESS + Reality` 的客户端

注意：

- `WARP` 不保证长期稳定解锁 `AbemaTV`
- `ChatGPT/OpenAI` 也不保证长期稳定
- `VLESS + Reality` 只负责传输与伪装，不负责“解锁”

## 3. 在 VPS 上生成 Reality 参数

在 VPS 上执行：

```bash
sing-box generate reality-keypair
```

你会得到：

- `PrivateKey`
- `PublicKey`

再生成 UUID：

```bash
uuidgen
```

再准备一个 `short_id`，例如：

```text
6ba85179
```

本文示例使用：

- `server_name`: `www.nhk.or.jp`
- `handshake.server`: `www.nhk.or.jp`

## 4. 在 VPS 上生成 WARP WireGuard 参数

这一步明确是在 VPS 服务端执行，不是在手机客户端执行。

### 4.1 安装 `wgcf`

项目地址：

`https://github.com/ViRb3/wgcf`

常见做法：

1. 到 Releases 下载对应架构的二进制
2. 解压
3. 放到系统 PATH，例如 `/usr/local/bin/wgcf`

### 4.2 注册 WARP

```bash
wgcf register
```

执行后会生成：

- `wgcf-account.toml`

### 4.3 生成 WireGuard 配置

```bash
wgcf generate
```

执行后会生成：

- `wgcf-profile.conf`

### 4.4 从 `wgcf-profile.conf` 提取参数

文件一般类似：

```ini
[Interface]
PrivateKey = YOUR_WARP_PRIVATE_KEY
Address = YOUR_WARP_IPV4/32, YOUR_WARP_IPV6/128
DNS = 1.1.1.1
MTU = 1280

[Peer]
PublicKey = YOUR_WARP_PEER_PUBLIC_KEY
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = engage.cloudflareclient.com:2408
```

后面要填进 `sing-box` 的字段主要是：

- `PrivateKey` -> `private_key`
- `Address` 第 1 个 -> `YOUR_WARP_IPV4/32`
- `Address` 第 2 个 -> `YOUR_WARP_IPV6/128`
- `PublicKey` -> `YOUR_WARP_PEER_PUBLIC_KEY`
- `Endpoint` -> `server` 和 `server_port`
- `MTU` -> `mtu`

## 5. 服务端完整配置

文件名建议：

`server-vless-reality-warp-egress.json`

完整配置如下：

```json
{
  "log": {
    "level": "info",
    "timestamp": true
  },
  "dns": {
    "servers": [
      {
        "tag": "local",
        "address": "local"
      }
    ],
    "strategy": "prefer_ipv4"
  },
  "inbounds": [
    {
      "type": "vless",
      "tag": "vless-reality-in",
      "listen": "::",
      "listen_port": 443,
      "users": [
        {
          "name": "default",
          "uuid": "YOUR_UUID",
          "flow": "xtls-rprx-vision"
        }
      ],
      "tls": {
        "enabled": true,
        "server_name": "www.nhk.or.jp",
        "reality": {
          "enabled": true,
          "handshake": {
            "server": "www.nhk.or.jp",
            "server_port": 443
          },
          "private_key": "YOUR_REALITY_PRIVATE_KEY",
          "short_id": [
            "YOUR_SHORT_ID"
          ]
        }
      },
      "sniff": true,
      "sniff_override_destination": false
    }
  ],
  "outbounds": [
    {
      "type": "wireguard",
      "tag": "warp",
      "server": "engage.cloudflareclient.com",
      "server_port": 2408,
      "local_address": [
        "YOUR_WARP_IPV4/32",
        "YOUR_WARP_IPV6/128"
      ],
      "private_key": "YOUR_WARP_PRIVATE_KEY",
      "peer_public_key": "YOUR_WARP_PEER_PUBLIC_KEY",
      "reserved": [
        0,
        0,
        0
      ],
      "mtu": 1280
    },
    {
      "type": "direct",
      "tag": "direct"
    },
    {
      "type": "block",
      "tag": "block"
    }
  ],
  "route": {
    "rules": [
      {
        "domain_suffix": [
          ".abema.tv",
          ".abema.io",
          ".abema-tv.com",
          ".abematv.akamaized.net",
          ".linear-abematv.akamaized.net",
          ".ds-linear-abematv.akamaized.net",
          ".vod-abematv.akamaized.net",
          ".ds-vod-abematv.akamaized.net",
          ".ameba.jp",
          ".ameblo.jp",
          ".winticket.jp",
          ".hayabusa.io",
          ".hayabusa.media"
        ],
        "outbound": "warp"
      },
      {
        "domain": [
          "chat.openai.com",
          "auth0.openai.com",
          "setup.auth.openai.com",
          "events.statsigapi.net",
          "js.stripe.com",
          "challenges.cloudflare.com"
        ],
        "domain_suffix": [
          ".chatgpt.com",
          ".openai.com",
          ".auth.openai.com",
          ".oaistatic.com",
          ".oaiusercontent.com",
          ".statsig.com",
          ".statsigapi.net",
          ".featuregates.org",
          ".intercomcdn.com",
          ".intercom.io",
          ".workos.com",
          ".workoscdn.com"
        ],
        "outbound": "warp"
      }
    ],
    "final": "direct"
  }
}
```

## 6. 服务端字段说明

必须替换的值：

- `YOUR_UUID`
- `YOUR_REALITY_PRIVATE_KEY`
- `YOUR_SHORT_ID`
- `YOUR_WARP_IPV4/32`
- `YOUR_WARP_IPV6/128`
- `YOUR_WARP_PRIVATE_KEY`
- `YOUR_WARP_PEER_PUBLIC_KEY`

通常也建议你检查：

- `listen_port`
- `server_name`
- `handshake.server`
- `server`
- `server_port`
- `mtu`

如果你的 `wgcf-profile.conf` 里 `Endpoint` 不是 `engage.cloudflareclient.com:2408`，就按实际值改。

## 7. 手机端节点怎么配

手机端不要再配置 `WARP`。

手机端只需要导入一个普通 `VLESS + Reality` 节点。

可直接拼装的链接模板：

```text
vless://YOUR_UUID@YOUR_SERVER_IP_OR_DOMAIN:443?security=reality&flow=xtls-rprx-vision&encryption=none&type=tcp&sni=www.nhk.or.jp&pbk=YOUR_REALITY_PUBLIC_KEY&sid=YOUR_SHORT_ID&fp=chrome#Reality-WARP-Server
```

字段对应关系：

- `YOUR_UUID` -> 服务端 `users[0].uuid`
- `YOUR_SERVER_IP_OR_DOMAIN` -> VPS 的公网 IP 或域名
- `pbk` -> Reality 公钥
- `sid` -> `short_id`
- `sni` -> 和服务端 `tls.server_name` 一致

手机端常见填写方式：

- 地址 / Address -> VPS IP 或域名
- 端口 / Port -> `443`
- UUID -> 你的 UUID
- Network -> `tcp`
- Security -> `reality`
- SNI / Server Name -> `www.nhk.or.jp`
- Public Key -> 你的 Reality 公钥
- Short ID -> 你的 `short_id`
- Fingerprint -> `chrome`
- Flow -> `xtls-rprx-vision`

## 8. 启动方式

在 VPS 上运行：

```bash
sing-box run -c server-vless-reality-warp-egress.json
```

如果要做成系统服务，再按你的系统把配置文件放到对应目录。

## 9. 验证方法

建议按下面顺序测试：

1. 手机导入节点后，先确认普通国外网站可以访问
2. 再测试 `https://chatgpt.com/`
3. 再测试 `https://abema.tv/`
4. 如果站点首页能打开但视频或登录异常，优先怀疑出口识别问题

你要知道：

- 节点能连接，只说明 `VLESS + Reality` 没问题
- `AbemaTV` 是否真的可看，取决于 `WARP` 出口是否被它接受
- `ChatGPT/OpenAI` 是否长期稳定，也取决于出口识别策略

## 10. 这套方案适合什么人

适合：

- 想在手机上只导入一个节点
- 不想在手机本机再跑 `WARP`
- 想让 VPS 帮你把 `AbemaTV/OpenAI` 流量转到 `WARP`

不适合：

- 要求 `AbemaTV` 长期高成功率且非常稳定
- 不接受 `WARP` 可能失效或波动

如果你追求更高的 `AbemaTV` 成功率，方向通常不是换 `Reality`，而是换更干净的日本出口。
