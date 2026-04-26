# NextToken 文档站

基于 [VitePress](https://vitepress.dev/) 的独立文档站,与主应用解耦部署。

## 目录约定

```
docs-site/
├── .vitepress/
│   └── config.ts        # 站点 + 主题 + i18n + 搜索配置
├── index.md             # 中文首页(默认 locale = zh)
├── zh/                  # 中文文档
│   ├── guide/
│   └── api/
├── en/                  # 英文文档(/en/ 前缀)
│   ├── guide/
│   └── api/
├── public/              # 静态资源(被原样拷贝到站点根)
└── package.json
```

## 本地开发

```bash
cd docs-site
pnpm install
pnpm dev          # 启动开发服务器
pnpm build        # 生成 .vitepress/dist
pnpm preview      # 预览构建产物
```

## 部署形态(当前)

文档站作为主站后端的子路径 `/docs/` 提供:

- `.vitepress/config.ts` 中 `base: '/docs/'`
- 后端通过 `//go:embed all:docs_dist` 把 VitePress 产物嵌入二进制
- 中间件挂载于 `internal/server/router.go`,使用文件 `internal/web/docs_embed_on.go`
- Docker 多阶段构建中由 `docs-builder` 阶段产出后拷贝到 `backend/internal/web/docs_dist/`

## 本地构建(脱离 Docker)

```bash
# 1. 构建文档静态产物
cd docs-site
pnpm install
pnpm run build         # 产物在 .vitepress/dist

# 2. 拷贝到后端 embed 目录
rm -rf ../backend/internal/web/docs_dist/*
cp -r .vitepress/dist/* ../backend/internal/web/docs_dist/

# 3. 编译带 embed 的后端
cd ../backend
go build -tags embed -o sub2api ./cmd/server
```

启动后访问 `http://localhost:8080/docs/` 即可看到文档站。

## 接入主站(关键步骤)

进入「管理后台 → 系统设置 → 站点设置」,把 **文档 URL** 填为:

```
/docs/
```

(相对路径会自动跟随主站域名;也可以写 `https://www.nexttoken.online/docs/`。)

保存后,Home 页右上角与 footer 会自动出现「文档」入口。

## 改回独立部署

若需要切换为独立子域名:

1. `.vitepress/config.ts`:`base: '/'`
2. 移除 Dockerfile 中 `docs-builder` 阶段及其拷贝步骤
3. 删除 `backend/internal/web/docs_embed_on.go` / `docs_embed_off.go` 与 router 中的 `r.Use(web.ServeEmbeddedDocs())`
4. 站点设置中的 `doc_url` 填新域名
