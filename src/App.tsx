
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Index";
import Membros from "./pages/Membros";
import MembroPerfil from "./pages/MembroPerfil";
import Eventos from "./pages/Eventos";
import Agendas from "./pages/Agendas";
import AutoIndicacao from "./pages/AutoIndicacao";
import PequenosGrupos from "./pages/PequenosGrupos";
import PequenoGrupoPerfil from "./pages/PequenoGrupoPerfil";
import PequenoGrupoMembros from "./pages/PequenoGrupoMembros";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { MembersProvider } from "./contexts/MembersContext";
import { SmallGroupsProvider } from "./contexts/SmallGroupsContext";

const queryClient = new QueryClient();

const App = () => (
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
                    <Route path="/membros" element={<Membros />} />
                    <Route path="/membros/:id" element={<MembroPerfil />} />
                    <Route path="/membros/editar/:id" element={<MembroPerfil />} />
                    <Route path="/membros/novo" element={<MembroPerfil />} />
                    <Route path="/eventos" element={<Eventos />} />
                    <Route path="/agendas" element={<Agendas />} />
                    <Route path="/auto-indicacao" element={<AutoIndicacao />} />
                    
                    {/* Novas rotas para Pequenos Grupos */}
                    <Route path="/pequenos-grupos" element={<PequenosGrupos />} />
                    <Route path="/pequenos-grupos/:id" element={<PequenoGrupoPerfil />} />
                    <Route path="/pequenos-grupos/membros/:id" element={<PequenoGrupoMembros />} />
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

export default App;
