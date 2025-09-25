import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  size?: number;
  style?: any;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 24, style }) => {
  const { theme, toggleTheme, colors } = useTheme();

  const getStyles = (colors: any) => StyleSheet.create({
    button: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.neutral.lightGray,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const styles = getStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      {theme === 'light' ? (
        <Moon size={size} color={colors.neutral.gray} />
      ) : (
        <Sun size={size} color={colors.neutral.black} />
      )}
    </TouchableOpacity>
  );
};
