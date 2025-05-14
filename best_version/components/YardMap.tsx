import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { Info } from 'lucide-react-native';
import MotorcycleInfoModal from './MotorcycleInfoModal';
import WaitingArea from './WaitingArea';

const GRID_SIZE = 10;
const CELL_SIZE = Math.floor((Dimensions.get('window').width - 40) / GRID_SIZE);

type YardMapProps = {
  motorcycles: any[];
};

export default function YardMap({ motorcycles }: YardMapProps) {
  const [selectedMotorcycle, setSelectedMotorcycle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleMotorcyclePress = (motorcycle) => {
    setSelectedMotorcycle(motorcycle);
    setModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponível':
        return Colors.success;
      case 'manutenção':
        return Colors.warning;
      case 'reservada':
        return Colors.error;
      default:
        return Colors.gray;
    }
  };

  const availableMotorcycles = motorcycles.filter(m => m.status === 'disponível');
  const waitingMotorcycles = motorcycles.filter(m => m.status !== 'disponível');

  // Criar um array 2D para representar o pátio
  const grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));

  // Preencher o grid com as motos disponíveis
  availableMotorcycles.forEach(motorcycle => {
    const { x, y } = motorcycle.position;
    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      if (!grid[y][x]) {
        grid[y][x] = [];
      }
      grid[y][x].push(motorcycle);
    }
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mapa do Pátio</Text>

      <View style={styles.gridContainer}>
        {grid.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View
                key={`cell-${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  {
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  }
                ]}
              >
                {cell && cell.map((motorcycle, index) => (
                  <TouchableOpacity
                    key={motorcycle.id}
                    style={[
                      styles.motorcycleMarker,
                      { backgroundColor: getStatusColor(motorcycle.status) },
                      index > 0 && {
                        top: 5 + (index * 5),
                        left: 5 + (index * 5)
                      }
                    ]}
                    onPress={() => handleMotorcyclePress(motorcycle)}
                  >
                    <Text style={styles.motorcycleText}>{motorcycle.placa.substring(0, 3)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Grid labels */}
      <View style={styles.rowLabelsContainer}>
        {Array(GRID_SIZE).fill(0).map((_, index) => (
          <Text key={`row-label-${index}`} style={styles.gridLabel}>
            {String.fromCharCode(65 + index)}
          </Text>
        ))}
      </View>
      <View style={styles.colLabelsContainer}>
        {Array(GRID_SIZE).fill(0).map((_, index) => (
          <Text key={`col-label-${index}`} style={styles.gridLabel}>
            {index + 1}
          </Text>
        ))}
      </View>

      <WaitingArea motorcycles={waitingMotorcycles} onPress={handleMotorcyclePress} />

      <MotorcycleInfoModal
        motorcycle={selectedMotorcycle}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.text,
  },
  gridContainer: {
    padding: 20,
    marginLeft: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  motorcycleMarker: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  motorcycleText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 11,
  },
  rowLabelsContainer: {
    position: 'absolute',
    top: 20 + CELL_SIZE / 2,
    left: 5,
    height: CELL_SIZE * GRID_SIZE,
    justifyContent: 'space-around',
  },
  colLabelsContainer: {
    position: 'absolute',
    top: 5,
    left: 20 + CELL_SIZE / 2,
    width: CELL_SIZE * GRID_SIZE,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gridLabel: {
    fontSize: 12,
    color: Colors.darkGray,
    textAlign: 'center',
  },
});
