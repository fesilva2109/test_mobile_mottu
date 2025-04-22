import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Motorcycle, MotorcycleStatus, YardSection } from '@/types/motorcycle';

interface MotorcycleContextType {
  motorcycles: Motorcycle[];
  setMotorcycles: React.Dispatch<React.SetStateAction<Motorcycle[]>>;
  addMotorcycle: (motorcycle: Motorcycle) => Promise<void>;
  updateMotorcycle: (id: string, updates: Partial<Motorcycle>) => Promise<void>;
  deleteMotorcycle: (id: string) => Promise<void>;
  filterByStatus: (status?: MotorcycleStatus | null) => Motorcycle[];
  filterBySection: (sectionId?: string | null) => Motorcycle[];
  loading: boolean;
  error: string | null;
  yardSections: YardSection[];
  syncWithServer: () => Promise<void>;
  lastSynced: Date | null;
}

const MotorcycleContext = createContext<MotorcycleContextType | undefined>(undefined);

// Sample yard sections
const initialYardSections: YardSection[] = [
  {
    id: 'section-1',
    name: 'Main Yard',
    capacity: 100,
    coordinates: {
      latitude: -23.550520,
      longitude: -46.633308,
      latitudeDelta: 0.0042,
      longitudeDelta: 0.0021,
    },
  },
  {
    id: 'section-2',
    name: 'Maintenance Area',
    capacity: 30,
    coordinates: {
      latitude: -23.551000,
      longitude: -46.634000,
      latitudeDelta: 0.0022,
      longitudeDelta: 0.0011,
    },
  },
  {
    id: 'section-3',
    name: 'Delivery Zone',
    capacity: 50,
    coordinates: {
      latitude: -23.550000,
      longitude: -46.632500,
      latitudeDelta: 0.0032,
      longitudeDelta: 0.0016,
    },
  },
];

// Sample initial data (only used if no data exists in AsyncStorage)
const initialMotorcycles: Motorcycle[] = [
  {
    id: '1',
    licensePlate: 'ABC1234',
    model: 'Scooter',
    status: 'available',
    location: {
      latitude: -23.550520,
      longitude: -46.633308,
      section: 'section-1',
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    licensePlate: 'DEF5678',
    model: 'Street',
    status: 'maintenance',
    location: {
      latitude: -23.551000,
      longitude: -46.634000,
      section: 'section-2',
    },
    lastUpdated: new Date().toISOString(),
    observations: 'Needs brake service',
  },
  {
    id: '3',
    licensePlate: 'GHI9012',
    model: 'Sport',
    status: 'reserved',
    location: {
      latitude: -23.550000,
      longitude: -46.632500,
      section: 'section-3',
    },
    lastUpdated: new Date().toISOString(),
    assignedTo: 'Carlos Silva',
  },
];

export const MotorcycleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yardSections] = useState<YardSection[]>(initialYardSections);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Load motorcycles from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('motorcycles');
        if (storedData) {
          setMotorcycles(JSON.parse(storedData));
        } else {
          // Use initial data if nothing is stored
          setMotorcycles(initialMotorcycles);
          await AsyncStorage.setItem('motorcycles', JSON.stringify(initialMotorcycles));
        }
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save motorcycles to AsyncStorage whenever they change
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('motorcycles', JSON.stringify(motorcycles));
      } catch (err) {
        setError('Failed to save data');
        console.error(err);
      }
    };

    if (motorcycles.length > 0 && !loading) {
      saveData();
    }
  }, [motorcycles, loading]);

  const addMotorcycle = async (motorcycle: Motorcycle) => {
    try {
      const newId = motorcycle.id || Date.now().toString();
      const newMotorcycle = {
        ...motorcycle,
        id: newId,
        lastUpdated: new Date().toISOString(),
      };
      
      setMotorcycles(currentMotorcycles => [...currentMotorcycles, newMotorcycle]);
    } catch (err) {
      setError('Failed to add motorcycle');
      console.error(err);
      throw err;
    }
  };

  const updateMotorcycle = async (id: string, updates: Partial<Motorcycle>) => {
    try {
      setMotorcycles(currentMotorcycles => 
        currentMotorcycles.map(motorcycle => 
          motorcycle.id === id 
            ? { 
                ...motorcycle, 
                ...updates, 
                lastUpdated: new Date().toISOString() 
              } 
            : motorcycle
        )
      );
    } catch (err) {
      setError('Failed to update motorcycle');
      console.error(err);
      throw err;
    }
  };

  const deleteMotorcycle = async (id: string) => {
    try {
      setMotorcycles(currentMotorcycles => 
        currentMotorcycles.filter(motorcycle => motorcycle.id !== id)
      );
    } catch (err) {
      setError('Failed to delete motorcycle');
      console.error(err);
      throw err;
    }
  };

  const filterByStatus = (status?: MotorcycleStatus | null) => {
    if (!status) return motorcycles;
    return motorcycles.filter(motorcycle => motorcycle.status === status);
  };

  const filterBySection = (sectionId?: string | null) => {
    if (!sectionId) return motorcycles;
    return motorcycles.filter(motorcycle => motorcycle.location.section === sectionId);
  };

  // Mock server sync function - would connect to your API in production
  const syncWithServer = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, you would:
      // 1. Send local changes to server
      // 2. Get latest data from server
      // 3. Merge data and resolve conflicts
      
      setLastSynced(new Date());
      return true;
    } catch (err) {
      setError('Failed to sync with server');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    motorcycles,
    setMotorcycles,
    addMotorcycle,
    updateMotorcycle,
    deleteMotorcycle,
    filterByStatus,
    filterBySection,
    loading,
    error,
    yardSections,
    syncWithServer,
    lastSynced,
  };

  return (
    <MotorcycleContext.Provider value={value}>
      {children}
    </MotorcycleContext.Provider>
  );
};

export const useMotorcycles = () => {
  const context = useContext(MotorcycleContext);
  if (context === undefined) {
    throw new Error('useMotorcycles must be used within a MotorcycleProvider');
  }
  return context;
};