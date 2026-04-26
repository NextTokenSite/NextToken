# Codex 使用指南

`Codex` 是一款专为代码生成、修改和审查设计的 AI Agent 工具。

## 安装

根据使用习惯选择安装方式。

<DocsTabs default-tab="app">
  <DocsTab title="Codex App" name="app">

  `Codex App` 适合使用图形界面的用户。

  按系统选择对应安装包：

  - [Codex App for Windows](https://get.microsoft.com/installer/download/9PLM9XGG6VKS?cid=website_cta_psi)
  - [Codex App for macOS (Apple Silicon)](https://persistent.oaistatic.com/codex-app-prod/Codex.dmg)
  - [Codex App for macOS (Intel)](https://persistent.oaistatic.com/codex-app-prod/Codex-latest-x64.dmg)

  下载完成后，按照系统提示完成安装并启动即可。

  </DocsTab>

  <DocsTab title="Codex CLI" name="cli">

  推荐在终端中使用 `Codex CLI`。

  安装方式：

  ```bash
  npm install -g @openai/codex
  ```

  验证安装：

  ```bash
  codex --help
  ```

  命令能正常输出帮助信息即表示安装成功。

  </DocsTab>

  <DocsTab title="npx 直接调用" name="npx">

  无需全局安装，可直接使用 `npx` 按需调用 `Codex`。

  ```bash
  npx @openai/codex
  ```

  第一次运行时，`npx` 会自动下载并执行 `Codex`。适合以下场景：

  - 不想污染全局环境
  - 在某台机器上按需运行一次
  - 验证 CLI 是否满足需求

  如果后续经常使用，建议全局安装以获得更快的启动速度。

  </DocsTab>
</DocsTabs>

## 导入

安装完成后，选择以下两种方式之一将 `Codex` 接入 `NextToken`。

<DocsTabs default-tab="cc-switch-setup">
  <DocsTab title="使用 CC-Switch" name="cc-switch-setup">

  推荐使用 `CC-Switch` 统一管理配置。

  操作步骤：

    1. 按 [创建 API Key 教程](https://www.nextoken.online/docs/create-key.md) 生成 API Key。
    2. 按 [CC-Switch](https://www.nextoken.online/docs/agents/cc-switch.md) 完成统一供应商配置。
    3. 配置完成后，重启 `Codex` 或 `Codex App`。

## 常见问题

### `api key not configured`

环境变量没设或没生效。`echo $NEXTTOKEN_API_KEY`(Linux/macOS)/ `echo %NEXTTOKEN_API_KEY%`(cmd)/ `$env:NEXTTOKEN_API_KEY`(PowerShell)确认能拿到值。

### 返回 404 / endpoint not found

`base_url` 末尾要带 `/v1`,完整路径是 `https://www.nexttoken.online/v1`,不要漏掉。

### 切换 Provider 没生效

确认 `config.toml` 顶部的 `model_provider = "nexttoken"` 与下方 `[model_providers.nexttoken]` 的名字一致。Codex 是按这个键名匹配的。

  </DocsTab>

  <DocsTab title="手动填写" name="manual-setup">

  **第一步：确认配置目录**

  `Codex` 的本地配置目录通常是：

  - Windows：`%userprofile%\.codex`
  - macOS / Linux：`~/.codex`

  如果你在 VSCode 或 Zed 中使用 `Codex`，通常同样走 `Codex` 的全局配置；按本节方式写入配置后，重启编辑器即可生效。

  建议先启动一次 `Codex` 或 `Codex App`，让程序自动初始化配置目录。

  **第二步：写入 `config.toml`**

  在配置目录中创建或编辑 `config.toml`，确保以下内容位于文件前部：

  ```toml
  model_provider = "nexttoken"
  model = "gpt-5.4"
  review_model = "gpt-5.4"
  model_reasoning_effort = "xhigh"
  disable_response_storage = true
  network_access = "enabled"
  windows_wsl_setup_acknowledged = true
  model_context_window = 1000000
  model_auto_compact_token_limit = 900000

  [model_providers.nexttoken]
  name = "nexttoken"
  base_url = "https://nexttoken.dev/v1"
  wire_api = "responses"
  requires_openai_auth = true
  ```

  **第三步：写入 `auth.json`**

  在同一目录中创建或编辑 `auth.json`：

  ```json
  {
    "OPENAI_API_KEY": "YOUR_NEXTTOKEN_API_KEY"
  }
  ```

  将 `YOUR_NEXTTOKEN_API_KEY` 替换为你的真实 API Key。


  **WebSocket 版本（可选）**

  如果需要 WebSocket 版本，`config.toml` 还需额外配置：

  ```toml
  supports_websockets = true

  [features]
  responses_websockets_v2 = true
  ```

  </DocsTab>
</DocsTabs>
