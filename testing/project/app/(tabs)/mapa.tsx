import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, Platform } from 'react-native';
import { useMotorcycleStore } from '@/stores/motorcycleStore';
import Grid from '@/components/Grid';
import Filtros from '@/components/Filtros';
import { Colors } from '@/constants/Colors';
import { FilterOptions, Motorcycle } from '@/constants/Types';
import { Info } from 'lucide-react-native';

export default function MapaScreen() {
  const { 
    motorcycles,
    waitingMotorcycles,
    filters,
    updateFilters,
  } = useMotorcycleStore();

  const [filteredMotorcycles, setFilteredMotorcycles] = useState<Motorcycle[]>([]);
  const [filteredWaiting, setFilteredWaiting] = useState<Motorcycle[]>([]);
  
  // Apply filters
  useEffect(() => {
    // Filter placed motorcycles
    const filtered = motorcycles.filter(m => {
      const statusMatch = filters.status === 'all' || m.status === filters.status;
      const modelMatch = filters.model === 'all' || m.modelo === filters.model;
      return statusMatch && modelMatch;
    });
    setFilteredMotorcycles(filtered);
    
    // Filter waiting motorcycles
    const filteredWaiting = waitingMotorcycles.filter(m => {
      const statusMatch = filters.status === 'all' || m.status === filters.status;
      const modelMatch = filters.model === 'all' || m.modelo === filters.model;
      return statusMatch && modelMatch;
    });
    setFilteredWaiting(filteredWaiting);
  }, [motorcycles, waitingMotorcycles, filters]);

  // Handle filter change
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    updateFilters(newFilters);
  };

  // Handle motorcycle placement
  const handleMotorcyclePlaced = (motorcycle: Motorcycle, x: number, y: number) => {
    console.log(`Motorcycle ${motorcycle.placa} placed at (${x}, ${y})`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Filtros filters={filters} onFilterChange={handleFilterChange} />
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredMotorcycles.length}</Text>
          <Text style={styles.statLabel}>No mapa</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredWaiting.length}</Text>
          <Text style={styles.statLabel}>Aguardando</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredMotorcycles.filter(m => m.status === 'Pronta para aluguel').length}
          </Text>
          <Text style={styles.statLabel}>Prontas</Text>
        </View>
      </View>
      
      <View style={styles.instructionBox}>
        <Info size={16} color={Colors.primary.default} />
        <Text style={styles.instructionText}>
          Pressione e arraste as motos da área de espera para posicioná-las no mapa
        </Text>
      </View>

      <Grid 
        motorcycles={filteredMotorcycles}
        waitingMotorcycles={filteredWaiting}
        onMotorcyclePlaced={handleMotorcyclePlaced}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 50,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    backgroundColor: Colors.neutral.light,
    borderRadius: 8,
    padding: 12,
    width: '31%',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary.default,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.neutral.gray,
    marginTop: 4,
  },
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(5, 175, 49, 0.1)',
    borderRadius: 8,
    marginBottom: 16,
  },
  instructionText: {
    marginLeft: 8,
    fontSize: 12,
    color: Colors.neutral.dark,
    flex: 1,
  },
});