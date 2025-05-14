import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';

export default function WaitingArea({ motorcycles, onPress }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.motoBox, getStatusStyle(item.status)]} onPress={() => onPress(item)}>
      <Text style={styles.motoText}>{item.name || 'Sem nome'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Área de Espera</Text>
      <FlatList
        data={motorcycles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const getStatusStyle = (status) => {
  switch (status) {
    case 'manutenção':
      return { backgroundColor: Colors.warning };
    case 'reservada':
      return { backgroundColor: Colors.error };
    default:
      return { backgroundColor: Colors.gray };
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.lightBackground,
    borderRadius: 10,
    elevation: 2,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text,
  },
  listContent: {
    gap: 8,
  },
  motoBox: {
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  motoText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});
