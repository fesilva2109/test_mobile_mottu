import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Motorcycle } from '@/constants/Types';
import { Colors } from '@/constants/Colors';
import { TriangleAlert as AlertTriangle, Calendar, Clock } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withTiming, withSequence, withDelay } from 'react-native-reanimated';

interface MotoCardProps {
  motorcycle: Motorcycle;
  onPress?: () => void;
  isDraggable?: boolean;
  inWaitingArea?: boolean;
}

export default function MotoCard({ motorcycle, onPress, isDraggable = false, inWaitingArea = false }: MotoCardProps) {
  // Get status color based on motorcycle status
  const getStatusColor = () => {
    switch (motorcycle.status) {
      case 'Pronta para aluguel':
        return Colors.status.ready;
      case 'Em manutenção':
      case 'Em reparo emergencial':
        return Colors.status.maintenance;
      case 'Em quarentena':
        return Colors.status.quarantine;
      case 'Aguardando vistoria':
        return Colors.status.waiting;
      default:
        return Colors.neutral.gray;
    }
  };

  // Get model icon/emoji based on motorcycle model
  const getModelEmoji = () => {
    switch (motorcycle.modelo) {
      case 'Mottu Pop':
        return '🛵';
      case 'Mottu Sport':
        return '🏍️';
      case 'Mottu-E':
        return '⚡';
      default:
        return '🛵';
    }
  };

  // Determine if motorcycle has been in yard for too long
  const hasExcessiveTime = motorcycle.timeInYard && motorcycle.timeInYard > 7;

  // Animation for attention-grabbing effect for high priority items
  const animatedStyle = useAnimatedStyle(() => {
    if (hasExcessiveTime || motorcycle.reservationTime) {
      return {
        transform: [
          { scale: withSequence(
            withDelay(Math.random() * 2000, withTiming(1.05, { duration: 300 })),
            withTiming(1, { duration: 300 })
          ) }
        ],
      };
    }
    return {};
  });

  const isQuarantine = motorcycle.status === 'Em quarentena';

  return (
    <Animated.View style={[
      styles.container,
      { borderColor: getStatusColor() },
      isDraggable && styles.draggable,
      inWaitingArea && styles.waitingCard,
      isQuarantine && styles.quarantineCard,
      animatedStyle
    ]}>
      <Pressable onPress={onPress} style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.placa}>{motorcycle.placa}</Text>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.model}>
            {getModelEmoji()} {motorcycle.modelo}
          </Text>
          <Text style={styles.color}>{motorcycle.cor}</Text>
        </View>

        <View style={styles.statusRow}>
          <Text 
            style={[
              styles.status, 
              { color: getStatusColor() }
            ]}
            numberOfLines={1}
          >
            {motorcycle.status}
          </Text>
        </View>

        {motorcycle.timeInYard !== undefined && (
          <View style={styles.infoRow}>
            <Clock size={12} color={Colors.neutral.gray} />
            <Text style={[
              styles.timeInfo,
              hasExcessiveTime && styles.excessiveTime
            ]}>
              {motorcycle.timeInYard} {motorcycle.timeInYard === 1 ? 'dia' : 'dias'} no pátio
            </Text>
          </View>
        )}

        {motorcycle.reservationTime && (
          <View style={styles.reservationContainer}>
            <View style={styles.infoRow}>
              <Calendar size={12} color={Colors.status.priority} />
              <Text style={styles.reservationText}>
                Reservado
              </Text>
            </View>
            <AlertTriangle size={16} color={Colors.status.priority} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    overflow: 'hidden',
    width: 160,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  draggable: {
    shadowColor: Colors.primary.default,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  waitingCard: {
    marginRight: 10,
  },
  quarantineCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  content: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  placa: {
    fontWeight: '700',
    fontSize: 14,
    color: Colors.neutral.dark,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  model: {
    fontSize: 12,
    color: Colors.neutral.dark,
    fontWeight: '500',
  },
  color: {
    fontSize: 12,
    color: Colors.neutral.gray,
  },
  statusRow: {
    marginBottom: 5,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeInfo: {
    fontSize: 11,
    color: Colors.neutral.gray,
  },
  excessiveTime: {
    color: Colors.status.maintenance,
    fontWeight: '500',
  },
  reservationContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 4,
    borderRadius: 4,
  },
  reservationText: {
    fontSize: 11,
    color: Colors.status.priority,
    fontWeight: '500',
  },
});