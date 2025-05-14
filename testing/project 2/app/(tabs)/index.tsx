import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useMotorcycleStore } from '@/stores/motorcycleStore';
import { Colors } from '@/constants/Colors';
import { LayoutGrid, QrCode, ChartBar as BarChart3, CirclePlus as PlusCircle } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { motorcycles, waitingMotorcycles } = useMotorcycleStore();
  const metrics = useMotorcycleStore(state => state.getYardMetrics());

  const navigateTo = (route: string) => {
    router.push(route);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://mottu.com.br/wp-content/uploads/2023/03/logo-mottu-branding.svg' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Gerenciamento Inteligente de Pátio</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{motorcycles.length}</Text>
          <Text style={styles.statLabel}>Motos no Pátio</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{waitingMotorcycles.length}</Text>
          <Text style={styles.statLabel}>Aguardando</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{metrics.readyMotorcycles}</Text>
          <Text style={styles.statLabel}>Prontas</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Acesso Rápido</Text>
      <View style={styles.quickAccessGrid}>
        <Pressable style={styles.quickAccessCard} onPress={() => navigateTo('/mapa')}>
          <LayoutGrid size={32} color={Colors.primary.default} />
          <Text style={styles.quickAccessLabel}>Mapa do Pátio</Text>
        </Pressable>
        <Pressable style={styles.quickAccessCard} onPress={() => navigateTo('/cadastro')}>
          <PlusCircle size={32} color={Colors.primary.default} />
          <Text style={styles.quickAccessLabel}>Cadastrar Moto</Text>
        </Pressable>
        <Pressable style={styles.quickAccessCard} onPress={() => navigateTo('/cadastro/camera')}>
          <QrCode size={32} color={Colors.primary.default} />
          <Text style={styles.quickAccessLabel}>Escanear QR</Text>
        </Pressable>
        <Pressable style={styles.quickAccessCard} onPress={() => navigateTo('/dashboard')}>
          <BarChart3 size={32} color={Colors.primary.default} />
          <Text style={styles.quickAccessLabel}>Dashboard</Text>
        </Pressable>
      </View>

      <View style={styles.impactSection}>
        <Text style={styles.impactTitle}>Impacto Social</Text>
        <Text style={styles.impactValue}>{metrics.potentialDeliveries} entregadores</Text>
        <Text style={styles.impactDescription}>
          podem estar trabalhando com as motos prontas para aluguel
        </Text>
      </View>

      <View style={styles.efficiencySection}>
        <Text style={styles.efficiencyTitle}>Eficiência do Pátio</Text>
        <View style={styles.efficiencyBar}>
          <View 
            style={[
              styles.efficiencyFill, 
              { width: `${metrics.efficiencyScore}%` }
            ]} 
          />
        </View>
        <Text style={styles.efficiencyValue}>{Math.round(metrics.efficiencyScore)}%</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.light,
  },
  header: {
    backgroundColor: Colors.primary.default,
    padding: 20,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  logo: {
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  subtitle: {
    color: Colors.neutral.white,
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: -25,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '31%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary.default,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral.gray,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral.dark,
    marginTop: 25,
    marginLeft: 20,
    marginBottom: 15,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    padding: 15,
    width: '47%',
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 120,
  },
  quickAccessLabel: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral.dark,
    textAlign: 'center',
  },
  impactSection: {
    backgroundColor: Colors.primary.lighter,
    margin: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral.white,
    marginBottom: 10,
  },
  impactValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  impactDescription: {
    fontSize: 14,
    color: Colors.neutral.white,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  efficiencySection: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  efficiencyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral.dark,
    marginBottom: 10,
  },
  efficiencyBar: {
    height: 10,
    backgroundColor: Colors.neutral.gray,
    borderRadius: 5,
    overflow: 'hidden',
  },
  efficiencyFill: {
    height: '100%',
    backgroundColor: Colors.primary.default,
    borderRadius: 5,
  },
  efficiencyValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral.dark,
    textAlign: 'right',
    marginTop: 5,
  },
});