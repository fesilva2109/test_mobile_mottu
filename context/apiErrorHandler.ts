import { ApiStatusContextType } from "@/context/ApiStatusContext";
import axios, { AxiosError } from "axios";
import i18n from "@/i18n";

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
      return new Error(i18n.t('errors.offline'));
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
        return new Error(data?.message || i18n.t('registerMoto.addError'));
      case 404:
        return new Error(data?.message || i18n.t('errors.unexpected'));
      case 409: // Conflict
        // Exemplo: placa de moto já existente, email já cadastrado.
        return new Error(data?.message || i18n.t('auth.registerConflict'));
      case 500:
        return new Error(data?.message || i18n.t('errors.unexpected'));
      case 502:
      case 503:
      case 504:
        triggerOfflineMode();
        return new Error(i18n.t('errors.unavailable'));
      default:
        return new Error(data?.message || i18n.t('errors.unexpected'));
    }
  }

  // O erro não é do Axios, pode ser um erro de lógica no frontend
  console.error('API Error Handler:', error);
  if (error instanceof Error) {
    return error;
  }

  // Fallback para erros desconhecidos
  return new Error(i18n.t('errors.unexpected'));
}