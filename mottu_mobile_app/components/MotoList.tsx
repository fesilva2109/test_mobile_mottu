import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MotoCard } from './MotoCard';
import { Motorcycle } from '@/types';
import { colors } from '@/theme/colors';

interface MotoListProps {
  motorcycles: Motorcycle[];
  onSelect: (motorcycle: Motorcycle) => void;
}

export function MotoList({ motorcycles, onSelect }: MotoListProps) {
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
          isInWaitingArea
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
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