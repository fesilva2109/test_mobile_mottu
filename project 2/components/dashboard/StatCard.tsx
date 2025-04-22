import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  change,
}) => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.footer}>
        {change && (
          <View 
            style={[
              styles.changeContainer,
              { backgroundColor: change.isPositive ? Colors.status.available + '20' : Colors.status.unavailable + '20' }
            ]}
          >
            <Text 
              style={[
                styles.changeText,
                { color: change.isPositive ? Colors.status.available : Colors.status.unavailable }
              ]}
            >
              {change.isPositive ? '+' : ''}{change.value}%
            </Text>
          </View>
        )}
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    minWidth: 160,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    backgroundColor: Colors.primary[100],
    borderRadius: 8,
    padding: 8,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[600],
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.neutral[800],
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  changeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[500],
  },
});

export default StatCard;