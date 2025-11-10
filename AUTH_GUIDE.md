# 🔐 Sistema de Autenticação - Guia Completo

## 📋 Visão Geral

Sistema completo de autenticação JWT com registro, login e proteção de rotas.

## 🎯 Funcionalidades Implementadas

### Backend (FastAPI)

1. **Registro de Usuários** (`POST /auth/register`)
   - Validação de username (mín. 3 caracteres)
   - Validação de email (formato válido)
   - Validação de senha (mín. 6 caracteres)
   - Hash seguro de senhas com bcrypt
   - Retorna token JWT + dados do usuário

2. **Login** (`POST /auth/login`)
   - Autenticação com username/senha
   - Verificação de hash da senha
   - Retorna token JWT + dados do usuário

3. **Verificação de Usuário** (`GET /auth/me`)
   - Endpoint protegido
   - Retorna dados do usuário autenticado

4. **Proteção de Rotas**
   - Todas as rotas de produtos agora requerem autenticação
   - Token JWT enviado no header `Authorization: Bearer <token>`

### Frontend (React + TypeScript)

1. **AuthContext**
   - Context API para gerenciar estado de autenticação
   - Persistência de token no localStorage
   - Verificação automática de token ao carregar app
   - Funções: `login()`, `register()`, `logout()`

2. **AuthForm Component**
   - Formulário unificado para Login/Registro
   - Validações client-side
   - Feedback visual de erros
   - Design responsivo e moderno

3. **Dashboard Component**
   - Tela principal após autenticação
   - Header com informações do usuário
   - Botão de logout
   - Requisições autenticadas automáticas

4. **Proteção de Rotas**
   - App.tsx redireciona automaticamente
   - Não autenticado → AuthForm
   - Autenticado → Dashboard

## 🚀 Como Usar

### 1. Instalar Novas Dependências

#### Backend:
```powershell
cd fastapi
pip install -r requirements.txt
```

Novas dependências:
- `python-jose[cryptography]` - Geração e validação de JWT
- `passlib[bcrypt]` - Hash seguro de senhas
- `python-multipart` - Suporte a form data

#### Frontend (já instalado):
Não precisa instalar nada novo, apenas React e TypeScript.

### 2. Iniciar o Sistema

```powershell
# Na raiz do projeto
.\start-dev.ps1
```

Isso abrirá duas janelas:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

### 3. Testar Autenticação

1. **Acesse o frontend**: `http://localhost:3000`
2. **Crie uma conta**:
   - Clique em "Registre-se aqui"
   - Preencha username, email e senha
   - Clique em "Criar Conta"
3. **Você será autenticado automaticamente** e redirecionado ao Dashboard
4. **Teste o sistema**:
   - Adicione produtos
   - Edite e delete produtos
   - Veja suas informações no canto superior direito
5. **Logout**: Clique em "Sair"
6. **Login novamente**: Use suas credenciais

## 🔧 Estrutura de Arquivos

### Backend (`/fastapi`)

```
fastapi/
├── main.py           # Rotas principais + integração auth
├── auth.py           # Lógica de autenticação JWT
├── database.py       # Gerenciamento do banco de dados
├── requirements.txt  # Dependências Python
└── database.db       # SQLite (criado automaticamente)
```

**Tabelas do Banco:**
- `produtos` - Produtos do sistema
- `users` - Usuários com senhas hasheadas

### Frontend (`/frontend/src`)

```
frontend/src/
├── contexts/
│   └── AuthContext.tsx    # Context de autenticação
├── components/
│   ├── AuthForm.tsx       # Formulário login/registro
│   ├── AuthForm.css
│   ├── Dashboard.tsx      # Tela principal autenticada
│   ├── Dashboard.css
│   ├── ProductCard.tsx
│   ├── ProductForm.tsx
│   ├── EditModal.tsx
│   └── AlertSystem.tsx
├── App.tsx                # Roteamento auth
└── App.css
```

## 🔐 Segurança

### Implementado:

✅ Senhas hasheadas com bcrypt (não armazena senha em texto plano)
✅ Tokens JWT com expiração (30 minutos)
✅ Validação de entrada (username, email, senha)
✅ Headers CORS configurados
✅ Verificação de token em todas as rotas protegidas
✅ Logout limpa token do localStorage

### Para Produção:

⚠️ **IMPORTANTE**: Antes de colocar em produção:

1. **Mude a `SECRET_KEY`** em `auth.py`:
   ```python
   SECRET_KEY = "sua-chave-muito-segura-e-aleatoria-de-pelo-menos-32-caracteres"
   ```

2. **Configure CORS** em `main.py`:
   ```python
   allow_origins=["https://seudominio.com"]  # Especifique domínios
   ```

3. **Use HTTPS** (não HTTP)

4. **Considere usar banco de dados PostgreSQL** (não SQLite)

5. **Adicione rate limiting** para prevenir ataques de força bruta

6. **Implemente refresh tokens** para melhor segurança

## 📡 API Endpoints

### Autenticação

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | `/auth/register` | ❌ | Registrar novo usuário |
| POST | `/auth/login` | ❌ | Fazer login |
| GET | `/auth/me` | ✅ | Obter dados do usuário |

### Produtos (Todos requerem autenticação)

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/produtos` | ✅ | Listar todos os produtos |
| GET | `/produtos/{id}` | ✅ | Obter produto específico |
| POST | `/produtos` | ✅ | Criar novo produto |
| PUT | `/produtos/{id}` | ✅ | Atualizar produto |
| DELETE | `/produtos/{id}` | ✅ | Deletar produto |

## 🎨 Fluxo de Autenticação

```
1. Usuário acessa app
   ↓
2. App verifica localStorage
   ├─ Token existe? → Valida com backend
   │  ├─ Válido → Dashboard
   │  └─ Inválido → AuthForm
   └─ Sem token → AuthForm
   
3. Usuário faz login/registro
   ↓
4. Backend retorna token JWT
   ↓
5. Frontend salva em localStorage + state
   ↓
6. Todas as requisições incluem token no header
   ↓
7. Logout limpa token e redireciona
```

## 🧪 Testar API com cURL/Postman

### Registro:
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","email":"teste@email.com","password":"123456"}'
```

### Login:
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"teste","password":"123456"}'
```

### Listar Produtos (com token):
```bash
curl http://localhost:8000/produtos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🐛 Troubleshooting

### Erro: "Token inválido ou expirado"
- Token expira em 30 minutos
- Faça logout e login novamente

### Erro: "Username já está em uso"
- Tente outro username
- Usernames são únicos

### Erro: "Sessão expirada"
- O token expirou (30 min)
- Você será redirecionado ao login automaticamente

### Produtos não carregam após login
- Verifique se o backend está rodando
- Abra DevTools (F12) → Network → veja se há erros
- Verifique se o token está sendo enviado no header

## 📚 Próximos Passos

Funcionalidades que podem ser adicionadas:

- [ ] Recuperação de senha por email
- [ ] Confirmaçã o de email
- [ ] Perfis de usuário (admin, usuário comum)
- [ ] Refresh tokens
- [ ] Login com Google/Facebook
- [ ] Autenticação de dois fatores (2FA)
- [ ] Histórico de login
- [ ] Bloqueio de conta após tentativas falhadas

---

**Desenvolvido com ❤️ usando FastAPI + React + TypeScript**
