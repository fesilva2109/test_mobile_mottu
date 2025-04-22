import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Search, Filter, SlidersHorizontal, CheckCircle2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useMotorcycles } from '@/contexts/MotorcycleContext';
import { Motorcycle, MotorcycleStatus } from '@/types/motorcycle';
import MotorcycleCard from '@/components/motorcycles/MotorcycleCard';
import StatusBadge from '@/components/ui/StatusBadge';

export default function MotorcyclesScreen() {
  const {
    motorcycles,
    loading,
    syncWithServer,
    lastSynced,
    updateMotorcycle,
  } = useMotorcycles();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<MotorcycleStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filterMotorcycles = useCallback(() => {
    let filtered = [...motorcycles];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        m => m.licensePlate.toLowerCase().includes(query) ||
             m.model.toLowerCase().includes(query) ||
             (m.observations && m.observations.toLowerCase().includes(query))
      );
    }
    
    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(m => m.status === selectedStatus);
    }
    
    // Sort by lastUpdated (newest first)
    filtered.sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
    
    return filtered;
  }, [motorcycles, searchQuery, selectedStatus]);

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

  const handleMotorcyclePress = (motorcycle: Motorcycle) => {
    Alert.alert(
      `${motorcycle.licensePlate}`,
      `Model: ${motorcycle.model}\nStatus: ${motorcycle.status}\n${motorcycle.observations || ''}`,
      [
        {
          text: 'Mark as Available',
          onPress: () => updateMotorcycle(motorcycle.id, { status: 'available' }),
          style: 'default',
        },
        {
          text: 'Close',
          style: 'cancel',
        },
      ]
    );
  };

  const renderMotorcycleItem = ({ item }: { item: Motorcycle }) => (
    <MotorcycleCard 
      motorcycle={item}
      onPress={handleMotorcyclePress}
    />
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus(null);
  };

  const statuses: MotorcycleStatus[] = ['available', 'unavailable', 'maintenance', 'reserved', 'transit'];

  const getFormattedDate = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Motorcycles</Text>
          <TouchableOpacity 
            style={styles.syncButton}
            onPress={handleRefresh}
            disabled={loading}
          >
            <Text style={styles.syncText}>
              {loading ? 'Syncing...' : 'Sync'}
            </Text>
            {lastSynced && (
              <Text style={styles.lastSyncedText}>
                Last: {getFormattedDate(lastSynced)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.neutral[400]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search license plate, model, or notes"
            placeholderTextColor={Colors.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
        
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>
            <Filter size={14} color={Colors.neutral[600]} />
            <Text> Filters</Text>
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statusFilterContainer}
          >
            {statuses.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusFilter,
                  selectedStatus === status && {
                    backgroundColor: `${Colors.status[status]}20`,
                    borderColor: Colors.status[status],
                  },
                ]}
                onPress={() => setSelectedStatus(selectedStatus === status ? null : status)}
              >
                <StatusBadge status={status} size="small" />
                {selectedStatus === status && (
                  <CheckCircle2 
                    size={14} 
                    color={Colors.status[status]} 
                    style={styles.checkIcon} 
                  />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={clearFilters}
            >
              <SlidersHorizontal size={14} color={Colors.neutral[600]} />
              <Text style={styles.clearFiltersText}>Clear</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={filterMotorcycles()}
        renderItem={renderMotorcycleItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh}
            colors={[Colors.primary[500]]}
            tintColor={Colors.primary[500]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedStatus
                ? 'No motorcycles match your filters'
                : 'No motorcycles found. Pull down to refresh.'}
            </Text>
          </View>
        }
      />
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
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    backgroundColor: Colors.light.background,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[800],
  },
  syncButton: {
    alignItems: 'flex-end',
  },
  syncText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary[500],
  },
  lastSyncedText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[500],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[800],
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filtersTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[600],
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusFilterContainer: {
    paddingRight: 16,
  },
  statusFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    marginRight: 8,
  },
  checkIcon: {
    marginLeft: 4,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
  },
  clearFiltersText: {
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[600],
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
});