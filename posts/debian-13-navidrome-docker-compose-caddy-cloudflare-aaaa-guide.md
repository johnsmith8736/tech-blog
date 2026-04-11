---
title: "Debian 13 上使用 Docker Compose 部署 Navidrome + Caddy HTTPS + Cloudflare AAAA 自动更新"
date: "2026-04-11"
excerpt: "在 Debian 13 主机上使用 Docker Compose 部署 Navidrome，通过 Caddy 提供 HTTPS 反向代理，并使用 systemd 定时自动更新 Cloudflare AAAA 记录。"
tags: ["Debian", "Docker", "Docker Compose", "Navidrome", "Caddy", "Cloudflare", "systemd", "IPv6"]
category: "Linux"
section: "linux"
subsection: "self-hosting"
---

# Debian 13 上使用 Docker Compose 部署 Navidrome + Caddy HTTPS + Cloudflare AAAA 自动更新

本文整理一套比较实用的家庭媒体自托管方案：

- 系统使用 `Debian 13`
- 音乐服务使用 `Navidrome`
- 容器编排使用 `Docker Compose`
- HTTPS 反向代理使用 `Caddy`
- 域名解析使用 `Cloudflare`
- 通过 `systemd timer` 定时更新 `AAAA` 记录

适合的场景是：主机有公网 IPv6，但 IPv6 地址可能变化，希望通过域名稳定访问自己的 Navidrome 服务。

## 1. 目标拓扑

本文示例假设：

- 域名：`music.example.com`
- Cloudflare Zone：`example.com`
- Navidrome 容器内部端口：`4533`
- Caddy 对外监听：`80` 和 `443`
- Docker 项目目录：`/opt/navidrome`
- 音乐目录：`/srv/music`

访问链路如下：

```text
浏览器 / App
    -> https://music.example.com
    -> Caddy
    -> Navidrome:4533
```

另外通过一个 `systemd timer` 定时执行脚本：

```text
主机当前公网 IPv6
    -> 调用 Cloudflare API
    -> 更新 music.example.com 的 AAAA 记录
```

## 2. 安装 Docker 与 Compose

先更新系统：

```bash
sudo apt update
sudo apt upgrade -y
```

安装 Docker：

```bash
sudo apt install -y docker.io docker-compose-v2
```

启用并启动 Docker：

```bash
sudo systemctl enable --now docker
```

确认版本：

```bash
docker --version
docker compose version
```

## 3. 创建目录结构

创建项目目录、数据目录和 Caddy 目录：

```bash
sudo mkdir -p /opt/navidrome/{data,caddy}
sudo mkdir -p /srv/music
```

如果你的音乐已经放在别处，可以跳过 `/srv/music`，后面把挂载路径改成自己的实际目录即可。

## 4. 编写 Docker Compose 配置

创建文件：

`/opt/navidrome/docker-compose.yml`

内容如下：

```yaml
services:
  navidrome:
    image: deluan/navidrome:latest
    container_name: navidrome
    restart: unless-stopped
    user: "1000:1000"
    environment:
      ND_SCANSCHEDULE: 1h
      ND_LOGLEVEL: info
      ND_SESSIONTIMEOUT: 24h
      ND_BASEURL: ""
      ND_ENABLEINSIGHTSCOLLECTOR: "false"
    volumes:
      - ./data:/data
      - /srv/music:/music:ro
    expose:
      - "4533"

  caddy:
    image: caddy:latest
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - navidrome

volumes:
  caddy_data:
  caddy_config:
```

说明：

- `navidrome` 不直接映射到宿主机端口，而是只暴露给 Docker 网络中的 `caddy`
- `user: "1000:1000"` 需要和你的实际用户 UID/GID 一致
- `/srv/music` 以只读方式挂载，避免误操作

如果你不确定自己的 UID/GID，可以执行：

```bash
id
```

## 5. 编写 Caddy 配置

创建文件：

`/opt/navidrome/caddy/Caddyfile`

内容如下：

```caddy
music.example.com {
    encode zstd gzip

    reverse_proxy navidrome:4533
}
```

这份配置已经够用，Caddy 会自动申请和续签 HTTPS 证书。

前提是：

