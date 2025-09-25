import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { ScanLine, Map, ChartBar as BarChart3, Clock } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLogout } from '@/components/Logout';
import { useMotorcycleStorage } from '@/hooks/useMotorcycleStorage';
import { ThemeToggle } from '@/components/ThemeToggle'; 
import React, { useMemo } from 'react';

// Tela inicial com resumo do pátio e acesso rápido às funcionalidades
export default function HomeScreen() {
  const router = useRouter(); 
  const { logout } = useLogout(); 
  const { motorcycles, refreshMotorcycles } = useMotorcycleStorage(); 
  const { colors } = useTheme();

  // Conta motos por status
  const motosDisponiveis = motorcycles.filter(m => m.status === 'Pronta para aluguel').length;
  const motosManutencao = motorcycles.filter(m => m.status === 'Em manutenção').length;
  const motosQuarentena = motorcycles.filter(m => m.status === 'Em quarentena').length;

  // Atualiza lista de motos quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      refreshMotorcycles();
    }, [refreshMotorcycles])
  );

  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho com título e botão de tema */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mottu</Text>
          <Text style={styles.subtitle}>Mapeamento Inteligente de Pátios</Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Seção de atalhos para funcionalidades principais */}
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>

        <View style={styles.quickAccessGrid}>
          {/* Cadastro de novas motos via QR Code */}
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => router.push('/cadastro')}
          >
            <ScanLine size={36} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Cadastrar Moto</Text>
            <Text style={styles.cardDescription}>Scanner QR Code</Text>
          </TouchableOpacity>

          {/* Mapa visual do pátio */}
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => router.push('/mapa')}
          >
            <Map size={36} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Mapa do Pátio</Text>
            <Text style={styles.cardDescription}>Organizar motos</Text>
          </TouchableOpacity>

          {/* Métricas e estatísticas */}
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => router.push('/dashboard')}
          >
            <BarChart3 size={36} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Dashboard</Text>
            <Text style={styles.cardDescription}>Métricas e KPIs</Text>
          </TouchableOpacity>

          {/* Histórico de atividades */}
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => router.push('/historico')}
          >
            <Clock size={36} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Histórico</Text>
            <Text style={styles.cardDescription}>Registro de atividades</Text>
          </TouchableOpacity>
        </View>

        {/* Resumo do status atual do pátio */}
        <Text style={styles.sectionTitle}>Status do Pátio</Text>

        <View style={styles.statsContainer}>
          {/* Motos disponíveis para aluguel */}
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{motosDisponiveis}</Text>
            <Text style={styles.statLabel}>Motos Disponíveis</Text>
          </View>
          
          {/* Motos em manutenção */}
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{motosManutencao}</Text>
            <Text style={styles.statLabel}>Em Manutenção</Text>
          </View>
          
          {/* Motos em quarentena */}
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{motosQuarentena}</Text>
            <Text style={styles.statLabel}>Em Quarentena</Text>
          </View>
        </View>

        {/* Botão para dashboard completo */}
        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() => router.push('/dashboard')}
        >
          <Text style={styles.dashboardButtonText}>Ver Dashboard Completo</Text>
        </TouchableOpacity>

        {/* Botão de logout */}
        <TouchableOpacity
          style={[styles.dashboardButton, { backgroundColor: colors.status.quarantine }]}
          onPress={logout}
        >
          <Text style={styles.dashboardButtonText}>Logout</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    color: colors.neutral.black,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    width: '48%',
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: colors.neutral.black,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.neutral.gray,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  statLabel: {
    fontSize: 12,
    color: colors.neutral.gray,
    textAlign: 'center',
    marginTop: 4,
  },
  dashboardButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  dashboardButtonText: {
    color: colors.neutral.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});