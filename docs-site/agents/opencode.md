# OpenCode

[OpenCode](https://opencode.ai) 是一款开源的终端编码代理。它支持配置自定义的 OpenAI 兼容端点,可以直接接入 NextToken。

## 配置文件

OpenCode 使用 `~/.config/opencode/config.json`(Linux/macOS)或 `%APPDATA%\opencode\config.json`(Windows)做配置。

打开或新建该文件,加入 NextToken 作为 provider:

```json
{
  "providers": {
    "nexttoken": {
      "type": "openai",
      "base_url": "https://www.nexttoken.online/v1",
      "api_key": "sk-xxxx"
    }
  },
  "default_provider": "nexttoken",
  "default_model": "gpt-4o-mini"
}
```

> `type: "openai"` 让 OpenCode 用 OpenAI 兼容协议;`base_url` 末尾包含 `/v1`;`api_key` 是在 NextToken「Keys」页创建的访问凭证。

## 启动

```bash
opencode
```

如果一切配置正确,OpenCode 启动后会用 NextToken 作为默认 provider 处理对话。

## 切换 Provider

OpenCode 通常支持在会话中切换 provider,具体命令以版本而定。常见做法是 `/provider nexttoken` 之类的内置命令。

## 验证

发起一次问答,主站「用量」页能看到调用记录即表示接入成功。

## 常见问题

### `provider not found`

`config.json` 里 `default_provider` 的值必须和 `providers` 下的某个键完全一致(本例都是 `nexttoken`)。区分大小写。

### 401 / 403

- `api_key` 写错或 Key 被禁用 → 主站重新创建一把
- 选用的 model 没有访问权限 → 换一个授权列表里的模型

### 配置文件路径不确定

不同发行版可能位置略有差异,可以在 OpenCode 启动时加 `--verbose` / `--debug` 看它实际加载的路径。



# OpenCode 使用指南

`OpenCode` 是一款开源的 AI 编程助手框架，支持多种 AI 模型集成，包括代码生成、修改和审查功能。

## 安装

根据使用习惯选择安装方式。

<DocsTabs default-tab="script">
  <DocsTab title="脚本安装" name="script">

**macOS / Linux**

```bash
curl -fsSL https://opencode.ai/install | bash
```

**Windows PowerShell**

推荐使用 WSL 环境，按上述 macOS / Linux 方式安装。

  </DocsTab>

  <DocsTab title="npm 安装" name="npm">

全局安装 `OpenCode`：

```bash
npm install -g opencode-ai
```

安装完成后，直接在终端运行 `opencode` 即可启动。

  </DocsTab>

  <DocsTab title="Homebrew" name="homebrew">

**macOS / Linux**

```bash
brew install anomalyco/tap/opencode
```

  </DocsTab>

  <DocsTab title="Windows" name="windows">

除 WSL 外，还可使用以下包管理器：

**Chocolatey**

```cmd
choco install opencode
```

**Scoop**

```cmd
scoop install opencode
```

推荐优先使用 WSL 环境以获得最佳兼容性。

  </DocsTab>
</DocsTabs>

## 导入

安装完成后，选择以下两种方式之一将 `OpenCode` 接入 `NextToken`。

<DocsTabs default-tab="cc-switch-setup">
  <DocsTab title="使用 CC-Switch" name="cc-switch-setup">

推荐使用 `CC-Switch` 统一管理配置。

操作步骤：

1. 按 [创建 API Key 教程](https://www.nextoken.online/docs/platform/create-apikey.md) 生成 API Key。
2. 按 [CC-Switch](https://www.nextoken.online/docs/agents/cc-switch.md) 完成统一供应商配置。
3. 配置完成后，重启 `OpenCode`。

  </DocsTab>

  <DocsTab title="手动填写" name="manual-setup">

**第一步：创建配置文件**

进入项目目录，创建 `opencode.json` 文件。

**第二步：填写配置**

将以下内容复制到 `opencode.json`：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "nexttoken/gpt-5.4",
  "small_model": "nexttoken/gpt-5.4-mini",
  "provider": {
    "nexttoken": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "nexttoken",
      "options": {
        "baseURL": "https://nexttoken.dev/v1",
        "apiKey": "YOUR_nexttoken_API_KEY"
      },
      "models": {
        "gpt-5.2": {
          "name": "GPT-5.2",
          "limit": {
            "context": 400000,
            "output": 128000
          },
          "variants": {
            "none": {
              "reasoningEffort": "none"
            },
            "low": {
              "reasoningEffort": "low"
            },
            "medium": {
              "reasoningEffort": "medium"
            },
            "high": {
              "reasoningEffort": "high"
            },
            "xhigh": {
              "reasoningEffort": "xhigh"
            }
          }
        },
        "gpt-5.3-codex": {
          "name": "GPT-5.3 Codex",
          "limit": {
            "context": 400000,
            "output": 128000
          },
          "variants": {
            "none": {
              "reasoningEffort": "none"
            },
            "low": {
              "reasoningEffort": "low"
            },
            "medium": {
              "reasoningEffort": "medium"
            },
            "high": {
              "reasoningEffort": "high"
            },
            "xhigh": {
              "reasoningEffort": "xhigh"
            }
          }
        },
        "gpt-5.3-codex-spark": {
          "name": "GPT-5.3 Codex Spark",
          "limit": {
            "context": 128000,
            "output": 32000
          },
          "variants": {
            "none": {
              "reasoningEffort": "none"
            },
            "low": {
              "reasoningEffort": "low"
            },
            "medium": {
              "reasoningEffort": "medium"
            },
            "high": {
              "reasoningEffort": "high"
            },
            "xhigh": {
              "reasoningEffort": "xhigh"
            }
          }
        },
        "gpt-5.4": {
          "name": "GPT-5.4",
          "limit": {
            "context": 1050000,
            "output": 128000
          },
          "variants": {
            "none": {
              "reasoningEffort": "none"
            },
            "low": {
              "reasoningEffort": "low"
            },
            "medium": {
              "reasoningEffort": "medium"
            },
            "high": {
              "reasoningEffort": "high"
            },
            "xhigh": {
              "reasoningEffort": "xhigh"
            }
          }
        },
        "gpt-5.4-mini": {
          "name": "GPT-5.4 Mini",
          "limit": {
            "context": 400000,
            "output": 128000
          },
          "variants": {
            "none": {
              "reasoningEffort": "none"
            },
            "low": {
              "reasoningEffort": "low"
            },
            "medium": {
              "reasoningEffort": "medium"
            },
            "high": {
              "reasoningEffort": "high"
            },
            "xhigh": {
              "reasoningEffort": "xhigh"
            }
          }
        },
        "grok-4.20-0309-reasoning": {
          "name": "Grok 4.20 0309 Reasoning"
        },
        "grok-4.20-auto": {
          "name": "Grok 4.20 Auto"
        },
        "grok-4.20-fast": {
          "name": "Grok 4.20 Fast"
        },
        "grok-imagine-image-lite": {
          "name": "Grok Imagine Image Lite"
        },
        "claude-opus-4-6": {
          "name": "Claude Opus 4.6",
          "limit": {
            "context": 1000000,
            "output": 128000
          },
          "variants": {
            "low": {
              "reasoningEffort": "low"
            },
            "medium": {
              "reasoningEffort": "medium"
            },
            "high": {
              "reasoningEffort": "high"
            }
          }
        },
        "claude-sonnet-4-6": {
          "name": "Claude Sonnet 4.6",
          "limit": {
            "context": 1000000,
            "output": 64000
          },
          "variants": {
            "low": {
              "reasoningEffort": "low"
            },
            "medium": {
              "reasoningEffort": "medium"
            },
            "high": {
              "reasoningEffort": "high"
            }
          }
        }
      }
    }
  }
}
```

将 `YOUR_NEXTTOKEN_API_KEY` 替换为你的真实 API Key。

这个示例按 OpenCode 官方 `custom provider` 的写法整理：

- `nexttoken` 是自定义 provider ID。
- `npm` 指定 OpenCode 使用 `@ai-sdk/openai-compatible` 接入 `https://nexttoken.dev/v1`。
- `variants` 不再只写空对象，而是显式传递 `reasoningEffort`，更贴近 OpenCode 官方示例。
- `gpt-5.4` 的 `none / low / medium / high / xhigh` 已用真实 `opencode run` 验证可用；`minimal` 会直接报不支持。
- `claude-opus-4-6` 和 `claude-sonnet-4-6` 的 `low / medium / high` 已用真实 `opencode run` 验证可正常调用；这只能说明当前 nexttoken 接法接受这些 variants，不等同于 Anthropic 原生 `thinking` budget 档位声明。

**第三步：启动 OpenCode**

进入项目目录后运行：

```bash
opencode
```

然后执行：

```
/init
```

  </DocsTab>
</DocsTabs>
