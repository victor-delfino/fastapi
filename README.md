# 🛍️ Sistema de Gerenciamento de Produtos

Aplicação full-stack moderna com **FastAPI** (backend) + **React** (frontend) para gerenciamento de produtos com operações CRUD completas.

## 📁 Estrutura do Projeto

```
fastapi/
├── fastapi/                 # Backend (API FastAPI)
│   ├── main.py             # Aplicação principal da API
│   ├── database.db         # Banco de dados SQLite
│   └── requirements.txt    # Dependências Python
├── frontend/               # Frontend (React + TypeScript)
│   ├── src/               # Código fonte React
│   ├── dist/              # Build de produção (gerado)
│   ├── package.json       # Dependências Node.js
│   └── README.md          # Documentação do frontend
├── start-dev.ps1          # Script para iniciar desenvolvimento
├── build-production.ps1   # Script para build de produção
└── README.md              # Este arquivo
```

## 🚀 Início Rápido

### Pré-requisitos
- Python 3.8+
- Node.js 18+ e npm
- PowerShell (Windows)

### Instalação

1. **Clone o repositório:**
```powershell
git clone <url-do-repositorio>
cd fastapi
```

2. **Instalar dependências do Backend:**
```powershell
cd fastapi
pip install -r requirements.txt
cd ..
```

3. **Instalar dependências do Frontend:**
```powershell
cd frontend
npm install
cd ..
```

### Desenvolvimento (Backend + Frontend separados)

**Opção 1: Usar o script automático** (Recomendado)
```powershell
.\start-dev.ps1
```
Isso abrirá duas janelas do PowerShell:
- Backend em `http://localhost:8000`
- Frontend em `http://localhost:3000`

**Opção 2: Manual (dois terminais)**

Terminal 1 - Backend:
```powershell
cd fastapi
python -m uvicorn main:app --reload
```

Terminal 2 - Frontend:
```powershell
cd frontend
npm run dev
```

Acesse:
- **Frontend:** http://localhost:3000
- **API:** http://localhost:8000
- **Docs:** http://localhost:8000/docs

### Produção (Frontend + Backend integrados)

1. **Fazer build do frontend e configurar:**
```powershell
.\build-production.ps1
```

2. **Iniciar o servidor:**
```powershell
cd fastapi
python -m uvicorn main:app
```

Acesse tudo em: **http://localhost:8000**

## 📚 Documentação da API

### Endpoints

#### Produtos
- **GET** `/api/produtos` - Listar todos os produtos
- **GET** `/api/produtos/{id}` - Obter produto específico
- **POST** `/api/produtos` - Criar novo produto
- **PUT** `/api/produtos/{id}` - Atualizar produto
- **DELETE** `/api/produtos/{id}` - Deletar produto

#### Outros
- **GET** `/api/` - Informações da API
- **GET** `/health` - Status da API
- **GET** `/docs` - Documentação Swagger
- **GET** `/redoc` - Documentação ReDoc

### Modelo de Dados (Produto)

```json
{
  "id": 1,
  "nome": "Notebook",
  "descricao": "Notebook Dell Inspiron 15",
  "preco": 3500.00,
  "estoque": 10
}
```

## 🎨 Funcionalidades do Frontend

- ✅ Criar produtos com validação de formulário
- ✅ Listar produtos em grid responsivo
- ✅ Editar produtos via modal elegante
- ✅ Deletar produtos com confirmação
- ✅ Sistema de notificações (alertas)
- ✅ Loading states e feedback visual
- ✅ Design moderno e responsivo
- ✅ Atualização inteligente (sem recarregar página)

## 🛠️ Tecnologias Utilizadas

### Backend
- **FastAPI** - Framework web moderno e rápido
- **Pydantic** - Validação de dados
- **SQLite** - Banco de dados leve
- **Uvicorn** - Servidor ASGI

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **CSS3** - Estilização moderna

## 📝 Scripts Disponíveis

### Raiz do projeto
- `.\start-dev.ps1` - Iniciar desenvolvimento (backend + frontend)
- `.\build-production.ps1` - Build e configurar para produção

### Backend (fastapi/)
- `python -m uvicorn main:app --reload` - Servidor de desenvolvimento
- `python -m uvicorn main:app` - Servidor de produção

### Frontend (frontend/)
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build

## 🔧 Configuração

### Backend
Edite `fastapi/main.py` para:
- Mudar configurações CORS
- Ajustar porta/host
- Adicionar novos endpoints

### Frontend
Crie `frontend/.env` para variáveis de ambiente:
```env
VITE_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

**Erro: uvicorn não encontrado**
```powershell
python -m pip install uvicorn[standard]
```

**Erro: CORS bloqueando requisições**
- Verifique `allow_origins` em `main.py`
- Em dev, deve incluir `http://localhost:3000`

**Frontend não conecta à API**
- Confirme que a API está rodando em `http://localhost:8000`
- Verifique a URL em `frontend/src/services/api.ts`

**Build do frontend falha**
```powershell
cd frontend
rm -r node_modules package-lock.json
npm install
```

## 📦 Deploy

### Heroku / Railway / Render
1. Build do frontend: `cd frontend && npm run build`
2. Configure Procfile ou start command: `uvicorn fastapi.main:app --host 0.0.0.0 --port $PORT`

### Docker
Crie um `Dockerfile` na raiz:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY fastapi/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY fastapi/ ./fastapi/
COPY frontend/dist/ ./frontend/dist/
CMD ["uvicorn", "fastapi.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### VPS (Linux)
1. Instalar dependências
2. Build do frontend
3. Configurar Nginx como reverse proxy
4. Usar systemd ou supervisor para gerenciar o processo

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é livre para uso educacional e comercial.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

⭐ Se este projeto foi útil, considere dar uma estrela!
