import { ApiStatusContextType } from "@/context/ApiStatusContext";
import axios, { AxiosError } from "axios";
import i18n from "@/i18n";


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

    if (!axiosError.response) {
      triggerOfflineMode();
      return new Error(i18n.t('errors.offline'));
    }

    const { response } = axiosError;
    const status = response.status;
    const data = response.data;

    // Mensagem personalizada para o status code, se existir no `customMessages`
    if (status === 401 || status === 403) {
      return new Error(i18n.t('errors.authFailed'));
    }
    if (customMessages[status]) {
      return new Error(customMessages[status]);
    }

    // Traduzindo exceções específicas do backend Java
    switch (status) {
      case 400: 
        return new Error(data?.message || i18n.t('registerMoto.addError'));
      case 404:
        return new Error(data?.message || i18n.t('errors.unexpected'));
      case 409:
        return new Error(customMessages[status] || data?.message || i18n.t('auth.registerConflict'));
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

  console.error('API Error Handler:', error);
  if (error instanceof Error) {
    return error;
  }

  // Fallback para erros desconhecidos
  return new Error(i18n.t('errors.unexpected'));
}