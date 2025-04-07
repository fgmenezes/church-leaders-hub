
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Função para definir os temas
const setTheme = (theme: 'light' | 'dark' | 'system') => {
  // Primeiro salvar a preferência no localStorage
  localStorage.setItem('theme', theme);
  
  const isDark = 
    theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Aplicar a classe 'dark' ao documento
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const ThemeToggle = () => {
  const [theme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [isOpen, setIsOpen] = useState(false);
  
  // Inicializar o tema ao carregar o componente
  useEffect(() => {
    // Verificar se existe uma preferência salva
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    const initialTheme = savedTheme || 'light';
    
    setCurrentTheme(initialTheme);
    setTheme(initialTheme);
    
    // Adicionar listener para mudanças de tema do sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (localStorage.getItem('theme') === 'system') {
        setTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setCurrentTheme(value);
    setTheme(value);
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          {theme === 'dark' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Alternar tema</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52" align="end">
        <div className="space-y-2">
          <h4 className="font-medium">Aparência</h4>
          <p className="text-xs text-muted-foreground">
            Escolha como deseja visualizar a aplicação.
          </p>
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(value) => {
              if (value) handleThemeChange(value as 'light' | 'dark' | 'system');
            }}
            className="flex flex-col gap-1 mt-3"
          >
            <ToggleGroupItem value="light" className="justify-start gap-2">
              <Sun className="h-4 w-4" />
              <span>Claro</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" className="justify-start gap-2">
              <Moon className="h-4 w-4" />
              <span>Escuro</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
};