- `music.example.com` 已正确解析到这台服务器
- `80` 和 `443` 入站端口可访问

## 6. 启动 Navidrome 与 Caddy

进入项目目录：

```bash
cd /opt/navidrome
```

启动容器：

```bash
sudo docker compose up -d
```

查看状态：

```bash
sudo docker compose ps
```

查看日志：

```bash
sudo docker compose logs -f navidrome
sudo docker compose logs -f caddy
```

首次访问：

```text
https://music.example.com
```

首次打开 Navidrome 时会要求创建管理员账号。

## 7. 创建 Cloudflare API Token

为了自动更新 `AAAA` 记录，需要在 Cloudflare 创建一个 API Token。

建议最小权限如下：

- `Zone` -> `DNS` -> `Edit`
- `Zone` -> `Zone` -> `Read`

Zone 范围只选择你的目标域名，例如：

- `example.com`

然后保存生成的 Token。

本文后续示例中使用以下变量：

- `CF_API_TOKEN`
- `CF_ZONE_NAME=example.com`
- `CF_RECORD_NAME=music.example.com`

## 8. 编写 Cloudflare AAAA 更新脚本

创建脚本：

`/usr/local/bin/update-cloudflare-aaaa.sh`

内容如下：

```bash
#!/usr/bin/env bash
set -euo pipefail

CF_API_TOKEN="REPLACE_WITH_YOUR_TOKEN"
CF_ZONE_NAME="example.com"
CF_RECORD_NAME="music.example.com"
CF_TTL=120
CF_PROXIED=false

get_public_ipv6() {
  curl -6 -fsS https://api64.ipify.org
}

CURRENT_IPV6="$(get_public_ipv6)"

if [[ -z "${CURRENT_IPV6}" ]]; then
  echo "Failed to get public IPv6"
  exit 1
fi

ZONE_ID="$(curl -fsS -X GET "https://api.cloudflare.com/client/v4/zones?name=${CF_ZONE_NAME}" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" | jq -r '.result[0].id')"

if [[ -z "${ZONE_ID}" || "${ZONE_ID}" == "null" ]]; then
  echo "Failed to get Cloudflare zone id"
  exit 1
fi

RECORD_JSON="$(curl -fsS -X GET "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?type=AAAA&name=${CF_RECORD_NAME}" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json")"

RECORD_ID="$(echo "${RECORD_JSON}" | jq -r '.result[0].id')"
OLD_IPV6="$(echo "${RECORD_JSON}" | jq -r '.result[0].content // empty')"

if [[ -n "${OLD_IPV6}" && "${OLD_IPV6}" == "${CURRENT_IPV6}" ]]; then
  echo "AAAA record is up to date: ${CURRENT_IPV6}"
  exit 0
fi

PAYLOAD="$(jq -n \
  --arg type "AAAA" \
  --arg name "${CF_RECORD_NAME}" \
  --arg content "${CURRENT_IPV6}" \
  --argjson ttl "${CF_TTL}" \
  --argjson proxied "${CF_PROXIED}" \
  '{type: $type, name: $name, content: $content, ttl: $ttl, proxied: $proxied}')"

if [[ -n "${RECORD_ID}" && "${RECORD_ID}" != "null" ]]; then
  curl -fsS -X PUT "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${RECORD_ID}" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "${PAYLOAD}" >/dev/null
  echo "Updated AAAA record to ${CURRENT_IPV6}"
else
  curl -fsS -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "${PAYLOAD}" >/dev/null
  echo "Created AAAA record with ${CURRENT_IPV6}"
fi
```

给脚本执行权限：

```bash
sudo chmod +x /usr/local/bin/update-cloudflare-aaaa.sh
```

这个脚本做了几件事：

- 先获取主机当前公网 IPv6
- 读取 Cloudflare 的 Zone ID
- 查询 `music.example.com` 的现有 `AAAA` 记录
- 如果地址没有变化则直接退出
- 如果地址变了就调用 Cloudflare API 更新
- 如果记录不存在则自动创建

## 9. 安装脚本依赖

这个脚本依赖 `curl` 和 `jq`：

```bash
sudo apt install -y curl jq
```

先手动测试一次：

```bash
sudo /usr/local/bin/update-cloudflare-aaaa.sh
```

