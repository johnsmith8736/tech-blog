---
title: "sing-box warp解锁abematv和chatgpt"
date: "2025-06-27"
excerpt: "sing-box warp解锁abematv和chatgpt"
---
**sing-box简介**

**Sing-box 是一个开源的通用代理平台，以其高性能、灵活性和广泛的协议支持而著称，被誉为网络代理的“瑞士军刀”。它支持多种操作系统，包括 Windows、macOS、Linux、Android 和 iOS，适用于创建代理服务器、客户端和透明代理。**

**广泛的协议支持：支持 Shadowsocks、Vmess、Trojan、Hysteria、ShadowTLS、VLESS、Socks、HTTP 等多种代理协议，满足多样化的网络需求。**

**灵活的配置：使用 JSON 格式配置文件，允许用户自定义复杂的路由规则和网络流量管理。配置文件包括日志、DNS、入口、出口、路由等模块，功能强大但配置相对复杂。**

**跨平台兼容性：支持多平台运行，Android 版本通过 VpnService 提供 TUN 透明代理功能，iOS 版本则支持本地和远程配置文件管理，操作简便。**

**高效性能：设计注重性能优化，支持一键安装和自动化证书管理（如 Let’s Encrypt），确保高效和安全的网络连接。**

**开源与社区支持：遵循 GNU General Public License v3.0，由 SagerNet 开发，拥有活跃的社区支持和定期更新。**

**WARP 和 WireGuard 节点简介**

**Cloudflare WARP 是一个基于 WireGuard 协议的 VPN 服务，通过 Cloudflare 的全球网络提供安全、高效的网络连接，支持 IPv4 和 IPv6 双栈，适用于隐私保护、网络加速及绕过地域限制。WARP 使用 Cloudflare 的 BoringTun（WireGuard 的用户空间实现），通过其边缘节点加密并优化网络流量。**

**WireGuard 节点 是指 WARP 使用的 WireGuard 协议配置中的服务器端点（endpoint），通常表现为一个 IP 地址或域名（如 engage.cloudflareclient.com:2408）以及对应的公钥和私钥对，用于建立安全的点对点隧道连接。提取 WARP 的 WireGuard 节点可以让用户在非官方 WARP 客户端的设备上（如 Linux VPS 或路由器）使用 WARP 服务，增加灵活性。**

**ABEMA 简介**

**ABEMA 是一家日本流媒体服务平台，最初于2016年4月11日以 AbemaTV 的名称推出，2020年4月更名为 ABEMA。由 CyberAgent（占股55.2%）和 TV Asahi（占股36.8%）共同创立，定位为“新未来电视”，结合了传统电视的线性直播与现代视频点播（VOD）的优势，旨在创新电视观看体验。**

**ChatGPT 简介**

**ChatGPT 是由 OpenAI 开发的一种基于 GPT（生成式预训练变换器）架构的对话型人工智能模型，专为自然语言理解和生成设计，广泛应用于回答问题、任务协助、内容创作等场景。**

**本教程使用sing-box+vless+reality+warp解锁流媒体和chatgpt。**

**搭建需要linux基础知识，vim使用，拥有自己的vps（GCP/AWS）。**

**1.安装sing-box**

**使用一键脚本在VPS上安装sing-box**

```bash
curl -fsSL https://sing-box.app/install.sh | sh
```

**2.提取warp中的wg节点,用warp-reg脚本去生成一些信息**

**保存生成的信息，将相应项填到服务端配置endpoints里**

bash -c "$(curl -L warp-reg.vercel.app)"

```bash
bash -c "$(curl -L warp-reg.vercel.app)"
```

```json
{
    "endpoint": {
       "v4": "162.159.192.2",
       "v6": "[2606:4700:d0::a29f:c002]"
    },
    "reserved_dec": [206, 21, 196],
    "reserved_hex": "0xce15c4",
    "reserved_str": "zhXE",
    "private_key": "ADXRcnIrMgRbrb3tIRnn5whR0Zrfkyzz9UcEZWP00kw=",
    "public_key": "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=",
    "v4": "172.16.0.2",
    "v6": "2606:4700:110:8a7f:9129:9da5:7dc2:1431"
}
```

**3.sing-box服务端配置**

