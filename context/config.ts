// URL da API real (backend Java) - Substitua pelo IP da sua máquina
const REAL_API_URL = 'http://192.168.0.10:8080'; 

// URL da API de mock (mockapi.io) 
const MOCK_API_URL = 'https://68cb62ef716562cf50734720.mockapi.io/api/v1';

// Alterne para 'true' para usar a mock API, ou 'false' para usar a API real.
export const USE_MOCK_API = true; 

// Exporta a URL base correta com base na configuração
export const API_BASE_URL = USE_MOCK_API ? MOCK_API_URL : `${REAL_API_URL}/api`;