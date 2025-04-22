export type MotorcycleStatus = 
   'pronta' 
  | 'indisponivel' 
  | 'manutenção' 
  | 'reservada'
  | 'transito';

export type Motorcycle = {
  id: string;
  licensePlate: string;
  model: 'Mottu Pop' | 'Mottu Sport' | 'Mottu-E' | 'Outro';
  status: MotorcycleStatus;
  location: {
    latitude: number;
    longitude: number;
    section?: string;
  };
  lastUpdated: string;
  observations?: string;
  imageUrl?: string;
  assignedTo?: string;
  critical?: boolean;
  customFields?: Record<string, any>;
};

export type YardSection = {
  id: string;
  name: string;
  capacity: number;
  coordinates: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
};