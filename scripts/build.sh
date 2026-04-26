#!/usr/bin/env bash
# 一键构建带 embed 的 sub2api 二进制(Linux / macOS / WSL / Git Bash)
#
# 用法:
#   ./scripts/build.sh              # 构建前端 + 文档 + 后端,产物在 backend/sub2api
#   ./scripts/build.sh --skip-docs  # 跳过文档构建(只复用旧的 docs_dist)
#   ./scripts/build.sh --skip-fe    # 跳过前端构建
#   SKIP_INSTALL=1 ./scripts/build.sh  # 不重新装 node 依赖
#
# 退出码非零即失败;脚本失败时会保留中间产物用于排查。

set -euo pipefail

# 切到仓库根(脚本可能从任意路径调用)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

# 终端着色(不支持时降级为空)
if [[ -t 1 ]]; then
  C_GREEN=$'\033[32m'; C_YELLOW=$'\033[33m'; C_RED=$'\033[31m'; C_DIM=$'\033[2m'; C_RESET=$'\033[0m'
else
  C_GREEN=''; C_YELLOW=''; C_RED=''; C_DIM=''; C_RESET=''
fi
log()  { printf '%s==>%s %s\n' "$C_GREEN" "$C_RESET" "$*"; }
warn() { printf '%s!!%s %s\n' "$C_YELLOW" "$C_RESET" "$*"; }
err()  { printf '%sxx%s %s\n' "$C_RED" "$C_RESET" "$*" >&2; }

# 解析参数
SKIP_DOCS=0
SKIP_FE=0
for arg in "$@"; do
  case "$arg" in
    --skip-docs) SKIP_DOCS=1 ;;
    --skip-fe)   SKIP_FE=1 ;;
    -h|--help)
      sed -n '2,11p' "$0"; exit 0 ;;
    *) err "未知参数: $arg"; exit 2 ;;
  esac
done

# 前置检查:必备命令
need() {
  command -v "$1" >/dev/null 2>&1 || { err "缺少命令: $1"; exit 1; }
}
need go
need pnpm

# 进入正题
log "工作目录: $ROOT_DIR"

# ---------- 1. 前端 ----------
if [[ "$SKIP_FE" -eq 1 ]]; then
  warn "跳过前端构建(--skip-fe)"
else
  log "构建前端 (frontend)"
  if [[ -z "${SKIP_INSTALL:-}" ]]; then
    pnpm --dir frontend install --frozen-lockfile
  fi
  pnpm --dir frontend run build
fi

# ---------- 2. 文档 ----------
if [[ "$SKIP_DOCS" -eq 1 ]]; then
  warn "跳过文档构建(--skip-docs);沿用 backend/internal/web/docs_dist 现有内容"
else
  log "构建文档站 (docs-site)"
  if [[ -z "${SKIP_INSTALL:-}" ]]; then
    pnpm --dir docs-site install
  fi
  pnpm --dir docs-site run build

  log "拷贝文档产物到 embed 目录"
  DOCS_DIST="backend/internal/web/docs_dist"
  # 清理目录但保留 .gitkeep
  if [[ -d "$DOCS_DIST" ]]; then
    find "$DOCS_DIST" -mindepth 1 ! -name '.gitkeep' -exec rm -rf {} +
  else
    mkdir -p "$DOCS_DIST"
  fi
  # 末尾 "/." 让 cp 包含目录内全部内容(包括隐藏文件)
  cp -r docs-site/.vitepress/dist/. "$DOCS_DIST/"
fi

# ---------- 3. 后端(带 embed) ----------
log "编译后端 (go build -tags embed)"
OUT="backend/sub2api"
# 与"在 backend 目录下手动 go build -tags embed -o sub2api ./cmd/server"等价
# 不加 -ldflags / -trimpath,保持与开发者手动命令一致,避免潜在的环境差异
# (若需交叉编译可在外部覆盖 GOOS/GOARCH)
( cd backend && go build -tags embed -o "$(basename "$OUT")" ./cmd/server )

# ---------- 4. 自检 ----------
if [[ ! -f "$OUT" ]]; then
  err "二进制未生成: $OUT"; exit 1
fi
SIZE_BYTES=$(wc -c <"$OUT")
SIZE_MB=$(( SIZE_BYTES / 1024 / 1024 ))
if [[ "$SIZE_MB" -lt 10 ]]; then
  err "二进制只有 ${SIZE_MB}MB,几乎肯定没 embed 成功(预期 > 100MB)"
  exit 1
fi
log "完成 ${C_DIM}产物: $OUT (${SIZE_MB}MB)${C_RESET}"
