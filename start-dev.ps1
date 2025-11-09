# Script para iniciar desenvolvimento (Backend + Frontend)
# Encoding: UTF-8

Write-Host "Iniciando ambiente de desenvolvimento..." -ForegroundColor Cyan
Write-Host ""

# Obter caminho absoluto da raiz do projeto
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Verificar se as pastas existem
$backendPath = Join-Path $projectRoot "fastapi"
$frontendPath = Join-Path $projectRoot "frontend"

if (-not (Test-Path $backendPath)) {
    Write-Host "ERRO: Pasta 'fastapi' nao encontrada!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendPath)) {
    Write-Host "ERRO: Pasta 'frontend' nao encontrada!" -ForegroundColor Red
    exit 1
}

# Verificar se node_modules existe no frontend
if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "AVISO: Dependencias do frontend nao instaladas!" -ForegroundColor Yellow
    Write-Host "Execute: cd frontend; npm install" -ForegroundColor Yellow
    Write-Host ""
}

# Iniciar Backend (FastAPI)
Write-Host "Iniciando Backend (FastAPI)..." -ForegroundColor Green
$backendCmd = "Set-Location '$backendPath'; python -m uvicorn main:app --reload --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd
Start-Sleep -Seconds 2

# Iniciar Frontend (React)
Write-Host "Iniciando Frontend (React)..." -ForegroundColor Blue
$frontendCmd = "Set-Location '$frontendPath'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Servidores iniciados com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "URLs disponiveis:" -ForegroundColor Cyan
Write-Host "   Frontend React: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API:    http://localhost:8000" -ForegroundColor White
Write-Host "   Swagger Docs:   http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Dica: Para parar os servidores, feche as janelas do PowerShell ou pressione Ctrl+C em cada uma." -ForegroundColor Yellow
Write-Host ""
