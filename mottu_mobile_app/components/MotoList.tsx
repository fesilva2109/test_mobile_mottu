import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation } from 'react-native';
import { MotoCard } from './MotoCard';
import { Motorcycle } from '@/types';
import { colors } from '@/theme/colors';
import { motorcycleListeners, useMotorcycleStorage } from '@/hooks/useStorage';

interface MotoListProps {
  motorcycles: Motorcycle[];
  onSelect: (motorcycle: Motorcycle) => void;
  onDelete: (id:string) => void;
  selectedMoto?: Motorcycle | null;
}

export function MotoList({ motorcycles, onSelect, onDelete, selectedMoto }: MotoListProps) {
    const { refreshMotorcycles } = useMotorcycleStorage();

    useEffect(() => {
      const listener = () => {
        refreshMotorcycles();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      };
      
      motorcycleListeners.add(listener);
      return () => {
        motorcycleListeners.delete(listener);
      };
    }, [refreshMotorcycles]);

  
  if (motorcycles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhuma moto disponível</Text>
      </View>
    );
  }
  


  return (
    <FlatList
      data={motorcycles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MotoCard 
          motorcycle={item}
          onPress={onSelect}
          onDelete={onDelete}
          isInWaitingArea
          isSelected={item.id === selectedMoto?.id}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      onLayout={() => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.lightGray,
    borderRadius: 8,
  },
  emptyText: {
    color: colors.neutral.gray,
    fontSize: 16,
  },
});