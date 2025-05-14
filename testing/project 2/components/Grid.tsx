import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  runOnJS,
  withTiming,
  withSpring
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { useMotorcycleStore } from '@/stores/motorcycleStore';
import MotoCard from './MotoCard';
import { GridCell, Motorcycle } from '@/constants/Types';

interface GridProps {
  motorcycles: Motorcycle[];
  waitingMotorcycles: Motorcycle[];
  onMotorcyclePlaced?: (motorcycle: Motorcycle, x: number, y: number) => void;
}

export default function Grid({ 
  motorcycles,
  waitingMotorcycles,
  onMotorcyclePlaced
}: GridProps) {
  const { gridDimensions, gridCells, moveMotorcycleToGrid } = useMotorcycleStore();
  const { rows, cols, cellSize } = gridDimensions;
  
  const scrollViewRef = useRef<ScrollView>(null);
  const gridScrollViewRef = useRef<ScrollView>(null);
  
  // For dragging
  const [activeDrag, setActiveDrag] = useState<Motorcycle | null>(null);
  const draggedPosition = useSharedValue({ x: 0, y: 0 });
  const draggedOffset = useSharedValue({ x: 0, y: 0 });
  const isDragging = useSharedValue(false);
  const opacity = useSharedValue(1);
  
  // Screen dimensions
  const windowWidth = Dimensions.get('window').width;
  
  // Calculate grid container width
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;

  // Start drag
  const startDrag = (motorcycle: Motorcycle) => {
    setActiveDrag(motorcycle);
    opacity.value = 0.8;
    isDragging.value = true;
  };

  // End drag and place motorcycle on grid
  const endDrag = () => {
    if (!activeDrag) return;
    
    const finalX = Math.round(draggedPosition.value.x / cellSize);
    const finalY = Math.round(draggedPosition.value.y / cellSize);
    
    // Check if position is valid
    if (
      finalX >= 0 && 
      finalX < cols && 
      finalY >= 0 && 
      finalY < rows
    ) {
      // Attempt to place on grid
      const success = moveMotorcycleToGrid(activeDrag.id, finalX, finalY);
      
      if (success && onMotorcyclePlaced) {
        onMotorcyclePlaced(activeDrag, finalX, finalY);
      }
    }
    
    // Reset drag state
    draggedPosition.value = { x: 0, y: 0 };
    draggedOffset.value = { x: 0, y: 0 };
    opacity.value = 1;
    isDragging.value = false;
    setActiveDrag(null);
  };

  // Gesture for dragging
  const dragGesture = Gesture.Pan()
    .onStart((e) => {
      draggedOffset.value = { x: e.x, y: e.y };
    })
    .onUpdate((e) => {
      const gridScrollView = gridScrollViewRef.current;
      
      // Auto-scroll if near edges
      if (gridScrollView) {
        const scrollOffset = gridScrollView.getScrollableNode().scrollLeft || 0;
        
        // Scroll right if near right edge
        if (e.absoluteX > windowWidth - 60) {
          gridScrollView.scrollTo({ x: scrollOffset + 10, animated: false });
        }
        // Scroll left if near left edge
        else if (e.absoluteX < 60 && scrollOffset > 0) {
          gridScrollView.scrollTo({ x: scrollOffset - 10, animated: false });
        }
      }
      
      // Update position
      draggedPosition.value = {
        x: e.translationX + draggedOffset.value.x,
        y: e.translationY + draggedOffset.value.y
      };
    })
    .onEnd(() => {
      runOnJS(endDrag)();
    });

  // Animated style for dragged card
  const animatedStyle = useAnimatedStyle(() => {
    if (isDragging.value) {
      return {
        position: 'absolute',
        zIndex: 1000,
        opacity: opacity.value,
        transform: [
          { translateX: draggedPosition.value.x - 75 }, // Center the card
          { translateY: draggedPosition.value.y - 50 }, // Center the card
          { scale: withSpring(1.05) }
        ],
      };
    }
    return {
      opacity: 0,
      transform: [
        { translateX: -1000 },
        { translateY: -1000 }
      ],
    };
  });

  // Check if a cell is highlighted for dragging
  const isCellHighlighted = (x: number, y: number) => {
    if (!isDragging.value) return false;
    
    const cellX = Math.round(draggedPosition.value.x / cellSize);
    const cellY = Math.round(draggedPosition.value.y / cellSize);
    
    return x === cellX && y === cellY;
  };

  // Cell style based on its state
  const getCellStyle = (cell: GridCell) => {
    const highlighted = isCellHighlighted(cell.x, cell.y);
    const isOccupied = cell.isOccupied;
    
    if (highlighted && !isOccupied) {
      return [styles.cell, styles.cellHighlighted];
    } else if (isOccupied) {
      return [styles.cell, styles.cellOccupied];
    }
    return styles.cell;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.waitingTitle}>Motos aguardando posicionamento</Text>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.waitingArea}
      >
        {waitingMotorcycles.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma moto aguardando</Text>
        ) : (
          waitingMotorcycles.map((motorcycle) => (
            <GestureDetector 
              key={motorcycle.id} 
              gesture={dragGesture}
            >
              <Pressable onLongPress={() => startDrag(motorcycle)}>
                <MotoCard 
                  motorcycle={motorcycle} 
                  isDraggable 
                  inWaitingArea 
                />
              </Pressable>
            </GestureDetector>
          ))
        )}
      </ScrollView>

      <Text style={styles.gridTitle}>Mapa do Pátio</Text>
      
      <View style={styles.gridContainer}>
        <ScrollView
          ref={gridScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ 
            width: gridWidth, 
            height: gridHeight,
          }}
        >
          {/* Grid background */}
          <View style={[styles.grid, { width: gridWidth, height: gridHeight }]}>
            {gridCells.map((row, y) => (
              <View key={`row-${y}`} style={styles.row}>
                {row.map((cell) => (
                  <Animated.View 
                    key={`cell-${cell.x}-${cell.y}`}
                    style={[
                      getCellStyle(cell),
                      {
                        width: cellSize - 2,
                        height: cellSize - 2,
                      }
                    ]}
                  />
                ))}
              </View>
            ))}
            
            {/* Placed motorcycles */}
            {motorcycles
              .filter(m => m.position)
              .map((motorcycle) => (
                <View
                  key={motorcycle.id}
                  style={[
                    styles.placedMotoContainer,
                    {
                      left: motorcycle.position!.x * cellSize + 2,
                      top: motorcycle.position!.y * cellSize + 2,
                      width: cellSize - 4,
                      height: cellSize - 4,
                    }
                  ]}
                >
                  <MotoCard motorcycle={motorcycle} />
                </View>
              ))}
          </View>
        </ScrollView>
        
        {/* Dragged motorcycle */}
        {activeDrag && (
          <GestureDetector gesture={dragGesture}>
            <Animated.View style={animatedStyle}>
              <MotoCard motorcycle={activeDrag} isDraggable />
            </Animated.View>
          </GestureDetector>
        )}
      </View>
      
      {activeDrag && (
        <View style={styles.dragInstructions}>
          <Text style={styles.dragText}>
            Arraste para posicionar no mapa
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  waitingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.dark,
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  waitingArea: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.neutral.light,
    flexDirection: 'row',
    minHeight: 140,
  },
  emptyText: {
    color: Colors.neutral.gray,
    fontStyle: 'italic',
    alignSelf: 'center',
    marginLeft: 16,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral.dark,
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  gridContainer: {
    flex: 1,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.neutral.light,
    borderRadius: 8,
    overflow: 'hidden',
  },
  grid: {
    backgroundColor: Colors.neutral.white,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 1,
    borderColor: Colors.neutral.light,
    backgroundColor: 'rgba(244, 244, 244, 0.3)',
    margin: 1,
  },
  cellHighlighted: {
    backgroundColor: 'rgba(5, 175, 49, 0.2)',
    borderColor: Colors.primary.default,
    borderWidth: 2,
  },
  cellOccupied: {
    backgroundColor: 'rgba(244, 244, 244, 0.5)',
  },
  placedMotoContainer: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragInstructions: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(5, 175, 49, 0.9)',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 40,
    alignItems: 'center',
  },
  dragText: {
    color: Colors.neutral.white,
    fontWeight: '500',
  },
});