如果输出类似下面内容，就说明脚本正常：

```text
Updated AAAA record to 2408:xxxx:xxxx:xxxx::1234
```

或者：

```text
AAAA record is up to date: 2408:xxxx:xxxx:xxxx::1234
```

## 10. 使用 systemd 定时执行

创建 service：

`/etc/systemd/system/cloudflare-aaaa-update.service`

```ini
[Unit]
Description=Update Cloudflare AAAA DNS record
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/update-cloudflare-aaaa.sh
```

创建 timer：

`/etc/systemd/system/cloudflare-aaaa-update.timer`

```ini
[Unit]
Description=Run Cloudflare AAAA updater every 10 minutes

[Timer]
OnBootSec=2min
OnUnitActiveSec=10min
Unit=cloudflare-aaaa-update.service
Persistent=true

[Install]
WantedBy=timers.target
```

重新加载并启用：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now cloudflare-aaaa-update.timer
```

查看 timer 状态：

```bash
systemctl status cloudflare-aaaa-update.timer
systemctl list-timers --all | grep cloudflare-aaaa-update
```

查看最近执行日志：

```bash
journalctl -u cloudflare-aaaa-update.service -n 50 --no-pager
```

## 11. 首次上线检查清单

建议按这个顺序检查：

1. `docker compose ps` 确认 `navidrome` 和 `caddy` 都已运行
2. `curl -6 https://music.example.com` 确认域名能通过 IPv6 访问
3. 浏览器访问 `https://music.example.com`
4. `journalctl -u cloudflare-aaaa-update.service` 确认 AAAA 更新脚本执行成功
5. 在 Cloudflare 后台确认 `music.example.com` 的 `AAAA` 记录已更新到当前公网 IPv6

## 12. 常见问题

### 12.1 Caddy 无法签发证书

重点检查：

- `music.example.com` 是否已经解析到服务器
- `80` 和 `443` 是否被防火墙拦截
- 是否被上游路由器错误转发

### 12.2 Navidrome 容器启动后扫描不到音乐

重点检查：

- `/srv/music` 是否真的有音乐文件
- 挂载路径是否正确
- `1000:1000` 是否有权限读取音乐目录

### 12.3 Cloudflare AAAA 更新失败

重点检查：

- Token 是否有 `DNS Edit` 权限
- Zone 名称和记录名称是否写对
- 主机是否真的有公网 IPv6
- `curl -6 https://api64.ipify.org` 是否能返回 IPv6

### 12.4 Cloudflare 是否要开启代理

如果你只是想做普通的家庭服务发布，`AAAA` 记录通常可以先设为：

```text
DNS only
```

也就是本文脚本中的：

```bash
CF_PROXIED=false
```

这样更直接，也更容易排错。

## 13. 可选优化

你还可以继续加这些优化：

- 给 Navidrome 单独增加备份策略
- 把 Cloudflare Token 放进 root-only 可读的环境文件，而不是直接写进脚本
- 为 Caddy 增加访问日志
- 使用防火墙只开放必要端口
- 给宿主机配置自动安全更新

如果你要把 Token 从脚本里分离，可以改成从环境文件读取，例如：

`/etc/default/cloudflare-aaaa-update`

```bash
CF_API_TOKEN="REPLACE_WITH_YOUR_TOKEN"
CF_ZONE_NAME="example.com"
CF_RECORD_NAME="music.example.com"
```

然后在 service 中写：

```ini
[Service]
Type=oneshot
EnvironmentFile=/etc/default/cloudflare-aaaa-update
ExecStart=/usr/local/bin/update-cloudflare-aaaa.sh
```

脚本里再改为读取环境变量即可。这种做法比把 Token 直接硬编码进脚本更稳妥。

## 总结

这套方案的核心思路很简单：

- 用 `Docker Compose` 部署 `Navidrome`
- 用 `Caddy` 提供自动 HTTPS
- 用 `systemd timer` 定时更新 `Cloudflare AAAA` 记录

这样即使家庭网络的公网 IPv6 地址变化，`music.example.com` 也能持续指向你的 Debian 13 主机，外部访问 Navidrome 时不会因为地址变化而失效。
