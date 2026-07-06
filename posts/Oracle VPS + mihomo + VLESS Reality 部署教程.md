# Oracle VPS + mihomo + VLESS Reality 部署教程

> 本教程记录了在 Oracle Cloud VPS 上使用 Docker Compose 部署 mihomo(Clash Meta 内核),并通过 VLESS + Reality 协议提供代理服务的完整流程。

## 目录

- [一、前置条件](#一前置条件)
- [二、服务端部署](#二服务端部署)
- [三、生成 Reality 密钥对](#三生成-reality-密钥对)
- [四、服务端完整配置文件](#四服务端完整配置文件)
- [五、网络与防火墙配置](#五网络与防火墙配置)
- [六、客户端完整配置文件](#六客户端完整配置文件)
- [七、验证与测试](#七验证与测试)
- [八、常见问题排查](#八常见问题排查)
- [九、关于 WARP 解锁流媒体的说明](#九关于-warp-解锁流媒体的说明)

---

## 一、前置条件

- 一台 Oracle Cloud VPS(本教程示例基于东京 region,已装好 Ubuntu 22.04/24.04)
- 已安装 Docker + Docker Compose v2
- 服务器有公网 IP,并在 Oracle 云控制台开放了对应端口

---

## 二、服务端部署

### 2.1 目录结构

```
mihomo/
├── docker-compose.yml
└── config.yaml
```

### 2.2 docker-compose.yml

```yaml
services:
  mihomo:
    image: metacubex/mihomo:latest
    container_name: mihomo
    restart: unless-stopped
    network_mode: "host"
    volumes:
      - ./config.yaml:/root/.config/mihomo/config.yaml
```

> 使用 `network_mode: host` 是为了让容器直接使用宿主机网络,简化端口映射和后续可能的本地服务调用。

### 2.3 启动容器

```bash
mkdir -p ~/mihomo
cd ~/mihomo
# 将 docker-compose.yml 和 config.yaml 放入此目录后执行:
docker compose up -d
```

---

## 三、生成 Reality 密钥对

Reality 协议需要一对密钥(公钥/私钥)和一个 short-id,mihomo 镜像自带生成工具。

### 3.1 生成密钥对

```bash
docker exec mihomo /mihomo generate reality-keypair
```

输出示例:
```
PrivateKey: <私钥,填入服务端配置>
PublicKey: <公钥,填入客户端配置>
```

> 如果报错 `executable file not found`,说明该镜像版本可执行文件路径不同,可以先查找:
> ```bash
> docker exec -it mihomo sh
> find / -iname "*mihomo*" -type f 2>/dev/null
> ```

### 3.2 生成 UUID

```bash
docker exec mihomo /mihomo generate uuid
```

### 3.3 生成 short-id

```bash
openssl rand -hex 8
```

**请务必保存好以下四项信息,后续配置都要用到:**

| 项目 | 用途 |
|---|---|
| PrivateKey | 服务端 `reality-config` 使用 |
| PublicKey | 客户端 `reality-opts` 使用 |
| UUID | 服务端和客户端必须一致 |
| short-id | 服务端和客户端必须一致 |

---

## 四、服务端完整配置文件

`config.yaml`(放在 `~/mihomo/config.yaml`):

```yaml
mixed-port: 7890
allow-lan: false
external-controller: 127.0.0.1:9090

listeners:
  - name: vless-in
    type: vless
    listen: 0.0.0.0
    port: 443
    users:
      - username: myuser
        uuid: "替换为你的UUID"
        flow: xtls-rprx-vision
    reality-config:
      dest: "www.nhk.or.jp:443"
      private-key: "替换为你的PrivateKey"
      server-names:
        - "www.nhk.or.jp"
      short-id:
        - ""
        - "替换为你的short-id"

dns:
  enable: true
  nameserver:
    - 223.5.5.5
    - 119.29.29.29
  fallback:
    - https://1.1.1.1/dns-query
    - https://8.8.8.8/dns-query

proxies: []

rules:
  - MATCH,DIRECT
```

### 关键字段说明

- **`dest`**:伪装的目标网站,格式必须是 `域名:端口`,建议选择访问量大、稳定在线的知名网站(如 `www.nhk.or.jp`、`www.microsoft.com` 等)。
- **`server-names`**:必须和 `dest` 里的域名保持一致,且客户端的 `servername` 也要跟这里完全一致。
- **`short-id`** 支持配置多个(数组形式),方便区分不同客户端。
- **`proxies: []`**:当前配置不使用任何出站代理,所有流量都从 VPS 自身网络直接出去(`MATCH,DIRECT`)。

### 写入配置文件的推荐方式

为避免手动复制粘贴时被编辑器/聊天工具自动转换格式(例如把纯文本域名转成 Markdown 链接),建议用 heredoc 方式直接写入,一次成型:

```bash
cd ~/mihomo

cat > config.yaml << 'EOF'
# 把上面的完整配置内容粘贴在这里
EOF
```

修改后重启容器:

```bash
docker compose restart mihomo
docker logs mihomo | tail -20
```

正常启动应看到:
```
level=info msg="Vless[vless-in] proxy listening at: [::]:443"
```

---

## 五、网络与防火墙配置

Oracle 云默认是白名单防火墙模式,监听端口不代表外部真的能连进来,需要两层都放行。

### 5.1 系统防火墙(如果启用了 ufw)

```bash
sudo ufw allow 443/tcp
sudo ufw status
```

### 5.2 Oracle 云控制台安全列表

进入:`网络(Networking) → 虚拟云网络(VCN) → 你的VCN → 安全列表(Security Lists) → 默认安全列表 → 添加入站规则`

添加规则:
- **Source CIDR**: `0.0.0.0/0`
- **IP Protocol**: TCP
- **Destination Port Range**: `443`

### 5.3 验证端口监听状态

```bash
ss -tlnp | grep 443
```

应看到类似:
```
LISTEN 0 4096 *:443 users:(("mihomo",pid=xxxx,fd=6))
```

### 5.4 从外部验证连通性

在你自己的电脑上(不是 VPS):

```bash
# Linux/Mac
nc -zv 你的VPS公网IP 443

# Windows PowerShell
Test-NetConnection -ComputerName 你的VPS公网IP -Port 443
```

---

## 六、客户端完整配置文件

适用于 Clash Meta 内核的客户端(Clash Verge、FlClash、Stash 等)。

```yaml
mixed-port: 7890
allow-lan: true
mode: rule
log-level: info

dns:
  enable: true
  ipv6: false
  enhanced-mode: fake-ip
  default-nameserver:
    - 223.5.5.5
    - 119.29.29.29
  nameserver:
    - https://1.1.1.1/dns-query
    - https://8.8.8.8/dns-query
  fallback:
    - https://1.1.1.1/dns-query
    - https://8.8.8.8/dns-query
  nameserver-policy:
    "geosite:cn":
      - 223.5.5.5
      - 119.29.29.29
  fake-ip-filter:
    - "*.cn"
    - "+.cn"
    - "geosite:cn"
    - "*.lan"

proxies:
  - name: "VPS"
    type: vless
    server: 你的VPS公网IP
    port: 443
    uuid: "替换为你的UUID(与服务端一致)"
    network: tcp
    tls: true
    udp: true
    flow: xtls-rprx-vision
    servername: www.nhk.or.jp
    client-fingerprint: chrome
    reality-opts:
      public-key: "替换为你的PublicKey"
      short-id: "替换为你的short-id(与服务端一致)"

proxy-groups:
  - name: "General-Proxy"
    type: select
    proxies:
      - VPS
      - DIRECT

rules:
  # Telegram
  - DOMAIN-SUFFIX,telegram.org,General-Proxy
  - DOMAIN-SUFFIX,t.me,General-Proxy
  - DOMAIN-KEYWORD,telegram,General-Proxy
  - GEOSITE,telegram,General-Proxy
  - GEOIP,telegram,General-Proxy

  # Google / YouTube
  - GEOSITE,google,General-Proxy
  - GEOSITE,youtube,General-Proxy
  - GEOIP,google,General-Proxy

  # X (Twitter)
  - DOMAIN-SUFFIX,twitter.com,General-Proxy
  - DOMAIN-SUFFIX,x.com,General-Proxy
  - DOMAIN-SUFFIX,twimg.com,General-Proxy
  - GEOSITE,twitter,General-Proxy

  # ChatGPT / OpenAI
  - DOMAIN-SUFFIX,openai.com,General-Proxy
  - DOMAIN-SUFFIX,chatgpt.com,General-Proxy
  - DOMAIN-SUFFIX,oaistatic.com,General-Proxy
  - DOMAIN-SUFFIX,oaiusercontent.com,General-Proxy

  # Gemini / Google AI
  - DOMAIN-SUFFIX,gemini.google.com,General-Proxy
  - DOMAIN-SUFFIX,bard.google.com,General-Proxy
  - DOMAIN-SUFFIX,ai.google.dev,General-Proxy

  # Claude / Anthropic
  - DOMAIN-SUFFIX,claude.ai,General-Proxy
  - DOMAIN-SUFFIX,anthropic.com,General-Proxy

  # 国内网站直连
  - GEOSITE,cn,DIRECT

  # 其余非中国大陆网站走代理
  - GEOSITE,geolocation-!cn,General-Proxy

  # 兜底规则:未被任何规则匹配的流量,默认走代理而非直连
  # (避免部分小众域名因未被地理数据库收录而直连失败)
  - MATCH,General-Proxy
```

### 需要替换的占位符

| 占位符 | 替换为 |
|---|---|
| `server: 你的VPS公网IP` | VPS 实际公网 IP |
| `uuid` | 与服务端一致的 UUID |
| `public-key` | 服务端生成的 PublicKey(注意不是 PrivateKey) |
| `short-id` | 与服务端一致的 short-id |

### DNS 配置说明

- `default-nameserver`:普通 UDP DNS,专门用来解析 DoH 服务器域名本身(`1.1.1.1`/`8.8.8.8`),避免"先有鸡还是先有蛋"的解析死循环。
- `nameserver-policy` + `fake-ip-filter`:确保国内域名走国内 DNS 解析出真实 IP,不受 fake-ip 影响,避免百度等国内网站解析出不合适的 IP 导致无法访问。
- `enhanced-mode: fake-ip`:提升移动端 TUN 模式下的兼容性。

---

## 七、验证与测试

### 7.1 服务端自检

```bash
docker logs mihomo | tail -30
```

确认没有报错,且能看到 VLESS 监听成功的日志。

### 7.2 客户端连接测试

导入客户端配置后,连接 `VPS` 节点,测试:

```bash
curl -x http://127.0.0.1:7890 https://www.google.com -I
```

同时查看服务端实时日志,确认流量正确匹配规则:

```bash
docker logs -f mihomo
```

### 7.3 延迟与网络质量排查

如果感觉速度慢,建议按下面顺序排查,分清是哪一段网络的问题:

```bash
# 1. 纯网络层延迟测试(在客户端设备上执行,不是VPS)
ping 你的VPS公网IP

# 2. 路由追踪,查看具体哪一跳丢包严重(在客户端设备上执行)
mtr -rw -c 30 你的VPS公网IP

# 3. VPS自身出网速度测试(在VPS上执行)
curl -o /dev/null -s -w "总耗时: %{time_total}s | 下载速度: %{speed_download} bytes/s\n" https://speed.cloudflare.com/__down?bytes=10000000
```

> 国际线路的延迟和丢包会随时段波动,如果 VPS 自身出网测试正常,但客户端到 VPS 这段延迟高、抖动大,通常是国际线路本身的问题,配置层面难以彻底解决,可尝试更换测试时段或考虑更换 VPS 所在 region。

---

## 八、常见问题排查

### 8.1 `executable file not found in $PATH`

镜像里的可执行文件路径可能不在 `mihomo`,尝试绝对路径 `/mihomo`,或者进容器用 `find` 命令确认实际路径。

### 8.2 `disallow using Vless without any certificates/reality/decryption/allow-insecure config`

说明 `reality-config` 字段没有正确配置或书写有误,常见原因:
- 字段名写成了 outbound 专用的 `reality-opts`(inbound 必须用 `reality-config`)
- YAML 内容被自动转换成了 Markdown 链接格式(尤其是复制粘贴域名类字段时)

### 8.3 `'reality-config' has unset fields: server-names`

`reality-config` 缺少必填的 `server-names` 字段,需要补上,且必须和 `dest` 域名以及客户端 `servername` 保持一致。

### 8.4 DNS 报错 `dns resolve failed: couldn't find ip`

客户端 DNS 配置缺少 `default-nameserver` 引导解析,或者某些域名未被任何规则匹配,落到了 `MATCH,DIRECT` 导致直连解析失败。解决方式:
1. 补充 `default-nameserver`
2. 把兜底规则从 `MATCH,DIRECT` 改成 `MATCH,General-Proxy`

### 8.5 某个策略组名字报错 "not found"

检查 `rules` 里引用的策略组名字,是否与 `proxy-groups` 里定义的名字完全一致(注意 emoji 字符在不同工具间复制容易被替换或编码错误,建议策略组名统一使用纯英文/数字)。

### 8.6 国内网站(百度等)打不开,但 Google 等能访问

通常是 `fake-ip` 模式下,国内域名被境外 DNS 解析出了不合适的 IP。需要配置 `nameserver-policy` 让 `geosite:cn` 走国内 DNS,并在 `fake-ip-filter` 里排除中国大陆域名。

---

## 九、关于 WARP 解锁流媒体的说明

本教程最初尝试过在服务端引入 Cloudflare WARP,作为特定域名(如 AbemaTV、TVer)的独立出站通道,思路是利用 WARP 的日本出口 IP 绕过地理限制。

**结论:该方案目前已不可行,不建议采用。**

原因:
- WARP 的出站 IP 虽然地理位置(`loc`)可能显示为日本,但其所属网络运营商(ASN)始终是 `AS13335 Cloudflare, Inc.`
- AbemaTV 目前已经针对整个 Cloudflare ASN 段进行了封锁,而不是针对个别 IP
- 无论重新连接多少次 WARP、更换多少次出口 IP,ASN 归属不会改变,因此该封锁无法通过重连规避
- 无论使用 mihomo 还是 xray、无论是否套用 Argo Tunnel,只要最终出站流量经过 WARP,结果都相同(Argo 只影响入站连接方式,不改变出站 IP)

如果确实需要解锁此类地域限制内容,现实可行的方向包括:
- 使用专门的日本住宅 IP 代理服务(需要额外付费订阅)
- 寻找 IP 段本身未被相关平台拉黑的日本本地云服务商

本教程当前的最终配置**已移除 WARP 相关内容**,仅保留 VLESS + Reality 作为通用代理通道,服务于 Google、YouTube、Telegram、ChatGPT、Claude 等常规科学上网需求。

---

## 附:完整命令速查

```bash
# 生成密钥
docker exec mihomo /mihomo generate reality-keypair
docker exec mihomo /mihomo generate uuid
openssl rand -hex 8

# 重启服务
docker compose restart mihomo

# 查看日志
docker logs mihomo | tail -30
docker logs -f mihomo

# 检查端口监听
ss -tlnp | grep 443

# YAML语法校验
python3 -c "import yaml; yaml.safe_load(open('config.yaml'))" && echo "YAML语法OK"
```
