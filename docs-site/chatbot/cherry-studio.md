# Cherry Studio

[Cherry Studio](https://cherry-ai.com) 是一款跨平台的 AI 客户端,支持 macOS / Windows / Linux,通过 OpenAI 兼容协议可以直接接入 NextToken。

## 安装

前往 [Cherry Studio 官方下载页](https://cherry-ai.com/download) 获取安装包，根据操作系统选择对应版本。

<DocsTabs default-tab="windows">
  <DocsTab title="Windows" name="windows">

Cherry Studio 提供 **Setup 安装版**和 **Portable 便携版**，均支持 x64 和 ARM64 架构。

1. 访问 [下载页面](https://cherry-ai.com/download)，根据系统架构选择对应安装包：
   - 普通 PC：选择推荐的标准版
   - ARM 设备：选择 `ARM` 版本
2. 下载完成后，双击安装包，按照向导提示完成安装。
3. 安装完成后，从开始菜单启动 `Cherry Studio`。

> **注意：** Cherry Studio 不支持 Windows 7。

> 如果启动时提示缺少运行库，请先安装 [Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe)。

  </DocsTab>

  <DocsTab title="macOS" name="macos">

Cherry Studio 提供 Intel 和 Apple Silicon 两个版本，请按芯片类型选择：

- **Apple Silicon**：选择 `Apple Silicon` 版本
- **Intel 芯片**：选择 `Intel` 版本

1. 访问 [下载页面](https://cherry-ai.com/download)，下载对应的 `.dmg` 文件。
2. 打开 `.dmg`，将 `Cherry Studio` 拖入"应用程序"文件夹。
3. 从启动台或"应用程序"中启动 `Cherry Studio`。

  </DocsTab>

  <DocsTab title="Linux" name="linux">

Linux 版本以 AppImage 格式分发，支持 x86_64 和 ARM64 架构。

1. 访问 [下载页面](https://cherry-ai.com/download)，根据系统架构选择对应 AppImage 文件：

   - 普通 x86 设备：选择 `x86_64` 版本
   - ARM 设备：选择 `ARM64` 版本

2. 下载完成后，赋予文件可执行权限：

   ```bash
   chmod +x CherryStudio-*.AppImage
   ```

3. 双击运行，或在终端中执行：

   ```bash
   ./CherryStudio-*.AppImage
   ```

AppImage 已内置所有依赖，适用于大多数主流 Linux 发行版，无需额外安装。

  </DocsTab>
</DocsTabs>

## 接入NextToken

1. 打开 `Cherry Studio`，进入**设置 → 模型服务**，点击添加服务商
2. 选择「模型服务 / Model Providers」
3. 点击「添加 / Add」按钮,选择「OpenAI」类型(或 OpenAI Compatible)
4. 填写:

| 字段 | 值 |
|---|---|
| 名称 | `nexttoken`(随意起一个能识别的名字) |
| API Host / Base URL | `https://www.nexttoken.online/v1` |
| API Key | `sk-xxxx`(在主站 Keys 页创建) |

5. 保存

## 添加可用模型

Cherry Studio 默认不知道你的账户能用哪些模型,需要手动添加。

- 在刚保存的 NextToken provider 详情页,找到「模型 / Models」区
- 点击「添加模型 / Add Model」
- 填写模型 ID(如 `gpt-4o-mini`、`claude-sonnet-4-5`、具体以你账户授权清单为准)
- 保存

## 选择模型对话

回到主界面,点击顶部的模型选择器,选刚添加的 NextToken 下的某个模型,即可开始对话。

## 验证

发一句简单的问题,如「你好」。返回正常即表示接入成功,主站「用量」页可以看到调用明细。

## 常见问题

### 401

API Key 不对或已被禁用。重新到主站「Keys」页确认状态、复制完整 Key,粘贴到 Cherry Studio 时注意不要带空格、不要带换行。

### 404 / endpoint not found

Base URL 末尾必须包含 `/v1`。完整地址 `https://www.nexttoken.online/v1`,少一个段都不行。

### 模型在列表里但调用报错

很可能是你添加的模型 ID,在 NextToken 账户授权范围之外。在主站「Keys / 用量」页确认你账户的可用模型清单,只添加里面有的。

### 多 Provider 共存

Cherry Studio 支持多个 Provider 并存,对话时按需切换。建议官方账号、NextToken 各自建一个 Provider,便于对比和按额度使用。

### 流式输出中断

少数情况下长回答会被本地超时切断。Cherry Studio 的 timeout 设置在「设置 → 网络」相关项中,长输出建议调到 600 秒以上。
