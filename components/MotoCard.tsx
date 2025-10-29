import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Motorcycle } from '@/types';
import { getStatusColor, getModelIcon } from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface MotoCardProps {
  motorcycle: Motorcycle;
  onPress?: (motorcycle: Motorcycle) => void;
  onEdit?: (motorcycle: Motorcycle) => void;
  onDelete?: (id: string) => void;
  isInWaitingArea?: boolean;
  isSelected?: boolean;
}

// Componente visual para exibir informações resumidas de uma moto
export function MotoCard({
  motorcycle,
  onPress,
  onEdit,
  onDelete,
  isInWaitingArea = false,
  isSelected = false,
}: MotoCardProps) {
  const { colors } = useTheme();

  const statusColor = getStatusColor(motorcycle.status, colors);
  const modelIcon = getModelIcon(motorcycle.modelo);

  // Calcula há quantas horas a moto está no pátio
  const hoursInYard = (Date.now() - motorcycle.timestampEntrada) / (1000 * 60 * 60);
  // Destaca motos que estão há mais de 48h no pátio
  const isOldMotorcycle = hoursInYard > 48;

  const getStyles = (colors: any) => StyleSheet.create({
    cardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
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
      flex: 1,
    },
    editButton: {
      marginLeft: 8,
      padding: 8,
      backgroundColor: colors.primary.main,
      borderRadius: 6,
    },
    waitingAreaCard: {
      borderLeftWidth: 4,
      borderLeftColor: colors.primary.light,
    },
    oldMotorcycleCard: {
      borderLeftWidth: 4,
      borderLeftColor: colors.status.priority,
    },
    selectedCard: {
      borderWidth: 2,
      borderColor: colors.primary.main,
      backgroundColor: colors.primary.lighter,
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
    deleteButton: {
      marginLeft: 8,
      padding: 8,
      backgroundColor: colors.status.quarantine,
      borderRadius: 6,
    },
  });

  const styles = getStyles(colors);

  return (
    <View style={styles.cardContainer}>
      {/* Card principal da moto */}
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
        {/* Cabeçalho: modelo (emoji) e placa */}
        <View style={styles.header}>
          <View style={styles.modelContainer}>
            <Text style={styles.emoji}>{modelIcon}</Text>
            <Text style={styles.placa}>{motorcycle.placa}</Text>
          </View>
          {/* Tag visual para motos reservadas */}
          {motorcycle.reservada && (
            <View style={styles.reservedTag}>
              <Text style={styles.reservedText}>Reservada</Text>
            </View>
          )}
        </View>

        {/* Informações principais: modelo e cor */}
        <View style={styles.infoContainer}>
          <Text style={styles.modelo}>{motorcycle.modelo}</Text>
          <Text style={styles.cor}>{motorcycle.cor}</Text>
        </View>

        {/* Rodapé: status e alerta de tempo no pátio */}
        <View style={styles.footer}>
          <View style={[styles.statusContainer, { backgroundColor: statusColor }]}>
            <Text style={styles.status}>{motorcycle.status}</Text>
          </View>
          {/* Alerta visual para motos antigas no pátio */}
          {isOldMotorcycle && (
            <View style={styles.timeAlertContainer}>
              <Text style={styles.timeAlertText}>
                {Math.floor(hoursInYard)}h no pátio
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      {/* Botões de ação */}
      <View style={{ flexDirection: 'row' }}>
        {onEdit && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(motorcycle)}
          >
            <MaterialIcons name="edit" size={20} color={colors.neutral.white} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(motorcycle.id)}
          >
            <MaterialIcons name="delete" size={20} color={colors.neutral.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
