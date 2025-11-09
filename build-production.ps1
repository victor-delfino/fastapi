# Script para fazer build do frontend e configurar para producao
# Encoding: UTF-8

Write-Host "Preparando aplicacao para producao..." -ForegroundColor Cyan
Write-Host ""

# Obter caminho absoluto da raiz do projeto
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendPath = Join-Path $projectRoot "frontend"
$backendPath = Join-Path $projectRoot "fastapi"

# Verificar se as pastas existem
if (-not (Test-Path $frontendPath)) {
    Write-Host "ERRO: Pasta 'frontend' nao encontrada!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $backendPath)) {
    Write-Host "ERRO: Pasta 'fastapi' nao encontrada!" -ForegroundColor Red
    exit 1
}

# Build do Frontend
Write-Host "Fazendo build do React..." -ForegroundColor Blue
Set-Location $frontendPath
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build do frontend concluido!" -ForegroundColor Green
} else {
    Write-Host "ERRO no build do frontend!" -ForegroundColor Red
    Set-Location $projectRoot
    exit 1
}

Set-Location $projectRoot

# Atualizar main.py para servir o frontend
Write-Host ""
Write-Host "Configurando main.py..." -ForegroundColor Yellow

$mainPyPath = Join-Path $backendPath "main.py"
$content = Get-Content $mainPyPath -Raw

# Descomentar as linhas do StaticFiles
$content = $content -replace '# frontend_path = os.path.join', 'frontend_path = os.path.join'
$content = $content -replace '# if os.path.exists\(frontend_path\):', 'if os.path.exists(frontend_path):'
$content = $content -replace '#     app.mount\("/", StaticFiles', '    app.mount("/", StaticFiles'

Set-Content $mainPyPath -Value $content

Write-Host "main.py configurado para servir o frontend!" -ForegroundColor Green
Write-Host ""
Write-Host "Aplicacao pronta para producao!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para testar localmente:" -ForegroundColor Yellow
Write-Host "   cd fastapi" -ForegroundColor White
Write-Host "   python -m uvicorn main:app --reload" -ForegroundColor White
Write-Host ""
Write-Host "Acesse: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
