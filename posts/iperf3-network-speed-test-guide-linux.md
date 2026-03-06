---
title: "如何使用 iperf3 测试网络速度"
date: "2026-03-06"
excerpt: "在 Linux 中使用 iperf3 测试局域网与 VPS 网络带宽、速度与稳定性的实用指南。"
tags: ["Linux", "iperf3", "Network", "Bandwidth", "Tools"]
category: "Linux"
section: "linux"
subsection: "linux-tools"
---


# 如何使用 iperf3 测试网络速度

在 Linux 网络测试中，**iperf3** 是一个非常常用的工具。它可以用来测试 **两台设备之间的带宽、网络速度和稳定性**，常用于：

* 测试局域网速度
* 测试服务器带宽
* 排查网络瓶颈

相比普通测速网站，iperf3 可以 **更准确地测试真实网络性能**。

---

# 一、安装 iperf3

在 Linux 上安装非常简单。

### Arch Linux

```bash
sudo pacman -S iperf3
```

### Ubuntu / Debian

```bash
sudo apt install iperf3
```

### CentOS / Rocky Linux

```bash
sudo dnf install iperf3
```

安装完成后可以检查版本：

```bash
iperf3 --version
```

---

# 二、iperf3 工作原理

iperf3 需要 **两台设备**：

* 一台作为 **服务器（Server）**
* 一台作为 **客户端（Client）**

流程：

```
客户端  →  服务器
发送数据包测试网络速度
```

例如：

```
电脑A (client)  →  电脑B (server)
```

---

# 三、启动 iperf3 服务器

在一台机器上运行：

```bash
iperf3 -s
```

输出示例：

```
Server listening on 5201
```

说明服务器已经启动，默认端口是：

```
5201
```

---

# 四、运行 iperf3 客户端

在另一台机器运行：

```bash
iperf3 -c 服务器IP
```

例如：

```bash
iperf3 -c 192.168.1.100
```

测试结果示例：

```
[  5]   0.00-10.00 sec  1.10 GBytes  941 Mbits/sec
```

解释：

* 10秒内发送数据
* 带宽约 **941 Mbps**

---

# 五、常用 iperf3 参数

### 1 测试时间

默认测试 **10 秒**。

例如测试 30 秒：

```bash
iperf3 -c 192.168.1.100 -t 30
```

---

### 2 多线程测试

使用多个连接：

```bash
iperf3 -c 192.168.1.100 -P 4
```

说明：

```
-P 4
```

表示 **4个并发连接**。

---

### 3 反向测试

测试服务器 → 客户端速度：

```bash
iperf3 -c 192.168.1.100 -R
```

---

### 4 指定端口

如果服务器端口不是 5201：

```bash
iperf3 -c 192.168.1.100 -p 5000
```

---

# 六、测试局域网速度示例

假设你的家庭网络：

```
PC1: 192.168.1.10
PC2: 192.168.1.20
```

步骤：

PC2：

```bash
iperf3 -s
```

PC1：

```bash
iperf3 -c 192.168.1.20
```

结果：

```
940 Mbps
```

说明你的局域网接近 **千兆网速**。

---

# 七、测试 VPS 网络速度

如果你有 VPS，可以测试服务器带宽。

服务器：

```bash
iperf3 -s
```

本地电脑：

```bash
iperf3 -c VPS_IP
```

这样可以测试：

* VPS 带宽
* 网络延迟
* 网络稳定性

---

# 八、iperf3 使用场景

iperf3 常见用途：

1️⃣ 测试局域网带宽
2️⃣ 测试服务器网络性能
3️⃣ 检查网络瓶颈
4️⃣ 网络故障排查

很多网络工程师都会使用 iperf3。

---

# 九、总结

**iperf3** 是 Linux 下非常强大的网络测试工具，它可以帮助你：

* 测试网络带宽
* 分析网络性能
* 诊断网络问题

如果你经常搭建服务器或家庭网络，iperf3 是一个 **非常值得掌握的工具**。

---
