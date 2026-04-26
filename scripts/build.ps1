# 一键构建带 embed 的 sub2api 二进制(Windows PowerShell 5.1+ / PowerShell 7+)
# 产物 backend/sub2api.exe 内含前端 SPA。
# 文档站不再嵌入主站,见 https://github.com/NextTokenSite/NextTokenDocs。
#
# 用法:
#   .\scripts\build.ps1                # 构建前端 + 后端
#   .\scripts\build.ps1 -SkipFe        # 跳过前端构建,直接编后端
#   .\scripts\build.ps1 -SkipInstall   # 不重新装 node 依赖
#
# PowerShell 5.1 没有 && 操作符,所以本脚本完全用 if ($?) / 单独命令组织。

[CmdletBinding()]
param(
    [switch]$SkipFe,
    [switch]$SkipInstall
)

$ErrorActionPreference = 'Stop'

# 切到仓库根
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

# ---------- 2. 后端(带 embed,把前端 dist 嵌入二进制) ----------
Write-Step "编译后端 (go build -tags embed)"
$Out = if ($IsWindows -or $env:OS -eq 'Windows_NT') { 'sub2api.exe' } else { 'sub2api' }

Push-Location backend
try {
    go build -tags embed -o $Out ./cmd/server
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} finally {
    Pop-Location
}

# ---------- 3. 自检 ----------
$OutPath = "backend/$Out"
if (-not (Test-Path $OutPath)) {
    Write-Err2 "二进制未生成: $OutPath"
    exit 1
}
$SizeMB = [int]((Get-Item $OutPath).Length / 1MB)
if ($SizeMB -lt 10) {
    Write-Err2 "二进制只有 ${SizeMB}MB,几乎肯定没 embed 成功(预期 > 50MB)"
    exit 1
}
Write-Step "完成 (产物: $OutPath, ${SizeMB}MB)"
