export interface Motorcycle {
  id: string;
  placa: string;
  modelo: string;
  cor: string;
  status: MotorcycleStatus;
  position?: { x: number; y: number };
  createdAt: Date;
  reservationTime?: Date;
  timeInYard?: number; // in days
}

export type MotorcycleStatus = 
  | 'Pronta para aluguel'
  | 'Em manutenção'
  | 'Aguardando vistoria'
  | 'Em reparo emergencial'
  | 'Em quarentena';

export type MotorcycleModel = 
  | 'Mottu Pop'
  | 'Mottu Sport'
  | 'Mottu-E';

export interface GridCell {
  x: number;
  y: number;
  motorcycle?: Motorcycle;
  isOccupied: boolean;
}

export interface GridDimensions {
  rows: number;
  cols: number;
  cellSize: number;
}

export interface FilterOptions {
  status: MotorcycleStatus | 'all';
  model: MotorcycleModel | 'all';
}

export interface YardMetrics {
  totalMotorcycles: number;
  readyMotorcycles: number;
  inMaintenanceMotorcycles: number;
  averageTimeInYard: number;
  efficiencyScore: number;
  potentialDeliveries: number;
}