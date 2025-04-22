import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Bike as MotorcycleIcon, MapPin, Calendar, AlertTriangle } from 'lucide-react-native';
import { Motorcycle } from '@/types/motorcycle';
import StatusBadge from '@/components/ui/StatusBadge';
import Card from '@/components/ui/Card';
import Colors from '@/constants/Colors';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onPress?: (motorcycle: Motorcycle) => void;
  compact?: boolean;
}

const MotorcycleCard: React.FC<MotorcycleCardProps> = ({
  motorcycle,
  onPress,
  compact = false,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(motorcycle);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Using a placeholder image for demo purposes
  const getImageUrl = () => {
    switch (motorcycle.model) {
      case 'Mottu Pop':
        return 'https://images.pexels.com/photos/5396279/pexels-photo-5396279.jpeg?auto=compress&cs=tinysrgb&w=600';
      case 'Mottu Sport':
        return 'https://images.pexels.com/photos/2393816/pexels-photo-2393816.jpeg?auto=compress&cs=tinysrgb&w=600';
      case 'Mottu-E':
        return 'https://images.pexels.com/photos/2611690/pexels-photo-2611690.jpeg?auto=compress&cs=tinysrgb&w=600';
      case 'Outro':
        return 'https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg?auto=compress&cs=tinysrgb&w=600';
      default:
        return 'https://images.pexels.com/photos/2119706/pexels-photo-2119706.jpeg?auto=compress&cs=tinysrgb&w=600';
    }
  };

  if (compact) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Card style={styles.compactCard}>
          <View style={styles.compactHeader}>
            <Text style={styles.licensePlate}>{motorcycle.licensePlate}</Text>
            <StatusBadge status={motorcycle.status} size="small" />
          </View>
          <View style={styles.compactDetails}>
            <View style={styles.compactInfo}>
            <MotorcycleIcon size={14} color={Colors.neutral[500]} />
            <Text style={styles.compactInfoText}>{motorcycle.model}</Text>
            </View>
            {motorcycle.location?.section && (
              <View style={styles.compactInfo}>
                <MapPin size={14} color={Colors.neutral[500]} />
                <Text style={styles.compactInfoText}>{motorcycle.location.section}</Text>
              </View>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Card>
        <View style={styles.header}>
          <View style={styles.licensePlateContainer}>
            <Text style={styles.licensePlate}>{motorcycle.licensePlate}</Text>
            <StatusBadge status={motorcycle.status} />
          </View>
          {motorcycle.critical && (
            <View style={styles.criticalBadge}>
              <AlertTriangle size={14} color={Colors.light.background} />
              <Text style={styles.criticalText}>Critical</Text>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: motorcycle.imageUrl || getImageUrl() }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.details}>
            <View style={styles.detailRow}>
            <MotorcycleIcon size={16} color={Colors.neutral[600]} />
            <Text style={styles.detailText}>{motorcycle.model}</Text>
            </View>
            
            {motorcycle.location?.section && (
              <View style={styles.detailRow}>
                <MapPin size={16} color={Colors.neutral[600]} />
                <Text style={styles.detailText}>{motorcycle.location.section}</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Calendar size={16} color={Colors.neutral[600]} />
              <Text style={styles.detailText}>
                Updated: {formatDate(motorcycle.lastUpdated)}
              </Text>
            </View>
          </View>
        </View>
        
        {motorcycle.observations && (
          <View style={styles.observations}>
            <Text style={styles.observationsText}>{motorcycle.observations}</Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  licensePlateContainer: {
    flexDirection: 'column',
  },
  licensePlate: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.primary[700],
    marginBottom: 4,
  },
  criticalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.utility.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  criticalText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.light.background,
    marginLeft: 4,
  },
  content: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  imageContainer: {
    width: 120,
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[700],
    marginLeft: 8,
  },
  observations: {
    backgroundColor: Colors.neutral[100],
    padding: 12,
    borderRadius: 8,
  },
  observationsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[700],
    lineHeight: 20,
  },
  // Compact styles
  compactCard: {
    padding: 12,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactInfoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.neutral[600],
    marginLeft: 4,
  },
});

export default MotorcycleCard;