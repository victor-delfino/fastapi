from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
from contextlib import contextmanager
import os

# Criar a aplicação FastAPI
app = FastAPI(
    title="API CRUD",
    description="API REST com FastAPI para operações CRUD",
    version="1.0.0"
)

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Nome do banco de dados
DB_NAME = "database.db"

# Modelos Pydantic
class ProdutoBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    preco: float
    estoque: int

class ProdutoCreate(ProdutoBase):
    pass

class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    preco: Optional[float] = None
    estoque: Optional[int] = None

class Produto(ProdutoBase):
    id: int

    class Config:
        from_attributes = True


# Gerenciador de contexto para conexão com o banco de dados
@contextmanager
def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()


# Inicializar banco de dados
def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                descricao TEXT,
                preco REAL NOT NULL,
                estoque INTEGER NOT NULL
            )
        """)
        
        # Inserir dados de exemplo se a tabela estiver vazia
        cursor.execute("SELECT COUNT(*) as count FROM produtos")
        if cursor.fetchone()["count"] == 0:
            produtos_exemplo = [
                ("Notebook", "Notebook Dell Inspiron 15", 3500.00, 10),
                ("Mouse", "Mouse sem fio Logitech", 89.90, 50),
                ("Teclado", "Teclado mecânico RGB", 299.90, 25),
                ("Monitor", "Monitor LG 24 polegadas", 899.00, 15),
                ("Webcam", "Webcam Full HD 1080p", 249.00, 30)
            ]
            cursor.executemany(
                "INSERT INTO produtos (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)",
                produtos_exemplo
            )


# Evento de inicialização
@app.on_event("startup")
async def startup_event():
    init_db()


# Rotas da API

@app.get("/api/")
async def root():
    """Informações da API"""
    return {
        "mensagem": "Bem-vindo à API CRUD com FastAPI!",
        "versao": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/produtos", response_model=List[Produto])
async def listar_produtos():
    """Listar todos os produtos"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM produtos ORDER BY id")
        produtos = cursor.fetchall()
        return [dict(produto) for produto in produtos]


@app.get("/produtos/{produto_id}", response_model=Produto)
async def obter_produto(produto_id: int):
    """Obter um produto específico por ID"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM produtos WHERE id = ?", (produto_id,))
        produto = cursor.fetchone()
        
        if not produto:
            raise HTTPException(status_code=404, detail="Produto não encontrado")
        
        return dict(produto)


@app.post("/produtos", response_model=Produto, status_code=201)
async def criar_produto(produto: ProdutoCreate):
    """Criar um novo produto"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO produtos (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)",
            (produto.nome, produto.descricao, produto.preco, produto.estoque)
        )
        produto_id = cursor.lastrowid
        
        cursor.execute("SELECT * FROM produtos WHERE id = ?", (produto_id,))
        novo_produto = cursor.fetchone()
        
        return dict(novo_produto)


@app.put("/produtos/{produto_id}", response_model=Produto)
async def atualizar_produto(produto_id: int, produto: ProdutoUpdate):
    """Atualizar um produto existente"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Verificar se o produto existe
        cursor.execute("SELECT * FROM produtos WHERE id = ?", (produto_id,))
        produto_existente = cursor.fetchone()
        
        if not produto_existente:
            raise HTTPException(status_code=404, detail="Produto não encontrado")
        
        # Atualizar apenas os campos fornecidos
        updates = []
        values = []
        
        if produto.nome is not None:
            updates.append("nome = ?")
            values.append(produto.nome)
        if produto.descricao is not None:
            updates.append("descricao = ?")
            values.append(produto.descricao)
        if produto.preco is not None:
            updates.append("preco = ?")
            values.append(produto.preco)
        if produto.estoque is not None:
            updates.append("estoque = ?")
            values.append(produto.estoque)
        
        if updates:
            values.append(produto_id)
            query = f"UPDATE produtos SET {', '.join(updates)} WHERE id = ?"
            cursor.execute(query, values)
        
        # Buscar o produto atualizado
        cursor.execute("SELECT * FROM produtos WHERE id = ?", (produto_id,))
        produto_atualizado = cursor.fetchone()
        
        return dict(produto_atualizado)


@app.delete("/produtos/{produto_id}", status_code=204)
async def deletar_produto(produto_id: int):
    """Deletar um produto"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Verificar se o produto existe
        cursor.execute("SELECT * FROM produtos WHERE id = ?", (produto_id,))
        produto = cursor.fetchone()
        
        if not produto:
            raise HTTPException(status_code=404, detail="Produto não encontrado")
        
        cursor.execute("DELETE FROM produtos WHERE id = ?", (produto_id,))
        
        return None


@app.get("/health")
async def health_check():
    """Endpoint para verificar a saúde da API"""
    return {"status": "ok", "mensagem": "API funcionando corretamente"}


# Servir o frontend React (após build)
# Descomente as linhas abaixo após fazer o build do React (npm run build)
# frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
# if os.path.exists(frontend_path):
#     app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
