# API CRUD com FastAPI

Este é um projeto de API REST utilizando FastAPI com operações CRUD completas.

## 🚀 Características

- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Banco de dados SQLite
- ✅ CORS habilitado para integração com frontend
- ✅ Documentação automática (Swagger UI)
- ✅ Validação de dados com Pydantic
- ✅ Dados de exemplo pré-carregados

## 📋 Pré-requisitos

- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

## 🔧 Instalação

1. **Instalar as dependências:**
```bash
pip install -r requirements.txt
```

## ▶️ Como Executar

1. **Iniciar o servidor:**
```bash
uvicorn main:app --reload
```

2. **Acessar a API:**
   - API: http://localhost:8000
   - Documentação Swagger: http://localhost:8000/docs
   - Documentação ReDoc: http://localhost:8000/redoc

## 📚 Endpoints da API

### Produtos

- **GET** `/produtos` - Listar todos os produtos
- **GET** `/produtos/{id}` - Obter um produto específico
- **POST** `/produtos` - Criar um novo produto
- **PUT** `/produtos/{id}` - Atualizar um produto
- **DELETE** `/produtos/{id}` - Deletar um produto

### Outros

- **GET** `/` - Informações da API
- **GET** `/health` - Verificar saúde da API

## 📝 Exemplos de Uso

### Listar todos os produtos
```bash
curl http://localhost:8000/produtos
```

### Criar um novo produto
```bash
curl -X POST "http://localhost:8000/produtos" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Produto Teste",
    "descricao": "Descrição do produto",
    "preco": 99.90,
    "estoque": 20
  }'
```

### Atualizar um produto
```bash
curl -X PUT "http://localhost:8000/produtos/1" \
  -H "Content-Type: application/json" \
  -d '{
    "preco": 149.90,
    "estoque": 15
  }'
```

### Deletar um produto
```bash
curl -X DELETE "http://localhost:8000/produtos/1"
```

## 🌐 Integração com Frontend

A API está configurada com CORS para aceitar requisições de qualquer origem durante o desenvolvimento.

### Exemplo com JavaScript (Fetch API):

```javascript
// Listar produtos
fetch('http://localhost:8000/produtos')
  .then(response => response.json())
  .then(data => console.log(data));

// Criar produto
fetch('http://localhost:8000/produtos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nome: 'Novo Produto',
    descricao: 'Descrição',
    preco: 99.90,
    estoque: 10
  })
})
  .then(response => response.json())
  .then(data => console.log(data));

// Atualizar produto
fetch('http://localhost:8000/produtos/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    preco: 149.90
  })
})
  .then(response => response.json())
  .then(data => console.log(data));

// Deletar produto
fetch('http://localhost:8000/produtos/1', {
  method: 'DELETE'
});
```

## 🗄️ Banco de Dados

O projeto utiliza SQLite, um banco de dados leve e sem necessidade de instalação adicional. O arquivo `database.db` será criado automaticamente na primeira execução.

### Schema da Tabela Produtos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INTEGER | Chave primária (auto-incremento) |
| nome | TEXT | Nome do produto (obrigatório) |
| descricao | TEXT | Descrição do produto (opcional) |
| preco | REAL | Preço do produto (obrigatório) |
| estoque | INTEGER | Quantidade em estoque (obrigatório) |

## 🔒 Segurança

⚠️ **Importante para produção:**
- Altere a configuração de CORS em `main.py` para permitir apenas domínios específicos
- Implemente autenticação/autorização
- Use variáveis de ambiente para configurações sensíveis
- Utilize um banco de dados mais robusto (PostgreSQL, MySQL, etc.)

## 📦 Estrutura do Projeto

```
fastapi/
│
├── main.py              # Aplicação principal
├── requirements.txt     # Dependências do projeto
├── README.md           # Documentação
└── database.db         # Banco de dados SQLite (criado automaticamente)
```

## 🛠️ Próximos Passos

Sugestões para expandir o projeto:

1. Adicionar autenticação JWT
2. Implementar paginação nos endpoints de listagem
3. Adicionar filtros e busca
4. Criar testes automatizados
5. Adicionar validações mais complexas
6. Implementar relacionamentos entre tabelas
7. Adicionar upload de imagens
8. Criar endpoints de estatísticas/relatórios

## 📄 Licença

Este projeto é livre para uso educacional e comercial.
