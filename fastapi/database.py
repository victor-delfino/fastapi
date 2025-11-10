"""
Módulo de gerenciamento do banco de dados
"""
import sqlite3
from contextlib import contextmanager

DB_NAME = "database.db"

@contextmanager
def get_db_connection():
    """Context manager para conexões com o banco de dados"""
    conn = sqlite3.connect(DB_NAME)
    try:
        yield conn
    finally:
        conn.close()

def init_database():
    """Inicializa o banco de dados com as tabelas necessárias"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Tabela de usuários (criar primeiro por causa da FK)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Verificar se a tabela produtos já existe
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='produtos'
        """)
        table_exists = cursor.fetchone()
        
        if table_exists:
            # Verificar se a coluna user_id já existe
            cursor.execute("PRAGMA table_info(produtos)")
            columns = [column[1] for column in cursor.fetchall()]
            
            if 'user_id' not in columns:
                print("⚠️  Migrando tabela produtos para adicionar relação com usuários...")
                
                # Criar nova tabela com a estrutura correta
                cursor.execute("""
                    CREATE TABLE produtos_new (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nome TEXT NOT NULL,
                        descricao TEXT,
                        preco REAL NOT NULL,
                        estoque INTEGER NOT NULL,
                        user_id INTEGER NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                    )
                """)
                
                # Verificar se há produtos existentes
                cursor.execute("SELECT COUNT(*) FROM produtos")
                count = cursor.fetchone()[0]
                
                if count > 0:
                    # Verificar se há usuários
                    cursor.execute("SELECT id FROM users LIMIT 1")
                    first_user = cursor.fetchone()
                    
                    if first_user:
                        user_id = first_user[0]
                        print(f"📦 Migrando {count} produtos para o usuário ID {user_id}...")
                        
                        # Copiar dados antigos para a nova tabela
                        cursor.execute(f"""
                            INSERT INTO produtos_new (id, nome, descricao, preco, estoque, user_id)
                            SELECT id, nome, descricao, preco, estoque, {user_id}
                            FROM produtos
                        """)
                    else:
                        print("⚠️  Produtos existentes serão perdidos (nenhum usuário encontrado)")
                
                # Remover tabela antiga e renomear a nova
                cursor.execute("DROP TABLE produtos")
                cursor.execute("ALTER TABLE produtos_new RENAME TO produtos")
                print("✅ Migração concluída!")
        else:
            # Criar tabela produtos com relação desde o início
            cursor.execute("""
                CREATE TABLE produtos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    descricao TEXT,
                    preco REAL NOT NULL,
                    estoque INTEGER NOT NULL,
                    user_id INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            """)
        
        conn.commit()
        print("✅ Banco de dados inicializado com sucesso!")
