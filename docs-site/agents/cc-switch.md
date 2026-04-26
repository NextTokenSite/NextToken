# CC-Switch

`CC-Switch` 是一款专为管理 AI 接口配置而设计的图形化工具，可统一管理多个 Agent 客户端的供应商配置与 API Key，支持 `Claude Code`、`Codex`、`OpenCode` 等主流 AI 编程助手，降低配置错误风险。

适用场景包括：
- 统一管理多个 Agent 客户端（如 `Claude Code`、`Codex`、`OpenCode`）的供应商配置与 API Key。
- 快速切换不同 AI 模型接口，无需手动修改环境变量或本地配置文件。
- 减少重复配置，提升多客户端场景下的效率与可维护性。

本文将重点介绍安装流程，更多配置详情可参阅相关客户端页面。

## 安装说明

请根据您所使用的操作系统，参考以下步骤完成安装。

<DocsTabs default-tab="windows">
  <DocsTab title="Windows" name="windows">

1. 访问 [此处](https://github.com/farion1231/cc-switch/releases/latest)，进入 Releases 页面。
    在页面中找到适用于 Windows 的安装包（推荐 `.msi` 格式），如图所示：

    <div style="text-align: center;">
      <img src="https://www.nextoken.online/images/cc-switch/windows-installer-selection.png" alt="如何在 Releases 页面选择适合 Windows 的安装包" />
    </div>

2. 下载完成后，双击安装包。
3. 按照安装向导的提示完成安装。
4. 安装完成后，您可以在开始菜单中找到并启动 `CC-Switch`。

  </DocsTab>

  <DocsTab title="macOS" name="macos">

建议使用 Homebrew 进行安装：

```bash
brew tap farion1231/ccswitch
brew install --cask cc-switch
```

安装完成后，可以从“应用程序”或启动台找到并运行 `CC-Switch`。

  </DocsTab>

  <DocsTab title="Linux" name="linux">

对于 Linux 用户，推荐通过 Releases 页面下载 AppImage 文件：

1. 前往 [发布页面](https://github.com/farion1231/cc-switch/releases/latest)。
2. 找到适合您操作系统架构的 AppImage 文件（例如 `CC-Switch-v3.13.0-Linux-x86_64.AppImage`）。
   请根据实际的系统架构（如 x86_64 或 arm64）选择正确的版本。
   如果对如何选择文件有疑问，可以参考下图：

   <div style="text-align: center;">
     <img src="https://www.nextoken.online/images/cc-switch/linux-installer-selection.png" alt="如何在 Releases 页面选择适合 Linux 的 AppImage 文件" />
   </div>

3. 下载完成后，赋予文件可执行权限。

   ```bash
   chmod +x CC-Switch-v3.13.0-Linux-x86_64.AppImage
   ```

4. 双击运行文件，或在终端中使用以下命令启动：

   ```bash
   ./CC-Switch-v3.13.0-Linux-x86_64.AppImage
   ```

   如果您使用的是图形界面（例如 KDE 或 GNOME），还可以通过右键点击文件，选择“属性”或“权限”选项卡，并启用“作为可执行程序”的权限。

AppImage 文件集成了所有必要的依赖，适用于大多数 Linux 发行版。

  </DocsTab>
</DocsTabs>

## 安装后怎么开始？
<!--
安装完成后，你可以选择两种方式开始：

<DocsTabs default-tab="import">
  <DocsTab title="一键导入" name="import">

**目前只支持 codex**

如果你希望最快完成配置，推荐直接使用一键导入。

1. 先按 [创建 API Key 教程](https://www.nextoken.online/docs/platform/create-key.md) 生成一个新的 API Key。
2. 回到 API Key 页面，点击 `导入到 CC-Switch`。

先找到导入入口：

<div style="text-align: center;">
  <img src="https://www.nextoken.online/images/cc-switch/import-to-cc-switch.png" alt="如何从 API Key 页面导入到 CC-Switch" />
</div>


点击导入后，会看到对应的导入界面：

<div style="text-align: center;">
  <img src="https://www.nextoken.online/images/cc-switch/import-to-cc-switch-dialog.png" alt="导入到 CC-Switch 的弹窗界面" />
</div>


完成导入后，`CC-Switch` 会自动写好接入地址和 API Key。

  </DocsTab>

<DocsTab title="手动填写" name="manual">

如果需要更灵活的配置方式，`CC-Switch` 还支持手动添加供应商。以下为操作步骤：-->


1. 按照 [创建 API Key 教程](https://www.nextoken.online/docs/platform/create-key.md) ，获取一个新的 API Key。
2. 打开 `CC-Switch`，点击右上角的“添加”按钮，选择“添加统一供应商”。
3. 在弹出的配置窗口中，准确填写以下字段：

   ```text
   供应商名: nexttoken
   API 地址: https://nexttoken.dev
   API Key: 你的 NextToken API Key
   ```

   示例界面如下图所示：

   <div style="text-align: center;">
     <img src="https://www.nextoken.online/images/cc-switch/manual-provider-fields.png" alt="CC-Switch 手动填写统一供应商字段示意图" />
   </div>

4. 保存配置，`CC-Switch` 会自动为所有相关的 Agent 启用该供应商。
<!--
    </DocsTab>
</DocsTabs>-->

## 下一步该怎么做？

恭喜你成功安装并配置了 `CC-Switch`！接下来，只需重启你的客户端，即可开始使用。

## 多账号切换的典型场景

```bash
ccswitch use official       # 用官方额度跑日常对话
claude

# 切到便宜的渠道做大批量任务
ccswitch use nexttoken
claude

# 用一个隔离的 Key 跑实验,避免污染主账户额度
ccswitch use nexttoken-test
claude
```

## 注意事项

- 切换只对**新启动的进程**生效。已经在运行的 Claude Code 会话不受影响,需要重启
- CC-Switch 把 Key 明文存在配置文件里,确保该文件权限正确(macOS/Linux 设 `chmod 600`)
- 项目持续更新,具体命令名、配置格式以仓库 README 为准

更多详情，请参阅：

- [Claude Code 使用指南](https://www.nextoken.online/docs/agents/claude-code.md)
- [Codex 使用指南](https://www.nextoken.online/docs/agents/codex.md)
- [OpenCode 使用指南](https://www.nextoken.online/docs/agents/opencode.md)
