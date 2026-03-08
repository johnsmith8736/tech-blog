---
title: 'sing-box 1.13.0+ 使用 VLESS + Reality 翻墙基础教程'
date: '2026-03-08'
excerpt: '使用 sing-box 1.13.0+ 配置最基础的 VLESS + Reality 代理方案，不使用 WARP，也不做额外的流媒体或 OpenAI 分流。'
tags: ["sing-box", "VLESS", "Reality", "proxy", "tutorial"]
category: "Network"
section: "networking"
subsection: "proxy"
---

# sing-box 1.13.0+ 使用 `VLESS + Reality` 翻墙基础教程

本文目标：

- 服务端使用 `sing-box 1.13.0+`
- 客户端使用 `sing-box 1.13.0+`
- 协议使用 `VLESS + Reality`
- 不使用 `WARP`
- 不做额外的日本流媒体或 `OpenAI` 专用分流

这是一套最基础、最直接的翻墙配置。

## 1. 环境准备

你需要准备：

- 一台公网 VPS
- VPS 已安装 `sing-box 1.13.0+`
- 客户端已安装 `sing-box 1.13.0+`

如果你说的是 `1.3.0+`，那和本文不是一回事。本文配置按 `1.13.0+` 编写。

## 2. 生成 Reality 参数

在一台装了 `sing-box` 的机器上执行：

```bash
sing-box generate reality-keypair
```

你会得到：

- `PrivateKey`
- `PublicKey`

再生成一个 UUID：

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

## 3. 服务端完整配置

文件名建议：

`server-vless-reality.json`

完整配置如下：

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

服务端你至少要替换：

- `YOUR_UUID`
- `YOUR_REALITY_PRIVATE_KEY`
- `YOUR_SHORT_ID`

通常也会按实际情况检查：

- `listen_port`
- `server_name`
- `handshake.server`

## 4. 客户端完整配置

文件名建议：

`client-vless-reality-basic.json`

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

客户端你至少要替换：

- `YOUR_SERVER_IP_OR_DOMAIN`
- `YOUR_UUID`
- `YOUR_REALITY_PUBLIC_KEY`
- `YOUR_SHORT_ID`

通常也会按实际情况检查：

- `server_port`
- `tls.server_name`

## 5. 手机端节点模板

如果你不是导入完整 `sing-box` 客户端 JSON，而是想在手机上直接导入一个节点，可以用下面这个模板：

```text
vless://YOUR_UUID@YOUR_SERVER_IP_OR_DOMAIN:443?security=reality&flow=xtls-rprx-vision&encryption=none&type=tcp&sni=www.nhk.or.jp&pbk=YOUR_REALITY_PUBLIC_KEY&sid=YOUR_SHORT_ID&fp=chrome#Reality-Basic
```

字段对应关系：

- `YOUR_UUID` -> 服务端 `users[0].uuid`
- `YOUR_SERVER_IP_OR_DOMAIN` -> VPS 的公网 IP 或域名
- `pbk` -> Reality 公钥
- `sid` -> `short_id`
- `sni` -> 和服务端 `tls.server_name` 一致

## 6. 启动方式

服务端：

```bash
sing-box run -c server-vless-reality.json
```

客户端：

```bash
sing-box run -c client-vless-reality-basic.json
```

## 7. 验证方法

建议按下面顺序测试：

1. 先确认客户端可以连上服务端
2. 确认普通国外网站能访问
3. 确认国内网站走直连
4. 如有需要，再检查广告域名是否被规则拦截

## 8. 这套配置适合什么场景

适合：

- 只需要一套基础翻墙配置
- 不想接入 `WARP`
- 不需要给特定站点单独分流
- 想先把最小可用版本跑起来

如果你后面要扩展：

- `OpenAI` 单独分流
- 日本流媒体分流
- 服务端挂 `WARP`
- 手机直导节点和桌面完整配置同时维护

都可以在这套基础版上继续加。
