export type MotorcycleStatus = 
  | 'available' 
  | 'unavailable' 
  | 'maintenance' 
  | 'reserved' 
  | 'transit';

export type MotorcycleModel = 
  | 'Scooter' 
  | 'Street' 
  | 'Sport' 
  | 'Touring' 
  | 'Off-road';

export type Motorcycle = {
  id: string;
  licensePlate: string;
  model: MotorcycleModel;
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