```json
{
  "log": {
    "disabled": false,
    "level": "info",
    "timestamp": true
  },
  "dns": {
    "servers": [
      {
        "tag": "alidns",
        "address": "https://223.5.5.5/dns-query",
        "strategy": "ipv4_only",
        "detour": "direct"
      },
      {
        "tag": "cloudflare",
        "address": "https://1.1.1.1/dns-query",
        "strategy": "ipv4_only",
        "detour": "direct"
      },
      {
        "tag": "block",
        "address": "rcode://success"
      }
    ],
    "rules": [
      {
        "rule_set": [
          "geosite-cn"
        ],
        "server": "alidns",
        "rule_set_ip_cidr_accept_empty": true
      },
      {
        "rule_set": [
          "geosite-category-ads-all"
        ],
        "server": "block",
        "rule_set_ip_cidr_accept_empty": true
      }
    ],
    "final": "cloudflare",
    "strategy": "ipv4_only",
    "disable_cache": false,
    "disable_expire": false
  },
  "inbounds": [
    { 
      "type": "vless",
      "tag": "vless-in",
      "listen": "::",
      "listen_port": 443,
      "users": [
        {
          "uuid": "19048463-5d7f-4728-9aef-b7bea26ceb30", // sing-box generate uuid
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
          "private_key": "iJssLygdap0yGTzg5H7krBTOEqr9ge1sOXJ8H4R2MXs", // sing-box generate reality-keypair
          "short_id": [
            "458f60c8eaa4751f" // sing-box generate rand 8 --hex
          ]
        }
      }
    }
  ],
  "outbounds": [
    {"type": "direct", "tag": "direct"}
  ],
  "endpoints": [
    {
      "type": "wireguard",
      "tag": "warp",
      "address": [
        "172.16.0.2/32",
        "2606:4700:110:8a7f:9129:9da5:7dc2:1431/128"
      ],
      "private_key": "ADXRcnIrMgRbrb3tIRnn5whR0Zrfkyzz9UcEZWP00kw=",
      "peers": [
        {
          "public_key": "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=",
          "allowed_ips": [
            "0.0.0.0/0",
            "::/0"
          ],
          "address": "162.159.192.2",
          "port": 2408,
          "reserved": [206, 21, 196]
        }
      ],
      "mtu": 1280
    }
  ],
  "route": {
    "rules": [
      {"protocol": ["dns"], "action": "hijack-dns"},
      {"inbound": ["vless-in"], "action": "sniff"},
      {"rule_set": ["geosite-category-ads-all"], "action": "reject"},
      {"ip_is_private": true, "action": "route", "outbound": "direct"},
      {"rule_set": ["geoip-cn", "geosite-cn"], "action": "route", "outbound": "direct"},
      {"rule_set": ["geosite-openai"], "action": "route", "outbound": "warp"},
      {"rule_set": ["geosite-abema"], "action": "route", "outbound": "warp"}
    ],
    "rule_set": [
      {
        "tag": "geoip-cn",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs",
        "download_detour": "direct",
        "update_interval": "1d"
      },
      {
        "tag": "geosite-cn",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
        "download_detour": "direct",
        "update_interval": "1d"
      },
      {
        "tag": "geosite-category-ads-all",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-category-ads-all.srs",
        "download_detour": "direct",
        "update_interval": "1d"
      },
      {
        "tag": "geosite-openai",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/openai.srs",
        "download_detour": "direct",
        "update_interval": "1d"
      },
      {
        "tag": "geosite-abema",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/abema.srs",
        "download_detour": "direct",
        "update_interval": "1d"
      }
    ],
    "auto_detect_interface": true,
    "final": "direct"
  },
  "experimental": {
    "cache_file": {
      "enabled": true,
      "path": "cache.db",
      "cache_id": "mycacheid",
      "store_fakeip": true
    }
  }
}
```

**4.服务管理**
```bash
systemctl start sing-box
```

```bash
systemctl enable sing-box
```

```bash
systemctl status sing-box
```

```bash
journalctl -u sing-box --output cat -f
```

**5.启用BBR**

**直接执行如下代码：**

