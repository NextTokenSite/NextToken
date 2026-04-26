# 部署构建脚本

一键产出带 embed 的可执行文件 `backend/sub2api`(Linux)或 `backend/sub2api.exe`(Windows),里面包含前端 SPA 与 VitePress 文档站。

## 选哪个

| 平台 | 用 |
|---|---|
| Linux / macOS / WSL / Git Bash | `scripts/build.sh` |
| Windows PowerShell (5.1+ / 7+) | `scripts/build.ps1` |

## 前置依赖

- `go`(版本与 `backend/go.mod` 一致或更新)
- `pnpm`
- 仓库已 clone 到本地

## 用法

### Linux / macOS

```bash
chmod +x scripts/build.sh           # 首次
./scripts/build.sh                  # 全量构建
./scripts/build.sh --skip-fe        # 跳过前端
./scripts/build.sh --skip-docs      # 跳过文档(沿用上次产物)
SKIP_INSTALL=1 ./scripts/build.sh   # 不重装 node 依赖
```

### Windows

```powershell
.\scripts\build.ps1                 # 全量构建
.\scripts\build.ps1 -SkipFe         # 跳过前端
.\scripts\build.ps1 -SkipDocs       # 跳过文档
.\scripts\build.ps1 -SkipInstall    # 不重装 node 依赖
```

PowerShell 执行策略受限时:`Set-ExecutionPolicy -Scope Process Bypass` 后再跑。

## 脚本做了什么

1. 切到仓库根
2. `pnpm install` + `pnpm build`(frontend)→ 产物落到 `backend/internal/web/dist`
3. `pnpm install` + `pnpm build`(docs-site)→ 产物在 `docs-site/.vitepress/dist`
4. 清空 `backend/internal/web/docs_dist`(保留 `.gitkeep`),把 docs 产物拷过去
5. `cd backend && go build -tags embed -o sub2api ./cmd/server`
6. 自检:产物大小 < 10MB 视为 embed 失败,直接报错退出

任意一步失败立即停;不会留下半成品被误用。

## 部署

构建完成后:

```bash
scp backend/sub2api  你的服务器:/path/to/
ssh 你的服务器 "screen 里重启进程"
```

文档站访问:`https://你的域名/docs/`,管理后台「站点设置 → 文档 URL」填 `/docs/` 即可。

## git 可执行权限

如果在 Windows 修改 `build.sh` 后提交,可执行位可能丢失。一次性写入 git:

```bash
git update-index --chmod=+x scripts/build.sh
git commit -m "chore: mark build.sh executable"
```
