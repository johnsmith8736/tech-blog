---
title: 'sing-box 1.13.0+ 使用 wgcf + WireGuard 为 AbemaTV 和 ChatGPT/OpenAI 分流教程'
date: '2026-03-08'
excerpt: '使用 sing-box 1.13.0+ 配合 wgcf 和 WireGuard，为 AbemaTV 与 ChatGPT/OpenAI 配置基于 VLESS + Reality + WARP 的分流方案。'
tags: ["sing-box", "VLESS", "Reality", "WARP", "WireGuard", "AbemaTV", "ChatGPT", "OpenAI"]
category: "Network"
section: "networking"
subsection: "proxy"
---

# sing-box 1.13.0+ 使用 `wgcf + WireGuard` 为 AbemaTV 和 ChatGPT/OpenAI 分流教程

本文目标：

- 服务端使用 `VLESS + Reality`
- 客户端默认走 `VLESS + Reality`
- 客户端额外添加一个 `WireGuard` 出站作为 `WARP`
- `AbemaTV` 和 `ChatGPT/OpenAI` 相关域名走 `WARP`
- 国内和局域网流量直连

本文使用的是非官方方案：

- `wgcf`：用来生成 Cloudflare WARP 的 WireGuard 参数
- `sing-box`：用来做分流和代理

注意：

- `wgcf` 是第三方工具，不是 Cloudflare 官方工具
- `WARP` 不保证稳定解锁 `AbemaTV`
- `AbemaTV` 往往更依赖日本出口，`WARP` 成功率不一定稳定
- `ChatGPT/OpenAI` 走 `WARP` 一般更有意义，但也不保证长期稳定

## 1. 环境准备

你需要准备：

- 一台公网服务器
- 服务端已安装 `sing-box 1.13.0+`
- 客户端已安装 `sing-box 1.13.0+`
- 客户端本机可运行 `wgcf`

## 2. 生成 WARP WireGuard 参数

### 2.1 安装 `wgcf`

项目地址：

`https://github.com/ViRb3/wgcf`

Linux 常见做法：

1. 到 Releases 下载对应架构二进制
2. 解压
3. 放到系统 PATH，例如 `/usr/local/bin/wgcf`

### 2.2 注册 WARP

```bash
wgcf register
```

执行后会生成：

- `wgcf-account.toml`

### 2.3 生成 WireGuard 配置

```bash
wgcf generate
```

执行后会生成：

- `wgcf-profile.conf`

### 2.4 从 `wgcf-profile.conf` 提取参数

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

你后面要填进 `sing-box` 的字段主要是：

- `PrivateKey` -> `private_key`
- `Address` 第 1 个 -> `YOUR_WARP_IPV4/32`
- `Address` 第 2 个 -> `YOUR_WARP_IPV6/128`
- `PublicKey` -> `YOUR_WARP_PEER_PUBLIC_KEY`
- `Endpoint` -> `server` 和 `server_port`
- `MTU` -> `mtu`

## 3. 生成 Reality 参数

在一台装了 `sing-box` 的机器上生成：

```bash
sing-box generate reality-keypair
```

会得到：

- `PrivateKey`
- `PublicKey`

再自己生成一个 UUID：

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

## 4. 服务端完整配置

文件名建议：

`server-vless-reality.json`

内容如下：

```json
{
  "log": {
    "level": "info",
    "timestamp": true
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
      }
    }
  ],
  "outbounds": [
    {
      "type": "direct",
      "tag": "direct"
    },
    {
      "type": "block",
      "tag": "block"
    }
  ]
}
```

服务端说明：

- `YOUR_UUID`：客户端和服务端保持一致
- `YOUR_REALITY_PRIVATE_KEY`：服务端私钥
- `YOUR_SHORT_ID`：客户端和服务端保持一致

## 5. 客户端完整配置

文件名建议：

`client-vless-reality-warp.json`

