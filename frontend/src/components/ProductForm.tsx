import { useState, FormEvent } from 'react';
import { ProdutoCreate } from '../types';
import './ProductForm.css';

interface ProductFormProps {
  onSubmit: (produto: ProdutoCreate) => Promise<void>;
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        nome,
        descricao: descricao || undefined,
        preco: parseFloat(preco),
        estoque: parseInt(estoque, 10),
      });

      // Limpar formulário após sucesso
      setNome('');
      setDescricao('');
      setPreco('');
      setEstoque('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nome">Nome do Produto:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="preco">Preço (R$):</label>
          <input
            type="number"
            id="preco"
            step="0.01"
            min="0"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="estoque">Quantidade em Estoque:</label>
          <input
            type="number"
            id="estoque"
            min="0"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? '⏳ Criando...' : '➕ Criar Produto'}
      </button>
    </form>
  );
}
