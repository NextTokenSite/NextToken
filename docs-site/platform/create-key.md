# 创建 API Key

API Key 是访问 NextToken 的唯一凭证。每个 Key 独立计费、独立限速、可独立禁用,建议**为每个应用/场景单独创建**。

## 操作步骤

1. 登录后进入 [API 密钥页面](https://www.nextoken.online/keys)。
2. 点击右上角的 `创建密钥` 按钮。
3. 输入一个便于识别的名称（例如：`cherry-studio`、`cc-switch`）。
4. 点击创建，复制生成的密钥并妥善保存。

> **注意：** 密钥仅在创建时完整显示一次，请立即复制保存。

## 创建后做什么？

拿到 API Key 后，可以直接开始接入：

- [快速开始](https://www.nextoken.online/docs/quickstart.md) — 根据使用习惯选择接入方式
- [Cherry Studio 使用指南](https://www.nextoken.online/docs/chatbot/cherry-studio.md) — 桌面端 AI 对话客户端
- [RikkaHub 使用指南](https://www.nextoken.online/docs/chatbot/rikkahub.md) — Android 端 AI 对话客户端
- [CC-Switch 使用指南](https://www.nextoken.online/docs/agents/cc-switch.md) — 管理 Claude Code / Codex 的配置工具

## 如何使用

```bash
curl https://www.nexttoken.online/v1/chat/completions \
  -H "Authorization: Bearer sk-xxxx" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"hi"}]}'
```

各客户端的具体配置参考侧栏的 [Agents](/agents/claude-code) 与 [ChatBot](/chatbot/cherry-studio) 章节。
