import { ApiStatusContextType } from "@/context/ApiStatusContext";

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
  if (error instanceof Response) {
    // O erro é uma resposta da API com status de falha (4xx, 5xx)
    const response = error;

    // Mensagem personalizada para o status code, se existir
    if (customMessages[response.status]) {
      return new Error(customMessages[response.status]);
    }

    // Mensagens genéricas para status de erro comuns
    if (response.status === 404) {
      return new Error('O recurso solicitado não foi encontrado no servidor.');
    }
    if (response.status >= 500) {
      triggerOfflineMode();
      return new Error('O servidor está indisponível ou em manutenção. Tente novamente mais tarde.');
    }

    // Tenta extrair uma mensagem de erro do corpo da resposta
    try {
      const errorData = await response.json();
      return new Error(errorData.message || 'Ocorreu um erro na comunicação com o servidor.');
    } catch {
      return new Error(`Erro ${response.status}: Não foi possível processar a resposta do servidor.`);
    }
  }

  // O erro é de rede ou já é um Error
  console.error('API Error Handler:', error);

  if (error instanceof Error && error.message.includes('Network request failed')) {
    triggerOfflineMode();
    return new Error('Erro de conexão. Ativando modo offline.');
  }

  triggerOfflineMode();
  return new Error('Erro de conexão. Verifique sua internet ou tente novamente mais tarde.');
}