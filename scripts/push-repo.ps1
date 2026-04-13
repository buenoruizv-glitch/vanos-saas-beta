#Requires -Version 5.1
<#
.SYNOPSIS
  Commit + push a origin. La URL se lee de git-remote.local (ignorado por Git).
#>
$ErrorActionPreference = "Stop"

function Find-Git {
  $cmd = Get-Command git -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $candidates = @(
    "${env:ProgramFiles}\Git\bin\git.exe",
    "${env:ProgramFiles(x86)}\Git\bin\git.exe",
    "${env:LocalAppData}\Programs\Git\bin\git.exe"
  )
  foreach ($p in $candidates) {
    if (Test-Path -LiteralPath $p) { return $p }
  }
  throw "No se encontró git.exe. Instala Git desde https://git-scm.com/download/win"
}

function Invoke-GitSilent {
  param([string[]]$GitArgs, [string]$GitExe)
  & $GitExe @GitArgs 2>$null
  return $LASTEXITCODE
}

$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $RepoRoot

$Git = Find-Git

function Invoke-Git {
  # No usar el nombre "Args": choca con $args automático de PowerShell y rompe el splatting.
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GitArguments)
  & $Git @GitArguments
  if ($LASTEXITCODE -ne 0) {
    throw "git $($GitArguments -join ' ') fallo (codigo $LASTEXITCODE)"
  }
}

$remoteFile = Join-Path $RepoRoot "git-remote.local"
if (-not (Test-Path -LiteralPath $remoteFile)) {
  Write-Host ""
  Write-Host "Falta git-remote.local con la URL de tu repo." -ForegroundColor Yellow
  Write-Host "Copia git-remote.local.example -> git-remote.local y edita la URL." -ForegroundColor Yellow
  Write-Host ""
  exit 1
}

$remoteUrl = (Get-Content -LiteralPath $remoteFile -Raw).Trim()
if ($remoteUrl -match "YOUR_USER|tu-repo") {
  Write-Host "Edita git-remote.local y pon tu URL real (GitHub/GitLab)." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot ".git"))) {
  Write-Host "Inicializando repositorio git…"
  Invoke-Git @("init")
}

$name = (& $Git config user.name 2>$null)
if (-not $name) {
  Invoke-Git @("config", "user.name", "VanOS deploy")
  Invoke-Git @("config", "user.email", "deploy@local.invalid")
  Write-Host "(user.name/email configurados solo en este repo.)" -ForegroundColor DarkGray
}

$code = Invoke-GitSilent -GitExe $Git -GitArgs @("remote", "get-url", "origin")
if ($code -ne 0) {
  Write-Host "Añadiendo remoto origin…"
  Invoke-Git @("remote", "add", "origin", $remoteUrl)
} else {
  $cur = (& $Git remote get-url origin 2>$null)
  if ($cur -ne $remoteUrl) {
    Write-Host "Actualizando URL de origin…"
    Invoke-Git @("remote", "set-url", "origin", $remoteUrl)
  }
}

Invoke-Git @("add", "-A")
$status = (& $Git status --porcelain)
if ($status) {
  $msg = "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
  Invoke-Git @("commit", "-m", $msg)
} else {
  Write-Host "Sin cambios nuevos para commitear." -ForegroundColor DarkGray
}

$hasHead = (Invoke-GitSilent -GitExe $Git -GitArgs @("rev-parse", "--verify", "HEAD")) -eq 0
if (-not $hasHead) {
  Write-Host "No hay ningún commit en el repo. Añade archivos al proyecto y vuelve a ejecutar." -ForegroundColor Red
  exit 1
}

Invoke-Git @("branch", "-M", "main")

Write-Host "Comprobando remoto…"
Invoke-Git @("fetch", "origin")
$remoteMain = (& $Git ls-remote --heads origin main 2>$null)
if ($remoteMain) {
  Write-Host "Sincronizando con origin/main (pull --rebase)…"
  Invoke-Git @("pull", "--rebase", "origin", "main")
} else {
  Write-Host "Remoto sin rama main aún; primer push." -ForegroundColor DarkGray
}

Write-Host "Subiendo a origin (main)…"
Invoke-Git @("push", "-u", "origin", "main")

Write-Host ""
Write-Host "Listo. Vercel puede desplegar si el repo está conectado." -ForegroundColor Green
Write-Host ""
