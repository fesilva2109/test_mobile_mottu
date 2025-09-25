import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useMemo } from 'react';
import { useMotorcycleStorage } from '@/hooks/useMotorcycleStorage';
import { MOTO_STATUSES, MOTO_MODELS } from '@/constants/motoStatuses';
import { DashboardCard } from '@/components/DashboardCard';
import { StatusChart } from '@/components/StatusChart';
import { MOTO_EFFICIENCY_TARGET } from '@/constants/dashboardConstants';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';

// Apresenta métricas e gráficos sobre as motos do pátio
export default function DashboardScreen() {
  const { motorcycles, loading } = useMotorcycleStorage();
  const { colors } = useTheme();

  // Estado local para armazenar métricas calculadas
  const [metrics, setMetrics] = useState({
    totalMotos: 0,
    statusCounts: {} as Record<string, number>,
    modelCounts: {} as Record<string, number>,
    tempoMedioPatio: 0,
    motosDisponiveis: 0,
    eficienciaPatio: 0,
  });

  // Sempre que as motos mudam, recalcula as métricas
  useEffect(() => {
    if (!loading && motorcycles.length > 0) {
      calculateMetrics();
    }
  }, [motorcycles, loading]);

  const styles = useMemo(() => getStyles(colors), [colors]);

  // Função para calcular todas as métricas do dashboard
  const calculateMetrics = () => {
    // Inicializa contadores por status e modelo
    const statusCounts: Record<string, number> = {};
    MOTO_STATUSES.forEach(status => { statusCounts[status] = 0; });

    const modelCounts: Record<string, number> = {};
    MOTO_MODELS.forEach(model => { modelCounts[model] = 0; });

    // Conta motos por status e modelo
    motorcycles.forEach(moto => {
      if (statusCounts[moto.status] !== undefined) statusCounts[moto.status]++;
      if (modelCounts[moto.modelo] !== undefined) modelCounts[moto.modelo]++;
    });

    // Calcula tempo médio no pátio (em horas)
    const now = Date.now();
    let totalTime = 0;
    motorcycles.forEach(moto => { totalTime += now - moto.timestampEntrada; });
    const avgTimeInMs = motorcycles.length > 0 ? totalTime / motorcycles.length : 0;
    const avgTimeInHours = avgTimeInMs / (1000 * 60 * 60);

    // Conta motos disponíveis para aluguel
    const disponivel = statusCounts['Pronta para aluguel'] || 0;

    // Calcula eficiência do pátio (meta vs. disponível)
    const eficiencia = (disponivel / MOTO_EFFICIENCY_TARGET) * 100;

    setMetrics({
      totalMotos: motorcycles.length,
      statusCounts,
      modelCounts,
      tempoMedioPatio: avgTimeInHours,
      motosDisponiveis: disponivel,
      eficienciaPatio: eficiencia > 100 ? 100 : eficiencia,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho do dashboard */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Métricas do Pátio</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Métricas principais em cards */}
        <View style={styles.mainMetrics}>
          <DashboardCard 
            title="Total de Motos"
            value={metrics.totalMotos.toString()}
            iconName="motorcycle"
            color={colors.primary.main}
          />
          <DashboardCard 
            title="Prontas p/ Aluguel"
            value={metrics.motosDisponiveis.toString()}
            iconName="check-circle"
            color={colors.status.ready}
          />
          <DashboardCard 
            title="Tempo Médio"
            value={`${metrics.tempoMedioPatio.toFixed(1)}h`}
            iconName="clock"
            color={colors.primary.teal}
          />
        </View>
        
        {/* Gráfico de status das motos */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Status das Motos</Text>
          <StatusChart data={metrics.statusCounts} />
        </View>
        
        {/* Barra de eficiência do pátio */}
        <View style={styles.efficiencyContainer}>
          <Text style={styles.sectionTitle}>Eficiência do Pátio</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${metrics.eficienciaPatio}%` },
                  metrics.eficienciaPatio < 50 ? { backgroundColor: colors.status.quarantine } :
                  metrics.eficienciaPatio < 75 ? { backgroundColor: colors.status.maintenance } :
                  { backgroundColor: colors.status.ready }
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(metrics.eficienciaPatio)}%</Text>
          </View>
          <Text style={styles.efficiencyInfo}>
            {metrics.motosDisponiveis} de {MOTO_EFFICIENCY_TARGET} motos prontas para aluguel
          </Text>
        </View>
        
        {/* Distribuição de motos por modelo */}
        <View style={styles.modelsContainer}>
          <Text style={styles.sectionTitle}>Distribuição por Modelo</Text>
          {MOTO_MODELS.map(model => (
            <View key={model} style={styles.modelItem}>
              <View style={styles.modelNameContainer}>
                <Text style={styles.modelEmoji}>
                  {model === 'Mottu Pop' ? '🛵' : model === 'Mottu Sport' ? '🏍️' : '⚡'}
                </Text>
                <Text style={styles.modelName}>{model}</Text>
              </View>
              <Text style={styles.modelCount}>{metrics.modelCounts[model] || 0}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightGray,
  },
  header: {
    padding: 16,
    backgroundColor: colors.primary.main,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral.white,
    opacity: 0.9,
  },
  content: {
    padding: 16,
  },
  mainMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.neutral.black,
  },
  chartContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  efficiencyContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 24,
    backgroundColor: colors.neutral.lightGray,
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
  },
  progressText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: 'bold',
    width: 48,
    textAlign: 'right',
  },
  efficiencyInfo: {
    fontSize: 14,
    color: colors.neutral.gray,
    marginBottom: 12,
  },
  modelsContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGray,
  },
  modelNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modelEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  modelName: {
    fontSize: 16,
  },
  modelCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
});
