import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useMotorcycleStorage } from '@/hooks/useMotorcycleStorage';
import { useTheme } from '@/context/ThemeContext';
import { useFocusEffect } from 'expo-router';
import { MOTO_STATUSES, MOTO_MODELS } from '@/constants/motoStatuses';
import { MOTO_EFFICIENCY_TARGET } from '@/constants/dashboardConstants';
import { DashboardCard } from '@/components/DashboardCard';
import { StatusChart } from '@/components/StatusChart';

// Apresenta métricas e gráficos sobre as motos do pátio
export default function DashboardScreen() {
  const { motorcycles, loading, error, refreshMotorcycles } = useMotorcycleStorage();
  const { colors, t } = useTheme();

  // Recarrega os dados das motocicletas sempre que a tela do dashboard é focada
  useFocusEffect(
    useCallback(() => {
      refreshMotorcycles();
    }, [refreshMotorcycles])
  );

  // Calcula as métricas do dashboard usando useMemo para otimização.
  // As métricas são recalculadas automaticamente apenas quando `motorcycles` muda.
  const metrics = useMemo(() => {
    if (motorcycles.length === 0) {
      return {
        totalMotos: 0,
        statusCounts: {},
        modelCounts: {},
        tempoMedioPatio: 0,
        motosDisponiveis: 0,
        eficienciaPatio: 0,
      };
    }

    // Inicializa contadores por status e modelo
    const statusCounts: Record<string, number> = {};
    MOTO_STATUSES.forEach(status => { statusCounts[status] = 0; });

    const modelCounts: Record<string, number> = {};
    MOTO_MODELS.forEach(model => { modelCounts[model] = 0; });

    let totalTime = 0;

    // Itera uma única vez para calcular tudo
    motorcycles.forEach(moto => {
      if (statusCounts[moto.status] !== undefined) statusCounts[moto.status]++;
      if (modelCounts[moto.modelo] !== undefined) modelCounts[moto.modelo]++;
      if (moto.timestampEntrada) {
        totalTime += Date.now() - moto.timestampEntrada;
      }
    });

    // Calcula tempo médio no pátio (em horas)
    const avgTimeInMs = motorcycles.length > 0 ? totalTime / motorcycles.length : 0;
    const avgTimeInHours = avgTimeInMs / (1000 * 60 * 60);

    // Conta motos disponíveis para aluguel
    const disponivel = statusCounts['Pronta para aluguel'] || 0;

    // Calcula eficiência do pátio (meta vs. disponível), garantindo que não seja NaN
    const eficiencia = MOTO_EFFICIENCY_TARGET > 0 ? (disponivel / MOTO_EFFICIENCY_TARGET) * 100 : 0;

    return {
      totalMotos: motorcycles.length,
      statusCounts,
      modelCounts,
      tempoMedioPatio: avgTimeInHours,
      motosDisponiveis: disponivel,
      eficienciaPatio: Math.min(eficiencia, 100), // Limita a eficiência a 100%
    };
  }, [motorcycles]);

  const styles = useMemo(() => getStyles(colors), [colors]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Carregando dados do dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar dados: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('dashboard.title')}</Text>
        <Text style={styles.subtitle}>{t('dashboard.subtitle')}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.mainMetrics}>
          <DashboardCard 
            title={t('dashboard.totalMotos')}
            value={metrics.totalMotos.toString()}
            iconName="motorcycle"
            color={colors.primary.main}
          />
          <DashboardCard 
            title={t('dashboard.readyToRent')}
            value={metrics.motosDisponiveis.toString()}
            iconName="check-circle"
            color={colors.status.ready}
          />
          <DashboardCard 
            title={t('dashboard.avgTime')}
            value={`${metrics.tempoMedioPatio.toFixed(1)}h`}
            iconName="clock"
            color={colors.primary.teal}
          />
        </View>
        
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>{t('dashboard.statusTitle')}</Text>
          <StatusChart data={metrics.statusCounts} />
        </View>
        
        <View style={styles.efficiencyContainer}>
          <Text style={styles.sectionTitle}>{t('dashboard.efficiencyTitle')}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${metrics.eficienciaPatio}%` }, // Corrigido para string literal
                  metrics.eficienciaPatio < 50 ? { backgroundColor: colors.status.quarantine } :
                  metrics.eficienciaPatio < 75 ? { backgroundColor: colors.status.maintenance } :
                  { backgroundColor: colors.status.ready }
                ]}
              />
            </View>
            <Text style={styles.progressText}>{metrics.eficienciaPatio.toFixed(0)}%</Text>
          </View>
          <Text style={styles.efficiencyInfo}>
            {t('dashboard.efficiencyInfo', { count: metrics.motosDisponiveis, target: MOTO_EFFICIENCY_TARGET })}
          </Text>
        </View>
        
        <View style={styles.modelsContainer}>
          <Text style={styles.sectionTitle}>{t('dashboard.modelDistribution')}</Text>
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
      </View>
    </ScrollView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.lightGray,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.neutral.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.lightGray,
    padding: 16,
  },
  errorText: {
    color: colors.status.danger,
    fontSize: 16,
    textAlign: 'center',
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
    justifyContent: 'space-around',
    gap: 12,
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
    color: colors.neutral.black,
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
    color: colors.neutral.black,
  },
  modelCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
});
