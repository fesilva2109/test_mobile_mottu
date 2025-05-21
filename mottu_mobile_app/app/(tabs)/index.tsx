import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScanLine, Map, ChartBar as BarChart3, Clock } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useResetAsync } from '@/components/ResetAsync';


export default function HomeScreen() {
  const router = useRouter();
  const {resetar} = useResetAsync();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mottu</Text>
        <Text style={styles.subtitle}>Mapeamento Inteligente de Pátios</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        
        <View style={styles.quickAccessGrid}>
          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => router.push('/cadastro')}
          >
            <ScanLine size={36} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Cadastrar Moto</Text>
            <Text style={styles.cardDescription}>Scanner QR Code</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => router.push('/mapa')}
          >
            <Map size={36} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Mapa do Pátio</Text>
            <Text style={styles.cardDescription}>Organizar motos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAccessCard}
            onPress={() => router.push('/dashboard')}
          >
            <BarChart3 size={36} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Dashboard</Text>
            <Text style={styles.cardDescription}>Métricas e KPIs</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAccessCard}
          >
            <Clock size={36} color={colors.primary.main} />
            <Text style={styles.cardTitle}>Histórico</Text>
            <Text style={styles.cardDescription}>Registro de atividades</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Status do Pátio</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Motos Disponíveis</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Em Manutenção</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Em Quarentena</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.dashboardButton}
          onPress={() => router.push('/dashboard')}
        >
          <Text style={styles.dashboardButtonText}>Ver Dashboard Completo</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.dashboardButton}
          onPress={resetar} 
        >
          <Text style={styles.dashboardButtonText}>Limpar Dados Locais</Text>
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