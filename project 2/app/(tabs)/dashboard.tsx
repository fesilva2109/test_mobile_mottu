import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FileKey as MotorcycleKey, Users as Users2, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useMotorcycles } from '@/contexts/MotorcycleContext';
import StatusChart from '@/components/dashboard/StatusChart';
import StatCard from '@/components/dashboard/StatCard';

export default function DashboardScreen() {
  const { motorcycles, loading, syncWithServer } = useMotorcycles();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await syncWithServer();
    } catch (error) {
      console.error('Error syncing with server:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const calculateStats = () => {
    const total = motorcycles.length;
    if (total === 0) return null;

    const available = motorcycles.filter(m => m.status === 'available').length;
    const maintenance = motorcycles.filter(m => m.status === 'maintenance').length;
    const critical = motorcycles.filter(m => m.critical).length;
    
    // Calculate the change in available motorcycles (mock data for demo)
    const availableChange = {
      value: 12,
      isPositive: true,
    };

    // Calculate average maintenance time (mock data for demo)
    const maintenanceChange = {
      value: 8,
      isPositive: false,
    };

    // Calculate active riders (mock data for demo)
    const activeRiders = Math.floor(available * 0.8);
    const riderChange = {
      value: 15,
      isPositive: true,
    };

    return {
      available,
      maintenance,
      critical,
      availableChange,
      maintenanceChange,
      activeRiders,
      riderChange,
    };
  };

  const stats = calculateStats();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          {loading ? 'Updating metrics...' : 'Real-time yard metrics'}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary[500]]}
            tintColor={Colors.primary[500]}
          />
        }
      >
        {stats ? (
          <>
            <View style={styles.statsGrid}>
              <StatCard
                title="Available Motorcycles"
                value={stats.available}
                subtitle="Ready for rental"
                icon={<MotorcycleKey size={24} color={Colors.primary[500]} />}
                change={stats.availableChange}
              />
              
              <StatCard
                title="Active Riders"
                value={stats.activeRiders}
                subtitle="Currently on delivery"
                icon={<Users2 size={24} color={Colors.primary[500]} />}
                change={stats.riderChange}
              />
              
              <StatCard
                title="In Maintenance"
                value={stats.maintenance}
                subtitle="Average time: 2.5 days"
                icon={<Clock size={24} color={Colors.primary[500]} />}
                change={stats.maintenanceChange}
              />
              
              <StatCard
                title="Critical Issues"
                value={stats.critical}
                subtitle="Require immediate attention"
                icon={<AlertTriangle size={24} color={Colors.utility.error} />}
              />
            </View>

            <StatusChart
              motorcycles={motorcycles}
              title="Fleet Status Distribution"
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No data available. Add motorcycles to see metrics.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[800],
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[500],
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
});