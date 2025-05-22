import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

interface HistoryEvent {
  id: string;
  action: string;
  timestamp: number;
  details?: string;
}

const HISTORY_STORAGE_KEY = 'mottu_app_history';

const useHistoryStorage = () => {
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Erro ao carregar o histórico:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const addHistoryEvent = async (action: string, details?: string) => {
  console.log('Tentando adicionar ao histórico:', action, details);
  const newEvent: HistoryEvent = {
    id: new Date().getTime().toString(),
    action,
    timestamp: Date.now(),
    details,
  };

  const updatedHistory = [...history, newEvent].sort((a, b) => b.timestamp - a.timestamp);
  setHistory(updatedHistory);
  console.log('Histórico atualizado no estado:', updatedHistory);

  try {
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    console.log('Evento salvo no AsyncStorage com sucesso');
  } catch (error) {
    console.error('Erro ao salvar o evento no histórico:', error);
  }
};

  const clearHistory = async () => {
    setHistory([]);
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar o histórico:', error);
    }
  };

  return { history, loadingHistory, addHistoryEvent, clearHistory };
};

export default useHistoryStorage;