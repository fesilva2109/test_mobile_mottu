import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Motorcycle, GridPosition } from '@/types';

// Chaves para armazenamento local no AsyncStorage
const MOTOS_KEY = '@mottu_motos';
const GRID_KEY = '@mottu_grid';
const TOKEN_KEY = '@mottu:token';

const API_BASE = 'https://68cb62ef716562cf50734720.mockapi.io/api/v1';

export const useMotorcycleStorage = () => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);

  // Load motorcycles from mock API with all required attributes
  const loadMotorcycles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/motorcycles`);
      if (!response.ok) {
        throw new Error('Failed to fetch motorcycles');
      }
      const motos = await response.json();
      // Map or validate attributes if needed here
      setMotorcycles(
        motos.map((moto: any) => ({
          id: moto.id,
          placa: moto.placa,
          modelo: moto.modelo,
          cor: moto.cor,
          status: moto.status,
          timestampEntrada: moto.timestampEntrada,
          reservada: moto.reservada,
          posicao: moto.posicao || null,
        }))
      );
      console.log('useMotorcycleStorage: Motos carregadas:', motos.length);
    } catch (error) {
      console.error('Failed to load motorcycles:', error);
      setMotorcycles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new motorcycle via API with all required attributes
  const addMotorcycle = async (moto: Motorcycle) => {
    try {
      const response = await fetch(`${API_BASE}/motorcycles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: moto.id,
          placa: moto.placa,
          modelo: moto.modelo,
          cor: moto.cor,
          status: moto.status,
          timestampEntrada: moto.timestampEntrada,
          reservada: moto.reservada,
          posicao: moto.posicao || null,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add motorcycle');
      }
      const newMoto = await response.json();
      setMotorcycles((prev) => [...prev, newMoto]);
      return newMoto;
    } catch (error) {
      console.error('Failed to add motorcycle:', error);
      throw error;
    }
  };

  // Update a motorcycle via API with all required attributes
  const updateMotorcycle = async (updatedMoto: Motorcycle) => {
    try {
      const response = await fetch(`${API_BASE}/motorcycles/${updatedMoto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatedMoto.id,
          placa: updatedMoto.placa,
          modelo: updatedMoto.modelo,
          cor: updatedMoto.cor,
          status: updatedMoto.status,
          timestampEntrada: updatedMoto.timestampEntrada,
          reservada: updatedMoto.reservada,
          posicao: updatedMoto.posicao || null,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update motorcycle');
      }
      const moto = await response.json();
      setMotorcycles((prev) =>
        prev.map((m) => (m.id === moto.id ? moto : m))
      );
      return moto;
    } catch (error) {
      console.error('Failed to update motorcycle:', error);
      throw error;
    }
  };

  // Remove a motorcycle via API
  const removeMotorcycle = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/motorcycles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove motorcycle');
      }
      setMotorcycles((prev) => prev.filter((moto) => moto.id !== id));
      return true;
    } catch (error) {
      console.error('Failed to remove motorcycle:', error);
      return false;
    }
  };

    // Limpa todas as motos do armazenamento
    const clearMotorcycles = async () => {
        try {
            await AsyncStorage.removeItem(MOTOS_KEY);
            setMotorcycles([]);
        } catch (e) {
            console.error('Erro ao limpar motos:', e);
        }
    };

    // Carrega motos ao montar o componente
    useEffect(() => {
        loadMotorcycles();
    }, []);

    return {
        motorcycles,
        loading,
        refreshMotorcycles: loadMotorcycles,
        addMotorcycle,
        updateMotorcycle,
        removeMotorcycle,
        clearMotorcycles,
    };
};

export const useGridStorage = () => {
    const [gridPositions, setGridPositions] = useState<GridPosition[]>([]);
    const [loading, setLoading] = useState(true);

    // Inicializa grid com dimensões padrão (8x8)
    const initializeGrid = (columns: number, rows: number): GridPosition[] => {
        const positions: GridPosition[] = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                positions.push({
                    x,
                    y,
                    occupied: false,
                });
            }
        }
        return positions;
    };

    // Carrega grid do AsyncStorage ou inicializa se não existir
    const loadGrid = async () => {
        try {
            setLoading(true);
            const storedGrid = await AsyncStorage.getItem(GRID_KEY);
            if (storedGrid) {
                setGridPositions(JSON.parse(storedGrid));
            } else {
                const initialGrid = initializeGrid(8, 8);
                setGridPositions(initialGrid);
                await AsyncStorage.setItem(GRID_KEY, JSON.stringify(initialGrid));
            }
        } catch (error) {
            console.error('Failed to load grid:', error);
            const initialGrid = initializeGrid(5, 5);
            setGridPositions(initialGrid);
        } finally {
            setLoading(false);
        }
    };

    // Salva grid atualizado no AsyncStorage
    const saveGrid = async (grid: GridPosition[]) => {
        try {
            await AsyncStorage.setItem(GRID_KEY, JSON.stringify(grid));
            setGridPositions(grid);
        } catch (error) {
            console.error('Failed to save grid:', error);
        }
    };

    // Atualiza uma posição específica do grid
    const updateGridPosition = async (position: GridPosition) => {
        const updatedGrid = gridPositions.map(pos =>
            pos.x === position.x && pos.y === position.y ? position : pos
        );
        await saveGrid(updatedGrid);
    };

    // Posiciona uma moto em uma célula do grid
    const placeMotorcycle = async (motorcycle: Motorcycle, x: number, y: number) => {
        // Remove moto de qualquer posição anterior
        let updatedGrid = gridPositions.map(pos => {
            if (pos.motorcycle?.id === motorcycle.id) {
                return { ...pos, occupied: false, motorcycle: undefined };
            }
            return pos;
        });

        // Posiciona moto na nova célula
        updatedGrid = updatedGrid.map(pos => {
            if (pos.x === x && pos.y === y) {
                return { ...pos, occupied: true, motorcycle: { ...motorcycle, posicao: { x, y } } };
            }
            return pos;
        });

        await saveGrid(updatedGrid);
        return { ...motorcycle, posicao: { x, y } };
    };

    // Remove uma moto do grid pelo ID
    const removeMotorcycleFromGrid = async (motorcycleId: string) => {
        const updatedGrid = gridPositions.map(pos => {
            if (pos.motorcycle?.id === motorcycleId) {
                return { ...pos, occupied: false, motorcycle: undefined };
            }
            return pos;
        });
        await saveGrid(updatedGrid);
    };

    // Verifica se uma posição está ocupada
    const isPositionOccupied = (x: number, y: number) => {
        return gridPositions.some(pos => pos.x === x && pos.y === y && pos.occupied);
    };

    // Carrega grid ao montar o componente
    useEffect(() => {
        loadGrid();
    }, []);

    return {
        gridPositions,
        loading,
        updateGridPosition,
        placeMotorcycle,
        removeMotorcycleFromGrid,
        isPositionOccupied,
        refreshGrid: loadGrid
    };
};