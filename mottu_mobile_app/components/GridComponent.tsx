import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { MotoCard } from './MotoCard';
import { GridPosition, Motorcycle } from '@/types';
import { colors } from '@/theme/colors';

interface GridComponentProps {
  gridPositions: GridPosition[];
  onPlaceMoto: (moto: Motorcycle, position: { x: number, y: number }) => void;
  onRemoveFromGrid: (motoId: string) => void;
}

export function GridComponent({ gridPositions, onPlaceMoto, onRemoveFromGrid }: GridComponentProps) {
  const [selectedMoto, setSelectedMoto] = useState<Motorcycle | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ x: number, y: number } | null>(null);
  
  // Calculate grid dimensions
  const gridSize = gridPositions.length > 0 ? Math.ceil(Math.sqrt(gridPositions.length)) : 0;
  
  // Get all occupied positions
  const occupiedPositions = gridPositions.filter(pos => pos.occupied);
  
  // Handle cell press
  const handleCellPress = (x: number, y: number) => {
    const position = gridPositions.find(pos => pos.x === x && pos.y === y);
    
    if (position) {
      if (position.occupied && position.motorcycle) {
        // Cell is occupied, select the motorcycle for potential movement
        setSelectedMoto(position.motorcycle);
        setSelectedCell({ x, y });
      } else if (selectedMoto) {
        // Empty cell with a motorcycle selected, move the motorcycle here
        onPlaceMoto(selectedMoto, { x, y });
        setSelectedMoto(null);
        setSelectedCell(null);
      }
    }
  };
  
  // Handle moving motorcycle out of grid
  const handleRemoveFromGrid = () => {
    if (selectedMoto) {
      onRemoveFromGrid(selectedMoto.id);
      setSelectedMoto(null);
      setSelectedCell(null);
    }
  };
  
  // Render grid cells
  const renderGridCells = () => {
    const cells = [];
    
    for (let y = 0; y < gridSize; y++) {
      const row = [];
      
      for (let x = 0; x < gridSize; x++) {
        // Find the grid position data
        const position = gridPositions.find(pos => pos.x === x && pos.y === y);
        const isSelected = selectedCell?.x === x && selectedCell?.y === y;
        
        row.push(
          <TouchableOpacity
            key={`cell-${x}-${y}`}
            style={[
              styles.gridCell,
              position?.occupied && styles.occupiedCell,
              isSelected && styles.selectedCell,
            ]}
            onPress={() => handleCellPress(x, y)}
          >
            {position?.occupied && position.motorcycle && (
              <View style={styles.cellContent}>
                <Text style={styles.cellPlaca}>{position.motorcycle.placa}</Text>
                <View 
                  style={[
                    styles.statusIndicator, 
                    { backgroundColor: getStatusColor(position.motorcycle.status) }
                  ]} 
                />
              </View>
            )}
          </TouchableOpacity>
        );
      }
      
      cells.push(
        <View key={`row-${y}`} style={styles.gridRow}>
          {row}
        </View>
      );
    }
    
    return cells;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {renderGridCells()}
      </View>
      
      {selectedMoto && (
        <View style={styles.actionContainer}>
          <Text style={styles.selectedText}>
            Moto selecionada: {selectedMoto.placa}
          </Text>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemoveFromGrid}
          >
            <Text style={styles.removeButtonText}>Remover do Grid</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Legenda:</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: colors.status.ready }]} />
          <Text style={styles.legendText}>Pronta para aluguel</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: colors.status.maintenance }]} />
          <Text style={styles.legendText}>Em manutenção</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: colors.status.quarantine }]} />
          <Text style={styles.legendText}>Em quarentena</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: colors.status.priority }]} />
          <Text style={styles.legendText}>Alta prioridade</Text>
        </View>
      </View>
    </View>
  );
}

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Pronta para aluguel':
      return colors.status.ready;
    case 'Em manutenção':
      return colors.status.maintenance;
    case 'Em quarentena':
      return colors.status.quarantine;
    case 'Alta prioridade':
      return colors.status.priority;
    case 'Reservada':
      return colors.status.reserved;
    case 'Aguardando vistoria':
      return colors.status.waiting;
    default:
      return colors.status.waiting;
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  gridContainer: {
    borderWidth: 1,
    borderColor: colors.neutral.gray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 80,
    height: 80,
    borderWidth: 0.5,
    borderColor: colors.neutral.gray,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
  },
  occupiedCell: {
    backgroundColor: colors.neutral.lightGray,
  },
  selectedCell: {
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  cellContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellPlaca: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  actionContainer: {
    marginVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: colors.status.quarantine,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  removeButtonText: {
    color: colors.neutral.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  legendContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.neutral.white,
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
});