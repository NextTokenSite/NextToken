# RikkaHub

`RikkaHub` 是一款 Android AI 聊天客户端，支持接入多种 OpenAI 兼容接口，适合在手机上进行日常 AI 对话。

## 安装

RikkaHub 目前仅支持 Android，**不支持 iOS**。

你可以通过以下任一方式安装：

- 前往 [RikkaHub 官网下载页](https://rikka-ai.com/download) 下载 APK 安装包，手动安装到设备。
- 在 Google Play 搜索 `RikkaHub` 并安装。

## 接入NextToken

RikkaHub 支持以 OpenAI 兼容方式接入 NextToken。

1. 按 [创建 API Key 教程](https://www.nexttoken.online/docs/create-key.md) 生成一个 API Key。

2. 打开 `RikkaHub`，点击左侧**侧边栏**，进入**设置**。

3. 选择**提供商**，点击添加新提供商，类型选择 `OpenAI`。

4. 填入以下配置：

   ```text
   提供商类型: OpenAI
   Base URL: https://nexttoken.dev/v1
   API Key: 你的 nexttoken API Key
   ```

   > **注意：** Base URL 必须以 `/v1` 结尾。RikkaHub 会在此基础上自动拼接 `/chat/completions` 等路径，请勿在末尾重复添加。

5. 保存后，等待模型列表刷新，点击添加模型**左侧**的图标，选择你需要使用的模型。

6. 返回主页，选择刚才添加的模型即可开始对话。

## 添加模型

进入刚配好的 Provider,在「模型」列表中添加你账户授权的模型 ID(如 `gpt-4o-mini`)。

## 开始对话

回到聊天界面,顶部选择 NextToken 下的模型,即可发起对话。

## 验证

发起一次对话,主站「用量」页能看到记录即表示接入成功。

## 使用生图

> 前提：已按上方步骤完成 TokenFlux 接入，并已导入支持图像生成的模型。

1. 进入**设置 → 提供商**，找到你导入的生图模型，将其**类型**改为**图像**。

   <div style="text-align: center;">
     <img src="https://www.nexttoken.online/images/rikkahub/step-1-edit-model-type.png" alt="RikkaHub 将生图模型类型设置为图像的界面" />
   </div>

2. 返回首页，点击左侧**侧边栏**，在底部找到**生图**选项并进入。

   <div style="text-align: center;">
     <img src="https://www.nexttoken.online/images/rikkahub/step-2-image-settings.png" alt="RikkaHub 侧边栏底部的图像生成入口" />
   </div>

3. 在生图页面选择刚才设置好的模型，即可开始生成图像。

   <div style="text-align: center;">
     <img src="https://www.nextoken.online/images/rikkahub/step-3-select-model.png" alt="RikkaHub 生图页面选择模型的界面" />
   </div>

## 常见问题

### 连接超时

移动网络环境下偶有不稳。可以在 Wi-Fi 下重试,或调大客户端 timeout。

### 401 / 403

- 401:Key 错误或被禁用
- 403:用了未授权的模型,确认账户授权清单

### Key 不想存在手机里

App 把 API Key 存在本地。建议为移动端创建一把**单独的 Key**(独立额度、可独立禁用),手机丢失或卸载后立即在主站删掉这把 Key,主账户不受影响。

::: tip
RikkaHub 不同版本的 UI 略有差异。核心只要找到"OpenAI 兼容 / 自定义 Provider"入口,填上 Base URL + API Key 就行。
:::
