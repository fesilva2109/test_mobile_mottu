import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, ColorsType } from '@/theme/colors';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  colors: ColorsType;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_KEY = '@mottu:theme';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const colors = theme === 'light' ? lightColors : darkColors;

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (storedTheme === 'dark' || storedTheme === 'light') {
          setTheme(storedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Erro ao carregar tema:', error);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};
