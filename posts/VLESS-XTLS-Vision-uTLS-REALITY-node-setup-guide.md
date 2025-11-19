---
title: 'VLESS-XTLS-Vision-uTLS-REALITY Setup Guide'
date: '2025-07-17'
excerpt: 'A guide on setting up a VLESS-XTLS-Vision-uTLS-REALITY node, which replaces traditional TLS with REALITY for enhanced security and privacy.'
---

本配置TLS 由 REALITY 取代，可消除服务端 TLS 指纹特征，仍有前向保密性等，且证书链攻击无效，安全性超越常规 TLS。可指向别人的网站，无需自己买域名、配置 TLS 服务端，更方便，实现向中间人呈现指定 SNI 的全程真实 TLS，可解决 SNI 名单阻断问题。

1. #安装并将 Xray-core 升级到预发布版本

bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install 

2. 服务端配置(修改/usr/local/etc/xray/config.json)

```json
{
  "log": {
    "loglevel": "info"
  },
  "routing": {
    "domainStrategy": "IPIfNonMatch",
    "rules": [
      {
        "type": "field",
        "domain": [
          "geosite:category-ads-all"
        ],
        "outboundTag": "block"
      },
      {
        "type": "field",
        "ip": [
          "geoip:cn"
        ],
        "outboundTag": "block"
      }
    ]
  },
  "inbounds": [
    {
      "listen": "0.0.0.0",
      "port": 443,
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "9f2b4b10-6818-492e-a157-d5131d450c7b", //xray uuid 
            "flow": "xtls-rprx-vision"
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "tcp",
        "security": "reality",
        "realitySettings": {
          "show": true,
          "dest": "www.microsoft.com:443",
          "xver": 0,
          "serverNames": [
            "www.microsoft.com"
          ],
          "privateKey": "M4cZLR81ErNfxnG1fAnNUIATs_UXqe6HR78wINhH7RA", // xray x25519
          "minClientVer": "",
          "maxClientVer": "",
          "maxTimeDiff": 0,
          "shortIds": [
            "b1"
          ]
        }
      },
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "tag": "direct"
    },
    {
      "protocol": "blackhole",
      "tag": "block"
    }
  ],
  "policy": {
    "levels": {
      "0": {
        "handshake": 3,
        "connIdle": 180
      }
    }
  }
}
```

3. #启动xray并查看状态

```bash
systemctl start xray

systemctl enable xray

systemctl restart xray

systemctl status xray
```

4. #启用BBR

直接执行如下代码：

```bash
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```

查看执行是否成功：

```bash
lsmod | grep bbr
```

#目标网站最低标准：国外网站，支持 TLSv1.3 与 H2，域名非跳转。

目标网站是否符合标准检查网站：https://www.ssllabs.com/ssltest/


5. 客户端配置

```json
{
  "log": {
    "loglevel": "info"
  },
  "routing": {
    "domainStrategy": "IPIfNonMatch",
    "rules": [
      {
        "type": "field",
        "domain": [
          "geosite:category-ads-all"
        ],
        "outboundTag": "block"
      },
      {
        "type": "field",
        "domain": [
          "geosite:category-games@cn"
        ],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "domain": [
          "geosite:geolocation-!cn"
        ],
        "outboundTag": "proxy"
      },
      {
        "type": "field",
        "domain": [
          "geosite:cn",
          "geosite:private"
        ],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "ip": [
          "geoip:cn",
          "geoip:private"
        ],
        "outboundTag": "direct"
      }
    ]
  },
  "inbounds": [
    {
      "listen": "127.0.0.1",
      "port": 1081,
      "protocol": "socks",
      "settings": {
        "udp": true
      },
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      }
    },
    {
      "listen": "127.0.0.1",
      "port": 1080,
      "protocol": "http",
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "vless",
      "settings": {
        "vnext": [
          {
            "address": "34.97.64.28",
            "port": 443,
            "users": [
              {
                "id": "30b8effb-37d6-4cd9-b2b9-41092321d87a",
                "flow": "xtls-rprx-vision",
                "encryption": "none"
              }
            ]
          }
        ]
      },
      "streamSettings": {
        "network": "tcp",
        "security": "reality",
        "realitySettings": {
          "show": true,
          "fingerprint": "chrome",
          "serverName": "www.nhk.or.jp",
          "publicKey": "pBp6BExKcDx-tUbZb1BXK8M_b_mOAgcjIiFkzn-dDzw",
          "shortId": "1688888888888888",
          "spiderX": "/xRAY123"
        }
      },
      "tag": "proxy"
    },
    {
      "protocol": "freedom",
      "tag": "direct"
    },
    {
      "protocol": "blackhole",
      "tag": "block"
    }
  ]
}
```