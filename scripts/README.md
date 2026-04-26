# 部署构建脚本

一键产出主站可执行文件 `backend/sub2api`(Linux)或 `backend/sub2api.exe`(Windows),前端 SPA 已 embed 进二进制。

> 文档站不在本仓库,详见 https://github.com/NextTokenSite/NextTokenDocs。

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
./scripts/build.sh --skip-fe        # 跳过前端,只编后端
SKIP_INSTALL=1 ./scripts/build.sh   # 不重新装 node 依赖
```

### Windows

```powershell
.\scripts\build.ps1                 # 全量构建
.\scripts\build.ps1 -SkipFe         # 跳过前端,只编后端
.\scripts\build.ps1 -SkipInstall    # 不重新装 node 依赖
```

PowerShell 执行策略受限时:`Set-ExecutionPolicy -Scope Process Bypass` 后再跑。

## 脚本做了什么

1. 切到仓库根
2. `pnpm install` + `pnpm build`(frontend)→ 产物落到 `backend/internal/web/dist`
3. `cd backend && go build -tags embed -o sub2api ./cmd/server`
4. 自检:产物大小 < 10MB 视为 embed 失败,直接报错退出

任意一步失败立即停。

## 部署

构建完成后:

```bash
scp backend/sub2api  你的服务器:/path/to/
ssh 你的服务器 "重启进程"
```

## git 可执行权限

如果在 Windows 修改 `build.sh` 后提交,可执行位可能丢失。一次性写入 git:

```bash
git update-index --chmod=+x scripts/build.sh
git commit -m "chore: mark build.sh executable"
```
