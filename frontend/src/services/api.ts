import { Produto, ProdutoCreate, ProdutoUpdate } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => 'Erro desconhecido');
    throw new ApiError(response.status, text || response.statusText);
  }
  
  // DELETE pode retornar 204 sem body
  if (response.status === 204) {
    return undefined as T;
  }
  
  return response.json();
}

export const produtoService = {
  async listarProdutos(): Promise<Produto[]> {
    const response = await fetch(`${API_BASE_URL}/produtos`);
    return handleResponse<Produto[]>(response);
  },

  async obterProduto(id: number): Promise<Produto> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`);
    return handleResponse<Produto>(response);
  },

  async criarProduto(produto: ProdutoCreate): Promise<Produto> {
    const response = await fetch(`${API_BASE_URL}/produtos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produto),
    });
    return handleResponse<Produto>(response);
  },

  async atualizarProduto(id: number, produto: ProdutoUpdate): Promise<Produto> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produto),
    });
    return handleResponse<Produto>(response);
  },

  async deletarProduto(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};
