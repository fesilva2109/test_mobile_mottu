import { create } from 'zustand';
import { Motorcycle, MotorcycleStatus, MotorcycleModel, GridCell, FilterOptions, YardMetrics } from '../constants/Types';

interface MotorcycleState {
  motorcycles: Motorcycle[];
  waitingMotorcycles: Motorcycle[];
  gridCells: GridCell[][];
  gridDimensions: { rows: number; cols: number; cellSize: number };
  filters: FilterOptions;
  addMotorcycle: (motorcycle: Omit<Motorcycle, 'id' | 'createdAt'>) => void;
  moveMotorcycleToGrid: (id: string, x: number, y: number) => boolean;
  updateMotorcycleStatus: (id: string, status: MotorcycleStatus) => void;
  removeMotorcycle: (id: string) => void;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  getFilteredMotorcycles: () => Motorcycle[];
  getYardMetrics: () => YardMetrics;
  isCellOccupied: (x: number, y: number) => boolean;
  resetGrid: () => void;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Create store with initial data for demo purposes
export const useMotorcycleStore = create<MotorcycleState>((set, get) => ({
  motorcycles: generateDemoMotorcycles(10),
  waitingMotorcycles: generateDemoMotorcycles(5),
  gridCells: initializeGrid(8, 10),
  gridDimensions: { rows: 8, cols: 10, cellSize: 80 },
  filters: { status: 'all', model: 'all' },

  addMotorcycle: (motorcycle) => {
    const newMotorcycle: Motorcycle = {
      ...motorcycle,
      id: generateId(),
      createdAt: new Date(),
      timeInYard: 0
    };

    set((state) => ({
      waitingMotorcycles: [...state.waitingMotorcycles, newMotorcycle]
    }));
  },

  moveMotorcycleToGrid: (id, x, y) => {
    const { gridCells, waitingMotorcycles } = get();
    
    // Check if cell is already occupied
    if (gridCells[y][x].isOccupied) {
      return false;
    }

    // Find motorcycle in waiting list
    const motorcycleIndex = waitingMotorcycles.findIndex(m => m.id === id);
    if (motorcycleIndex === -1) return false;
    
    const motorcycle = {...waitingMotorcycles[motorcycleIndex], position: { x, y }};
    
    // Update grid cells
    const newGridCells = [...gridCells];
    newGridCells[y][x] = { 
      ...newGridCells[y][x], 
      motorcycle: motorcycle, 
      isOccupied: true 
    };

    // Move motorcycle from waiting list to placed list
    set((state) => ({
      waitingMotorcycles: state.waitingMotorcycles.filter(m => m.id !== id),
      motorcycles: [...state.motorcycles, motorcycle],
      gridCells: newGridCells
    }));

    return true;
  },

  updateMotorcycleStatus: (id, status) => {
    set((state) => ({
      motorcycles: state.motorcycles.map(m => 
        m.id === id ? { ...m, status } : m
      ),
      waitingMotorcycles: state.waitingMotorcycles.map(m => 
        m.id === id ? { ...m, status } : m
      )
    }));
  },

  removeMotorcycle: (id) => {
    const { motorcycles, gridCells } = get();
    const motorcycle = motorcycles.find(m => m.id === id);
    
    if (motorcycle?.position) {
      const { x, y } = motorcycle.position;
      const newGridCells = [...gridCells];
      newGridCells[y][x] = { x, y, isOccupied: false };
      
      set((state) => ({
        motorcycles: state.motorcycles.filter(m => m.id !== id),
        gridCells: newGridCells
      }));
    } else {
      set((state) => ({
        motorcycles: state.motorcycles.filter(m => m.id !== id),
        waitingMotorcycles: state.waitingMotorcycles.filter(m => m.id !== id)
      }));
    }
  },

  updateFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  getFilteredMotorcycles: () => {
    const { motorcycles, filters } = get();
    return motorcycles.filter(m => {
      const statusMatch = filters.status === 'all' || m.status === filters.status;
      const modelMatch = filters.model === 'all' || m.modelo === filters.model;
      return statusMatch && modelMatch;
    });
  },

  getYardMetrics: () => {
    const { motorcycles } = get();
    
    const readyMotorcycles = motorcycles.filter(m => m.status === 'Pronta para aluguel').length;
    const inMaintenanceMotorcycles = motorcycles.filter(m => 
      m.status === 'Em manutenção' || m.status === 'Em reparo emergencial'
    ).length;
    
    const totalTimeInYard = motorcycles.reduce((sum, m) => sum + (m.timeInYard || 0), 0);
    const averageTimeInYard = motorcycles.length > 0 ? totalTimeInYard / motorcycles.length : 0;
    
    // Efficiency score (example formula: percentage of ready motorcycles - avg time in yard penalty)
    const readyPercentage = motorcycles.length > 0 ? (readyMotorcycles / motorcycles.length) * 100 : 0;
    const timePenalty = Math.min(averageTimeInYard * 2, 20); // Cap penalty at 20%
    const efficiencyScore = Math.max(0, readyPercentage - timePenalty);
    
    // Potential deliveries (simple estimation)
    const potentialDeliveries = Math.round(readyMotorcycles * 1.5);
    
    return {
      totalMotorcycles: motorcycles.length,
      readyMotorcycles,
      inMaintenanceMotorcycles,
      averageTimeInYard,
      efficiencyScore,
      potentialDeliveries
    };
  },

  isCellOccupied: (x, y) => {
    const { gridCells } = get();
    return gridCells[y][x].isOccupied;
  },
  
  resetGrid: () => {
    set((state) => ({
      gridCells: initializeGrid(state.gridDimensions.rows, state.gridDimensions.cols)
    }));
  }
}));

// Initialize grid cells
function initializeGrid(rows: number, cols: number): GridCell[][] {
  return Array(rows).fill(0).map((_, y) => 
    Array(cols).fill(0).map((_, x) => ({
      x,
      y,
      isOccupied: false
    }))
  );
}

// Generate demo motorcycles
function generateDemoMotorcycles(count: number): Motorcycle[] {
  const statuses: MotorcycleStatus[] = [
    'Pronta para aluguel',
    'Em manutenção',
    'Aguardando vistoria',
    'Em reparo emergencial',
    'Em quarentena'
  ];
  
  const models: MotorcycleModel[] = ['Mottu Pop', 'Mottu Sport', 'Mottu-E'];
  const colors = ['Preto', 'Vermelho', 'Branco', 'Azul', 'Prata', 'Verde'];
  
  return Array(count).fill(0).map((_, i) => {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    const timeInYard = Math.floor((new Date().getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
    
    // Some motorcycles have reservations
    const hasReservation = Math.random() > 0.7;
    const reservationTime = hasReservation ? new Date(
      new Date().getTime() + Math.floor(Math.random() * 48) * 3600 * 1000
    ) : undefined;
    
    return {
      id: generateId(),
      placa: `M${Math.floor(Math.random() * 9000) + 1000}`,
      modelo: models[Math.floor(Math.random() * models.length)],
      cor: colors[Math.floor(Math.random() * colors.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: createdDate,
      timeInYard,
      reservationTime
    };
  });
}