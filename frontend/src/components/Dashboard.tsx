import { useState, useEffect, useCallback } from 'react';
import { Produto, ProdutoCreate, ProdutoUpdate, Alert } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { AlertSystem } from './AlertSystem';
import { ProductForm } from './ProductForm';
import { ProductCard } from './ProductCard';
import { EditModal } from './EditModal';
import { UserProfile } from './UserProfile';
import { Footer } from './Footer';
import './Dashboard.css';

export const Dashboard = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [nextAlertId, setNextAlertId] = useState(1);

  const { user, logout, token } = useAuth();
   
  // Debug: Verificar se user e token estão presentes
  useEffect(() => {
    console.log('👤 Dashboard - User:', user);
    console.log('🔑 Dashboard - Token:', token ? 'Presente' : 'Ausente');
  }, [user, token]);

  const addAlert = useCallback((message: string, type: Alert['type'] = 'success') => {
    const id = nextAlertId;
    setNextAlertId(id + 1);
    setAlerts(prev => [...prev, { id, message, type }]);
  }, [nextAlertId]);

  const dismissAlert = useCallback((id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  // Função para fazer requisições autenticadas
  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    console.log('🔑 Token atual:', token ? 'Token presente' : 'Token ausente');
    
    if (!token) {
      throw new Error('Token não encontrado');
    }
    
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      addAlert('Sessão expirada. Faça login novamente.', 'error');
      logout();
      throw new Error('Não autenticado');
    }

    return response;
  }, [token, logout, addAlert]);

  const carregarProdutos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth('http://localhost:8000/produtos');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos');
      }

      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      addAlert('Erro ao carregar produtos: ' + (error as Error).message, 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth, addAlert]);

  useEffect(() => {
    // Só carregar produtos se tiver token
    if (token) {
      carregarProdutos();
    }
  }, [carregarProdutos, token]);

  const handleCriarProduto = async (produto: ProdutoCreate) => {
    try {
      const response = await fetchWithAuth('http://localhost:8000/produtos', {
        method: 'POST',
        body: JSON.stringify(produto),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao criar produto');
      }

      const novoProduto = await response.json();
      setProdutos(prev => [...prev, novoProduto]);
      addAlert('Produto criado com sucesso!', 'success');
    } catch (error) {
      addAlert('Erro ao criar produto: ' + (error as Error).message, 'error');
      throw error;
    }
  };

  const handleAtualizarProduto = async (id: number, updates: ProdutoUpdate) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8000/produtos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao atualizar produto');
      }

      const produtoAtualizado = await response.json();
      setProdutos(prev => prev.map(p => p.id === id ? produtoAtualizado : p));
      addAlert('Produto atualizado com sucesso!', 'success');
    } catch (error) {
      addAlert('Erro ao atualizar produto: ' + (error as Error).message, 'error');
      throw error;
    }
  };

  const handleDeletarProduto = async (id: number) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8000/produtos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao deletar produto');
      }

      setProdutos(prev => prev.filter(p => p.id !== id));
      addAlert('Produto deletado com sucesso!', 'success');
    } catch (error) {
      addAlert('Erro ao deletar produto: ' + (error as Error).message, 'error');
    }
  };

  return (
    <div className="dashboard">
      <AlertSystem alerts={alerts} onDismiss={dismissAlert} />

      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>🛍️ Sistema de Gerenciamento de Produtos</h1>
          <p className="subtitle">Aplicação React moderna integrada com FastAPI</p>
        </div>
        <div className="user-info">
          <div className="user-details">
            <span className="user-icon">👤</span>
            <div>
              <div className="user-name">{user?.username}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button onClick={() => setShowProfile(true)} className="btn btn-profile">
            ⚙️ Perfil
          </button>
          <button onClick={logout} className="btn btn-logout">
            🚪 Sair
          </button>
        </div>
      </div>

      <div className="container">
        <section className="section">
          <h2>➕ Adicionar Novo Produto</h2>
          <ProductForm onSubmit={handleCriarProduto} />
        </section>

        <section className="section">
          <div className="section-header">
            <h2>📦 Lista de Produtos</h2>
            <button
              className="btn btn-refresh"
              onClick={carregarProdutos}
              disabled={loading}
            >
              🔄 {loading ? 'Atualizando...' : 'Atualizar Lista'}
            </button>
          </div>

          {loading && produtos.length === 0 ? (
            <div className="loading">⏳ Carregando produtos...</div>
          ) : produtos.length === 0 ? (
            <div className="empty-state">
              <p>📭 Nenhum produto encontrado.</p>
              <p>Adicione seu primeiro produto acima!</p>
            </div>
          ) : (
            <div className="products-grid">
              {produtos.map(produto => (
                <ProductCard
                  key={produto.id}
                  produto={produto}
                  onEdit={setEditingProduto}
                  onDelete={handleDeletarProduto}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />

      {editingProduto && (
        <EditModal
          produto={editingProduto}
          onClose={() => setEditingProduto(null)}
          onSave={handleAtualizarProduto}
        />
      )}

      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};

