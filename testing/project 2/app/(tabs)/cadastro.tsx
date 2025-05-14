import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import MotorcycleForm from '@/components/MotorcycleForm';
import { useMotorcycleStore } from '@/stores/motorcycleStore';
import { Colors } from '@/constants/Colors';
import { MotorcycleModel, MotorcycleStatus } from '@/constants/Types';

export default function CadastroScreen() {
  const { addMotorcycle, waitingMotorcycles } = useMotorcycleStore();
  
  const handleSubmit = (data: {
    placa: string;
    modelo: MotorcycleModel;
    cor: string;
    status: MotorcycleStatus;
  }) => {
    addMotorcycle(data);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Cadastrar Nova Moto</Text>
        <Text style={styles.subtitle}>
          Preencha os dados abaixo ou escaneie o QR Code da moto
        </Text>
        
        <MotorcycleForm onSubmit={handleSubmit} />
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {waitingMotorcycles.length} {waitingMotorcycles.length === 1 ? 'moto aguardando' : 'motos aguardando'} posicionamento no pátio
          </Text>
        </View>
      </View>
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
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.neutral.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.neutral.gray,
    marginBottom: 24,
  },
  statsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.neutral.light,
    borderRadius: 8,
    alignItems: 'center',
  },
  statsText: {
    color: Colors.neutral.dark,
    fontWeight: '500',
  },
});