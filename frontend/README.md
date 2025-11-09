# Frontend React - Sistema de Gerenciamento de Produtos

Interface moderna construída com React + TypeScript + Vite para consumir a API FastAPI.

## 🚀 Características

- ⚛️ React 18 com TypeScript
- ⚡ Vite para build ultrarrápido
- 🎨 Design moderno e responsivo
- 🔄 Atualizações em tempo real sem recarregar página
- 📝 Modal de edição com validações
- 🎯 Sistema de alertas/notificações
- 🎨 Animações suaves
- 📱 Totalmente responsivo (mobile-first)

## 📋 Pré-requisitos

- Node.js 18+ e npm (ou yarn/pnpm)
- API FastAPI rodando em `http://localhost:8000`

## 🔧 Instalação

1. **Instalar dependências:**
```powershell
cd frontend
npm install
```

## ▶️ Como Executar

### Modo Desenvolvimento
```powershell
npm run dev
```
A aplicação estará disponível em: **http://localhost:3000**

### Build para Produção
```powershell
npm run build
```
Os arquivos otimizados estarão em `dist/`

### Preview do Build
```powershell
npm run preview
```

## 🏗️ Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes React
│   │   ├── AlertSystem.tsx   # Sistema de notificações
│   │   ├── ProductCard.tsx   # Card individual de produto
│   │   ├── ProductForm.tsx   # Formulário de criação
│   │   └── EditModal.tsx     # Modal de edição
│   ├── services/            # Camada de comunicação com API
│   │   └── api.ts           # Funções para chamar FastAPI
│   ├── types/               # Definições TypeScript
│   │   └── index.ts         # Interfaces e tipos
│   ├── App.tsx              # Componente principal
│   ├── App.css              # Estilos globais
│   ├── main.tsx             # Entry point
│   └── index.css            # Reset CSS
├── index.html               # Template HTML
├── package.json             # Dependências
├── tsconfig.json            # Configuração TypeScript
├── vite.config.ts           # Configuração Vite
└── README.md                # Este arquivo
```

## 🔌 Integração com FastAPI

A aplicação consome os seguintes endpoints:

- `GET /produtos` - Listar todos os produtos
- `GET /produtos/{id}` - Obter produto específico
- `POST /produtos` - Criar novo produto
- `PUT /produtos/{id}` - Atualizar produto
- `DELETE /produtos/{id}` - Deletar produto

### Configurar URL da API

Por padrão a API é `http://localhost:8000`. Para alterar:

1. Crie um arquivo `.env` na raiz do `frontend/`:
```env
VITE_API_URL=http://seu-servidor:porta
```

2. Ou edite diretamente em `src/services/api.ts`

## 🎨 Funcionalidades

### Criar Produto
- Preencha o formulário no topo da página
- Todos os campos exceto "Descrição" são obrigatórios
- Preço e Estoque devem ser >= 0

### Editar Produto
- Clique no botão "✏️ Editar" em qualquer card
- Modal abre com valores atuais
- Apenas os campos alterados são enviados ao backend
- Fechar com ESC ou clicando fora do modal

### Deletar Produto
- Clique no botão "🗑️ Deletar"
- Confirme a exclusão no prompt

### Atualizar Lista
- Clique em "🔄 Atualizar Lista" para recarregar da API
- Lista atualiza automaticamente após criar/editar/deletar

## 🛠️ Scripts Disponíveis

```powershell
npm run dev       # Inicia servidor de desenvolvimento
npm run build     # Build para produção
npm run preview   # Preview do build
npm run lint      # Executar linter (ESLint)
```

## 🌐 Deploy

### Servir pelo FastAPI

Após build, você pode servir os arquivos estáticos pelo FastAPI:

1. Build do frontend:
```powershell
cd frontend
npm run build
```

2. No FastAPI (`main.py`), monte a pasta `dist/`:
```python
from fastapi.staticfiles import StaticFiles

app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="frontend")
```

3. Acesse em `http://localhost:8000`

### Outras opções de deploy
- Vercel, Netlify, GitHub Pages (hospedar frontend separado)
- Docker (containerizar frontend + backend)
- Nginx/Apache (servir arquivos estáticos)

## 🐛 Troubleshooting

**Erro de CORS:**
- Verifique se o FastAPI tem `allow_origins=["*"]` ou especifique `http://localhost:3000`

**API não responde:**
- Confirme que FastAPI está rodando em `http://localhost:8000`
- Verifique a URL em `src/services/api.ts`

**Dependências não instaladas:**
```powershell
rm -rf node_modules package-lock.json
npm install
```

## 📦 Tecnologias Utilizadas

- React 18
- TypeScript 5
- Vite 5
- CSS3 (CSS Modules)
- Fetch API

## 📄 Licença

Este projeto é livre para uso educacional e comercial.
