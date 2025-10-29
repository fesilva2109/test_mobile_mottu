export const lightColors = {
  // Primary colors
  primary: {
    main: '#05AF31',
    light: '#3ED17D',
    lighter: '#61CE70',
    bright: '#29D443',
    teal: '#4BCFAD',
    accent: '#A2FF00',
  },
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    lightGray: '#F4F4F4',
    gray: '#7A7A7A',
    darkGray: '#1D1D1D',
    black: '#040408',
  },
  // Status colors
  status: {
    ready: '#05AF31',
    maintenance: '#FFB800',
    quarantine: '#FF5252',
    priority: '#B71C1C',
    reserved: '#4A56E2',
    waiting: '#7A7A7A',
  },
  // Error colors
  error: {
    background: '#ffe6e6',
  }
};

export const darkColors = {
  // Primary colors
  primary: {
    main: '#05AF31',
    light: '#3ED17D',
    lighter: '#61CE70',
    bright: '#29D443',
    teal: '#4BCFAD',
    accent: '#A2FF00',
  },
  // Neutral colors
  neutral: {
    white: '#1D1D1D',
    lightGray: '#2D2D2D',
    gray: '#7A7A7A',
    darkGray: '#F4F4F4',
    black: '#FFFFFF',
  },
  // Status colors
  status: {
    ready: '#05AF31',
    maintenance: '#FFB800',
    quarantine: '#FF5252',
    priority: '#B71C1C',
    reserved: '#4A56E2',
    waiting: '#7A7A7A',
  },
  // Error colors
  error: {
    background: '#ffe6e6',
  }
};

export type ColorsType = typeof lightColors;

export const getStatusColor = (status: string, colors: ColorsType): string => {
  switch (status) {
    case 'Pronta para aluguel':
      return colors.status.ready;
    case 'Em manutenção':
      return colors.status.maintenance;
    case 'Em quarentena':
      return colors.status.quarantine;
    case 'Alta prioridade':
      return colors.status.priority;
    case 'Reservada':
      return colors.status.reserved;
    case 'Aguardando vistoria':
      return colors.status.waiting;
    default:
      return colors.status.waiting;
  }
};

export const getModelIcon = (model: string): string => {
  switch (model) {
    case 'Mottu Pop':
      return '🛵';
    case 'Mottu Sport':
      return '🏍️';
    case 'Mottu-E':
      return '⚡';
    default:
      return '🛵';
  }
};
