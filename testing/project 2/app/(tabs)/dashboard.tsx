import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useMotorcycleStore } from '@/stores/motorcycleStore';
import { Colors } from '@/constants/Colors';
import DashboardCharts from '@/components/DashboardCharts';
import { ArrowUpRight, Users, Clock, TrendingUp, Calendar } from 'lucide-react-native';

export default function DashboardScreen() {
  const { motorcycles } = useMotorcycleStore();
  const metrics = useMotorcycleStore(state => state.getYardMetrics());
  
  // Additional metric calculations
  const quarantineMotorcycles = motorcycles.filter(m => m.status === 'Em quarentena').length;
  const waitingMotorcycles = motorcycles.filter(m => m.status === 'Aguardando vistoria').length;
  
  // Calculate highest efficiency day (simulated)
  const today = new Date();
  const highestDay = new Date(today);
  highestDay.setDate(today.getDate() - Math.floor(Math.random() * 7));
  
  // Format date to locale string (weekday, month day)
  const formattedDate = highestDay.toLocaleDateString('pt-BR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  
  const timeInYardDistribution = [
    { range: '0-1 dia', count: motorcycles.filter(m => (m.timeInYard || 0) <= 1).length },
    { range: '2-3 dias', count: motorcycles.filter(m => (m.timeInYard || 0) > 1 && (m.timeInYard || 0) <= 3).length },
    { range: '4-7 dias', count: motorcycles.filter(m => (m.timeInYard || 0) > 3 && (m.timeInYard || 0) <= 7).length },
    { range: '>7 dias', count: motorcycles.filter(m => (m.timeInYard || 0) > 7).length },
  ];
  
  // Calculate percentage distribution
  const totalMotorcycles = motorcycles.length;
  timeInYardDistribution.forEach(item => {
    item.percentage = totalMotorcycles > 0 ? (item.count / totalMotorcycles * 100) : 0;
  });
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard do Pátio</Text>
        <Text style={styles.subtitle}>Visão geral do seu pátio em tempo real</Text>
      </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <View style={[styles.metricIcon, { backgroundColor: 'rgba(5, 175, 49, 0.1)' }]}>
              <TrendingUp size={18} color={Colors.primary.default} />
            </View>
            <Text style={styles.metricTitle}>Eficiência</Text>
          </View>
          <Text style={styles.metricValue}>{Math.round(metrics.efficiencyScore)}%</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${metrics.efficiencyScore}%` }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <View style={[styles.metricIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Users size={18} color={Colors.status.priority} />
            </View>
            <Text style={styles.metricTitle}>Impacto</Text>
          </View>
          <Text style={styles.metricValue}>{metrics.potentialDeliveries}</Text>
          <Text style={styles.metricSubtitle}>entregadores potenciais</Text>
        </View>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{metrics.readyMotorcycles}</Text>
          <Text style={styles.statsLabel}>Motos Prontas</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{metrics.inMaintenanceMotorcycles}</Text>
          <Text style={styles.statsLabel}>Em Manutenção</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{quarantineMotorcycles}</Text>
          <Text style={styles.statsLabel}>Em Quarentena</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{waitingMotorcycles}</Text>
          <Text style={styles.statsLabel}>Aguardando</Text>
        </View>
      </View>
      
      <View style={styles.timeDistributionCard}>
        <Text style={styles.cardTitle}>Tempo no Pátio</Text>
        {timeInYardDistribution.map((item, index) => (
          <View key={item.range} style={styles.timeDistributionItem}>
            <View style={styles.timeDistributionLabelContainer}>
              <Text style={styles.timeDistributionLabel}>{item.range}</Text>
              <Text style={styles.timeDistributionCount}>{item.count} motos</Text>
            </View>
            <View style={styles.timeDistributionBarContainer}>
              <View 
                style={[
                  styles.timeDistributionBar, 
                  { width: `${item.percentage}%` },
                  index === 3 && item.count > 0 && styles.excessiveTimeBar
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.insightCard}>
        <View style={styles.insightIconContainer}>
          <Calendar size={24} color={Colors.primary.default} />
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>Dia de Maior Eficiência</Text>
          <Text style={styles.insightValue}>{formattedDate}</Text>
          <Text style={styles.insightDescription}>
            Neste dia, {Math.round(metrics.efficiencyScore + 15)}% de eficiência foi alcançada
          </Text>
        </View>
        <ArrowUpRight size={20} color={Colors.primary.default} />
      </View>
      
      <View style={styles.insightCard}>
        <View style={styles.insightIconContainer}>
          <Clock size={24} color={Colors.primary.default} />
        </View>
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>Tempo Médio no Pátio</Text>
          <Text style={styles.insightValue}>
            {metrics.averageTimeInYard.toFixed(1)} dias
          </Text>
          <Text style={styles.insightDescription}>
            Reduzir este tempo aumenta a eficiência do pátio
          </Text>
        </View>
        <ArrowUpRight size={20} color={Colors.primary.default} />
      </View>
      
      <DashboardCharts 
        motorcycles={motorcycles}
        metrics={metrics}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.light,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.neutral.dark,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.neutral.gray,
    marginTop: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral.gray,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral.dark,
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 12,
    color: Colors.neutral.gray,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.neutral.light,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary.default,
    borderRadius: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary.default,
  },
  statsLabel: {
    fontSize: 12,
    color: Colors.neutral.gray,
    marginTop: 4,
  },
  timeDistributionCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.dark,
    marginBottom: 12,
  },
  timeDistributionItem: {
    marginBottom: 10,
  },
  timeDistributionLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeDistributionLabel: {
    fontSize: 12,
    color: Colors.neutral.dark,
  },
  timeDistributionCount: {
    fontSize: 12,
    color: Colors.neutral.gray,
  },
  timeDistributionBarContainer: {
    height: 8,
    backgroundColor: Colors.neutral.light,
    borderRadius: 4,
    overflow: 'hidden',
  },
  timeDistributionBar: {
    height: '100%',
    backgroundColor: Colors.primary.default,
    borderRadius: 4,
  },
  excessiveTimeBar: {
    backgroundColor: Colors.status.maintenance,
  },
  insightCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(5, 175, 49, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral.gray,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral.dark,
    marginVertical: 2,
  },
  insightDescription: {
    fontSize: 12,
    color: Colors.neutral.gray,
  },
});