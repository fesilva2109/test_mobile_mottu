import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '@/theme/colors';
import useHistoryStorage from '@/hooks/useHistoryStorage';

interface HistoryEvent {
  id: string;
  action: string;
  timestamp: number;
  details?: string;
}

interface HistoryListProps {
  onClearHistory?: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ onClearHistory }) => {
  const { history, loadingHistory } = useHistoryStorage();

  const renderHistoryItem = ({ item }: { item: HistoryEvent }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyAction}>{item.action}</Text>
      {item.details && <Text style={styles.historyDetails}>({item.details})</Text>}
      <Text style={styles.historyTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Histórico de Ações</Text>
        <Text style={styles.subTitle}>
          Aqui você pode ver todas as ações realizadas no aplicativo.
        </Text>
      </View>
      {loadingHistory ? (
        <ActivityIndicator color={colors.primary.main} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma ação registrada ainda.</Text>}
        />
      )}
      {history.length > 0 && onClearHistory && (
        <TouchableOpacity style={styles.clearButton} onPress={onClearHistory}>
          <Text style={styles.clearButtonText}>Limpar Histórico</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: colors.neutral.lightGray,
  },
  header: {
    padding: 16,
    backgroundColor: colors.primary.main,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  subTitle: {
    marginTop: 8,
    fontSize: 16,
    color: colors.neutral.white,
    opacity: 0.9,
  },
  historyItem: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
  },
  historyAction: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.neutral.black,
    marginBottom: 4,
  },
  historyDetails: {
    fontSize: 14,
    color: colors.neutral.gray,
  },
  historyTimestamp: {
    fontSize: 12,
    color: colors.neutral.gray,
    marginTop: 8,
  },
  clearButton: {
    backgroundColor: colors.status.quarantine,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  clearButtonText: {
    color: colors.neutral.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.neutral.gray,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HistoryList;