import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';

type FilterBarProps = {
  filters: {
    disponiveis: boolean;
    manutencao: boolean;
    reservadas: boolean;
    outras: boolean;
  };
  onFilterChange: (filterName: string) => void;
};

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtros:</Text>
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.disponiveis ? styles.activeFilterButton : styles.inactiveFilterButton,
            { borderColor: Colors.success }
          ]}
          onPress={() => onFilterChange('disponiveis')}
        >
          <View style={[styles.colorIndicator, { backgroundColor: Colors.success }]} />
          <Text style={styles.filterText}>Disponíveis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.manutencao ? styles.activeFilterButton : styles.inactiveFilterButton,
            { borderColor: Colors.warning }
          ]}
          onPress={() => onFilterChange('manutencao')}
        >
          <View style={[styles.colorIndicator, { backgroundColor: Colors.warning }]} />
          <Text style={styles.filterText}>Manutenção</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.reservadas ? styles.activeFilterButton : styles.inactiveFilterButton,
            { borderColor: Colors.error }
          ]}
          onPress={() => onFilterChange('reservadas')}
        >
          <View style={[styles.colorIndicator, { backgroundColor: Colors.error }]} />
          <Text style={styles.filterText}>Reservadas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filters.outras ? styles.activeFilterButton : styles.inactiveFilterButton,
            { borderColor: Colors.gray }
          ]}
          onPress={() => onFilterChange('outras')}
        >
          <View style={[styles.colorIndicator, { backgroundColor: Colors.gray }]} />
          <Text style={styles.filterText}>Outras</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 2,
  },
  activeFilterButton: {
    backgroundColor: Colors.white,
  },
  inactiveFilterButton: {
    backgroundColor: Colors.lightBackground,
    opacity: 0.6,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  filterText: {
    fontSize: 13,
    color: Colors.text,
  },
});