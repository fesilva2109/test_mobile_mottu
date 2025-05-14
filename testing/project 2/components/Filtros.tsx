import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { FilterOptions, MotorcycleStatus, MotorcycleModel } from '@/constants/Types';
import { Filter } from 'lucide-react-native';

interface FiltrosProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

export default function Filtros({ filters, onFilterChange }: FiltrosProps) {
  const statuses: Array<MotorcycleStatus | 'all'> = [
    'all',
    'Pronta para aluguel',
    'Em manutenção',
    'Aguardando vistoria',
    'Em reparo emergencial',
    'Em quarentena'
  ];

  const models: Array<MotorcycleModel | 'all'> = [
    'all',
    'Mottu Pop',
    'Mottu Sport',
    'Mottu-E'
  ];

  // Get status color based on status
  const getStatusColor = (status: MotorcycleStatus | 'all') => {
    switch (status) {
      case 'Pronta para aluguel':
        return Colors.status.ready;
      case 'Em manutenção':
      case 'Em reparo emergencial':
        return Colors.status.maintenance;
      case 'Em quarentena':
        return Colors.status.quarantine;
      case 'Aguardando vistoria':
        return Colors.status.waiting;
      case 'all':
        return Colors.primary.default;
      default:
        return Colors.neutral.gray;
    }
  };

  // Format display text
  const formatDisplayText = (text: string) => {
    if (text === 'all') return 'Todos';
    return text;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Filter size={16} color={Colors.neutral.dark} />
        <Text style={styles.title}>Filtros</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {statuses.map((status) => (
            <Pressable
              key={status}
              style={[
                styles.filterItem, 
                filters.status === status && styles.selectedFilter,
                { borderColor: getStatusColor(status) }
              ]}
              onPress={() => onFilterChange({ status })}
            >
              <View style={[styles.colorIndicator, { backgroundColor: getStatusColor(status) }]} />
              <Text style={[
                styles.filterText,
                filters.status === status && styles.selectedFilterText
              ]}>
                {formatDisplayText(status)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Modelo</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {models.map((model) => (
            <Pressable
              key={model}
              style={[
                styles.filterItem, 
                filters.model === model && styles.selectedFilter,
                { borderColor: filters.model === model ? Colors.primary.default : Colors.neutral.light }
              ]}
              onPress={() => onFilterChange({ model })}
            >
              {model !== 'all' && (
                <Text style={styles.modelEmoji}>
                  {model === 'Mottu Pop' ? '🛵' : model === 'Mottu Sport' ? '🏍️' : '⚡'}
                </Text>
              )}
              <Text style={[
                styles.filterText,
                filters.model === model && styles.selectedFilterText
              ]}>
                {formatDisplayText(model)}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral.white,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.dark,
    marginLeft: 8,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral.gray,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  filtersContainer: {
    paddingHorizontal: 5,
  },
  filterItem: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedFilter: {
    backgroundColor: 'rgba(5, 175, 49, 0.05)',
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  modelEmoji: {
    marginRight: 6,
    fontSize: 14,
  },
  filterText: {
    fontSize: 12,
    color: Colors.neutral.dark,
  },
  selectedFilterText: {
    fontWeight: '500',
    color: Colors.primary.default,
  },
});