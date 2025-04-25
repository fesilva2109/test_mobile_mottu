import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useMotorcycleStore } from '@/stores/motorcycleStore';
import Colors from '@/constants/Colors';
import YardMap from '@/components/YardMap';
import FilterBar from '@/components/FilterBar';
import { Filter, RefreshCw } from 'lucide-react-native';

export default function MapaScreen() {
  const [activeFilters, setActiveFilters] = useState({
    disponiveis: true,
    manutencao: true,
    reservadas: true,
    outras: true,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { motorcycles, syncMotorcycles } = useMotorcycleStore();

  const handleRefresh = () => {
    syncMotorcycles();
  };

  const handleFilterChange = (filterName) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const filterMotorcycles = () => {
    return motorcycles.filter((moto) => {
      if (activeFilters.disponiveis && moto.status === 'disponível') return true;
      if (activeFilters.manutencao && moto.status === 'manutenção') return true;
      if (activeFilters.reservadas && moto.status === 'reservada') return true;
      if (activeFilters.outras && !['disponível', 'manutenção', 'reservada'].includes(moto.status)) return true;
      return false;
    });
  };

  const filteredMotorcycles = filterMotorcycles();
  const statusCounts = {
    disponível: motorcycles.filter(m => m.status === 'disponível').length,
    manutenção: motorcycles.filter(m => m.status === 'manutenção').length,
    reservada: motorcycles.filter(m => m.status === 'reservada').length,
    total: motorcycles.length,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Total: <Text style={styles.statusNumber}>{motorcycles.length}</Text>
          </Text>
          <Text style={styles.statusTextSmall}>
            Disponíveis: <Text style={[styles.statusNumberSmall, { color: Colors.success }]}>
              {statusCounts.disponível}
            </Text>
          </Text>
          <Text style={styles.statusTextSmall}>
            Manutenção: <Text style={[styles.statusNumberSmall, { color: Colors.warning }]}>
              {statusCounts.manutenção}
            </Text>
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setIsFilterOpen(!isFilterOpen)}>
            <Filter size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleRefresh}>
            <RefreshCw size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {isFilterOpen && (
        <FilterBar 
          filters={activeFilters}
          onFilterChange={handleFilterChange}
        />
      )}

      <View style={styles.mapContainer}>
        <YardMap motorcycles={filteredMotorcycles} />
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legenda:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.success }]} />
            <Text style={styles.legendText}>Disponível</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.warning }]} />
            <Text style={styles.legendText}>Manutenção</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.error }]} />
            <Text style={styles.legendText}>Reservada</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.gray }]} />
            <Text style={styles.legendText}>Outras</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statusContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.text,
  },
  statusNumber: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statusTextSmall: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  statusNumberSmall: {
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: Colors.lightBackground,
  },
  mapContainer: {
    flex: 1,
    padding: 8,
  },
  legend: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: Colors.darkGray,
  },
});