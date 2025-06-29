---
title: "JSON 语法高亮测试"
date: "2025-06-29"
excerpt: "测试 JSON 代码的语法高亮效果"
---

# JSON 语法高亮测试

这是一个测试文件，用来验证 JSON 代码的语法高亮效果。

## 带语言标识的 JSON

```json
{
  "name": "tech-blog",
  "version": "1.0.0",
  "description": "一个技术博客",
  "author": "Stanley Chan",
  "dependencies": {
    "next": "^15.3.4",
    "react": "^19.0.0",
    "highlight.js": "^11.11.1"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "keywords": ["blog", "nextjs", "react"],
  "license": "MIT",
  "private": true,
  "enabled": true,
  "count": 42,
  "config": null
}
```

## 不带语言标识的 JSON（应该自动检测）

```
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
  "v6": "2606:4700:110:8a7f:9129:9da5:7dc2:1431",
  "enabled": true,
  "port": 2408,
  "timeout": 30.5,
  "debug": false,
  "features": null
}
```

## 复杂的 JSON 配置

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
        "tag": "cloudflare",
        "address": "https://1.1.1.1/dns-query",
        "strategy": "ipv4_only",
        "detour": "direct"
      }
    ],
    "rules": [
      {
        "rule_set": ["geosite-cn"],
        "server": "alidns",
        "rule_set_ip_cidr_accept_empty": true
      }
    ],
    "final": "cloudflare",
    "strategy": "ipv4_only",
    "disable_cache": false,
    "disable_expire": false
  }
}
```

现在 JSON 代码应该有以下颜色：
- **键名**：蓝色 (#79c0ff)
- **字符串值**：浅蓝色 (#a5d6ff)  
- **数字**：蓝色 (#79c0ff)
- **布尔值和 null**：粉色 (#ff7b72)
- **标点符号**：白色 (#e6edf3)
