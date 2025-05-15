import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMotorcycleStorage, useGridStorage } from '@/hooks/useStorage';
import { GridComponent } from '@/components/GridComponent';
import { MotoList } from '@/components/MotoList';
import { FilterMenu } from '@/components/FilterMenu';
import { colors } from '@/theme/colors';

export default function MapaScreen() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  
  const { motorcycles, loading: loadingMotos, updateMotorcycle } = useMotorcycleStorage();
  const { 
    gridPositions, 
    loading: loadingGrid, 
    placeMotorcycle, 
    removeMotorcycleFromGrid 
  } = useGridStorage();
  
  const [waitingMotos, setWaitingMotos] = useState<any[]>([]);
  const [placedMotos, setPlacedMotos] = useState<any[]>([]);
  
  // Filter motorcycles by status and model
  useEffect(() => {
    // Get motorcycles that are placed on the grid
    const onGrid = motorcycles.filter(moto => moto.posicao);
    
    // Get motorcycles that are not on the grid (waiting)
    const waiting = motorcycles.filter(moto => !moto.posicao);
    
    // Apply filters if selected
    let filteredWaiting = waiting;
    let filteredOnGrid = onGrid;
    
    if (selectedStatus) {
      filteredWaiting = filteredWaiting.filter(moto => moto.status === selectedStatus);
      filteredOnGrid = filteredOnGrid.filter(moto => moto.status === selectedStatus);
    }
    
    if (selectedModel) {
      filteredWaiting = filteredWaiting.filter(moto => moto.modelo === selectedModel);
      filteredOnGrid = filteredOnGrid.filter(moto => moto.modelo === selectedModel);
    }
    
    setWaitingMotos(filteredWaiting);
    setPlacedMotos(filteredOnGrid);
  }, [motorcycles, selectedStatus, selectedModel, gridPositions]);
  
  // Handle motorcycle placement
  const handlePlaceMoto = async (moto: any, position: any) => {
    try {
      await placeMotorcycle(moto, position.x, position.y);
      
      // Update the motorcycle with the new position
      await updateMotorcycle({
        ...moto,
        posicao: { x: position.x, y: position.y }
      });
    } catch (error) {
      console.error('Failed to place motorcycle:', error);
    }
  };
  
  // Handle motorcycle removal from grid
  const handleRemoveFromGrid = async (motoId: string) => {
    try {
      // Find the motorcycle
      const moto = motorcycles.find(m => m.id === motoId);
      if (!moto) return;
      
      // Remove from grid
      await removeMotorcycleFromGrid(motoId);
      
      // Update the motorcycle to remove position
      await updateMotorcycle({
        ...moto,
        posicao: undefined
      });
    } catch (error) {
      console.error('Failed to remove motorcycle from grid:', error);
    }
  };
  
  if (loadingMotos || loadingGrid) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa do Pátio</Text>
        <FilterMenu 
          selectedStatus={selectedStatus}
          selectedModel={selectedModel}
          onStatusChange={setSelectedStatus}
          onModelChange={setSelectedModel}
        />
      </View>
      
      <Text style={styles.sectionTitle}>Grid do Pátio</Text>
      <ScrollView horizontal style={styles.gridContainer}>
        <GridComponent 
          gridPositions={gridPositions}
          onPlaceMoto={handlePlaceMoto}
          onRemoveFromGrid={handleRemoveFromGrid}
        />
      </ScrollView>
      
      <View style={styles.waitingSection}>
        <View style={styles.waitingHeader}>
          <Text style={styles.waitingTitle}>
            Motos em Espera ({waitingMotos.length})
          </Text>
          <TouchableOpacity onPress={() => {
            setSelectedStatus(null);
            setSelectedModel(null);
          }}>
            <Text style={styles.clearFilters}>Limpar Filtros</Text>
          </TouchableOpacity>
        </View>
        <MotoList 
          motorcycles={waitingMotos}
          onSelect={(moto) => console.log('Selected:', moto)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.neutral.gray,
  },
  header: {
    backgroundColor: colors.primary.main,
    padding: 16,
  },
  title: {
    color: colors.neutral.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    marginHorizontal: 16,
  },
  gridContainer: {
    maxHeight: 300,
  },
  waitingSection: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 12,
    padding: 16,
  },
  waitingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  waitingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearFilters: {
    color: colors.primary.main,
    fontWeight: '500',
  }
});