import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

// Componente simulado para gráfico de barras
// Na versão real, usaríamos Victory Native ou react-native-svg-charts
// Este é apenas um placeholder visual para demonstração

type BarChartDataItem = {
  day: string;
  available: number;
  maintenance: number;
};

type BarChartViewProps = {
  data: BarChartDataItem[];
};

export default function BarChartView({ data }: BarChartViewProps) {
  // Encontrar o valor máximo para escala
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.available, item.maintenance))
  );

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={item.day} style={styles.barGroup}>
            <Text style={styles.barLabel}>{item.day}</Text>
            <View style={styles.barsContainer}>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    styles.availableBar,
                    { height: `${(item.available / maxValue) * 100}%` }
                  ]} 
                />
              </View>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    styles.maintenanceBar,
                    { height: `${(item.maintenance / maxValue) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.success }]} />
          <Text style={styles.legendText}>Disponíveis</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.warning }]} />
          <Text style={styles.legendText}>Em Manutenção</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chartContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingLeft: 30,
    paddingRight: 10,
    paddingTop: 20,
  },
  barGroup: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 40,
  },
  barLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.darkGray,
    marginTop: 8,
  },
  barsContainer: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
  },
  barWrapper: {
    width: 15,
    height: 150,
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: 2,
  },
  bar: {
    width: '100%',
    minHeight: 5,
    borderRadius: 3,
  },
  availableBar: {
    backgroundColor: Colors.success,
  },
  maintenanceBar: {
    backgroundColor: Colors.warning,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: Colors.text,
  },
});