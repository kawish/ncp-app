'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from '@/theme/theme';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    return {
      isDarkMode: false,
      toggleTheme: () => {},
    };
  }
  
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-mode');
    const newMode = savedTheme === 'dark';
    setIsDarkMode(newMode);
    
    // Set initial color-scheme
    if (typeof window !== 'undefined') {
      document.documentElement.style.colorScheme = newMode ? 'dark' : 'light';
    }
    
    setMounted(true);
  }, []);

  // Update color-scheme whenever isDarkMode changes
  useEffect(() => {
    if (!mounted) return;
    
    if (typeof window !== 'undefined') {
      document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
      localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Use the appropriate theme based on isDarkMode
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
