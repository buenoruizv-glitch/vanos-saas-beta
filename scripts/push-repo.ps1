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

if (-not (Test-Path -LiteralPath (Join-Path $RepoRoot "package.json"))) {
  Write-Host "Aviso: no hay package.json aqui. RepoRoot debe ser la raiz del proyecto (donde esta app/ y package.json)." -ForegroundColor Yellow
  Write-Host "Ruta actual: $RepoRoot" -ForegroundColor Yellow
}

$Git = Find-Git

function Invoke-Git {
  # Parametro explícito -GitArguments: ValueFromRemainingArguments junta "add" y "--all" en un solo token.
  param([Parameter(Mandatory = $true)][string[]]$GitArguments)
  $prevEap = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    $out = & $Git @GitArguments 2>&1
    $code = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $prevEap
  }
  if ($code -ne 0) {
    $detail = if ($null -eq $out) { "" } else { ($out | Out-String).Trim() }
    if (-not $detail) { $detail = "(sin salida de git)" }
    throw "git $($GitArguments -join ' ') fallo (codigo $code): $detail"
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
  Invoke-Git -GitArguments @("init")
}

$name = (& $Git config user.name 2>$null)
if (-not $name) {
  Invoke-Git -GitArguments @("config", "user.name", "VanOS deploy")
  Invoke-Git -GitArguments @("config", "user.email", "deploy@local.invalid")
  Write-Host "(user.name/email configurados solo en este repo.)" -ForegroundColor DarkGray
}

# Usar "git remote" (lista): get-url puede fallar en algunos estados y "add" da error 1 si origin ya existe.
$remotes = @(& $Git remote 2>$null)
$hasOrigin = $false
foreach ($r in $remotes) {
  if ($r.Trim() -eq "origin") {
    $hasOrigin = $true
    break
  }
}
if ($hasOrigin) {
  $cur = (& $Git remote get-url origin 2>$null)
  if ($cur -and $cur.Trim() -ne $remoteUrl) {
    Write-Host "Actualizando URL de origin…"
    Invoke-Git -GitArguments @("remote", "set-url", "origin", $remoteUrl)
  }
} else {
  Write-Host "Añadiendo remoto origin…"
  Invoke-Git -GitArguments @("remote", "add", "origin", $remoteUrl)
}

# Usar --all en lugar de -A: en algunos PowerShell -A se interpreta mal al pasarlo a git.exe
Invoke-Git -GitArguments @("add", "--all")
$status = (& $Git status --porcelain)
if ($status) {
  $msg = "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
  Invoke-Git -GitArguments @("commit", "-m", $msg)
}

$hasHead = (Invoke-GitSilent -GitExe $Git -GitArgs @("rev-parse", "--verify", "HEAD")) -eq 0
if (-not $hasHead) {
  Write-Host ""
  Write-Host "No hay ningun commit. Tras 'git add --all' no hay nada en staging." -ForegroundColor Red
  Write-Host "Causas tipicas: carpeta del proyecto vacia, o .gitignore excluye todos los archivos." -ForegroundColor Red
  Write-Host "Salida de git status:" -ForegroundColor Yellow
  & $Git status
  exit 1
}

if (-not $status) {
  Write-Host "Sin cambios nuevos para commitear." -ForegroundColor DarkGray
}

Invoke-Git -GitArguments @("branch", "-M", "main")

Write-Host "Comprobando remoto…"
Invoke-Git -GitArguments @("fetch", "origin")
$remoteMain = (& $Git ls-remote --heads origin main 2>$null)
if ($remoteMain) {
  Write-Host "Sincronizando con origin/main (pull --rebase)…"
  Invoke-Git -GitArguments @("pull", "--rebase", "origin", "main")
} else {
  Write-Host "Remoto sin rama main aún; primer push." -ForegroundColor DarkGray
}

Write-Host "Subiendo a origin (main)…"
Invoke-Git -GitArguments @("push", "-u", "origin", "main")

Write-Host ""
Write-Host "Listo. Vercel puede desplegar si el repo está conectado." -ForegroundColor Green
Write-Host ""
