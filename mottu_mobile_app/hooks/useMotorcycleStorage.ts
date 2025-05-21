import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Motorcycle } from '@/types';

const MOTOS_KEY = '@mottu_motos';

export const useMotorcycleStorage = () => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());


  useEffect(() => {
    loadMotorcycles();
  }, []);

  const loadMotorcycles = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(MOTOS_KEY);
      if (jsonValue != null) {
        setMotorcycles(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Erro ao carregar motos:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveMotorcycles = async (motos: Motorcycle[]) => {
    try {
      const jsonValue = JSON.stringify(motos);
      await AsyncStorage.setItem(MOTOS_KEY, jsonValue);
      setMotorcycles(motos);
      setLastUpdate(Date.now()); // Atualiza o timestamp
    } catch (e) {
      console.error('Erro ao salvar motos:', e);
    }
  };

  const addMotorcycle = async (newMoto: Motorcycle) => {
    const updatedMotos = [...motorcycles, newMoto];
    await saveMotorcycles(updatedMotos);
  };

  const removeMotorcycle = async (id: string) => {
    const updatedMotos = motorcycles.filter((m) => m.id !== id);
    await saveMotorcycles(updatedMotos);
  };

  const clearMotorcycles = async () => {
    try {
      await AsyncStorage.removeItem(MOTOS_KEY);
      setMotorcycles([]);
    } catch (e) {
      console.error('Erro ao limpar motos:', e);
    }
  };

  return {
    motorcycles,
    loading,
    addMotorcycle,
    removeMotorcycle,
    clearMotorcycles,
    reloadMotorcycles: loadMotorcycles,
    lastUpdate 
  };
};
