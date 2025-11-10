"""
Módulo de autenticação com JWT
"""
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import bcrypt
from jose import JWTError, jwt
from pydantic import BaseModel
import sqlite3

# Configurações JWT
SECRET_KEY = "sua-chave-secreta-super-segura-mude-em-producao"  # MUDE ISSO EM PRODUÇÃO!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Security scheme
security = HTTPBearer()

# Modelos Pydantic
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    email: str
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class User(BaseModel):
    id: int
    username: str
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User


# Funções de hash de senha usando bcrypt diretamente
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha corresponde ao hash"""
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )

def get_password_hash(password: str) -> str:
    """Gera hash da senha"""
    # Gera salt e hash em uma operação
    # rounds=10 é um bom equilíbrio entre segurança e velocidade
    salt = bcrypt.gensalt(rounds=10)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


# Funções JWT
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Cria um token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """Decodifica e valida um token JWT"""
    try:
        print(f"🔍 Tentando decodificar token...")
        print(f"   SECRET_KEY: {SECRET_KEY[:10]}...")
        print(f"   ALGORITHM: {ALGORITHM}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"✅ Token decodificado com sucesso! Payload: {payload}")
        return payload
    except JWTError as e:
        print(f"❌ JWTError detalhado: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Dependência para obter o usuário atual
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """
    Dependência que valida o token JWT e retorna o usuário atual.
    Use como: current_user: User = Depends(get_current_user)
    """
    token = credentials.credentials
    print(f"🔐 Token recebido: {token[:20]}...")  # Debug: mostrar início do token
    
    try:
        payload = decode_access_token(token)
        print(f"✅ Token decodificado: user_id={payload.get('sub')}")  # Debug
    except HTTPException as e:
        print(f"❌ Erro ao decodificar token: {e.detail}")  # Debug
        raise
    
    user_id_str = payload.get("sub")
    if user_id_str is None:
        print("❌ Token não contém 'sub'")  # Debug
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Converter de string para int
    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
        print(f"❌ 'sub' não é um número válido: {user_id_str}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Buscar usuário no banco
    from database import get_db_connection
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, username, email FROM users WHERE id = ?",
            (user_id,)
        )
        user_data = cursor.fetchone()
    
    if user_data is None:
        print(f"❌ Usuário id={user_id} não encontrado no banco")  # Debug
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"✅ Usuário autenticado: {user_data[1]}")  # Debug
    return User(
        id=user_data[0],
        username=user_data[1],
        email=user_data[2]
    )


# Funções de banco de dados para usuários
def create_user_in_db(username: str, email: str, password_hash: str) -> int:
    """Cria um novo usuário no banco de dados"""
    from database import get_db_connection
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Verificar se username já existe
        cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username já está em uso"
            )
        
        # Verificar se email já existe
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já está em uso"
            )
        
        # Criar usuário
        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            (username, email, password_hash)
        )
        conn.commit()
        return cursor.lastrowid

def authenticate_user(username: str, password: str) -> Optional[User]:
    """Autentica um usuário verificando username e senha"""
    from database import get_db_connection
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, username, email, password_hash FROM users WHERE username = ?",
            (username,)
        )
        user_data = cursor.fetchone()
    
    if not user_data:
        return None
    
    if not verify_password(password, user_data[3]):
        return None
    
    return User(
        id=user_data[0],
        username=user_data[1],
        email=user_data[2]
    )

def update_user_in_db(user_id: int, email: str, current_password: Optional[str] = None, new_password: Optional[str] = None) -> User:
    """Atualiza informações do usuário no banco de dados"""
    from database import get_db_connection
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Verificar se o usuário existe e pegar os dados atuais
        cursor.execute(
            "SELECT id, username, email, password_hash FROM users WHERE id = ?",
            (user_id,)
        )
        user_data = cursor.fetchone()
        
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuário não encontrado"
            )
        
        # Se está tentando mudar a senha, verificar a senha atual
        if new_password:
            if not current_password:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Senha atual é necessária para alterar a senha"
                )
            
            # Verificar senha atual
            if not verify_password(current_password, user_data[3]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Senha atual incorreta"
                )
            
            # Atualizar email e senha
            new_password_hash = get_password_hash(new_password)
            cursor.execute(
                "UPDATE users SET email = ?, password_hash = ? WHERE id = ?",
                (email, new_password_hash, user_id)
            )
        else:
            # Atualizar apenas email
            cursor.execute(
                "UPDATE users SET email = ? WHERE id = ?",
                (email, user_id)
            )
        
        conn.commit()
        
        return User(
            id=user_data[0],
            username=user_data[1],
            email=email
        )

