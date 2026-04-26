# 常见问题

## 接入与协议

### NextToken 兼容哪些协议?

主入口 `https://www.nexttoken.online/v1` 是 OpenAI 兼容协议。`/v1/chat/completions`、`/v1/completions`、`/v1/embeddings`、`/v1/models` 等端点行为与 OpenAI 官方一致,任何 OpenAI SDK 改 `base_url` 即可使用。

部分上游服务(如 Anthropic 原生协议)会有专属端点,具体在对应客户端文档页中说明。

### 我已有的代码能直接迁过来吗?

可以。把客户端的 `base_url` / `baseURL` 改成 `https://www.nexttoken.online/v1`,`api_key` 换成在我们后台新建的 `sk-xxxx`,其余不动。

### 支持流式输出吗?

支持。在请求体里设置 `"stream": true`,响应会以 `text/event-stream` 推送增量,完全遵循 SSE 标准。

## Key 与鉴权

### 401 是什么原因?

最常见的三种:

1. `Authorization` 头缺少 `Bearer ` 前缀
2. Key 被禁用、过期或额度耗尽——到「Keys」页确认状态
3. 复制 Key 时多了空格或换行,清掉再试

### 一个 Key 能给多个客户端用吗?

可以,Key 维度的额度与速率是聚合的——所有持有该 Key 的客户端共享配额。但建议**每个应用单独建一把 Key**,出问题时只需禁用对应那把,不影响其它服务。

### 如何更换 Key?

在「Keys」页找到要替换的那一把,点删除,然后新建一把同分组、同额度的。把客户端配置里的 Key 替换即可。

## 调用细节

### 如何选择模型?

在「用量」或「Keys」页可以看到当前账号可访问的全部模型清单。请求时把 `model` 字段填上对应的模型 ID 即可。如果填了一个未授权的模型,接口会返回 403。

### 速率限制怎么算?

按 Key 维度。响应头会带:

- `X-RateLimit-Limit`:窗口内额度
- `X-RateLimit-Remaining`:剩余额度
- `X-RateLimit-Reset`:重置的 Unix 时间戳

收到 `429 Too Many Requests` 时建议指数退避后重试。

### 请求超时如何处理?

短消息一般几秒返回。生成内容长 / 模型推理慢时可能超过一分钟——客户端的 `timeout` 建议至少设到 120 秒,流式接口建议 600 秒以上,避免被客户端单方面断开。

## 计费

### 收费方式是什么?

按 token 计费,输入与输出分开。详见 [计费说明](/platform/billing)。

### 余额从哪里看?

主站「用量」页右上方显示当前余额与本月消耗。

### 调用失败也扣费吗?

通常不扣。只有上游已经返回有效响应(包括成功的流式输出)才计入消耗。客户端取消、网络中断、上游报错的情况不扣费。

## 想用 NextToken生图，该用哪个客户端？

- **桌面端**：推荐使用 [Cherry Studio](https://www.nextoken.online/docs/chatbot/cherry-studio.md)。界面简洁，配置方便，接入 NextToken 后在模型列表中选择支持生图的模型即可直接使用。
- **Android 手机端**：推荐使用 [RikkaHub](https://www.nextoken.online/docs/chatbot/rikkahub.md)。接入 NextToken 并导入支持图像生成的模型后，将模型类型设为"图像"，再从侧边栏底部进入"生图"，选择模型即可开始生成。

**快速开始：**

- **Cherry Studio**：按 [Cherry Studio 使用指南](https://www.nextoken.online/docs/chatbot/cherry-studio.md) 完成安装并接入 NextToken，在模型列表中选择支持生图的模型（如 `gpt-image-2` 等），在对话界面发送提示词即可生成图片。
- **RikkaHub**：按 [RikkaHub 使用指南](https://www.nextoken.online/docs/chatbot/rikkahub.md) 完成接入，参考其中的"使用生图"章节完成配置。



## 其它

### 哪里看故障与公告?

- 登录后首页有公告横幅,临时维护与重大变更会从这里发布
- 管理员可以在「渠道监控」页看具体上游的健康度

### 怎么联系到团队?

在主站「设置 → 联系方式」可以看到当前的官方联系渠道。
