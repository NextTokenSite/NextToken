# Hermes 使用指南

`Hermes` 是一款 AI Agent 工具，支持通过自定义 OpenAI-compatible 接口接入 `NextToken`。

## 安装

可直接使用官方安装脚本：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

安装完成后，默认配置目录通常位于 `~/.hermes`。

## 接入 NextToken

1. 按 [创建 API Key 教程](https://www.nextoken.online/docs/platform/create-key.md) 生成一个 API Key。
2. 编辑 `~/.hermes/config.yaml`，写入或确认以下配置：

   ```yaml
   model:
     default: "gpt-5.4"
     provider: "custom"
     base_url: "https://www.nextoken.online/v1"
   ```

3. 编辑 `~/.hermes/.env`，写入：

   ```env
   OPENAI_API_KEY=YOUR_NEXTTOKEN_API_KEY
   OPENAI_BASE_URL=https://nexttoken.dev/v1
   ```

   将 `YOUR_NEXTTOKEN_API_KEY` 替换为你的真实 API Key。

## 验证配置

保存配置后，可运行以下命令验证：

```bash
hermes config check
hermes chat -Q -q '只回复 OK' --max-turns 3
```

如果命令能够正常返回，即表示 `Hermes` 已成功通过 `NextToken` 调用模型。

## 常见问题

### 401

API Key 错误或被禁用。在主站「Keys」页确认 Key 状态正常,重新复制(注意不要带空格、换行)。

### 404

Base URL 末尾必须包含 `/v1`,完整路径是 `https://www.nexttoken.online/v1`。

### 流式响应中断

调高客户端的 timeout(建议 600 秒以上),长输出场景常见。

::: tip
具体 UI 字段名、菜单位置随 Hermes 版本可能变化,以你使用的版本实际界面为准。核心只要把"Base URL + API Key"这两项指向 NextToken 即可。
:::

## 更多相关内容

- [创建 API Key](https://www.nextoken.online/docs/platform/create-key.md)
- [计费说明](https://www.nextoken.online/docs/platform/billing.md)
