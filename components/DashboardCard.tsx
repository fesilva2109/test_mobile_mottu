import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Recycle as Motorcycle, ChartBar as BarChart2, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface DashboardCardProps {
  title: string;
  value: string;
  iconName: string;
  color: string;
}

export function DashboardCard({ title, value, iconName, color }: DashboardCardProps) {
  const { colors } = useTheme();

  const renderIcon = () => {
    switch (iconName) {
      case 'motorcycle':
        return <Motorcycle size={24} color={color} />;
      case 'chart':
        return <BarChart2 size={24} color={color} />;
      case 'clock':
        return <Clock size={24} color={color} />;
      case 'check-circle':
        return <CheckCircle size={24} color={color} />;
      case 'warning':
        return <AlertTriangle size={24} color={color} />;
      case 'alert':
        return <AlertCircle size={24} color={color} />;
      default:
        return <Motorcycle size={24} color={color} />;
    }
  };

  const getStyles = (colors: any) => StyleSheet.create({
    container: {
      backgroundColor: colors.neutral.white,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      width: '31%',
      elevation: 2,
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    iconContainer: {
      marginBottom: 12,
    },
    value: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.neutral.black,
      marginBottom: 4,
    },
    title: {
      fontSize: 12,
      color: colors.neutral.gray,
      textAlign: 'center',
    },
  });

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
