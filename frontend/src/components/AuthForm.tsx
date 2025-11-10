import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthForm.css';

interface AuthFormProps {
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
      } else {
        if (!email) {
          throw new Error('Email é obrigatório');
        }
        await register(username, email, password);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? '🔐 Login' : '📝 Registro'}</h2>
        <p className="auth-subtitle">
          {isLogin 
            ? 'Entre para acessar o sistema' 
            : 'Crie sua conta para começar'}
        </p>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              placeholder="Digite seu username"
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading 
              ? '⏳ Processando...' 
              : isLogin ? '🚀 Entrar' : '✨ Criar Conta'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? (
            <p>
              Não tem uma conta?{' '}
              <button onClick={toggleMode} className="link-button">
                Registre-se aqui
              </button>
            </p>
          ) : (
            <p>
              Já tem uma conta?{' '}
              <button onClick={toggleMode} className="link-button">
                Faça login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
