import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, LayoutAnimation, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMotorcycleStorage, useGridStorage } from '@/hooks/useStorage';
import { GridComponent } from '@/components/GridComponent';
import { MotoList } from '@/components/MotoList';
import { FilterMenu } from '@/components/FilterMenu';
import { colors } from '@/theme/colors';
import { Motorcycle } from '@/types';


export default function MapaScreen() {
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [selectedMoto, setSelectedMoto] = useState<Motorcycle | null>(null);
    const { motorcycles, loading: loadingMotos, lastUpdate , updateMotorcycle,refreshMotorcycles, removeMotorcycle } = useMotorcycleStorage();
    const {
        gridPositions,
        loading: loadingGrid,
        placeMotorcycle,
        removeMotorcycleFromGrid
    } = useGridStorage();

    const [waitingMotos, setWaitingMotos] = useState<Motorcycle[]>([]);
    const [placedMotos, setPlacedMotos] = useState<Motorcycle[]>([]);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [waitingMotos, placedMotos]);

    useEffect(() => {
        const onGrid = motorcycles.filter(moto => moto.posicao);
        const waiting = motorcycles.filter(moto => !moto.posicao);

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

        if (selectedMoto && filteredWaiting.every(m => m.id !== selectedMoto.id)) {
            setSelectedMoto(null);
        }
    }, [motorcycles, selectedStatus, selectedModel, gridPositions, lastUpdate]);

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

    const handleRemoveFromGrid = async (motoId: string) => {
        try {
            const moto = motorcycles.find(m => m.id === motoId);
            if (!moto) return;

            await removeMotorcycleFromGrid(motoId);
            await updateMotorcycle({
                ...moto,
                posicao: undefined
            });

            if (selectedMoto?.id === motoId) {
                setSelectedMoto(null);
            }
        } catch (error) {
            console.error('Failed to remove motorcycle from grid:', error);
        }
    };

    const handleClearSelection = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedMoto(null);
    };
    const handleDeleteMoto = async (id: string) => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja remover esta moto?',
            [
            {
                text: 'Cancelar',
                style: 'cancel',
            },
            {
                text: 'Remover',
                style: 'destructive',
                onPress: async () => {
                try {

                    await removeMotorcycleFromGrid(id);
                    
                    await removeMotorcycle(id);

                    refreshMotorcycles();

                } catch (error) {
                    console.error('Erro ao remover moto:', error);
                    Alert.alert('Erro', 'Não foi possível remover a moto');
                }
                },
            },
            ]
        );
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
            <ScrollView >
                {selectedMoto && (
                    <View style={styles.selectionIndicator}>
                        <Text style={styles.selectionText}>Moto selecionada: {selectedMoto.placa}</Text>
                        <TouchableOpacity
                            style={styles.clearSelectionButton}
                            onPress={handleClearSelection}
                        >
                            <Text style={styles.clearSelectionText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <Text style={styles.sectionTitle}>Grid do Pátio</Text>
                <ScrollView style={styles.gridContainer}>
                    <GridComponent
                        gridPositions={gridPositions}
                        onPlaceMoto={handlePlaceMoto}
                        onRemoveFromGrid={handleRemoveFromGrid}
                        selectedMoto={selectedMoto}
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
                        onSelect={(moto) => setSelectedMoto(moto)}
                        onDelete={handleDeleteMoto}
                        selectedMoto={selectedMoto}
                    />
                </View>
            </ScrollView>    
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

function removeMotorcycle(id: string) {
    throw new Error('Function not implemented.');
}
