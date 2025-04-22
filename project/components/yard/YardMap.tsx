import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polygon, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { YardSection, Motorcycle } from '@/types/motorcycle';
import Colors from '@/constants/Colors';
import StatusBadge from '@/components/ui/StatusBadge';

interface YardMapProps {
  sections: YardSection[];
  motorcycles: Motorcycle[];
  initialRegion?: Region;
  onMarkerPress?: (motorcycle: Motorcycle) => void;
  selectedSectionId?: string | null;
}

const { width } = Dimensions.get('window');

const YardMap: React.FC<YardMapProps> = ({
  sections,
  motorcycles,
  initialRegion,
  onMarkerPress,
  selectedSectionId,
}) => {
  const mapRef = useRef<MapView>(null);
  const [focusedMarker, setFocusedMarker] = useState<string | null>(null);

  const getMarkerColor = (status: string) => {
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

  const getDefaultRegion = () => {
    if (selectedSectionId) {
      const selectedSection = sections.find(section => section.id === selectedSectionId);
      if (selectedSection) {
        return selectedSection.coordinates;
      }
    }
    
    // If no section is selected or no initialRegion is provided,
    // calculate the center of all sections
    if (!initialRegion && sections.length > 0) {
      const latitudes = sections.map(section => section.coordinates.latitude);
      const longitudes = sections.map(section => section.coordinates.longitude);
      
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);
      
      return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max(0.01, (maxLat - minLat) * 1.5),
        longitudeDelta: Math.max(0.01, (maxLng - minLng) * 1.5),
      };
    }
    
    return initialRegion || {
      latitude: -23.550520,
      longitude: -46.633308,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  };

  const handleMarkerPress = (motorcycle: Motorcycle) => {
    setFocusedMarker(motorcycle.id);
    if (onMarkerPress) {
      onMarkerPress(motorcycle);
    }
  };

  // Create a polygon for each section
  const createSectionPolygon = (section: YardSection) => {
    // This is a simplified example - in a real app you would have actual polygon coordinates
    // Here we're just creating a rectangle around the section center point
    const { latitude, longitude, latitudeDelta, longitudeDelta } = section.coordinates;
    
    const halfLatDelta = latitudeDelta / 2;
    const halfLngDelta = longitudeDelta / 2;
    
    return [
      { latitude: latitude - halfLatDelta, longitude: longitude - halfLngDelta },
      { latitude: latitude - halfLatDelta, longitude: longitude + halfLngDelta },
      { latitude: latitude + halfLatDelta, longitude: longitude + halfLngDelta },
      { latitude: latitude + halfLatDelta, longitude: longitude - halfLngDelta },
    ];
  };

  const filteredMotorcycles = selectedSectionId 
    ? motorcycles.filter(m => m.location.section === selectedSectionId) 
    : motorcycles;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={getDefaultRegion()}
        showsUserLocation
        showsMyLocationButton
        showsCompass
      >
        {sections.map(section => (
          <React.Fragment key={section.id}>
            <Polygon
              coordinates={createSectionPolygon(section)}
              fillColor={selectedSectionId === section.id ? 'rgba(17, 86, 252, 0.2)' : 'rgba(200, 200, 200, 0.2)'}
              strokeColor={Colors.primary[500]}
              strokeWidth={selectedSectionId === section.id ? 2 : 1}
            />
            <Marker
              coordinate={{
                latitude: section.coordinates.latitude,
                longitude: section.coordinates.longitude,
              }}
              opacity={0.8}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.sectionMarker}>
                <Text style={styles.sectionName}>{section.name}</Text>
              </View>
            </Marker>
          </React.Fragment>
        ))}
        
        {filteredMotorcycles.map(motorcycle => (
          <Marker
            key={motorcycle.id}
            coordinate={{
              latitude: motorcycle.location.latitude,
              longitude: motorcycle.location.longitude,
            }}
            onPress={() => handleMarkerPress(motorcycle)}
          >
            <View style={[
              styles.motorcycleMarker,
              {
                backgroundColor: getMarkerColor(motorcycle.status),
                borderWidth: focusedMarker === motorcycle.id ? 3 : 0,
              }
            ]}>
              <Text style={styles.markerText}>{motorcycle.licensePlate.substring(0, 3)}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
      
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Status</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <StatusBadge status="available" showLabel />
          </View>
          <View style={styles.legendItem}>
            <StatusBadge status="maintenance" showLabel />
          </View>
          <View style={styles.legendItem}>
            <StatusBadge status="reserved" showLabel />
          </View>
          <View style={styles.legendItem}>
            <StatusBadge status="unavailable" showLabel />
          </View>
          <View style={styles.legendItem}>
            <StatusBadge status="transit" showLabel />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  motorcycleMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.light.background,
  },
  markerText: {
    color: Colors.light.background,
    fontFamily: 'Inter-Bold',
    fontSize: 10,
  },
  sectionMarker: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primary[500],
  },
  sectionName: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: Colors.primary[700],
  },
  legend: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 12,
    elevation: 4,
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: Colors.neutral[800],
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    marginRight: 16,
    marginBottom: 4,
  },
});

export default YardMap;