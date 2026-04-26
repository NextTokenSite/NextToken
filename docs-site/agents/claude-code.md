# Claude Code 使用指南

`Claude Code` 是 Anthropic 推出的 AI 编程助手，支持代码生成、修改和审查。

## 安装

根据使用习惯选择安装方式。

<DocsTabs default-tab="native">
  <DocsTab title="脚本安装" name="native">

**macOS / Linux**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell**

```powershell
irm https://claude.ai/install.ps1 | iex
```

**Windows CMD**

需要先安装 [Git for Windows](https://git-scm.com/download/win)，然后运行：

```cmd
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

  </DocsTab>


  <DocsTab title="Homebrew" name="homebrew">

**macOS / Linux**

```bash
brew install --cask claude-code
```

  </DocsTab>

  <DocsTab title="WinGet" name="winget">

**Windows**

```powershell
winget install Anthropic.ClaudeCode
```

  </DocsTab>

  <DocsTab title="npm 安装" name="npm">

全局安装 `Claude Code`：

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后，直接在终端运行 `claude-code` 即可启动。

  </DocsTab>

  <DocsTab title="npx 启动" name="npx">

无需全局安装，可直接使用 `npx` 按需调用 `Claude Code`：

```bash
npx @anthropic-ai/claude-code
```

第一次运行时，`npx` 会自动下载并执行 `Claude Code`。

  </DocsTab>
</DocsTabs>

## 导入

安装完成后，选择以下两种方式之一将 `Claude Code` 接入 `NextToken`。

<DocsTabs default-tab="cc-switch-setup">
  <DocsTab title="使用 CC-Switch" name="cc-switch-setup">

推荐使用 `CC-Switch` 统一管理配置。

操作步骤：

1. 按 [创建 API Key 教程](https://www.nextoken.online/docs/platform/create-key.md) 生成 API Key。
2. 按 [CC-Switch](https://www.nextoken.online/docs/agents/cc-switch.md) 完成统一供应商配置。
3. 配置完成后，重启 `Claude Code`。

  </DocsTab>

  <DocsTab title="手动填写" name="manual-setup">

**第一步：设置环境变量**

根据操作系统选择对应方式设置环境变量：

如果你在 VSCode 或 Zed 中使用 `Claude Code`，通常同样走 `Claude Code` 的全局配置；按本节方式配置后，重启编辑器即可生效。

**macOS / Linux**

在终端中运行：

```bash
export ANTHROPIC_BASE_URL="https://www.nextoken.online"
export ANTHROPIC_AUTH_TOKEN="YOUR_NEXTTOKEN_API_KEY"
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
```

将 `YOUR_NEXTTOKEN_API_KEY` 替换为你的真实 API Key。

**Windows PowerShell**

```powershell
$env:ANTHROPIC_BASE_URL="https://www.nextoken.online"
$env:ANTHROPIC_AUTH_TOKEN="YOUR_NEXTTOKEN_API_KEY"
$env:CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
```

**Windows CMD**

```cmd
set ANTHROPIC_BASE_URL=https://www.nextoken.online
set ANTHROPIC_AUTH_TOKEN=YOUR_NEXTTOKEN_API_KEY
set CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
```

**第二步：配置 VSCode Claude Code（可选）**

如果 VSCode 中的 Claude Code 扩展未读取到 shell 环境变量，还可以通过 `settings.json` 显式配置：

**macOS / Linux 路径**

```
~/.claude/settings.json
```

**Windows 路径**

```
%userprofile%\.claude\settings.json
```

**settings.json 内容**

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://www.nextoken.online",
    "ANTHROPIC_AUTH_TOKEN": "YOUR_NEXTTOKEN_API_KEY",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "CLAUDE_CODE_ATTRIBUTION_HEADER": "0"
  }
}
```

将 `YOUR_NEXTTOKEN_API_KEY` 替换为你的真实 API Key。

  </DocsTab>
</DocsTabs>
