import { useState, useEffect, useCallback } from 'react';
import { Produto, ProdutoCreate, ProdutoUpdate, Alert } from './types';
import { produtoService } from './services/api';
import { AlertSystem } from './components/AlertSystem';
import { ProductForm } from './components/ProductForm';
import { ProductCard } from './components/ProductCard';
import { EditModal } from './components/EditModal';
import './App.css';

function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [nextAlertId, setNextAlertId] = useState(1);

  const addAlert = useCallback((message: string, type: Alert['type'] = 'success') => {
    const id = nextAlertId;
    setNextAlertId(id + 1);
    setAlerts(prev => [...prev, { id, message, type }]);
  }, [nextAlertId]);

  const dismissAlert = useCallback((id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const carregarProdutos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await produtoService.listarProdutos();
      setProdutos(data);
    } catch (error) {
      addAlert('Erro ao carregar produtos. Verifique se a API está rodando.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [addAlert]);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const handleCriarProduto = async (produto: ProdutoCreate) => {
    try {
      const novoProduto = await produtoService.criarProduto(produto);
      setProdutos(prev => [...prev, novoProduto]);
      addAlert('Produto criado com sucesso!', 'success');
    } catch (error) {
      addAlert('Erro ao criar produto: ' + (error as Error).message, 'error');
      throw error;
    }
  };

  const handleAtualizarProduto = async (id: number, updates: ProdutoUpdate) => {
    try {
      const produtoAtualizado = await produtoService.atualizarProduto(id, updates);
      setProdutos(prev => prev.map(p => p.id === id ? produtoAtualizado : p));
      addAlert('Produto atualizado com sucesso!', 'success');
    } catch (error) {
      addAlert('Erro ao atualizar produto: ' + (error as Error).message, 'error');
      throw error;
    }
  };

  const handleDeletarProduto = async (id: number) => {
    try {
      await produtoService.deletarProduto(id);
      setProdutos(prev => prev.filter(p => p.id !== id));
      addAlert('Produto deletado com sucesso!', 'success');
    } catch (error) {
      addAlert('Erro ao deletar produto: ' + (error as Error).message, 'error');
    }
  };

  return (
    <div className="app">
      <AlertSystem alerts={alerts} onDismiss={dismissAlert} />

      <div className="container">
        <header className="app-header">
          <h1>🛍️ Sistema de Gerenciamento de Produtos</h1>
          <p className="subtitle">Aplicação React moderna integrada com FastAPI</p>
        </header>

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

      {editingProduto && (
        <EditModal
          produto={editingProduto}
          onClose={() => setEditingProduto(null)}
          onSave={handleAtualizarProduto}
        />
      )}
    </div>
  );
}

export default App;
