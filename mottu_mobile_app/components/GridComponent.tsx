import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { GridPosition, Motorcycle } from '@/types';
import { colors } from '@/theme/colors';

interface GridComponentProps {
    gridPositions: GridPosition[];
    onPlaceMoto: (position: { x: number, y: number }) => void;
    onRemoveFromGrid: (motoId: string) => void |  Promise<void>;
    selectedMoto?: Motorcycle | null;
}

export function GridComponent({ gridPositions, onPlaceMoto, onRemoveFromGrid, selectedMoto }: GridComponentProps) {
    const [gridSelectedMoto, setGridSelectedMoto] = useState<Motorcycle | null>(null);
    const [selectedCell, setSelectedCell] = useState<{ x: number, y: number } | null>(null);

    const screenWidth = Dimensions.get('window').width - 36;
    const gridSize = gridPositions.reduce((max, pos) => Math.max(max, pos.x + 1, pos.y + 1), 5);
    const cellWidth = gridSize > 0 ? screenWidth / gridSize : 80;
    const cellHeight = cellWidth;

    const occupiedPositions = useMemo(() => gridPositions.filter(pos => pos.occupied), [gridPositions]);

    const handleCellPress = (x: number, y: number) => {
        const position = gridPositions.find(pos => pos.x === x && pos.y === y);

        if (position) {
            if (position.occupied && position.motorcycle) {
                setGridSelectedMoto(position.motorcycle);
                setSelectedCell({ x, y });
            } else if (selectedMoto) {
                onPlaceMoto({ x, y });
            }
        }
    };

    const handleRemoveFromGrid = () => {
        if (gridSelectedMoto) {
            onRemoveFromGrid(gridSelectedMoto.id);
            setGridSelectedMoto(null);
            setSelectedCell(null);
        }
    };

    const renderGridCells = () => {
        const cells = [];

        for (let y = 0; y < gridSize; y++) {
            const row = [];

            for (let x = 0; x < gridSize; x++) {
                const position = gridPositions.find(pos => pos.x === x && pos.y === y);
                const isSelected = selectedCell?.x === x && selectedCell?.y === y;
                const isHighlighted = selectedMoto && !position?.occupied;

                row.push(
                    <TouchableOpacity
                        key={`cell-${x}-${y}`}
                        style={[
                            styles.gridCell,
                            { width: cellWidth, height: cellHeight },
                            position?.occupied && styles.occupiedCell,
                            !position?.occupied && styles.emptyCell,
                            isSelected && styles.selectedCell,
                            isHighlighted && styles.highlightedCell,
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
                        {!position?.occupied && selectedMoto && (
                            <View style={styles.previewContent}>
                                <Text style={styles.previewText}>+</Text>
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

            {gridSelectedMoto && (
                <View style={styles.actionContainer}>
                    <Text style={styles.selectedText}>
                        Moto selecionada: {gridSelectedMoto.placa}
                    </Text>

                    <TouchableOpacity
                        style={styles.removeButton}
                        onPress={handleRemoveFromGrid}
                    >
                        <Text style={styles.removeButtonText}>Remover do Grid</Text>
                    </TouchableOpacity>
                </View>
            )}

            {selectedMoto && (
                <View style={styles.selectionHint}>
                    <Text style={styles.selectionHintText}>
                        Clique em uma célula vazia para posicionar a moto {selectedMoto.placa}
                    </Text>
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
        borderWidth: 0.5,
        borderColor: colors.neutral.gray,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.neutral.white,
    },
    occupiedCell: {
        backgroundColor: colors.neutral.lightGray,
    },
    emptyCell: {
        backgroundColor: colors.neutral.white,
        opacity: 0.7,
    },
    selectedCell: {
        borderWidth: 2,
        borderColor: colors.primary.main,
    },
    highlightedCell: {
        backgroundColor: colors.primary.lighter,
    },
    cellContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewText: {
        fontSize: 20,
        color: colors.primary.main,
        fontWeight: 'bold',
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
    selectionHint: {
        backgroundColor: colors.primary.lighter,
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
    },
    selectionHintText: {
        color: colors.primary.main,
        fontWeight: '500',
        textAlign: 'center',
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