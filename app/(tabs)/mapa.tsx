import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, LayoutAnimation, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMotorcycleStorage } from '@/hooks/useMotorcycleStorage';
import { useGridStorage } from '@/hooks/useGridStorage';
import { GridComponent } from '@/components/GridComponent';
import { MotoList } from '@/components/MotoList';
import { FilterMenu } from '@/components/FilterMenu';
import { useTheme } from '@/context/ThemeContext';
import { Motorcycle } from '@/types';
import { useFocusEffect } from 'expo-router';
import React from 'react';

export default function MapaScreen() {
  const router = useRouter();
  const { colors, t } = useTheme();
  // Estados para filtros e seleção de motos
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedMoto, setSelectedMoto] = useState<Motorcycle | null>(null);

  // Hooks customizados para acessar motos e grid do AsyncStorage
  const { motorcycles, loading: loadingMotos, updateMotorcycle, refreshMotorcycles, removeMotorcycle } = useMotorcycleStorage();
  const {
    gridPositions,
    loading: loadingGrid,
    placeMotorcycle,
    removeMotorcycleFromGrid
  } = useGridStorage();

  // Estados para motos aguardando e já posicionadas no grid
  const [waitingMotos, setWaitingMotos] = useState<Motorcycle[]>([]);
  const [placedMotos, setPlacedMotos] = useState<Motorcycle[]>([]);

  // Atualiza motos sempre que a tela ganha foco (garante dados atualizados)
  useFocusEffect(
    useCallback(() => {
      refreshMotorcycles();
    }, [refreshMotorcycles])
  );

  // Animação suave ao atualizar listas de motos
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [waitingMotos, placedMotos]);

  // Filtra motos conforme status/modelo selecionados e atualiza listas
  useEffect(() => {
    console.log('MapaScreen: Estado motorcycles mudou. Recalculando waitingMotos.');
    const placedIds = gridPositions.filter(p => p.occupied && p.motorcycle).map(p => p.motorcycle!.id);
    const onGrid = motorcycles.filter(moto => moto.posicao);
    const waiting = motorcycles.filter(moto => !moto.posicao && !placedIds.includes(moto.id));

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

    // Limpa seleção se moto filtrada sair da lista
    if (selectedMoto && filteredWaiting.every(m => m.id !== selectedMoto.id)) {
      setSelectedMoto(null);
    }
  }, [motorcycles, selectedStatus, selectedModel, gridPositions]);

  // Posiciona moto selecionada no grid
  const handlePlaceMoto = async (position: { x: number, y: number }) => {
    if (!selectedMoto) return;

    try {
      await placeMotorcycle(selectedMoto, position.x, position.y);
      await updateMotorcycle({
        ...selectedMoto,
        posicao: { x: position.x, y: position.y }
      });
      setSelectedMoto(null);
    } catch (error) {
      console.error('Failed to place motorcycle:', error);
    }
  };

  // Remove moto do grid (mantém no sistema)
  const handleRemoveFromGrid = async (motoId: string) => {
    try {
      const moto = motorcycles.find(m => m.id === motoId);
      if (!moto) return;

      await removeMotorcycleFromGrid(motoId);
      await updateMotorcycle({
        ...moto,
        posicao: null
      });
      
      if (selectedMoto?.id === motoId) {
        setSelectedMoto(null);
      }
    } catch (error) {
      console.error('Failed to remove motorcycle from grid:', error);
    }
  };

  // Limpa seleção de moto
  const handleClearSelection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedMoto(null);
  };
  const handleDeleteMoto = async (id: string) => {
    Alert.alert(
      t('map.deleteConfirmTitle'),
      t('map.deleteConfirmMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMotorcycleFromGrid(id);
              await removeMotorcycle(id);
              refreshMotorcycles();
            } catch (error) {
              console.error('Erro ao remover moto:', error);
              Alert.alert(t('common.error'), t('map.deleteError'));
            }
          },
        },
      ]
    );
  };

  const styles = useMemo(() => getStyles(colors), [colors]);

  // Exibe loading enquanto carrega motos ou grid
  if (loadingMotos || loadingGrid) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>{t('map.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho com filtros */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('map.title')}</Text>
        <FilterMenu
          selectedStatus={selectedStatus}
          selectedModel={selectedModel}
          onStatusChange={setSelectedStatus}
          onModelChange={setSelectedModel}
        />
      </View>
      <ScrollView>
        {/* Indicador de seleção de moto */}
        {selectedMoto && (
          <View style={styles.selectionIndicator}>
            <Text style={styles.selectionText}>{t('map.selectedMoto', { placa: selectedMoto.placa })}</Text>
            <TouchableOpacity
              style={styles.clearSelectionButton}
              onPress={handleClearSelection}
            >
              <Text style={styles.clearSelectionText}>{t('map.cancel')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Grid visual do pátio */}
        <Text style={styles.sectionTitle}>{t('map.gridTitle')}</Text>
        <ScrollView style={styles.gridContainer}>
          <GridComponent
            gridPositions={gridPositions}
            onPlaceMoto={handlePlaceMoto}
            onRemoveFromGrid={handleRemoveFromGrid}
            selectedMoto={selectedMoto}
          />
        </ScrollView>

        {/* Lista de motos aguardando posicionamento */}
        <View style={styles.waitingSection}>
          <View style={styles.waitingHeader}>
            <Text style={styles.waitingTitle}>
              {t('map.waitingTitle', { count: waitingMotos.length })}
            </Text>
            <TouchableOpacity onPress={() => {
              setSelectedStatus(null);
              setSelectedModel(null);
            }}>
              <Text style={styles.clearFilters}>{t('map.clearFilters')}</Text>
            </TouchableOpacity>
          </View>
          <MotoList
            motorcycles={waitingMotos}
            onSelect={(moto) => setSelectedMoto(moto)}
            onEdit={(moto) => {
              router.push({
                pathname: '/cadastro',
                params: {
                  id: moto.id,
                  placa: moto.placa,
                  modelo: moto.modelo,
                  cor: moto.cor,
                  status: moto.status,
                  posicao: moto.posicao ? JSON.stringify(moto.posicao) : null,
                },
              });
            }}
            onDelete={handleDeleteMoto}
            selectedMoto={selectedMoto}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
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
    color: colors.neutral.black,
  },
  waitingSection: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
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
    color: colors.neutral.black,
  },
  clearFilters: {
    color: colors.primary.main,
    fontWeight: '500',
  },
  gridContainer: {
    marginBottom: 8,
    maxHeight: 550,
    overflow: 'scroll',
  },
  selectionIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.primary.lighter,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary.main,
  },
  selectionText: {
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  clearSelectionButton: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: colors.status.quarantine,
  },
  clearSelectionText: {
    color: colors.neutral.white,
    fontSize: 12,
  },
});
