# 一键构建带 embed 的 sub2api 二进制(Windows PowerShell 5.1+ / PowerShell 7+)
#
# 用法:
#   .\scripts\build.ps1              # 构建前端 + 文档 + 后端,产物在 backend/sub2api.exe
#   .\scripts\build.ps1 -SkipDocs    # 跳过文档构建(沿用旧的 docs_dist)
#   .\scripts\build.ps1 -SkipFe      # 跳过前端构建
#   .\scripts\build.ps1 -SkipInstall # 不重新装 node 依赖
#
# PowerShell 5.1 没有 && 操作符,所以本脚本完全用 if ($?) / 单独命令组织。

[CmdletBinding()]
param(
    [switch]$SkipDocs,
    [switch]$SkipFe,
    [switch]$SkipInstall
)

$ErrorActionPreference = 'Stop'

# 切到仓库根(脚本可能从任意路径调用)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir   = Resolve-Path (Join-Path $ScriptDir '..')
Set-Location $RootDir

function Write-Step($msg) { Write-Host "==> $msg" -ForegroundColor Green }
function Write-Warn2($msg) { Write-Host "!!  $msg" -ForegroundColor Yellow }
function Write-Err2($msg)  { Write-Host "xx  $msg" -ForegroundColor Red }

function Require-Cmd($name) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        Write-Err2 "缺少命令: $name"
        exit 1
    }
}

# 前置检查
Require-Cmd 'go'
Require-Cmd 'pnpm'

Write-Step "工作目录: $RootDir"

# ---------- 1. 前端 ----------
if ($SkipFe) {
    Write-Warn2 "跳过前端构建(-SkipFe)"
} else {
    Write-Step "构建前端 (frontend)"
    if (-not $SkipInstall) {
        pnpm --dir frontend install --frozen-lockfile
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }
    pnpm --dir frontend run build
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

# ---------- 2. 文档 ----------
if ($SkipDocs) {
    Write-Warn2 "跳过文档构建(-SkipDocs);沿用 backend/internal/web/docs_dist 现有内容"
} else {
    Write-Step "构建文档站 (docs-site)"
    if (-not $SkipInstall) {
        pnpm --dir docs-site install
        if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    }
    pnpm --dir docs-site run build
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    Write-Step "拷贝文档产物到 embed 目录"

    # 用绝对路径,避免 cwd / 通配符 / 相对路径解析的歧义
    $DistSrc  = Join-Path $RootDir 'docs-site/.vitepress/dist'
    $DocsDist = Join-Path $RootDir 'backend/internal/web/docs_dist'

    if (-not (Test-Path -LiteralPath $DistSrc)) {
        Write-Err2 "找不到 VitePress 产物: $DistSrc"
        exit 1
    }
    # 检查源目录非空(防御 build 静默失败)
    $SrcEntries = Get-ChildItem -LiteralPath $DistSrc -Force -ErrorAction SilentlyContinue
    if (-not $SrcEntries) {
        Write-Err2 "VitePress 产物为空: $DistSrc"
        exit 1
    }

    # 清理目标目录但保留 .gitkeep
    if (Test-Path -LiteralPath $DocsDist) {
        Get-ChildItem -LiteralPath $DocsDist -Force `
            | Where-Object { $_.Name -ne '.gitkeep' } `
            | ForEach-Object { Remove-Item -LiteralPath $_.FullName -Recurse -Force -ErrorAction Stop }
    } else {
        New-Item -ItemType Directory -Path $DocsDist -Force | Out-Null
    }

    # 逐项拷贝(每个顶层条目用绝对路径),避免通配符在某些 PS 版本下解析失误
    foreach ($entry in $SrcEntries) {
        Copy-Item -LiteralPath $entry.FullName -Destination $DocsDist -Recurse -Force -ErrorAction Stop
    }

    # 拷后再校验:目标里至少要有 index.html
    if (-not (Test-Path -LiteralPath (Join-Path $DocsDist 'index.html'))) {
        Write-Err2 "拷贝完成但 docs_dist/index.html 不存在,流程异常"
        exit 1
    }
}

# ---------- 3. 后端(带 embed) ----------
Write-Step "编译后端 (go build -tags embed)"
$Out = if ($IsWindows -or $env:OS -eq 'Windows_NT') { 'sub2api.exe' } else { 'sub2api' }

Push-Location backend
try {
    # 与"在 backend 目录下手动 go build -tags embed -o sub2api.exe ./cmd/server"等价
    # 不加 -ldflags / -trimpath,保持与开发者手动命令一致,避免潜在的环境差异
    go build -tags embed -o $Out ./cmd/server
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
    Pop-Location
}

# ---------- 4. 自检 ----------
$OutPath = "backend/$Out"
if (-not (Test-Path $OutPath)) {
    Write-Err2 "二进制未生成: $OutPath"
    exit 1
}
$SizeMB = [int]((Get-Item $OutPath).Length / 1MB)
if ($SizeMB -lt 10) {
    Write-Err2 "二进制只有 ${SizeMB}MB,几乎肯定没 embed 成功(预期 > 100MB)"
    exit 1
}
Write-Step "完成 (产物: $OutPath, ${SizeMB}MB)"
