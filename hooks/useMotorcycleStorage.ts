import { useState, useEffect, useCallback } from 'react';
import { Motorcycle } from '@/types';
import { API_BASE_URL } from '@/context/config';
import { useAuth } from '@/context/AuthContext';
import { handleApiError } from '@/hooks/apiErrorHandler';
import { useApiStatus } from '@/context/ApiStatusContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_MOTOS_KEY = '@mottu:motorcycles_local';
// Hook customizado para gerenciar o CRUD de motocicletas via API.

export const useMotorcycleStorage = () => {
  const { token } = useAuth(); 
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const { isOffline, setApiOffline } = useApiStatus();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca todas as motos da API
  const loadMotorcycles = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return; 
    }

    try {
      setLoading(true);
      setError(null);

      let motosFromSource: Motorcycle[] = [];

      if (isOffline) {
        console.log('Carregando motos do modo OFFLINE');
        const localData = await AsyncStorage.getItem(LOCAL_MOTOS_KEY);
        motosFromSource = localData ? JSON.parse(localData) : [];
      } else {
        const response = await fetch(`${API_BASE_URL}/motorcycles`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          throw await handleApiError(response, setApiOffline);
        }
        const motosFromApi = await response.json();
        
        // Formata os dados para garantir consistência com o tipo Motorcycle
        motosFromSource = motosFromApi.map((moto: any): Motorcycle => ({
          id: moto.id,
          placa: moto.placa,
          modelo: moto.modelo,
          cor: moto.cor,
          status: moto.status,
          timestampEntrada: moto.timestampEntrada,
          reservada: moto.reservada || false,
          posicao: moto.posicao ?? null,
        }));
        // Salva uma cópia local para o caso de ficar offline
        await AsyncStorage.setItem(LOCAL_MOTOS_KEY, JSON.stringify(motosFromSource));
      }

      setMotorcycles(motosFromSource);
    } catch (error) {
      const apiError = await handleApiError(error, setApiOffline);
      setError(apiError.message);
      setMotorcycles([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Adiciona uma nova moto na API
  const addMotorcycle = async (moto: Omit<Motorcycle, 'id' | 'timestampEntrada'>) => {
    if (!token) throw new Error('Usuário não autenticado.');
    try {
      // O backend é responsável por gerar id, timestamp e posição inicial.
      const newMotoData = {
        placa: moto.placa,
        modelo: moto.modelo,
        cor: moto.cor,
        status: moto.status,
      };

      if (isOffline) {
        console.log('Adicionando moto em modo OFFLINE');
        const newLocalMoto: Motorcycle = {
          ...newMotoData,
          id: `local_${Date.now()}`,
          timestampEntrada: Date.now(),
        };
        const updatedMotos = [...motorcycles, newLocalMoto];
        await AsyncStorage.setItem(LOCAL_MOTOS_KEY, JSON.stringify(updatedMotos));
        setMotorcycles(updatedMotos);
        return newLocalMoto;
      } else {
        const response = await fetch(`${API_BASE_URL}/motorcycles`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(newMotoData),
        });

        if (!response.ok) throw await handleApiError(response, setApiOffline);
        
        const addedMoto = await response.json();
        setMotorcycles((prev) => [...prev, addedMoto]);
        return addedMoto;
      }
    } catch (error) {
      const apiError = await handleApiError(error, setApiOffline);
      console.error('Falha ao adicionar motocicleta:', apiError.message);
      throw apiError; // Lança o erro tratado
    }
  };

  // Atualiza uma moto existente na API
  const updateMotorcycle = async (updatedMoto: Motorcycle) => {
    if (!token) throw new Error('Usuário não autenticado.');
    try {
      if (isOffline) {
        console.log('Atualizando moto em modo OFFLINE');
        const updatedMotos = motorcycles.map((m) => (m.id === updatedMoto.id ? updatedMoto : m));
        await AsyncStorage.setItem(LOCAL_MOTOS_KEY, JSON.stringify(updatedMotos));
        setMotorcycles(updatedMotos);
        return updatedMoto;
      } else {
        const response = await fetch(`${API_BASE_URL}/motorcycles/${updatedMoto.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updatedMoto),
        });

        if (!response.ok) throw await handleApiError(response, setApiOffline);
        
        setMotorcycles((prev) =>
          prev.map((m) => (m.id === updatedMoto.id ? updatedMoto : m))
        );
        return updatedMoto;
      }
    } catch (error) {
      const apiError = await handleApiError(error, setApiOffline);
      console.error('Falha ao atualizar motocicleta:', apiError.message);
      throw apiError; 
    }
  };

  // Remove uma moto da API
  const removeMotorcycle = async (id: string) => {
    if (!token) throw new Error('Usuário não autenticado.');
    try {
      if (isOffline) {
        console.log('Removendo moto em modo OFFLINE');
        const updatedMotos = motorcycles.filter((moto) => moto.id !== id);
        await AsyncStorage.setItem(LOCAL_MOTOS_KEY, JSON.stringify(updatedMotos));
        setMotorcycles(updatedMotos);
      } else {
        const response = await fetch(`${API_BASE_URL}/motorcycles/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok && response.status !== 204) throw await handleApiError(response, setApiOffline);
        
        setMotorcycles((prev) => prev.filter((moto) => moto.id !== id));
      }
    } catch (error) {
      const apiError = await handleApiError(error, setApiOffline);
      console.error('Falha ao remover motocicleta:', apiError.message);
      throw apiError; 
    }
  };

  // Carrega as motos quando o hook é montado
  useEffect(() => {
    loadMotorcycles();
  }, [loadMotorcycles]);

  return { motorcycles, loading, error, refreshMotorcycles: loadMotorcycles, addMotorcycle, updateMotorcycle, removeMotorcycle };
};