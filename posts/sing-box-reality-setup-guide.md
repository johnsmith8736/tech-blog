---
title: 'Sing-Box Reality 节点搭建教程'
date: '2025-07-17'
excerpt: '本教程将指导您如何从零开始搭建和配置 sing-box Reality 节点，包括服务端和客户端的详细设置。'
tags: ["sing-box", "REALITY", "VLESS", "proxy", "setup"]
---

## **1. 手动安装**

**执行以下命令来安装 sing-box：**

```bash
bash <(curl -fsSL https://sing-box.app/deb-install.sh)
```

## **2. sing-box 服务端配置**

**在 `/etc/sing-box/config.json` 中写入以下配置。请务必替换 `server_name`、`private_key` 和 `uuid` 为您自己的信息。**

```json
{
  "log": {
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
    "strategy": "ipv4_only"
  },
  "inbounds": [
    {
      "type": "vless",
      "tag": "vless-in",
      "listen": "::",
      "listen_port": 443,
      "users": [
        {
          "uuid": "d76342ab-9f10-45ab-a573-9a27c47cdefd",
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
          "private_key": "SOeAsvoPhjty-rrwxVW88At7wm3pxGvfLt9gBkC4rlc",
          "short_id": [
            "c845cf683a33a580"
          ]
        }
      }
    }
  ],
  "outbounds": [
    {
      "type": "direct",
      "tag": "direct"
    }
  ],
  "route": {
    "rules": [
      {
        "protocol": ["dns"],
        "action": "hijack-dns"
      },
      {
        "rule_set": ["geosite-category-ads-all"],
        "action": "reject"
      },
      {
        "rule_set": ["geoip-cn", "geosite-cn"],
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
        "download_detour": "direct",
        "update_interval": "24h"
      },
      {
        "tag": "geosite-cn",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
        "download_detour": "direct",
        "update_interval": "24h"
      },
      {
        "tag": "geosite-category-ads-all",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-category-ads-all.srs",
        "download_detour": "direct",
        "update_interval": "24h"
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

## **3. 服务管理**

**使用 systemd 管理 sing-box 服务：**

```bash
# 启动服务
systemctl start sing-box

# 设置开机自启
systemctl enable sing-box

# 查看服务状态
systemctl status sing-box

# 查看实时日志
journalctl -u sing-box --output cat -f
```

## **4. 启用 BBR**

**为了优化网络性能，建议启用 BBR 拥塞控制算法：**

```bash
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

**执行后，使用以下命令检查 BBR 是否成功启用：**

```bash
lsmod | grep bbr
```

## **5. sing-box 客户端配置**

**这是一个示例客户端配置，请根据您的服务端信息进行修改：**

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
    "strategy": "ipv4_only"
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
      "sniff": true,
      "users": []
    }
  ],
  "outbounds": [
    {
      "tag": "proxy",
      "type": "selector",
      "outbounds": [
        "auto",
        "direct",
        "sing-box-reality"
      ]
    },
    {
      "type": "vless",
      "tag": "sing-box-reality",
      "server": "141.147.179.207",
      "server_port": 443,
      "uuid": "d76342ab-9f10-45ab-a573-9a27c47cdefd",
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
          "public_key": "ZlTqXYDaMSa3EuiGqa7k8kzlAQ3o3ron_CNndNRc52U",
          "short_id": "c845cf683a33a580"
        }
      },
      "packet_encoding": "xudp"
    },
    {
      "type": "direct",
      "tag": "direct"
    },
    {
      "tag": "auto",
      "type": "urltest",
      "outbounds": [
        "sing-box-reality"
      ],
      "url": "http://www.gstatic.com/generate_204",
      "interval": "1m",
      "tolerance": 50
    }
  ],
  "route": {
    "rules": [
      {
        "protocol": ["dns"],
        "action": "hijack-dns"
      },
      {
        "inbound": ["tun-in", "mixed-in"],
        "action": "sniff"
      },
      {
        "rule_set": ["geosite-category-ads-all"],
        "action": "reject"
      },
      {
        "ip_is_private": true,
        "action": "route",
        "outbound": "direct"
      },
      {
        "domain_suffix": [".cn"],
        "action": "route",
        "outbound": "direct"
      },
      {
        "rule_set": ["geoip-cn", "geosite-cn", "geosite-private"],
        "action": "route",
        "outbound": "direct"
      },
      {
        "clash_mode": "direct",
        "action": "route",
        "outbound": "direct"
      },
      {
        "clash_mode": "global",
        "action": "route",
        "outbound": "proxy"
      },
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
        "update_interval": "24h"
      },
      {
        "tag": "geosite-cn",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-cn.srs",
        "download_detour": "proxy",
        "update_interval": "24h"
      },
      {
        "tag": "geosite-private",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-private.srs",
        "download_detour": "proxy",
        "update_interval": "24h"
      },
      {
        "tag": "geosite-category-ads-all",
        "type": "remote",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-category-ads-all.srs",
        "download_detour": "proxy",
        "update_interval": "24h"
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
