# Script de setup inicial - Instala todas as dependencias
# Encoding: UTF-8

Write-Host "Configuracao inicial do projeto..." -ForegroundColor Cyan
Write-Host ""

# Obter caminho absoluto da raiz do projeto
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendPath = Join-Path $projectRoot "frontend"
$backendPath = Join-Path $projectRoot "fastapi"

# 1. Verificar Python
Write-Host "1. Verificando Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   $pythonVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "   ERRO: Python nao encontrado!" -ForegroundColor Red
    Write-Host "   Instale Python 3.8+ de https://python.org" -ForegroundColor Yellow
    exit 1
}

# 2. Verificar Node.js
Write-Host "2. Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "   Node.js $nodeVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "   ERRO: Node.js nao encontrado!" -ForegroundColor Red
    Write-Host "   Instale Node.js 18+ de https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# 3. Instalar dependencias do Backend
Write-Host ""
Write-Host "3. Instalando dependencias do Backend (Python)..." -ForegroundColor Yellow
Set-Location $backendPath

if (Test-Path "requirements.txt") {
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   Dependencias do backend instaladas!" -ForegroundColor Green
    } else {
        Write-Host "   ERRO ao instalar dependencias do backend!" -ForegroundColor Red
        Set-Location $projectRoot
        exit 1
    }
} else {
    Write-Host "   AVISO: requirements.txt nao encontrado!" -ForegroundColor Yellow
}

# 4. Instalar dependencias do Frontend
Write-Host ""
Write-Host "4. Instalando dependencias do Frontend (Node.js)..." -ForegroundColor Yellow
Set-Location $frontendPath

if (Test-Path "package.json") {
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   Dependencias do frontend instaladas!" -ForegroundColor Green
    } else {
        Write-Host "   ERRO ao instalar dependencias do frontend!" -ForegroundColor Red
        Set-Location $projectRoot
        exit 1
    }
} else {
    Write-Host "   ERRO: package.json nao encontrado!" -ForegroundColor Red
    Set-Location $projectRoot
    exit 1
}

Set-Location $projectRoot

# Resumo
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Setup concluido com sucesso!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Para desenvolvimento (backend + frontend separados):" -ForegroundColor White
Write-Host "   .\start-dev.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Para producao (tudo junto):" -ForegroundColor White
Write-Host "   .\build-production.ps1" -ForegroundColor Cyan
Write-Host "   cd fastapi" -ForegroundColor Cyan
Write-Host "   python -m uvicorn main:app --reload" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000 (dev)" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "   Docs:     http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