```bash
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

**查看执行是否成功：**

```bash
lsmod | grep bbr
```

**6.sing-box客户端配置**

```json
{
  "dns": {
    "servers": [
      {
        "tag": "alidns",
        "address": "https://223.5.5.5/dns-query",
        "strategy": "ipv4_only",
        "detour": "direct"
      },
      {
        "tag": "cloudflare",
        "address": "https://1.1.1.1/dns-query",
        "strategy": "ipv4_only",
        "detour": "proxy"
      },
      {
        "tag": "block",
        "address": "rcode://success"
      }
    ],
    "rules": [
      {
        "rule_set": ["geosite-cn"],
        "server": "alidns",
        "rule_set_ip_cidr_accept_empty": true
      },
      {
        "rule_set": ["geosite-category-ads-all"],
        "server": "block",
        "rule_set_ip_cidr_accept_empty": true
      }
    ],
    "final": "cloudflare",
    "strategy": "ipv4_only",
    "disable_cache": false,
    "disable_expire": false
  },
  "inbounds": [
    {
      "type": "tun",
      "tag": "tun-in",
      "address": "172.19.0.1/30",
      "mtu": 1500,
      "auto_route": true,
      "strict_route": true,
      "stack": "system",
      "platform": {
        "http_proxy": {
          "enabled": true,
          "server": "127.0.0.1",
          "server_port": 2080
        }
      }
    },
    {
      "type": "mixed",
      "tag": "mixed-in",
      "listen": "127.0.0.1",
      "listen_port": 2080,
      "users": []
    }
  ],
  "outbounds": [
    {
      "tag": "proxy",
      "type": "selector",
      "outbounds": ["auto", "direct", "sing-box-reality"]
    },
    {
      "type": "vless",
      "tag": "sing-box-reality",
      "server": "152.70.99.80",
      "server_port": 443,
      "uuid": "19048463-5d7f-4728-9aef-b7bea26ceb30",
      "flow": "xtls-rprx-vision",
      "tls": {
        "enabled": true,
        "server_name": "www.nhk.or.jp",
        "utls": {
          "enabled": true,
          "fingerprint": "chrome"
        },
        "reality": {
          "enabled": true,
          "public_key": "YKzc-eJCLI3fsxBPcW4xrocBcynan0CshD_zI7hpGWY",
          "short_id": "458f60c8eaa4751f"
        }
      },
      "packet_encoding": "xudp"
    },
    {"type": "direct", "tag": "direct"},
    {
      "tag": "auto",
      "type": "urltest",
      "outbounds": ["sing-box-reality"],
      "url": "http://www.gstatic.com/generate_204",
      "interval": "1m",
      "tolerance": 50
    }
  ],
  "route": {
    "rules": [
      {"protocol": ["dns"], "action": "hijack-dns"},
      {"inbound": ["tun-in", "mixed-in"], "action": "sniff"},
      {"rule_set": ["geosite-category-ads-all"], "action": "reject"},
      {"ip_is_private": true, "action": "route", "outbound": "direct"},
      {"domain_suffix": [".cn"], "action": "route", "outbound": "direct"},
      {"rule_set": ["geoip-cn", "geosite-cn", "geosite-private"], "action": "route", "outbound": "direct"},
      {"rule_set": ["geosite-openai"], "action": "route", "outbound": "proxy"},
      {"rule_set": ["geosite-abema"], "action": "route", "outbound": "proxy"},
      {"clash_mode": "direct", "action": "route", "outbound": "direct"},
      {"clash_mode": "global", "action": "route", "outbound": "proxy"},
      {
        "domain": [
          "clash.razord.top",
          "yacd.metacubex.one",
          "yacd.haishan.me",
          "d.metacubex.one"
        ],
        "action": "route",
        "outbound": "direct"
      }
    ],
    "rule_set": [
      {
        "tag": "geoip-cn",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs",
        "download_detour": "proxy",
        "update_interval": "1d"
      },
      {
        "tag": "geosite-cn",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
        "download_detour": "proxy",
        "update_interval": "1d"
      },
      {
        "tag": "geosite-private",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-private.srs",
        "download_detour": "proxy",
        "update_interval": "1d"
      },
      {
        "tag": "geosite-category-ads-all",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-category-ads-all.srs",
        "download_detour": "proxy",
        "update_interval": "1d"
      },
      {
        "tag": "geosite-openai",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/openai.srs",
        "download_detour": "proxy",
        "update_interval": "1d"
      },
      {
        "tag": "geosite-abema",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/abema.srs",
        "download_detour": "proxy",
        "update_interval": "1d"
      }
    ],
    "auto_detect_interface": true,
    "final": "proxy"
  },
  "experimental": {
    "clash_api": {
      "external_controller": "0.0.0.0:9090",
      "external_ui": "dashboard",
      "secret": "",
      "default_mode": "rule",
      "access_control_allow_origin": [
        "http://127.0.0.1",
        "http://yacd.haishan.me"
      ],
      "access_control_allow_private_network": true
    },
    "cache_file": {
      "enabled": true,
      "path": "cache.db",
      "cache_id": "mycacheid",
      "store_fakeip": true
    }
  }
}
```
