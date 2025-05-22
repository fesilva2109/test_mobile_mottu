import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Motorcycle, GridPosition } from '@/types';

const MOTOS_KEY = '@mottu_motos';
const GRID_KEY = '@mottu_grid';

export const useMotorcycleStorage = () => {
    const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
    const [loading, setLoading] = useState(true);

  const loadMotorcycles = useCallback(async () => { 
    try {
      setLoading(true);
      const storedMotos = await AsyncStorage.getItem(MOTOS_KEY);
      if (storedMotos) {
        setMotorcycles(JSON.parse(storedMotos));
        console.log('useMotorcycleStorage: Motos carregadas:', JSON.parse(storedMotos).length);
      }
    } catch (error) {
      console.error('Failed to load motorcycles:', error);
    } finally {
      setLoading(false);
    }
  }, []);

    const saveMotorcycles = useCallback(async (motos: Motorcycle[]) => {
        try {
            await AsyncStorage.setItem(MOTOS_KEY, JSON.stringify(motos));
            setMotorcycles(motos);
        } catch (error) {
            console.error('Failed to save motorcycles:', error);
        }
    }, []);

    const addMotorcycle = async (moto: Motorcycle) => {
        const updatedMotos = [...motorcycles, moto];
        await saveMotorcycles(updatedMotos);
        return moto;
    };

    const updateMotorcycle = async (updatedMoto: Motorcycle) => {
        const updatedMotos = motorcycles.map(moto =>
            moto.id === updatedMoto.id ? updatedMoto : moto
        );
        await saveMotorcycles(updatedMotos);
        return updatedMoto;
    };

    const removeMotorcycle = async (id: string) => {
        try {
            const updatedMotos = motorcycles.filter(moto => moto.id !== id);
            await AsyncStorage.setItem(MOTOS_KEY, JSON.stringify(updatedMotos));
            setMotorcycles(updatedMotos);
            return true;
        } catch (error) {
            console.error('Failed to remove motorcycle:', error);
            return false;
        }
    };

    const clearMotorcycles = async () => {
        try {
            await AsyncStorage.removeItem(MOTOS_KEY);
            setMotorcycles([]);
        } catch (e) {
            console.error('Erro ao limpar motos:', e);
        }
    };

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

    const saveGrid = async (grid: GridPosition[]) => {
        try {
            await AsyncStorage.setItem(GRID_KEY, JSON.stringify(grid));
            setGridPositions(grid);
        } catch (error) {
            console.error('Failed to save grid:', error);
        }
    };

    const updateGridPosition = async (position: GridPosition) => {
        const updatedGrid = gridPositions.map(pos =>
            pos.x === position.x && pos.y === position.y ? position : pos
        );
        await saveGrid(updatedGrid);
    };

    const placeMotorcycle = async (motorcycle: Motorcycle, x: number, y: number) => {
        let updatedGrid = gridPositions.map(pos => {
            if (pos.motorcycle?.id === motorcycle.id) {
                return { ...pos, occupied: false, motorcycle: undefined };
            }
            return pos;
        });

        updatedGrid = updatedGrid.map(pos => {
            if (pos.x === x && pos.y === y) {
                return { ...pos, occupied: true, motorcycle: { ...motorcycle, posicao: { x, y } } };
            }
            return pos;
        });

        await saveGrid(updatedGrid);
        return { ...motorcycle, posicao: { x, y } };
    };

    const removeMotorcycleFromGrid = async (motorcycleId: string) => {
        const updatedGrid = gridPositions.map(pos => {
            if (pos.motorcycle?.id === motorcycleId) {
                return { ...pos, occupied: false, motorcycle: undefined };
            }
            return pos;
        });
        await saveGrid(updatedGrid);
    };

    const isPositionOccupied = (x: number, y: number) => {
        return gridPositions.some(pos => pos.x === x && pos.y === y && pos.occupied);
    };

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