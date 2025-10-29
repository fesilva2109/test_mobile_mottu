import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, ColorsType } from '@/theme/colors';
import i18n from '@/i18n';
import { getLocales } from 'expo-localization';

type ThemeType = 'light' | 'dark';
type LanguageType = 'pt' | 'es';

interface ThemeContextType {
  theme: ThemeType;
  colors: ColorsType;
  toggleTheme: () => void;
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (scope: any, options?: any) => string;
  reloadPreferences: () => void;
}
const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_KEY = '@mottu:theme';
const LANGUAGE_KEY = '@mottu:language';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [language, setLanguageState] = useState<LanguageType>('pt');
  const colors = theme === 'light' ? lightColors : darkColors;

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (storedTheme === 'dark' || storedTheme === 'light') {
          setTheme(storedTheme as ThemeType);
        }

        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (storedLanguage === 'pt' || storedLanguage === 'es') {
          setLanguageState(storedLanguage as LanguageType);
          i18n.locale = storedLanguage;
        } else {
          const deviceLanguage = getLocales()[0]?.languageCode;
          const initialLang = deviceLanguage === 'es' ? 'es' : 'pt';
          setLanguageState(initialLang);
          i18n.locale = initialLang;
        }
      } catch (error) {
        console.error('Erro ao carregar tema ou idioma:', error);
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

  const setLanguage = async (lang: LanguageType) => {
    setLanguageState(lang);
    i18n.locale = lang;
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    } catch (error) {
      console.error('Erro ao salvar idioma:', error);
    }
  };

  // Função de tradução para ser usada nos componentes
  const t = useCallback((scope: any, options?: any) => i18n.t(scope, options), [language]);

  const reloadPreferences = useCallback(async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setTheme(storedTheme as ThemeType);
      } else {
        setTheme('light');
      }

      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (storedLanguage === 'pt' || storedLanguage === 'es') {
        setLanguageState(storedLanguage as LanguageType);
        i18n.locale = storedLanguage;
      } else {
        setLanguageState('pt');
        i18n.locale = 'pt';
      }
    } catch (error) {
      console.error('Erro ao recarregar preferências:', error);
      setTheme('light');
      setLanguageState('pt');
      i18n.locale = 'pt';
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, language, setLanguage, t, reloadPreferences }}>
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
