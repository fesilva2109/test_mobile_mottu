import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useMotorcycleStore } from '@/stores/motorcycleStore';
import Colors from '@/constants/Colors';
import MetricsCard from '@/components/MetricsCard';
import HeatmapView from '@/components/HeatmapView';
import PieChartView from '@/components/PieChartView';
import BarChartView from '@/components/BarChartView';
import { Calendar, Calculator, Truck, Users } from 'lucide-react-native';

export default function DashboardScreen() {
  const [timeFilter, setTimeFilter] = useState('hoje');
  const { motorcycles } = useMotorcycleStore();

  // Dados simulados para os gráficos
  const availableCount = motorcycles.filter(m => m.status === 'disponível').length;
  const maintenanceCount = motorcycles.filter(m => m.status === 'manutenção').length;
  const reservedCount = motorcycles.filter(m => m.status === 'reservada').length;
  const otherCount = motorcycles.length - availableCount - maintenanceCount - reservedCount;

  // Cálculos estimados para as métricas
  const deliveryDriversCount = Math.floor(availableCount * 1.8); // Estimativa: cada moto disponível serve ~1.8 entregadores
  const estimatedRevenue = availableCount * 65 * (timeFilter === 'semana' ? 7 : timeFilter === 'mês' ? 30 : 1); // R$65/dia por moto
  const maintenanceCost = maintenanceCount * 120 * (timeFilter === 'semana' ? 0.3 : timeFilter === 'mês' ? 1 : 0.05); // Custo de manutenção

  const pieChartData = [
    { label: 'Disponíveis', value: availableCount, color: Colors.success },
    { label: 'Manutenção', value: maintenanceCount, color: Colors.warning },
    { label: 'Reservadas', value: reservedCount, color: Colors.error },
    { label: 'Outras', value: otherCount, color: Colors.gray },
  ];

  // Dados simulados para o gráfico de barras (últimos 7 dias)
  const barChartData = [
    { day: 'Seg', available: 42, maintenance: 8 },
    { day: 'Ter', available: 45, maintenance: 7 },
    { day: 'Qua', available: 48, maintenance: 9 },
    { day: 'Qui', available: 52, maintenance: 6 },
    { day: 'Sex', available: 58, maintenance: 5 },
    { day: 'Sáb', available: 50, maintenance: 10 },
    { day: 'Dom', available: availableCount, maintenance: maintenanceCount },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Visão Geral do Pátio</Text>
        <View style={styles.timeFilterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, timeFilter === 'hoje' && styles.activeFilterButton]}
            onPress={() => setTimeFilter('hoje')}
          >
            <Text style={[styles.filterText, timeFilter === 'hoje' && styles.activeFilterText]}>Hoje</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, timeFilter === 'semana' && styles.activeFilterButton]}
            onPress={() => setTimeFilter('semana')}
          >
            <Text style={[styles.filterText, timeFilter === 'semana' && styles.activeFilterText]}>Semana</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, timeFilter === 'mês' && styles.activeFilterButton]}
            onPress={() => setTimeFilter('mês')}
          >
            <Text style={[styles.filterText, timeFilter === 'mês' && styles.activeFilterText]}>Mês</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <MetricsCard
          title="Motos Disponíveis"
          value={availableCount}
          icon={<Truck size={24} color={Colors.primary} />}
          backgroundColor={Colors.white}
          textColor={Colors.text}
        />
        <MetricsCard
          title="Entregadores Ativos"
          value={deliveryDriversCount}
          icon={<Users size={24} color={Colors.primary} />}
          backgroundColor={Colors.white}
          textColor={Colors.text}
        />
        <MetricsCard
          title="Receita Estimada"
          value={`R$ ${estimatedRevenue.toLocaleString('pt-BR')}`}
          icon={<Calculator size={24} color={Colors.primary} />}
          backgroundColor={Colors.white}
          textColor={Colors.text}
        />
        <MetricsCard
          title="Custo Manutenção"
          value={`R$ ${maintenanceCost.toLocaleString('pt-BR')}`}
          icon={<Calendar size={24} color={Colors.primary} />}
          backgroundColor={Colors.white}
          textColor={Colors.text}
        />
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Status das Motos</Text>
        <View style={styles.chartContainer}>
          <PieChartView data={pieChartData} />
        </View>
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Motos Disponíveis vs Manutenção</Text>
        <View style={styles.chartContainer}>
          <BarChartView data={barChartData} />
        </View>
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Mapa de Calor - Ocupação</Text>
        <View style={[styles.chartContainer, { height: 200 }]}>
          <HeatmapView />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  timeFilterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.lightBackground,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  activeFilterText: {
    color: Colors.white,
    fontWeight: '600',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  chartSection: {
    margin: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    height: 250,
  },
});