from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
from datetime import timedelta
import os

# Importar módulos de autenticação e banco de dados
from auth import (
    User, UserCreate, UserLogin, UserUpdate, Token,
    create_access_token, get_current_user,
    get_password_hash, authenticate_user, create_user_in_db, update_user_in_db,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from database import init_database, get_db_connection

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
    user_id: int
    
    class Config:
        from_attributes = True


# Evento de inicialização
@app.on_event("startup")
async def startup_event():
    init_database()
    
    # Não inserir produtos de exemplo automaticamente
    # Cada usuário criará seus próprios produtos após o registro
    print("🚀 API iniciada com sucesso!")


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


# ==================== ROTAS DE AUTENTICAÇÃO ====================

@app.post("/auth/register", response_model=Token, status_code=201)
async def register(user_data: UserCreate):
    """Registrar um novo usuário"""
    print(f"📝 Registro iniciado para: {user_data.username}")
    
    # Validações básicas
    if len(user_data.username) < 3:
        raise HTTPException(status_code=400, detail="Username deve ter pelo menos 3 caracteres")
    
    if len(user_data.password) < 6:
        raise HTTPException(status_code=400, detail="Senha deve ter pelo menos 6 caracteres")
    
    if "@" not in user_data.email:
        raise HTTPException(status_code=400, detail="Email inválido")
    
    print(f"✅ Validações passaram, gerando hash da senha...")
    
    # Hash da senha
    password_hash = get_password_hash(user_data.password)
    
    print(f"✅ Hash gerado, criando usuário no banco...")
    
    # Criar usuário no banco
    user_id = create_user_in_db(user_data.username, user_data.email, password_hash)
    
    print(f"✅ Usuário criado com ID: {user_id}, gerando token...")
    
    # Criar token JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user_id)},  # Converter para string!
        expires_delta=access_token_expires
    )
    
    user = User(id=user_id, username=user_data.username, email=user_data.email)
    
    print(f"🎉 Registro completo para: {user_data.username}")
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user
    )


@app.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    """Fazer login e obter token JWT"""
    user = authenticate_user(credentials.username, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Username ou senha incorretos"
        )
    
    # Criar token JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},  # Converter para string!
        expires_delta=access_token_expires
    )
    
    print(f"🔑 Token gerado para usuário {user.username} (id={user.id})")
    print(f"   Token: {access_token[:30]}...")
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user
    )


@app.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    """Obter informações do usuário atual"""
    return current_user


@app.put("/auth/me", response_model=User)
async def update_me(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """Atualizar informações do usuário atual"""
    print(f"📝 Atualizando usuário: {current_user.username}")
    
    # Validar email
    if "@" not in user_data.email:
        raise HTTPException(status_code=400, detail="Email inválido")
    
    # Validar senha se estiver alterando
    if user_data.new_password:
        if len(user_data.new_password) < 6:
            raise HTTPException(
                status_code=400,
                detail="Nova senha deve ter pelo menos 6 caracteres"
            )
    
    try:
        updated_user = update_user_in_db(
            user_id=current_user.id,
            email=user_data.email,
            current_password=user_data.current_password,
            new_password=user_data.new_password
        )
        print(f"✅ Usuário atualizado: {updated_user.username}")
        return updated_user
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Erro ao atualizar usuário: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao atualizar usuário: {str(e)}"
        )



# ==================== ROTAS DE PRODUTOS (PROTEGIDAS) ====================


