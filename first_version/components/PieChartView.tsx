import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

// Componente simulado para gráfico de pizza
// Na versão real, usaríamos Victory Native ou react-native-svg-charts
// Este é apenas um placeholder visual para demonstração

type PieChartDataItem = {
  label: string;
  value: number;
  color: string;
};

type PieChartViewProps = {
  data: PieChartDataItem[];
};

export default function PieChartView({ data }: PieChartViewProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calcular porcentagens para cada item
  data.forEach(item => {
    item['percentage'] = Math.round((item.value / total) * 100);
  });

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {/* Gráfico simulado */}
        <View style={styles.pieChartSimulation}>
          {data.map((item, index) => {
            // Simular divisões de pizza com cores
            const rotation = index * (360 / data.length);
            return (
              <View
                key={item.label}
                style={[
                  styles.pieSlice,
                  {
                    backgroundColor: item.color,
                    transform: [{ rotate: `${rotation}deg` }],
                    height: `${Math.max(item.percentage, 10)}%`,
                    width: `${Math.max(item.percentage, 10)}%`,
                    borderRadius: Math.max(item.percentage, 10),
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.legendContainer}>
        {data.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.label}: {item.percentage}% ({item.value})
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    height: 150,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartSimulation: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#EEEEEE',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieSlice: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '60%',
    height: '60%',
  },
  legendContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: Colors.text,
  },
});