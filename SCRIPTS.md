# Scripts Disponíveis

## 📝 Resumo dos Scripts PowerShell

### 🎬 Setup Inicial (Execute UMA vez)
```powershell
.\setup.ps1
```
Instala todas as dependências (backend + frontend).

---

### 🚀 Desenvolvimento (Execute TODO dia)
```powershell
.\start-dev.ps1
```
Inicia backend + frontend em servidores separados.
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

### 🏭 Produção (Para deploy)
```powershell
.\build-production.ps1
```
Faz build do frontend e configura tudo para rodar em um único servidor.

Depois execute:
```powershell
cd fastapi
python -m uvicorn main:app
```
Acesse: http://localhost:8000

---

## 📚 Documentação Completa

- **QUICK_START.md** - Guia rápido passo a passo
- **README.md** - Documentação completa do projeto
- **frontend/README.md** - Documentação do React

---

## ⚡ Início Rápido

```powershell
# 1. Setup (primeira vez)
.\setup.ps1

# 2. Desenvolvimento (sempre)
.\start-dev.ps1

# 3. Abrir navegador
# http://localhost:3000
```

---

## 🆘 Ajuda

Problemas? Consulte **QUICK_START.md** para troubleshooting.
