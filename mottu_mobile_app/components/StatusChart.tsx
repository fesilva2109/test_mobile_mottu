import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

interface StatusChartProps {
  data: Record<string, number>;
}

export function StatusChart({ data }: StatusChartProps) {
  // Calculate total
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  
  // Check if we have data
  if (total === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sem dados disponíveis</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {Object.entries(data).map(([status, count]) => {
        // Skip if count is 0
        if (count === 0) return null;
        
        // Calculate percentage
        const percentage = (count / total) * 100;
        
        return (
          <View key={status} style={styles.barContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{status}</Text>
              <Text style={styles.count}>{count}</Text>
            </View>
            <View style={styles.barBackground}>
              <View 
                style={[
                  styles.bar,
                  { 
                    width: `${percentage}%`,
                    backgroundColor: getStatusColor(status)
                  }
                ]} 
              />
            </View>
            <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
          </View>
        );
      })}
    </View>
  );
}

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Pronta para aluguel':
      return colors.status.ready;
    case 'Em manutenção':
      return colors.status.maintenance;
    case 'Em quarentena':
      return colors.status.quarantine;
    case 'Alta prioridade':
      return colors.status.priority;
    case 'Reservada':
      return colors.status.reserved;
    case 'Aguardando vistoria':
      return colors.status.waiting;
    default:
      return colors.status.waiting;
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.neutral.gray,
    fontSize: 16,
  },
  barContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: colors.neutral.darkGray,
  },
  count: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.neutral.black,
  },
  barBackground: {
    height: 12,
    backgroundColor: colors.neutral.lightGray,
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 6,
  },
  percentage: {
    fontSize: 12,
    color: colors.neutral.gray,
    marginTop: 2,
    textAlign: 'right',
  },
});