import React from 'react';
import { Tabs } from 'expo-router';
import { ScanLine, Map, ChartBar as BarChart3, Clock, Home } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { colors, t } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.neutral.gray,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.neutral.white,
          borderTopColor: colors.neutral.lightGray,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      {/* Tela inicial do aplicativo */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      
      {/* Tela para cadastrar novas motos */}
      <Tabs.Screen
        name="cadastro"
        options={{
          title: t('tabs.register'),
          tabBarIcon: ({ color, size }) => <ScanLine color={color} size={size} />,
        }}
      />
      
      {/* Tela do mapa com posicionamento das motos */}
      <Tabs.Screen
        name="mapa"
        options={{
          title: t('tabs.map'),
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />
      
      {/* Tela de estatísticas e relatórios */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('tabs.dashboard'),
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
        }}
      />
      
      {/* Tela do histórico de movimentações */}
      <Tabs.Screen
        name="historico"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}