
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Index";
import Membros from "./pages/Membros";
import MembroPerfil from "./pages/MembroPerfil";
import Lideres from "./pages/Lideres";
import LiderPerfil from "./pages/LiderPerfil";
import Eventos from "./pages/Eventos";
import Agendas from "./pages/Agendas";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
// Importação removida de Auto-Indicação
import PequenosGrupos from "./pages/PequenosGrupos";
import PequenoGrupoPerfil from "./pages/PequenoGrupoPerfil";
import PequenoGrupoMembros from "./pages/PequenoGrupoMembros";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { MembersProvider } from "./contexts/MembersContext";
import { SmallGroupsProvider } from "./contexts/SmallGroupsContext";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Initialize theme from localStorage
const initializeTheme = () => {
  // Check if theme exists in localStorage
  const theme = localStorage.getItem('theme');
  
  // If theme is set to dark or system preference is dark, apply dark class
  const isDarkMode = 
    theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const App = () => {
  // Initialize theme when app loads
  useEffect(() => {
    initializeTheme();
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (localStorage.getItem('theme') === 'system') {
        initializeTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <MembersProvider>
              <SmallGroupsProvider>
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Rotas protegidas */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/membros/novo" element={<MembroPerfil />} />
                      <Route path="/membros/editar/:id" element={<MembroPerfil />} />
                      <Route path="/membros/:id" element={<MembroPerfil />} />
                      <Route path="/membros" element={<Membros />} />
                      <Route path="/lideres" element={<Lideres />} />
                      <Route path="/lideres/:id" element={<LiderPerfil />} />
                      <Route path="/lideres/:id/detalhes" element={<LiderPerfil isViewMode={true} />} />
                      <Route path="/lideres/novo" element={<LiderPerfil />} />
                      <Route path="/eventos" element={<Eventos />} />
                      <Route path="/agendas" element={<Agendas />} />
                      <Route path="/relatorios" element={<Relatorios />} />
                      <Route path="/configuracoes" element={<Configuracoes />} />
                      {/* Rota de Auto-Indicação removida */}
                      <Route path="/perfil" element={<UserProfile />} />
                      
                      {/* Rotas para Pequenos Grupos */}
                      <Route path="/pequenos-grupos/membros/:id" element={<PequenoGrupoMembros />} />
                      <Route path="/pequenos-grupos/:id" element={<PequenoGrupoPerfil />} />
                      <Route path="/pequenos-grupos" element={<PequenosGrupos />} />
                    </Route>
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SmallGroupsProvider>
            </MembersProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
