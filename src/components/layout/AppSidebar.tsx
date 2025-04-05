
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Home, 
  Users, 
  Calendar, 
  ListTodo, 
  Settings, 
  BarChart3, 
  ChevronRight, 
  Menu,
  UserPlus,
  LogOut,
  UsersRound
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  isCollapsed: boolean;
  active?: boolean;
};

const NavItem = ({ icon: Icon, label, to, isCollapsed, active }: NavItemProps) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-all duration-300 ease-in-out",
        active 
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!isCollapsed && (
        <span className="text-sm animate-fade-in">{label}</span>
      )}
    </Link>
  );
};

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const routes = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Membros', path: '/membros' },
    { icon: UsersRound, label: 'Pequenos Grupos', path: '/pequenos-grupos' },
    { icon: Calendar, label: 'Eventos', path: '/eventos' },
    { icon: ListTodo, label: 'Agendas', path: '/agendas' },
    { icon: UserPlus, label: 'Auto Indicação', path: '/auto-indicacao' },
    { icon: BarChart3, label: 'Relatórios', path: '/relatorios' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];
  
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  
  const sidebarContent = (
    <div className={cn(
      "h-screen bg-sidebar flex flex-col",
      isCollapsed ? "w-[70px]" : "w-[240px]",
      isMobile && "fixed top-0 left-0 z-40 h-full",
      isMobile && !isMobileOpen && "transform -translate-x-full",
    )}>
      <div className="px-3 py-4 flex items-center justify-between border-b border-sidebar-border">
        {!isCollapsed && (
          <h1 className="text-sidebar-foreground text-lg font-semibold">
            Ministérios
          </h1>
        )}
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-sidebar-foreground ml-auto"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        )}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileSidebar}
            className="text-sidebar-foreground ml-auto"
          >
            <ChevronLeft size={18} />
          </Button>
        )}
      </div>
      
      <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto px-2">
        {routes.map((route) => (
          <NavItem 
            key={route.path}
            icon={route.icon}
            label={route.label}
            to={route.path}
            isCollapsed={isCollapsed}
            active={location.pathname === route.path}
          />
        ))}
      </div>
      
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className={cn(
          "flex items-center gap-3", 
          isCollapsed && "justify-center"
        )}>
          <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground">
            {user?.name.charAt(0) || 'L'}
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in flex-1">
              <p className="text-sidebar-foreground text-sm font-medium">{user?.name || 'Líder'}</p>
              <p className="text-sidebar-foreground/70 text-xs">Ministério</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            title="Sair"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-30 bg-background/50 backdrop-blur-md border rounded-md shadow-sm"
          onClick={toggleMobileSidebar}
        >
          <Menu size={18} />
        </Button>
      )}
      
      {/* Overlay para mobile quando o sidebar está aberto */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={toggleMobileSidebar}
        />
      )}
      
      {sidebarContent}
    </>
  );
}
