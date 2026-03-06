---
title: "NVIDIA + Wayland 在 Arch Linux 上的完整配置指南"
date: "2026-03-06"
excerpt: "适用于 Arch Linux 的 NVIDIA + Wayland 完整配置步骤，涵盖内核模块、GRUB 参数与常见排查。"
tags: ["Arch Linux", "NVIDIA", "Wayland", "Linux", "Graphics"]
category: "Linux"
section: "linux"
subsection: "arch-linux"
---


# NVIDIA + Wayland 在 Arch Linux 上的完整配置指南

> 适用于 Arch Linux 用户，让 NVIDIA 显卡在 Wayland 下正常运行。

Wayland 是 Linux 图形系统的新一代显示协议，逐渐取代传统的 Xorg。
虽然 Wayland 在安全性和架构上更先进，但 **NVIDIA 显卡长期以来在 Wayland 上兼容性较差**，经常出现渲染或性能问题。

随着 NVIDIA 驱动逐渐支持 **GBM (Generic Buffer Management)**，现在在 Arch Linux 上使用 NVIDIA + Wayland 已经变得可行。

本文将介绍完整配置步骤。

---

# 1 设置环境变量

NVIDIA 新驱动支持 **GBM 后端**，Wayland 合成器通常默认使用它。

编辑环境变量文件：

```bash
sudo nano /etc/environment
```

添加以下内容：

```bash
GBM_BACKEND=nvidia-drm
__GLX_VENDOR_LIBRARY_NAME=nvidia
```

保存退出。

---

# 2 在系统启动时加载 NVIDIA 模块

为了确保 NVIDIA 模块在系统启动时加载，需要将模块加入 **initramfs**。

编辑配置文件：

```bash
sudo nano /etc/mkinitcpio.conf
```

找到：

```bash
MODULES=()
```

修改为：

```bash
MODULES=(nvidia nvidia_modeset nvidia_uvm nvidia_drm)
```

---

## 移除 kms hook

在同一个文件中找到：

```bash
HOOKS=()
```

删除其中的：

```
kms
```

原因：

* 避免加载 **nouveau 开源驱动**
* 防止与 NVIDIA 官方驱动冲突

---

## 重新生成 initramfs

执行：

```bash
sudo mkinitcpio -P
```

如果出现类似：

```
WARNING: Possibly missing firmware
```

通常可以忽略。

---

# 3 启用 DRM (Direct Rendering Manager)

Wayland 依赖 **DRM 内核模式设置 (KMS)** 才能正常运行。([ArchWiki][2])

需要在 **GRUB 启动参数**中启用 NVIDIA DRM。

编辑 GRUB 配置：

```bash
sudo nano /etc/default/grub
```

找到：

```bash
GRUB_CMDLINE_LINUX_DEFAULT=
```

修改为：

```bash
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 nomodeset nvidia-drm.modeset=1 nvidia_drm.fbdev=1"
```

---

## KDE Plasma 用户额外参数

如果使用 KDE Plasma，建议再加一个参数：

```
nvidia.NVreg_EnableGpuFirmware=0
```

最终示例：

```bash
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 nomodeset nvidia-drm.modeset=1 nvidia_drm.fbdev=1 nvidia.NVreg_EnableGpuFirmware=0"
```

---

## 重新生成 GRUB

执行：

```bash
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

---

# 4 重启并测试 Wayland

重启系统：

```bash
reboot
```

在 **登录界面**选择：

```
Wayland Session
```

例如：

* GNOME Wayland
* Plasma Wayland
* Hyprland

---

# 5 验证 NVIDIA DRM 是否启用

执行：

```bash
cat /sys/module/nvidia_drm/parameters/modeset
```

如果输出：

```
Y
```

说明 DRM 已成功启用。

---

# 6 注意事项

## 1 桌面环境支持程度

Wayland 支持程度不同：

推荐：

* GNOME
* KDE Plasma
* Hyprland

支持较差：

* Cinnamon

---

## 2 应用兼容性

部分应用仍依赖 X11，需要通过 **Xwayland** 运行。

可能出现：

* UI 问题
* 性能下降
* 窗口异常

---

## 3 NVIDIA 与 Wayland仍在改进

虽然现在已经可用，但仍存在：

* 一些游戏问题
* 多显示器问题
* 某些应用兼容性问题

---

# 总结

通过以下步骤可以让 **Arch + NVIDIA + Wayland** 正常运行：

1️⃣ 设置 GBM 环境变量
2️⃣ 在 initramfs 中加载 NVIDIA 模块
3️⃣ 删除 kms hook
4️⃣ 启用 NVIDIA DRM
5️⃣ 重新生成 GRUB
6️⃣ 登录 Wayland 会话

完成后即可在 Arch Linux 上使用 Wayland + NVIDIA。

---

[2]: https://wiki.archlinux.org/title/NVIDIA "ArchWiki - NVIDIA"
