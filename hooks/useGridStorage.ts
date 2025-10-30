import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Motorcycle, GridPosition } from '@/types';

const GRID_KEY = '@mottu:grid';

export const useGridStorage = () => {
  const [gridPositions, setGridPositions] = useState<GridPosition[]>([]);
  const [loading, setLoading] = useState(true);

  // Cria um grid inicial com posições vazias
  const initializeGrid = (columns: number, rows: number): GridPosition[] => {
    const positions: GridPosition[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        positions.push({ x, y, occupied: false });
      }
    }
    return positions;
  };

  // Carrega o grid salvo ou cria um novo se não existir
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

  // Salva o estado atual do grid no AsyncStorage
  const saveGrid = async (grid: GridPosition[]) => {
    try {
      await AsyncStorage.setItem(GRID_KEY, JSON.stringify(grid));
      setGridPositions(grid);
    } catch (error) {
      console.error('Failed to save grid:', error);
    }
  };

  // Posiciona uma motocicleta em uma célula específica do grid
  const placeMotorcycle = async (motorcycle: Motorcycle, x: number, y: number) => {
    // Remove a moto de qualquer posição anterior para evitar duplicatas
    let updatedGrid = gridPositions.map(pos => {
      if (pos.motorcycle?.id === motorcycle.id) {
        return { ...pos, occupied: false, motorcycle: undefined };
      }
      return pos;
    });

    // Coloca a moto na nova posição
    updatedGrid = updatedGrid.map(pos => {
      if (pos.x === x && pos.y === y) {
        return { ...pos, occupied: true, motorcycle: { ...motorcycle, posicao: { x, y } } };
      }
      return pos;
    });

    await saveGrid(updatedGrid);
    return { ...motorcycle, posicao: { x, y } };
  };

  // Remove uma motocicleta do grid usando seu ID
  const removeMotorcycleFromGrid = async (motorcycleId: string) => {
    const updatedGrid = gridPositions.map(pos => {
      if (pos.motorcycle?.id === motorcycleId) {
        return { ...pos, occupied: false, motorcycle: undefined };
      }
      return pos;
    });
    await saveGrid(updatedGrid);
  };

  // Carrega o grid quando o hook é inicializado
  useEffect(() => {
    loadGrid();
  }, []);

  return {
    gridPositions,
    loading,
    placeMotorcycle,
    removeMotorcycleFromGrid,
    refreshGrid: loadGrid,
  };
};