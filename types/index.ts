export interface Motorcycle {
  id: string;
  placa: string;
  modelo: string;
  cor: string;
  status: string;
  posicao?: {
    x: number;
    y: number;
  } | null;
  timestampEntrada: number;
  reservada?: boolean;
}
export interface User {
  id: string;
  name: string;
  email: string;
}
export interface GridPosition {
  x: number;
  y: number;
  occupied: boolean;
  motorcycle?: Motorcycle;
}

export interface DashboardMetrics {
  totalMotos: number;
  motosDisponiveis: number;
  motosEmManutencao: number;
  motosEmQuarentena: number;
  tempoMedioPatio: number; // em horas
  eficiencia: number; // porcentagem
}