import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Info, LogOut, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLogout } from '@/components/Logout';

export default function MoreScreen() {
  const router = useRouter();
  const { colors, t } = useTheme();
  const { logout } = useLogout();
  const styles = getStyles(colors);

  const menuItems = [
    {
      icon: <Clock color={colors.primary.main} size={24} />,
      label: t('tabs.history'),
      onPress: () => router.push('/historico'),
    },
    {
      icon: <Info color={colors.primary.main} size={24} />,
      label: t('about.title'),
      onPress: () => router.push('/sobre'),
    },
    {
      icon: <LogOut color={colors.status.quarantine} size={24} />,
      label: t('home.logout'),
      onPress: logout,
      isDestructive: true,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('tabs.more')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuItemIcon}>{item.icon}</View>
            <Text style={[styles.menuItemText, item.isDestructive && styles.destructiveText]}>
              {item.label}
            </Text>
            <ChevronRight color={colors.neutral.gray} size={20} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightGray,
  },
  header: {
    backgroundColor: colors.primary.main,
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.neutral.white,
    textAlign: 'center',
    paddingVertical: 4, // Adicionado para evitar corte de texto
  },
  content: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.lighter,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.darkGray,
  },
  destructiveText: {
    color: colors.status.quarantine,
  },
});