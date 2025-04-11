
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Define a User type that includes profile information
type User = {
  id: string;
  email: string;
  nome?: string;
  cargo?: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, nome: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado quando o componente é montado
  useEffect(() => {
    // Verifica a sessão atual
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Obter sessão atual do supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          await setUserFromSession(session);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Configura listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          await setUserFromSession(session);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper para buscar e configurar o usuário a partir da sessão
  const setUserFromSession = async (session: Session) => {
    const supabaseUser = session.user;
    
    // Buscar dados do perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    setUser({
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      nome: profile?.nome,
      cargo: profile?.cargo
    });
  };

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Exibe um toast de boas-vindas
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao sistema de gestão!",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  };

  // Função de cadastro
  const signup = async (email: string, password: string, nome: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado",
        description: "Sua conta foi criada com sucesso!",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      throw new Error(error.message || 'Erro ao criar conta');
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      navigate('/login');
      
      toast({
        title: "Logout realizado",
        description: "Você saiu do sistema com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: error.message || "Ocorreu um erro ao tentar sair do sistema.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup,
      logout 
    }}>
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
