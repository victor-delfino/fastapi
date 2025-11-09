import { useState, FormEvent, useEffect } from 'react';
import { Produto, ProdutoUpdate } from '../types';
import './EditModal.css';

interface EditModalProps {
  produto: Produto;
  onClose: () => void;
  onSave: (id: number, updates: ProdutoUpdate) => Promise<void>;
}

export function EditModal({ produto, onClose, onSave }: EditModalProps) {
  const [nome, setNome] = useState(produto.nome);
  const [descricao, setDescricao] = useState(produto.descricao || '');
  const [preco, setPreco] = useState(produto.preco.toString());
  const [estoque, setEstoque] = useState(produto.estoque.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updates: ProdutoUpdate = {};
      
      if (nome !== produto.nome) updates.nome = nome;
      if (descricao !== (produto.descricao || '')) updates.descricao = descricao;
      if (parseFloat(preco) !== produto.preco) updates.preco = parseFloat(preco);
      if (parseInt(estoque, 10) !== produto.estoque) updates.estoque = parseInt(estoque, 10);

      await onSave(produto.id, updates);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Editar Produto</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-nome">Nome do Produto:</label>
            <input
              type="text"
              id="edit-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-descricao">Descrição:</label>
            <textarea
              id="edit-descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-preco">Preço (R$):</label>
              <input
                type="number"
                id="edit-preco"
                step="0.01"
                min="0"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-estoque">Estoque:</label>
              <input
                type="number"
                id="edit-estoque"
                min="0"
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Salvando...' : '💾 Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
