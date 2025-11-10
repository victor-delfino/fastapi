export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  user_id: number;
}

export interface ProdutoCreate {
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
}

export interface ProdutoUpdate {
  nome?: string;
  descricao?: string;
  preco?: number;
  estoque?: number;
}

export type AlertType = 'success' | 'error' | 'info';

export interface Alert {
  id: number;
  message: string;
  type: AlertType;
}
