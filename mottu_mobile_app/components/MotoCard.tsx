import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Motorcycle } from '@/types';
import { getStatusColor, getModelIcon, colors } from '@/theme/colors';

interface MotoCardProps {
  motorcycle: Motorcycle;
  onPress?: (motorcycle: Motorcycle) => void;
  isInWaitingArea?: boolean;
  isSelected?: boolean;
}

export function MotoCard({ motorcycle, onPress, isInWaitingArea = false, isSelected = false }: MotoCardProps) {
  const statusColor = getStatusColor(motorcycle.status);
  const modelIcon = getModelIcon(motorcycle.modelo);
  
  
  const hoursInYard = (Date.now() - motorcycle.timestampEntrada) / (1000 * 60 * 60);
  const isOldMotorcycle = hoursInYard > 48; 
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isInWaitingArea && styles.waitingAreaCard,
        isOldMotorcycle && styles.oldMotorcycleCard,
        isSelected && styles.selectedCard,
      ]}
      onPress={() => onPress?.(motorcycle)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.modelContainer}>
          <Text style={styles.emoji}>{modelIcon}</Text>
          <Text style={styles.placa}>{motorcycle.placa}</Text>
        </View>
        
        {motorcycle.reservada && (
          <View style={styles.reservedTag}>
            <Text style={styles.reservedText}>Reservada</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.modelo}>{motorcycle.modelo}</Text>
        <Text style={styles.cor}>{motorcycle.cor}</Text>
      </View>
      
      <View style={styles.footer}>
        <View style={[styles.statusContainer, { backgroundColor: statusColor }]}>
          <Text style={styles.status}>{motorcycle.status}</Text>
        </View>
        
        {isOldMotorcycle && (
          <View style={styles.timeAlertContainer}>
            <Text style={styles.timeAlertText}>
              {Math.floor(hoursInYard)}h no pátio
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  waitingAreaCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.light,
  },
  oldMotorcycleCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.status.priority,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
    marginRight: 6,
  },
  placa: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.neutral.black,
  },
  reservedTag: {
    backgroundColor: colors.status.reserved,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reservedText: {
    color: colors.neutral.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginBottom: 12,
  },
  modelo: {
    fontSize: 14,
    color: colors.neutral.darkGray,
  },
  cor: {
    fontSize: 14,
    color: colors.neutral.gray,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  status: {
    color: colors.neutral.white,
    fontSize: 12,
    fontWeight: '500',
  },
  timeAlertContainer: {
    backgroundColor: colors.status.priority,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timeAlertText: {
    color: colors.neutral.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.lighter,
  },
});