# 快速开始

::: tip 访问提示
本服务面向中国大陆以外的部分上游可能需要稳定的境外网络环境。如遇连接问题,请先确认本地网络可访问 `https://www.nexttoken.online`。
:::

本指南帮助你在五分钟内完成从注册到第一次成功调用的全过程。

## 概览

NextToken 是一个面向多家上游 AI 服务的统一 API 网关。你只需要一个端点(`https://www.nexttoken.online/v1`)和一把 Key,即可访问后台聚合的所有渠道。绝大多数与 OpenAI 协议兼容的客户端、SDK 与编码代理可以**直接换 base_url** 接入,无需改代码。

## 步骤 1:注册账号

1. 打开主站:[https://www.nexttoken.online](https://www.nexttoken.online)
2. 点击右上角「登录」 → 「注册」
3. 使用邮箱(或已开放的第三方账号)完成注册并验证

注册完成后,系统会自动登录并跳转到用户面板。

## 步骤 2:创建 Key

1. 在左侧导航选择「Keys」
2. 点击「新建」,填写:
   - **名称**:任意便于识别的标识,如 `cherry-studio`
   - **分组**(可选):用于划分不同业务/用途
   - **额度**(可选):为该 Key 设置独立的消耗上限
3. 保存,系统会生成一把形如 `sk-xxxx` 的访问凭证

::: warning 仅显示一次
完整的 Key 只在创建那一刻显示一次。请立刻复制并妥善保存——一旦关闭弹窗就无法再次查看,只能删除后重新创建。
:::

详见:[创建 API Key](/platform/create-key)。

## 步骤 3:第一次调用

把请求发到 `https://www.nexttoken.online/v1`,头部带上 Key 即可。

### curl

```bash
curl https://www.nexttoken.online/v1/chat/completions \
  -H "Authorization: Bearer sk-xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "你好,请用一句话介绍自己"}]
  }'
```

### Python(OpenAI SDK)

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-xxxx",
    base_url="https://www.nexttoken.online/v1",
)

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "你好"}],
)
print(resp.choices[0].message.content)
```

### Node.js

```js
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: 'sk-xxxx',
  baseURL: 'https://www.nexttoken.online/v1',
})

const resp = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: '你好' }],
})
console.log(resp.choices[0].message.content)
```

## 步骤 4:查看用量

返回主站,左侧选择「用量」:

- 每一次调用的耗时、输入/输出 token 数都有完整记录
- 当日/当月聚合视图,方便对账与控制成本
- 可以按 Key 维度筛选,看不同应用的消耗

## 接下来

- 在你常用的客户端里接入:[Claude Code](/agents/claude-code) · [Codex](/agents/codex) · [Cherry Studio](/chatbot/cherry-studio)
- 详细的[计费说明](/platform/billing)
- 遇到问题先查 [FAQ](./faq)
