import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar token do localStorage ao iniciar
  useEffect(() => {
    const loadStoredAuth = async () => {
      console.log('🔍 Verificando autenticação armazenada...');
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        console.log('📦 Token encontrado no localStorage');
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verificar se o token ainda é válido
        try {
          const response = await fetch('http://localhost:8000/auth/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });

          if (!response.ok) {
            console.log('❌ Token inválido, limpando...');
            // Token inválido, limpar
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setToken(null);
            setUser(null);
          } else {
            console.log('✅ Token válido!');
          }
        } catch (error) {
          console.error('❌ Erro ao verificar token:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('📭 Nenhum token armazenado encontrado');
      }

      setIsLoading(false);
    };

    loadStoredAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    console.log('🔐 Iniciando login para:', username);
    
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao fazer login');
    }

    const data = await response.json();
    console.log('✅ Resposta do login:', { hasToken: !!data.access_token, hasUser: !!data.user });
    
    setToken(data.access_token);
    setUser(data.user);
    
    console.log('💾 Salvando no localStorage...');
    // Salvar no localStorage
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    
    console.log('🎉 Login concluído! Token e usuário definidos.');
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    console.log('📝 Iniciando registro para:', username);
    
    const response = await fetch('http://localhost:8000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao registrar');
    }

    const data = await response.json();
    console.log('✅ Resposta do registro:', { hasToken: !!data.access_token, hasUser: !!data.user });
    
    setToken(data.access_token);
    setUser(data.user);
    
    console.log('💾 Salvando no localStorage...');
    // Salvar no localStorage
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    
    console.log('🎉 Registro concluído! Token e usuário definidos.');
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }, []);

  // Debug: Log toda vez que token ou user mudarem
  useEffect(() => {
    console.log('📊 AuthContext State Update:', {
      hasToken: !!token,
      hasUser: !!user,
      isAuthenticated: !!token,
      username: user?.username || 'N/A'
    });
  }, [token, user]);

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
