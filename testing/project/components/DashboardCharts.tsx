import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { YardMetrics } from '@/constants/Types';
import { VictoryPie, VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

interface DashboardChartsProps {
  motorcycles: any[];
  metrics: YardMetrics;
}

export default function DashboardCharts({ motorcycles, metrics }: DashboardChartsProps) {
  // Calculate status distribution
  const statusCounts = motorcycles.reduce((acc, motorcycle) => {
    const status = motorcycle.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  // Prepare data for pie chart
  const pieChartData = Object.entries(statusCounts).map(([status, count]) => ({
    x: status,
    y: count,
    label: `${count}`,
  }));
  
  // Get color for status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pronta para aluguel':
        return Colors.status.ready;
      case 'Em manutenção':
      case 'Em reparo emergencial':
        return Colors.status.maintenance;
      case 'Em quarentena':
        return Colors.status.quarantine;
      case 'Aguardando vistoria':
        return Colors.status.waiting;
      default:
        return Colors.neutral.gray;
    }
  };
  
  // Get colors for pie chart
  const pieChartColors = Object.keys(statusCounts).map(status => getStatusColor(status));
  
  // Data for bar chart (average time by model)
  const modelData = motorcycles.reduce((acc, motorcycle) => {
    const model = motorcycle.modelo;
    if (!acc[model]) {
      acc[model] = { total: 0, count: 0 };
    }
    acc[model].total += motorcycle.timeInYard || 0;
    acc[model].count += 1;
    return acc;
  }, {});
  
  const barChartData = Object.entries(modelData).map(([model, data]: [string, any]) => ({
    x: model,
    y: data.count > 0 ? Math.round(data.total / data.count * 10) / 10 : 0,
  }));
  
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40;
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Distribuição por Status</Text>
        <View style={styles.pieChartContainer}>
          <VictoryPie
            data={pieChartData}
            width={chartWidth}
            height={220}
            colorScale={pieChartColors}
            innerRadius={50}
            labelRadius={70}
            style={{
              labels: {
                fill: 'white',
                fontSize: 14,
                fontWeight: 'bold',
              },
            }}
          />
        </View>
        <View style={styles.legendContainer}>
          {Object.keys(statusCounts).map((status) => (
            <View key={status} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor, 
                  { backgroundColor: getStatusColor(status) }
                ]} 
              />
              <Text style={styles.legendText}>{status}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Tempo Médio no Pátio (dias)</Text>
        <VictoryChart
          theme={VictoryTheme.material}
          width={chartWidth}
          height={200}
          domainPadding={{ x: 30 }}
        >
          <VictoryAxis
            style={{
              tickLabels: { fontSize: 10, padding: 5 }
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 10, padding: 5 }
            }}
          />
          <VictoryBar
            data={barChartData}
            style={{
              data: { 
                fill: Colors.primary.default,
                width: 30,
              }
            }}
            animate={{
              duration: 500,
              onLoad: { duration: 300 }
            }}
          />
        </VictoryChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  chartContainer: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.dark,
    marginBottom: 15,
    textAlign: 'center',
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: Colors.neutral.dark,
  },
});