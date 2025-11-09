# 🚀 Guia Rápido de Início

## ⚡ Setup Inicial (PRIMEIRA VEZ)

Execute o script de setup para instalar todas as dependências automaticamente:

```powershell
.\setup.ps1
```

Isso vai:
- ✅ Verificar Python e Node.js
- ✅ Instalar dependências do backend (FastAPI)
- ✅ Instalar dependências do frontend (React)

---

## 🎯 Desenvolvimento (Dia a Dia)

Após o setup inicial, sempre que quiser trabalhar no projeto:

```powershell
.\start-dev.ps1
```

Isso abre **2 janelas automaticamente**:
- 🟦 Backend em http://localhost:8000
- ⚛️ Frontend em http://localhost:3000

### Acesse:
- **Frontend:** http://localhost:3000 (use este para testar)
- **API Docs:** http://localhost:8000/docs
- **Backend API:** http://localhost:8000/api/

---

## 🏭 Produção (Tudo Integrado)

Para fazer deploy ou testar em produção:

1. **Build do frontend:**
```powershell
.\build-production.ps1
```

2. **Iniciar servidor único:**
```powershell
cd fastapi
python -m uvicorn main:app --reload
```

3. **Acesse:** http://localhost:8000

Agora frontend e backend rodam juntos no mesmo servidor!

---

## 🐛 Problemas Comuns

### "Python não encontrado"
```powershell
# Instale Python 3.8+ de https://python.org
# Marque "Add to PATH" durante instalação
```

### "Node.js não encontrado"
```powershell
# Instale Node.js 18+ de https://nodejs.org
```

### "Dependências não instaladas"
```powershell
.\setup.ps1
```

### Porta já está em uso
- Backend (8000): Feche outros processos Python ou altere porta em `start-dev.ps1`
- Frontend (3000): Feche outros processos npm/vite ou altere em `frontend/vite.config.ts`

### Script não executa (política de execução)
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
```

---

## 📁 Estrutura Importante

```
fastapi/
├── fastapi/          ← Backend (FastAPI/Python)
│   ├── main.py
│   └── database.db
├── frontend/         ← Frontend (React/TypeScript)
│   ├── src/
│   └── package.json
├── setup.ps1         ← Executar UMA VEZ (setup inicial)
├── start-dev.ps1     ← Executar TODO DIA (desenvolvimento)
└── build-production.ps1  ← Executar para PRODUÇÃO
```

---

## ✨ Funcionalidades Disponíveis

- ✅ **Criar produtos** - Formulário com validação
- ✅ **Listar produtos** - Grid responsivo com cards
- ✅ **Editar produtos** - Modal elegante (todos os campos)
- ✅ **Deletar produtos** - Com confirmação
- ✅ **Notificações** - Alertas automáticos de sucesso/erro
- ✅ **Design responsivo** - Funciona em mobile

---

## 🎓 Dicas

**Durante desenvolvimento:**
- Mantenha as 2 janelas abertas (backend + frontend)
- O código recarrega automaticamente ao salvar
- Use Ctrl+F5 no navegador para hard refresh
- F12 para abrir DevTools

**Atalhos:**
- Ctrl+C em cada janela para parar servidores
- Fechar as janelas também para servidores

**URLs úteis:**
- Frontend Dev: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Swagger Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

---

**Pronto para começar?**
```powershell
.\setup.ps1          # Primeira vez
.\start-dev.ps1      # Sempre que quiser desenvolver
```
