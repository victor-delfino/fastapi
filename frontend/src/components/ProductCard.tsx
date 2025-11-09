import { Produto } from '../types';
import './ProductCard.css';

interface ProductCardProps {
  produto: Produto;
  onEdit: (produto: Produto) => void;
  onDelete: (id: number) => void;
}

export function ProductCard({ produto, onEdit, onDelete }: ProductCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja deletar "${produto.nome}"?`)) {
      onDelete(produto.id);
    }
  };

  return (
    <div className="product-card">
      <h3 className="product-name">{produto.nome}</h3>
      <div className="product-info">
        <p className="product-description">
          {produto.descricao || 'Sem descrição'}
        </p>
        <p className="product-price">R$ {produto.preco.toFixed(2)}</p>
        <p className="product-stock">
          Estoque: <span className="stock-value">{produto.estoque}</span> unidades
        </p>
      </div>
      <div className="product-actions">
        <button
          className="btn btn-edit"
          onClick={() => onEdit(produto)}
          aria-label="Editar produto"
        >
          ✏️ Editar
        </button>
        <button
          className="btn btn-delete"
          onClick={handleDelete}
          aria-label="Deletar produto"
        >
          🗑️ Deletar
        </button>
      </div>
    </div>
  );
}
