import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { ScanLine, Map, ChartBar as BarChart3, Clock } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useLogout } from '@/components/Logout';
import { useMotorcycleStorage } from '@/hooks/useStorage';
import React from 'react';

// HomeScreen é a tela inicial, oferecendo acesso rápido às principais funcionalidades
// e exibindo um resumo do status do pátio.
export default function HomeScreen() {
  const router = useRouter(); 
  const { logout } = useLogout(); 
  const { motorcycles, refreshMotorcycles } = useMotorcycleStorage(); 

  const motosDisponiveis = motorcycles.filter(m => m.status === 'Pronta para aluguel').length;
  const motosManutencao = motorcycles.filter(m => m.status === 'Em manutenção').length;
  const motosQuarentena = motorcycles.filter(m => m.status === 'Em quarentena').length;

  // useFocusEffect é um hook que permite executar efeitos colaterais quando a tela ganha foco.
  // Aqui, ele é usado para atualizar a lista de motos sempre que a tela é exibida.
  useFocusEffect(
    React.useCallback(() => {
      refreshMotorcycles();
    }, [refreshMotorcycles])
  );


  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho da tela com o título e subtítulo do aplicativo. */}
      <View style={styles.header}>
        <Text style={styles.title}>Mottu</Text>
        <Text style={styles.subtitle}>Mapeamento Inteligente de Pátios</Text>
      </View>

      {/* Área de conteúdo principal, permitindo rolagem para visualizar todo o conteúdo. */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Seção que oferece atalhos para as funcionalidades mais importantes do aplicativo. */}
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>

        {/* Grid de botões que levam a diferentes telas do aplicativo. */}
        <View style={styles.quickAccessGrid}>
          {/* Botão para navegar para a tela de cadastro de novas motos. */}
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => router.push('/cadastro')}
          >
            <ScanLine size={36} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Cadastrar Moto</Text>
            <Text style={styles.cardDescription}>Scanner QR Code</Text>
          </TouchableOpacity>

          {/* Botão para navegar para a tela do mapa do pátio, mostrando a localização das motos. */}
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => router.push('/mapa')}
          >
            <Map size={36} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Mapa do Pátio</Text>
            <Text style={styles.cardDescription}>Organizar motos</Text>
          </TouchableOpacity>

          {/* Botão para navegar para a tela do dashboard, exibindo métricas e KPIs. */}
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => router.push('/dashboard')}
          >
            <BarChart3 size={36} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Dashboard</Text>
            <Text style={styles.cardDescription}>Métricas e KPIs</Text>
          </TouchableOpacity>

          {/* Botão para navegar para a tela do histórico de atividades do aplicativo. */}
          <TouchableOpacity
            style={styles.quickAccessCard}
            onPress={() => router.push('/historico')}
          >
            <Clock size={36} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Histórico</Text>
            <Text style={styles.cardDescription}>Registro de atividades</Text>
          </TouchableOpacity>
        </View>

        {/* Seção que apresenta um resumo do status das motos presentes no pátio. */}

        <Text style={styles.sectionTitle}>Status do Pátio</Text>

        {/* Exibição de três cartões com informações sobre o status das motos. */}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{motosDisponiveis}</Text>
            <Text style={styles.statLabel}>Motos Disponíveis</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{motosManutencao}</Text>
            <Text style={styles.statLabel}>Em Manutenção</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{motosQuarentena}</Text>
            <Text style={styles.statLabel}>Em Quarentena</Text>
          </View>
        </View>

        {/* Botão para navegar para a tela completa do dashboard para uma visão detalhada. */}
        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() => router.push('/dashboard')}
        >
          <Text style={styles.dashboardButtonText}>Ver Dashboard Completo</Text>
        </TouchableOpacity>

        {/* Botão para realizar o logout do aplicativo e retornar à tela de login. */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightGray,
  },
  header: {
    padding: 16,
    backgroundColor: colors.primary.main,
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


