import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Motorcycle, GridPosition } from '@/types';

// Keys for AsyncStorage
const MOTOS_KEY = '@mottu_motos';
const GRID_KEY = '@mottu_grid';


export const motorcycleListeners = new Set<() => void>();

const notifyMotorcycleListeners = () => {
  motorcycleListeners.forEach(listener => listener());
};

export const useMotorcycleStorage = () => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Load motorcycles from AsyncStorage
  const loadMotorcycles = async () => {
    try {
      setLoading(true);
      const storedMotos = await AsyncStorage.getItem(MOTOS_KEY);
      if (storedMotos) {
        setMotorcycles(JSON.parse(storedMotos));
      }
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Failed to load motorcycles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save motorcycles to AsyncStorage
  const saveMotorcycles = useCallback(async (motos: Motorcycle[]) => {
    try {
      await AsyncStorage.setItem(MOTOS_KEY, JSON.stringify(motos));
      setMotorcycles(motos);
      setLastUpdate(Date.now());
      notifyMotorcycleListeners(); 
    } catch (error) {
      console.error('Failed to save motorcycles:', error);
    }
  }, []);

  // Add a new motorcycle
  const addMotorcycle = async (moto: Motorcycle) => {
    const updatedMotos = [...motorcycles, moto];
    await saveMotorcycles(updatedMotos);
    return moto;
  };

  // Update a motorcycle
  const updateMotorcycle = async (updatedMoto: Motorcycle) => {
    const updatedMotos = motorcycles.map(moto => 
      moto.id === updatedMoto.id ? updatedMoto : moto
    );
    await saveMotorcycles(updatedMotos);
    return updatedMoto;
  };

  // Remove a motorcycle
  const removeMotorcycle = async (id: string) => {
    const updatedMotos = motorcycles.filter(moto => moto.id !== id);
    await saveMotorcycles(updatedMotos);
  };

  // Clear all motorcycles
  const clearMotorcycles = async () => {
    try {
      await AsyncStorage.removeItem(MOTOS_KEY);
      setMotorcycles([]);
      setLastUpdate(Date.now());
    } catch (e) {
      console.error('Erro ao limpar motos:', e);
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
    clearMotorcycles,
    refreshMotorcycles: loadMotorcycles,
    lastUpdate
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
        const initialGrid = initializeGrid(8, 8);
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
    }
  };

  // Update a position in the grid
  const updateGridPosition = async (position: GridPosition) => {
    const updatedGrid = gridPositions.map(pos => 
      pos.x === position.x && pos.y === position.y ? position : pos
    );
    await saveGrid(updatedGrid);
  };

  // Place a motorcycle in the grid
  const placeMotorcycle = async (motorcycle: Motorcycle, x: number, y: number) => {
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
  };

  // Remove a motorcycle from the grid
  const removeMotorcycleFromGrid = async (motorcycleId: string) => {
    const updatedGrid = gridPositions.map(pos => {
      if (pos.motorcycle?.id === motorcycleId) {
        return { ...pos, occupied: false, motorcycle: undefined };
      }
      return pos;
    });
    await saveGrid(updatedGrid);
  };

  // Check if a position is occupied
  const isPositionOccupied = (x: number, y: number) => {
    return gridPositions.some(pos => pos.x === x && pos.y === y && pos.occupied);
  };

  // Initialize
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