import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { VictoryPie, VictoryLegend } from 'victory-native';
import { Motorcycle, MotorcycleStatus } from '@/types/motorcycle';
import Colors from '@/constants/Colors';
import Card from '@/components/ui/Card';

interface StatusChartProps {
  motorcycles: Motorcycle[];
  title?: string;
}

const { width } = Dimensions.get('window');
const chartWidth = width - 48;

const StatusChart: React.FC<StatusChartProps> = ({ 
  motorcycles,
  title = 'Motorcycle Status Distribution'
}) => {
  const statusCounts = motorcycles.reduce((acc, motorcycle) => {
    if (!acc[motorcycle.status]) {
      acc[motorcycle.status] = 0;
    }
    acc[motorcycle.status]++;
    return acc;
  }, {} as Record<MotorcycleStatus, number>);

  const chartData = Object.entries(statusCounts)
    .map(([status, count]) => ({ 
      x: status, 
      y: count,
      label: `${Math.round((count / motorcycles.length) * 100)}%`
    }));

  const getStatusColors = () => {
    return [
      Colors.status.pronta,
      Colors.status.manutenção,
      Colors.status.reservada,
      Colors.status.indisponivel,
      Colors.status.transito,
    ];
  };

  const getStatusLabels = () => {
    return [
      { name: 'Available', symbol: { fill: Colors.status.pronta } },
      { name: 'Maintenance', symbol: { fill: Colors.status.manutenção } },
      { name: 'Reserved', symbol: { fill: Colors.status.reservada } },
      { name: 'Unavailable', symbol: { fill: Colors.status.indisponivel } },
      { name: 'In Transit', symbol: { fill: Colors.status.transito } },
    ];
  };

  return (
    <Card title={title}>
      <View style={styles.container}>
        {motorcycles.length > 0 ? (
          <>
            <View style={styles.chartContainer}>
              <VictoryPie
                data={chartData}
                width={chartWidth * 0.8}
                height={200}
                colorScale={getStatusColors()}
                innerRadius={70}
                padAngle={1}
                labelRadius={80}
                style={{
                  labels: {
                    fill: Colors.neutral[800],
                    fontSize: 14,
                    fontWeight: 'bold',
                  },
                }}
              />
              <View style={styles.totalContainer}>
                <Text style={styles.totalNumber}>{motorcycles.length}</Text>
                <Text style={styles.totalLabel}>Total</Text>
              </View>
            </View>
            <VictoryLegend
              x={0}
              y={0}
              width={chartWidth}
              centerTitle
              orientation="horizontal"
              gutter={20}
              style={{ 
                labels: { 
                  fontSize: 12, 
                  fontFamily: 'Inter-Medium',
                  fill: Colors.neutral[700]
                } 
              }}
              data={getStatusLabels()}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No motorcycle data available</Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 16,
  },
  totalContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.neutral[800],
  },
  totalLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[500],
  },
  emptyState: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[500],
  },
});

export default StatusChart;