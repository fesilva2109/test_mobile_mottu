import React from 'react';
import { View } from 'react-native';
import Scanner from '@/components/Scanner';
import { useRouter } from 'expo-router';
import { useMotorcycleStore } from '@/stores/motorcycleStore';
import { Motorcycle } from '@/constants/Types';

export default function CameraScreen() {
  const router = useRouter();
  const { addMotorcycle } = useMotorcycleStore();
  
  const handleScan = (data: Partial<Motorcycle>) => {
    // Add the motorcycle to the store
    addMotorcycle({
      placa: data.placa || 'Unknown',
      modelo: data.modelo || 'Mottu Pop',
      cor: data.cor || 'Preto',
      status: data.status || 'Aguardando vistoria',
    });
    
    // Navigate back to the previous screen
    setTimeout(() => {
      router.replace('/cadastro');
    }, 1000);
  };
  
  return (
    <View style={{ flex: 1 }}>
      <Scanner onScan={handleScan} />
    </View>
  );
}