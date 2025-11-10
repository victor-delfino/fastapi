import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

interface UserProfileProps {
  onClose: () => void;
}

export const UserProfile = ({ onClose }: UserProfileProps) => {
  const { user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      setMessage({ type: 'error', text: 'Digite sua senha atual para alterar a senha' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:8000/auth/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          current_password: formData.currentPassword || null,
          new_password: formData.newPassword || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erro ao atualizar informações');
      }

      await response.json(); // Confirmar sucesso
      
      setMessage({ type: 'success', text: 'Informações atualizadas com sucesso!' });
      setIsEditing(false);
      
      // Limpar campos de senha
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Se alterou a senha, fazer login novamente
      if (formData.newPassword) {
        setMessage({ type: 'success', text: 'Senha alterada! Faça login novamente.' });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erro ao atualizar informações' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h2>👤 Meu Perfil</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="profile-content">
          {message && (
            <div className={`profile-message ${message.type}`}>
              {message.type === 'success' ? '✅' : '❌'} {message.text}
            </div>
          )}

          {!isEditing ? (
            <div className="profile-view">
              <div className="profile-avatar">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              
              <div className="profile-info">
                <div className="info-item">
                  <label>Nome de usuário</label>
                  <p>{user?.username}</p>
                </div>
                
                <div className="info-item">
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>
                
                <div className="info-item">
                  <label>ID do usuário</label>
                  <p>#{user?.id}</p>
                </div>
              </div>

              <button 
                className="edit-profile-button"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Editar Perfil
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Nome de usuário</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Seu nome de usuário"
                  disabled
                />
                <small>O nome de usuário não pode ser alterado</small>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <hr />
              <h3>Alterar Senha</h3>

              <div className="form-group">
                <label>Senha Atual</label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="Digite sua senha atual"
                />
              </div>

              <div className="form-group">
                <label>Nova Senha</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Digite a nova senha"
                />
              </div>

              <div className="form-group">
                <label>Confirmar Nova Senha</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirme a nova senha"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button type="submit" className="save-button" disabled={isLoading}>
                  {isLoading ? '⏳ Salvando...' : '💾 Salvar Alterações'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
