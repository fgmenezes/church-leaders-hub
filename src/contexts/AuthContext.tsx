
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

type User = {
  id: string;
  name: string;
  role: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciais de teste
const TEST_EMAIL = "admin@igreja.com";
const TEST_PASSWORD = "ministerio123";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado quando o componente é montado
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Função de login com credenciais de teste
  const login = async (email: string, password: string) => {
    // Verifica se as credenciais correspondem às credenciais de teste
    if (email === TEST_EMAIL && password === TEST_PASSWORD) {
      const mockUser = {
        id: '1',
        name: 'Líder do Ministério',
        role: 'leader',
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Exibe um toast de boas-vindas
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo, ${mockUser.name}!`,
      });
      
      navigate('/');
    } else {
      throw new Error('Credenciais inválidas');
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}
