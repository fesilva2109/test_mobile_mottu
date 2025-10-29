import { ApiStatusContextType } from "@/context/ApiStatusContext";
import axios, { AxiosError } from "axios";

/**
 * Centraliza o tratamento de erros de API, sejam eles de rede ou de status HTTP.
 
 * @param error O erro capturado, que pode ser uma `Response` ou um `Error`.
 * @param apiStatusSetter Função para setar o status da API para offline.
 * @param customMessages Mapeamento de códigos de status para mensagens personalizadas.
 * @returns Um objeto `Error` com uma mensagem amigável.
 
 */
export async function handleApiError(
  error: unknown,
  apiStatusSetter?: () => void,
  customMessages: Record<number, string> = {}
): Promise<Error> {
  const triggerOfflineMode = () => {
    if (apiStatusSetter) {
      apiStatusSetter();
    }
  };

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    // Erro de rede (sem resposta do servidor)
    if (!axiosError.response) {
      triggerOfflineMode();
      return new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    }

    const { response } = axiosError;
    const status = response.status;
    const data = response.data;

    // Mensagem personalizada para o status code, se existir no `customMessages`
    if (customMessages[status]) {
      return new Error(customMessages[status]);
    }

    // Traduzindo exceções específicas do backend Java
    switch (status) {
      case 400: // Bad Request
        // O backend pode retornar uma mensagem específica para validação
        return new Error(data?.message || 'Dados inválidos. Verifique as informações enviadas.');
      case 404:
        return new Error('O recurso solicitado não foi encontrado.');
      case 409: // Conflict
        // Exemplo: placa de moto já existente, email já cadastrado.
        return new Error(data?.message || 'Conflito de dados. O recurso já existe.');
      case 500:
        return new Error(data?.message || 'Erro interno no servidor. Tente novamente mais tarde.');
      case 502:
      case 503:
      case 504:
        triggerOfflineMode();
        return new Error('O servidor está indisponível. Ativando modo offline.');
      default:
        return new Error(data?.message || `Ocorreu um erro inesperado (código ${status}).`);
    }
  }

  // O erro não é do Axios, pode ser um erro de lógica no frontend
  console.error('API Error Handler:', error);
  if (error instanceof Error) {
    return error;
  }

  // Fallback para erros desconhecidos
  return new Error('Ocorreu um erro desconhecido.');
}