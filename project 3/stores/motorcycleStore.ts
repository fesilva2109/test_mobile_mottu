import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipo para a moto
export interface Motorcycle {
  id: string;
  placa: string;
  modelo: string;
  status: 'disponível' | 'manutenção' | 'reservada' | 'outros';
  cor?: string;
  observacoes?: string;
  position: {
    x: number;
    y: number;
  };
  timestamp: string;
}

interface MotorcycleStore {
  motorcycles: Motorcycle[];
  isLoading: boolean;
  addMotorcycle: (motorcycle: Motorcycle) => void;
  updateMotorcycle: (id: string, data: Partial<Motorcycle>) => void;
  removeMotorcycle: (id: string) => void;
  syncMotorcycles: () => Promise<void>;
}

// Alguns dados iniciais para demonstração
const initialMotorcycles: Motorcycle[] = [
  {
    id: '1',
    placa: 'BRZ2A44',
    modelo: 'Honda CG 160',
    status: 'disponível',
    cor: 'Preta',
    position: { x: 2, y: 3 },
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    placa: 'BRA1B22',
    modelo: 'Honda Biz 125',
    status: 'manutenção',
    cor: 'Vermelha',
    observacoes: 'Problemas no freio traseiro. Aguardando peças.',
    position: { x: 5, y: 2 },
    timestamp: new Date().toISOString(),
  },
  {
    id: '3',
    placa: 'BRF3C55',
    modelo: 'Yamaha Factor 150',
    status: 'reservada',
    cor: 'Azul',
    position: { x: 1, y: 7 },
    timestamp: new Date().toISOString(),
  },
  {
    id: '4',
    placa: 'BRY7D88',
    modelo: 'Honda CB 250F',
    status: 'disponível',
    cor: 'Preta',
    position: { x: 8, y: 4 },
    timestamp: new Date().toISOString(),
  },
  {
    id: '5',
    placa: 'BRH9E11',
    modelo: 'Yamaha Fazer 250',
    status: 'disponível',
    cor: 'Branca',
    position: { x: 4, y: 1 },
    timestamp: new Date().toISOString(),
  },
  {
    id: '6',
    placa: 'BRJ5F33',
    modelo: 'Honda CG 160',
    status: 'manutenção',
    cor: 'Vermelha',
    observacoes: 'Troca de óleo e revisão geral.',
    position: { x: 3, y: 6 },
    timestamp: new Date().toISOString(),
  },
  {
    id: '7',
    placa: 'BRR6G77',
    modelo: 'Honda Biz 125',
    status: 'disponível',
    cor: 'Prata',
    position: { x: 6, y: 8 },
    timestamp: new Date().toISOString(),
  },
];

export const useMotorcycleStore = create<MotorcycleStore>()(
  persist(
    (set, get) => ({
      motorcycles: initialMotorcycles,
      isLoading: false,

      addMotorcycle: (motorcycle) => {
        set((state) => ({
          motorcycles: [...state.motorcycles, motorcycle],
        }));
      },

      updateMotorcycle: (id, data) => {
        set((state) => ({
          motorcycles: state.motorcycles.map((m) =>
            m.id === id ? { ...m, ...data } : m
          ),
        }));
      },

      removeMotorcycle: (id) => {
        set((state) => ({
          motorcycles: state.motorcycles.filter((m) => m.id !== id),
        }));
      },

      syncMotorcycles: async () => {
        // Simular sincronização com backend
        set({ isLoading: true });
        
        // Simular tempo de resposta da API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Gerar algumas motos aleatórias como se fossem novas do servidor
        const newMotorcycle: Motorcycle = {
          id: Math.random().toString(36).substr(2, 9),
          placa: `BR${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(
            65 + Math.floor(Math.random() * 26)
          )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
          modelo: ['Honda CG 160', 'Honda Biz 125', 'Yamaha Factor 150'][
            Math.floor(Math.random() * 3)
          ],
          status: ['disponível', 'manutenção', 'reservada'][
            Math.floor(Math.random() * 3)
          ] as 'disponível' | 'manutenção' | 'reservada',
          cor: ['Preta', 'Vermelha', 'Branca', 'Azul', 'Prata'][
            Math.floor(Math.random() * 5)
          ],
          position: {
            x: Math.floor(Math.random() * 10),
            y: Math.floor(Math.random() * 10),
          },
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          motorcycles: [...state.motorcycles, newMotorcycle],
          isLoading: false,
        }));
      },
    }),
    {
      name: 'motorcycle-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);