@app.get("/produtos", response_model=List[Produto])
async def listar_produtos(current_user: User = Depends(get_current_user)):
    """Listar apenas os produtos do usuário autenticado"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, nome, descricao, preco, estoque, user_id FROM produtos WHERE user_id = ? ORDER BY id",
            (current_user.id,)
        )
        produtos = cursor.fetchall()
        return [
            {
                "id": p[0],
                "nome": p[1],
                "descricao": p[2],
                "preco": p[3],
                "estoque": p[4],
                "user_id": p[5]
            }
            for p in produtos
        ]


@app.get("/produtos/{produto_id}", response_model=Produto)
async def obter_produto(produto_id: int, current_user: User = Depends(get_current_user)):
    """Obter um produto específico (apenas se pertencer ao usuário)"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, nome, descricao, preco, estoque, user_id FROM produtos WHERE id = ? AND user_id = ?",
            (produto_id, current_user.id)
        )
        produto = cursor.fetchone()
        
        if not produto:
            raise HTTPException(
                status_code=404,
                detail="Produto não encontrado ou você não tem permissão para acessá-lo"
            )
        
        return {
            "id": produto[0],
            "nome": produto[1],
            "descricao": produto[2],
            "preco": produto[3],
            "estoque": produto[4],
            "user_id": produto[5]
        }


@app.post("/produtos", response_model=Produto, status_code=201)
async def criar_produto(produto: ProdutoCreate, current_user: User = Depends(get_current_user)):
    """Criar um novo produto associado ao usuário autenticado"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO produtos (nome, descricao, preco, estoque, user_id) VALUES (?, ?, ?, ?, ?)",
            (produto.nome, produto.descricao, produto.preco, produto.estoque, current_user.id)
        )
        conn.commit()
        produto_id = cursor.lastrowid
        
        cursor.execute(
            "SELECT id, nome, descricao, preco, estoque, user_id FROM produtos WHERE id = ?",
            (produto_id,)
        )
        novo_produto = cursor.fetchone()
        
        return {
            "id": novo_produto[0],
            "nome": novo_produto[1],
            "descricao": novo_produto[2],
            "preco": novo_produto[3],
            "estoque": novo_produto[4],
            "user_id": novo_produto[5]
        }


@app.put("/produtos/{produto_id}", response_model=Produto)
async def atualizar_produto(
    produto_id: int,
    produto: ProdutoUpdate,
    current_user: User = Depends(get_current_user)
):
    """Atualizar um produto (apenas se pertencer ao usuário)"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Verificar se o produto existe E pertence ao usuário
        cursor.execute(
            "SELECT id, nome, descricao, preco, estoque, user_id FROM produtos WHERE id = ? AND user_id = ?",
            (produto_id, current_user.id)
        )
        produto_existente = cursor.fetchone()
        
        if not produto_existente:
            raise HTTPException(
                status_code=404,
                detail="Produto não encontrado ou você não tem permissão para editá-lo"
            )
        
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
            values.append(current_user.id)
            query = f"UPDATE produtos SET {', '.join(updates)} WHERE id = ? AND user_id = ?"
            cursor.execute(query, values)
            conn.commit()
        
        # Buscar o produto atualizado
        cursor.execute(
            "SELECT id, nome, descricao, preco, estoque, user_id FROM produtos WHERE id = ?",
            (produto_id,)
        )
        produto_atualizado = cursor.fetchone()
        
        return {
            "id": produto_atualizado[0],
            "nome": produto_atualizado[1],
            "descricao": produto_atualizado[2],
            "preco": produto_atualizado[3],
            "estoque": produto_atualizado[4],
            "user_id": produto_atualizado[5]
        }


@app.delete("/produtos/{produto_id}", status_code=204)
async def deletar_produto(produto_id: int, current_user: User = Depends(get_current_user)):
    """Deletar um produto (apenas se pertencer ao usuário)"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Verificar se o produto existe E pertence ao usuário
        cursor.execute(
            "SELECT id FROM produtos WHERE id = ? AND user_id = ?",
            (produto_id, current_user.id)
        )
        produto = cursor.fetchone()
        
        if not produto:
            raise HTTPException(
                status_code=404,
                detail="Produto não encontrado ou você não tem permissão para deletá-lo"
            )
        
        cursor.execute(
            "DELETE FROM produtos WHERE id = ? AND user_id = ?",
            (produto_id, current_user.id)
        )
        conn.commit()
        
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
