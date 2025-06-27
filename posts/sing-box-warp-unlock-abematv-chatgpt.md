---
title: "sing-box warp解锁abematv和chatgpt"
date: "2025-06-27"
excerpt: "sing-box warp解锁abematv和chatgpt"
---

1.安装sing-box

curl -fsSL https://sing-box.app/install.sh | sh

2.提取warp中的wg节点,用warp-reg脚本去生成一些信息

bash -c "$(curl -L warp-reg.vercel.app)"

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

3.sing-box服务端配置

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
          "uuid": "19048463-5d7f-4728-9aef-b7bea26ceb30", //sing-box generate uuid
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
            "458f60c8eaa4751f"
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

4.服务管理
systemctl start sing-box

systemctl enable sing-box

systemctl status sing-box

journalctl -u sing-box --output cat -f

5.启用BBR

直接执行如下代码：

echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p

查看执行是否成功：

lsmod | grep bbr

6.sing-box客户端配置

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