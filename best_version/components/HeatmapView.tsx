import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Colors from '@/constants/Colors';

// Componente simulado para heatmap
// Na versão real, usaríamos bibliotecas como react-native-maps com heatmap
// Este é apenas um placeholder visual para demonstração

export default function HeatmapView() {
  // Dados simulados de ocupação por área
  const heatmapData = [
    [0.9, 0.8, 0.7, 0.5, 0.3, 0.2, 0.4, 0.6],
    [0.7, 0.8, 0.6, 0.4, 0.3, 0.4, 0.5, 0.7],
    [0.5, 0.6, 0.7, 0.8, 0.5, 0.3, 0.4, 0.5],
    [0.3, 0.4, 0.6, 0.7, 0.8, 0.6, 0.4, 0.3],
    [0.2, 0.3, 0.4, 0.5, 0.7, 0.8, 0.6, 0.4],
  ];

  // Função para transformar valor de ocupação em cor
  const getHeatColor = (value: number) => {
    if (value >= 0.8) return 'rgba(255, 0, 0, 0.8)'; // Vermelho para alta ocupação
    if (value >= 0.6) return 'rgba(255, 165, 0, 0.7)'; // Laranja para média-alta
    if (value >= 0.4) return 'rgba(255, 255, 0, 0.6)'; // Amarelo para média
    if (value >= 0.2) return 'rgba(144, 238, 144, 0.6)'; // Verde claro para baixa-média
    return 'rgba(0, 255, 0, 0.5)'; // Verde para baixa ocupação
  };

  return (
    <View style={styles.container}>
      <View style={styles.heatmapContainer}>
        {heatmapData.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.heatmapRow}>
            {row.map((value, colIndex) => (
              <View
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.heatmapCell,
                  { backgroundColor: getHeatColor(value) },
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendText}>Baixa</Text>
        <View style={styles.gradientLegend}>
          <View style={[styles.legendItem, { backgroundColor: 'rgba(0, 255, 0, 0.5)' }]} />
          <View style={[styles.legendItem, { backgroundColor: 'rgba(144, 238, 144, 0.6)' }]} />
          <View style={[styles.legendItem, { backgroundColor: 'rgba(255, 255, 0, 0.6)' }]} />
          <View style={[styles.legendItem, { backgroundColor: 'rgba(255, 165, 0, 0.7)' }]} />
          <View style={[styles.legendItem, { backgroundColor: 'rgba(255, 0, 0, 0.8)' }]} />
        </View>
        <Text style={styles.legendText}>Alta</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heatmapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  heatmapRow: {
    flexDirection: 'row',
  },
  heatmapCell: {
    width: 30,
    height: 20,
    margin: 1,
    borderRadius: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingBottom: 8,
  },
  gradientLegend: {
    flexDirection: 'row',
    height: 20,
    width: 150,
    marginHorizontal: 10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  legendItem: {
    flex: 1,
  },
  legendText: {
    fontSize: 12,
    color: Colors.darkGray,
  },
});