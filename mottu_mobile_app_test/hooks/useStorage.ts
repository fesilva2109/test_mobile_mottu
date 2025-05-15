import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Motorcycle, GridPosition } from '@/types';

// Keys for AsyncStorage
const MOTOS_KEY = '@mottu_motos';
const GRID_KEY = '@mottu_grid';

export const useMotorcycleStorage = () => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);

  // Load motorcycles from AsyncStorage
  const loadMotorcycles = async () => {
    try {
      setLoading(true);
      const storedMotos = await AsyncStorage.getItem(MOTOS_KEY);
      if (storedMotos) {
        setMotorcycles(JSON.parse(storedMotos));
      }
    } catch (error) {
      console.error('Failed to load motorcycles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save motorcycles to AsyncStorage
  const saveMotorcycles = async (motos: Motorcycle[]) => {
    try {
      await AsyncStorage.setItem(MOTOS_KEY, JSON.stringify(motos));
      setMotorcycles(motos);
    } catch (error) {
      console.error('Failed to save motorcycles:', error);
      throw error; // Propagate error to handle it in the UI
    }
  };

  // Add a new motorcycle
  const addMotorcycle = async (moto: Motorcycle) => {
    try {
      const updatedMotos = [...motorcycles, moto];
      await saveMotorcycles(updatedMotos);
      return moto;
    } catch (error) {
      console.error('Failed to add motorcycle:', error);
      throw error;
    }
  };

  // Update a motorcycle
  const updateMotorcycle = async (updatedMoto: Motorcycle) => {
    try {
      const updatedMotos = motorcycles.map(moto => 
        moto.id === updatedMoto.id ? updatedMoto : moto
      );
      await saveMotorcycles(updatedMotos);
      return updatedMoto;
    } catch (error) {
      console.error('Failed to update motorcycle:', error);
      throw error;
    }
  };

  // Remove a motorcycle
  const removeMotorcycle = async (id: string) => {
    try {
      const updatedMotos = motorcycles.filter(moto => moto.id !== id);
      await saveMotorcycles(updatedMotos);
    } catch (error) {
      console.error('Failed to remove motorcycle:', error);
      throw error;
    }
  };

  // Initialize
  useEffect(() => {
    loadMotorcycles();
  }, []);

  return {
    motorcycles,
    loading,
    addMotorcycle,
    updateMotorcycle,
    removeMotorcycle,
    refreshMotorcycles: loadMotorcycles
  };
};

export const useGridStorage = () => {
  const [gridPositions, setGridPositions] = useState<GridPosition[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize grid with empty positions if none exists
  const initializeGrid = (columns: number, rows: number) => {
    const positions: GridPosition[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        positions.push({
          x,
          y,
          occupied: false
        });
      }
    }
    return positions;
  };

  // Load grid from AsyncStorage
  const loadGrid = async () => {
    try {
      setLoading(true);
      const storedGrid = await AsyncStorage.getItem(GRID_KEY);
      if (storedGrid) {
        setGridPositions(JSON.parse(storedGrid));
      } else {
        // If no grid exists, initialize a new one (default 5x5)
        const initialGrid = initializeGrid(5, 5);
        setGridPositions(initialGrid);
        await AsyncStorage.setItem(GRID_KEY, JSON.stringify(initialGrid));
      }
    } catch (error) {
      console.error('Failed to load grid:', error);
      // Initialize grid with default values if loading fails
      const initialGrid = initializeGrid(5, 5);
      setGridPositions(initialGrid);
    } finally {
      setLoading(false);
    }
  };

  // Save grid to AsyncStorage
  const saveGrid = async (grid: GridPosition[]) => {
    try {
      await AsyncStorage.setItem(GRID_KEY, JSON.stringify(grid));
      setGridPositions(grid);
    } catch (error) {
      console.error('Failed to save grid:', error);
      throw error;
    }
  };

  // Place a motorcycle in the grid
  const placeMotorcycle = async (motorcycle: Motorcycle, x: number, y: number) => {
    try {
      // Remove motorcycle from previous position if it exists
      let updatedGrid = gridPositions.map(pos => {
        if (pos.motorcycle?.id === motorcycle.id) {
          return { ...pos, occupied: false, motorcycle: undefined };
        }
        return pos;
      });

      // Place motorcycle in new position
      updatedGrid = updatedGrid.map(pos => {
        if (pos.x === x && pos.y === y) {
          return { ...pos, occupied: true, motorcycle: { ...motorcycle, posicao: { x, y } } };
        }
        return pos;
      });

      await saveGrid(updatedGrid);
      return { ...motorcycle, posicao: { x, y } };
    } catch (error) {
      console.error('Failed to place motorcycle:', error);
      throw error;
    }
  };

  // Remove a motorcycle from the grid
  const removeMotorcycleFromGrid = async (motorcycleId: string) => {
    try {
      const updatedGrid = gridPositions.map(pos => {
        if (pos.motorcycle?.id === motorcycleId) {
          return { ...pos, occupied: false, motorcycle: undefined };
        }
        return pos;
      });
      await saveGrid(updatedGrid);
    } catch (error) {
      console.error('Failed to remove motorcycle from grid:', error);
      throw error;
    }
  };

  // Initialize
  useEffect(() => {
    loadGrid();
  }, []);

  return {
    gridPositions,
    loading,
    placeMotorcycle,
    removeMotorcycleFromGrid,
    refreshGrid: loadGrid
  };
};