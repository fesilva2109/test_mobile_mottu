import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MotorcycleStatus } from '@/types/motorcycle';
import Colors from '@/constants/Colors';

interface StatusBadgeProps {
  status: MotorcycleStatus;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  style?: any;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
  showLabel = true,
  style,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return Colors.status.available;
      case 'unavailable':
        return Colors.status.unavailable;
      case 'maintenance':
        return Colors.status.maintenance;
      case 'reserved':
        return Colors.status.reserved;
      case 'transit':
        return Colors.status.transit;
      default:
        return Colors.neutral[400];
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'unavailable':
        return 'Unavailable';
      case 'maintenance':
        return 'Maintenance';
      case 'reserved':
        return 'Reserved';
      case 'transit':
        return 'In Transit';
      default:
        return 'Unknown';
    }
  };

  const getDotSize = () => {
    switch (size) {
      case 'small':
        return 8;
      case 'large':
        return 12;
      default:
        return 10;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 16;
      default:
        return 14;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.dot,
          {
            backgroundColor: getStatusColor(),
            width: getDotSize(),
            height: getDotSize(),
          },
        ]}
      />
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              fontSize: getFontSize(),
            },
          ]}
        >
          {getStatusLabel()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    borderRadius: 50,
    marginRight: 6,
  },
  label: {
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[700],
  },
});

export default StatusBadge;