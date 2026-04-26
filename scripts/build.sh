#!/usr/bin/env bash
# 一键构建带 embed 的 sub2api 二进制(Linux / macOS / WSL / Git Bash)
# 产物 backend/sub2api 内含前端 SPA。
# 文档站不再嵌入主站,见 https://github.com/NextTokenSite/NextTokenDocs。
#
# 用法:
#   ./scripts/build.sh                  # 构建前端 + 后端
#   ./scripts/build.sh --skip-fe        # 跳过前端构建,直接编后端
#   SKIP_INSTALL=1 ./scripts/build.sh   # 不重新装 node 依赖
#
# 退出码非零即失败。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

if [[ -t 1 ]]; then
  C_GREEN=$'\033[32m'; C_YELLOW=$'\033[33m'; C_RED=$'\033[31m'; C_DIM=$'\033[2m'; C_RESET=$'\033[0m'
else
  C_GREEN=''; C_YELLOW=''; C_RED=''; C_DIM=''; C_RESET=''
fi
log()  { printf '%s==>%s %s\n' "$C_GREEN" "$C_RESET" "$*"; }
warn() { printf '%s!!%s %s\n' "$C_YELLOW" "$C_RESET" "$*"; }
err()  { printf '%sxx%s %s\n' "$C_RED" "$C_RESET" "$*" >&2; }

# 解析参数
SKIP_FE=0
for arg in "$@"; do
  case "$arg" in
    --skip-fe)   SKIP_FE=1 ;;
    -h|--help)
      sed -n '2,12p' "$0"; exit 0 ;;
    *) err "未知参数: $arg"; exit 2 ;;
  esac
done

# 前置检查:必备命令
need() {
  command -v "$1" >/dev/null 2>&1 || { err "缺少命令: $1"; exit 1; }
}
need go
need pnpm

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

# ---------- 2. 后端(带 embed,把前端 dist 嵌入二进制) ----------
log "编译后端 (go build -tags embed)"
OUT="backend/sub2api"
( cd backend && go build -tags embed -o "$(basename "$OUT")" ./cmd/server )

# ---------- 3. 自检 ----------
if [[ ! -f "$OUT" ]]; then
  err "二进制未生成: $OUT"; exit 1
fi
SIZE_BYTES=$(wc -c <"$OUT")
SIZE_MB=$(( SIZE_BYTES / 1024 / 1024 ))
if [[ "$SIZE_MB" -lt 10 ]]; then
  err "二进制只有 ${SIZE_MB}MB,几乎肯定没 embed 成功(预期 > 50MB)"
  exit 1
fi
log "完成 ${C_DIM}产物: $OUT (${SIZE_MB}MB)${C_RESET}"
