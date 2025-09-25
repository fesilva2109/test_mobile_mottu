import { useState, useEffect, useCallback } from 'react';
import { Motorcycle } from '@/types';
import { API_BASE_URL } from '@/context/config';

/**
 * Hook customizado para gerenciar o CRUD de motocicletas via API.
 * Lida com carregamento, adição, atualização e remoção de motos.
 */
export const useMotorcycleStorage = () => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca todas as motos da API
  const loadMotorcycles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/motorcycles`);
      if (!response.ok) {
        throw new Error('Failed to fetch motorcycles from API');
      }
      const motosFromApi = await response.json();
      
      // Formata os dados para garantir consistência com o tipo Motorcycle
      const formattedMotos = motosFromApi.map((moto: any): Motorcycle => ({
        id: moto.id,
        placa: moto.placa,
        modelo: moto.modelo,
        cor: moto.cor,
        status: moto.status,
        timestampEntrada: moto.timestampEntrada,
        reservada: moto.reservada || false,
        posicao: moto.posicao ?? null,
      }));

      setMotorcycles(formattedMotos);
    } catch (error) {
      console.error('Failed to load motorcycles:', error);
      setMotorcycles([]); // Em caso de erro, retorna um array vazio
    } finally {
      setLoading(false);
    }
  }, []);

  // Adiciona uma nova moto na API
  const addMotorcycle = async (moto: Omit<Motorcycle, 'id' | 'timestampEntrada'>) => {
    try {
      const newMotoData = {
        ...moto,
        id: `moto_${Date.now()}`, // Simula a geração de ID
        timestampEntrada: Date.now(),
      };

      const response = await fetch(`${API_BASE_URL}/motorcycles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMotoData),
      });

      if (!response.ok) throw new Error('Failed to add motorcycle');
      
      const addedMoto = await response.json();
      setMotorcycles((prev) => [...prev, addedMoto]);
      return addedMoto;
    } catch (error) {
      console.error('Failed to add motorcycle:', error);
      throw error;
    }
  };

  // Atualiza uma moto existente na API
  const updateMotorcycle = async (updatedMoto: Motorcycle) => {
    try {
      const response = await fetch(`${API_BASE_URL}/motorcycles/${updatedMoto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMoto),
      });

      if (!response.ok) throw new Error('Failed to update motorcycle');
      
      setMotorcycles((prev) =>
        prev.map((m) => (m.id === updatedMoto.id ? updatedMoto : m))
      );
      return updatedMoto;
    } catch (error) {
      console.error('Failed to update motorcycle:', error);
      throw error;
    }
  };

  // Remove uma moto da API
  const removeMotorcycle = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/motorcycles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove motorcycle');
      
      setMotorcycles((prev) => prev.filter((moto) => moto.id !== id));
    } catch (error) {
      console.error('Failed to remove motorcycle:', error);
      throw error;
    }
  };

  // Carrega as motos quando o hook é montado
  useEffect(() => {
    loadMotorcycles();
  }, [loadMotorcycles]);

  return { motorcycles, loading, refreshMotorcycles: loadMotorcycles, addMotorcycle, updateMotorcycle, removeMotorcycle };
};