
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
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