内容如下：

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
      },
      {
        "tag": "remote",
        "address": "tls://1.1.1.1",
        "detour": "proxy"
      },
      {
        "tag": "block-dns",
        "address": "rcode://success"
      }
    ],
    "rules": [
      {
        "rule_set": "geosite-cn",
        "server": "local"
      },
      {
        "rule_set": "category-ads-all",
        "server": "block-dns"
      }
    ],
    "final": "remote",
    "strategy": "prefer_ipv4",
    "independent_cache": true
  },
  "inbounds": [
    {
      "type": "tun",
      "tag": "tun-in",
      "interface_name": "tun0",
      "address": [
        "172.19.0.1/30",
        "fdfe:dcba:9876::1/126"
      ],
      "mtu": 9000,
      "auto_route": true,
      "strict_route": true,
      "auto_redirect": true,
      "stack": "mixed"
    },
    {
      "type": "mixed",
      "tag": "mixed-in",
      "listen": "127.0.0.1",
      "listen_port": 2080
    }
  ],
  "outbounds": [
    {
      "type": "dns",
      "tag": "dns-out"
    },
    {
      "tag": "proxy",
      "type": "selector",
      "outbounds": [
        "vless-reality",
        "direct"
      ],
      "default": "vless-reality"
    },
    {
      "type": "vless",
      "tag": "vless-reality",
      "server": "YOUR_SERVER_IP_OR_DOMAIN",
      "server_port": 443,
      "uuid": "YOUR_UUID",
      "flow": "xtls-rprx-vision",
      "network": "tcp",
      "packet_encoding": "xudp",
      "tls": {
        "enabled": true,
        "server_name": "www.nhk.or.jp",
        "utls": {
          "enabled": true,
          "fingerprint": "chrome"
        },
        "reality": {
          "enabled": true,
          "public_key": "YOUR_REALITY_PUBLIC_KEY",
          "short_id": "YOUR_SHORT_ID"
        }
      }
    },
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
        "action": "sniff"
      },
      {
        "protocol": "dns",
        "action": "hijack-dns"
      },
      {
        "ip_is_private": true,
        "outbound": "direct"
      },
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
      },
      {
        "domain_suffix": [
          ".lan",
          ".local"
        ],
        "outbound": "direct"
      },
      {
        "domain": [
          "nas.home.arpa",
          "router.local"
        ],
        "outbound": "direct"
      },
      {
        "rule_set": "category-ads-all",
        "outbound": "block"
      },
      {
        "rule_set": [
          "geoip-cn",
          "geosite-cn"
        ],
        "outbound": "direct"
      }
    ],
    "rule_set": [
      {
        "type": "remote",
        "tag": "geoip-cn",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs",
        "download_detour": "direct",
        "update_interval": "24h"
      },
      {
        "type": "remote",
        "tag": "geosite-cn",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
        "download_detour": "direct",
        "update_interval": "24h"
      },
      {
        "type": "remote",
        "tag": "category-ads-all",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/category-ads-all.srs",
        "download_detour": "direct",
        "update_interval": "24h"
      }
    ],
    "auto_detect_interface": true,
    "default_domain_resolver": "local",
    "final": "proxy"
  },
  "experimental": {
    "cache_file": {
      "enabled": true,
      "store_fakeip": false
    }
  }
}
```

## 6. 需要替换的字段

### 服务端需要替换

- `YOUR_UUID`
- `YOUR_REALITY_PRIVATE_KEY`
- `YOUR_SHORT_ID`

### 客户端需要替换

- `YOUR_SERVER_IP_OR_DOMAIN`
- `YOUR_UUID`
- `YOUR_REALITY_PUBLIC_KEY`
- `YOUR_SHORT_ID`
- `YOUR_WARP_IPV4/32`
- `YOUR_WARP_IPV6/128`
- `YOUR_WARP_PRIVATE_KEY`
- `YOUR_WARP_PEER_PUBLIC_KEY`

## 7. 为什么这样分流

这套策略的逻辑是：

- `AbemaTV` 相关域名 -> `warp`
- `ChatGPT/OpenAI` 相关域名 -> `warp`
- 中国大陆相关规则 -> `direct`
- 局域网 -> `direct`
- 广告域名 -> `block`
- 其他流量 -> `vless-reality`

这样可以把需要特殊出口的服务和普通代理流量拆开。

## 8. 启动前检查

如果本机已安装 `sing-box`，先做配置检查：

```bash
sing-box check -c client-vless-reality-warp.json
sing-box check -c server-vless-reality.json
```

## 9. 启动方式示例

### 服务端

```bash
sing-box run -c server-vless-reality.json
```

### 客户端

```bash
sudo sing-box run -c client-vless-reality-warp.json
```

说明：

- `tun` 入站通常需要 root 或 `CAP_NET_ADMIN`
- Linux 下如果权限不够，客户端会启动失败

## 10. 验证方法

### 验证主代理

访问：

- `https://www.google.com`

确认普通国外流量能走 `vless-reality`

### 验证 ChatGPT/OpenAI

访问：

- `https://chatgpt.com`
- `https://platform.openai.com`

确认命中 `warp`

### 验证 AbemaTV

访问：

- `https://abema.tv/`

如果仍无法播放，通常不是配置结构问题，而是 `WARP` 出口地区不满足要求。

## 11. 常见问题

### 11.1 WARP 连不上

通常是下面这些值填错：

- `YOUR_WARP_IPV4/32`
- `YOUR_WARP_IPV6/128`
- `YOUR_WARP_PRIVATE_KEY`
- `YOUR_WARP_PEER_PUBLIC_KEY`

### 11.2 ChatGPT 还是打不开

常见原因：

- `WARP` 本身不可用
- DNS 没有被 `sing-box` 接管
- 相关域名仍有遗漏
- 目标服务对出口有额外风控

### 11.3 AbemaTV 还是地区限制

最常见原因：

- `WARP` 没落到日本出口
- 相关媒体域名没全走 `warp`

如果你追求稳定解锁 `AbemaTV`，通常应该给它单独走日本节点，而不是只依赖 `WARP`

## 12. 更稳的方案建议

如果你的目标是长期稳定：

- `AbemaTV` -> 日本节点
- `ChatGPT/OpenAI` -> `WARP`
- 其他国外流量 -> `VLESS + Reality`

这种结构通常比“全部依赖 WARP 解锁”更靠谱。
