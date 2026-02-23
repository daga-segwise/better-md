import { useState, useEffect } from 'react';
import type { Theme } from '../types';

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('better-md-theme') as Theme | null;
  if (stored && ['light', 'dark', 'nord'].includes(stored)) return stored;
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('better-md-theme', theme);
  }, [theme]);

  return { theme, setTheme };
}
