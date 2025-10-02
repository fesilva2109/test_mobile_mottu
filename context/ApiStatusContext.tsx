import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

type ApiStatus = 'online' | 'offline';

export interface ApiStatusContextType {
  status: ApiStatus;
  isOffline: boolean;
  setApiOffline: () => void;
  setApiOnline: () => void;
}

const ApiStatusContext = createContext<ApiStatusContextType | null>(null);

/**
 * Provedor que gerencia o estado da conexão com a API (online/offline).
 */
export const ApiStatusProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<ApiStatus>('online');

  const setApiOffline = useCallback(() => {
    console.log('API OFFLINE - Mudando para modo local.');
    setStatus('offline');
  }, []);

  const setApiOnline = useCallback(() => {
    console.log('API ONLINE - Voltando para modo online.');
    setStatus('online');
  }, []);

  const isOffline = status === 'offline';

  return (
    <ApiStatusContext.Provider value={{ status, isOffline, setApiOffline, setApiOnline }}>
      {children}
    </ApiStatusContext.Provider>
  );
};

/**
 * Hook para acessar o estado da API e controlar o modo online/offline.
 */
export const useApiStatus = () => {
  const context = useContext(ApiStatusContext);
  if (!context) {
    throw new Error('useApiStatus deve ser usado dentro de um ApiStatusProvider');
  }
  return context;
};