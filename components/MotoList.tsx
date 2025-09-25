import React from 'react';
import { FlatList, StyleSheet, View, Text, LayoutAnimation } from 'react-native';
import { MotoCard } from './MotoCard';
import { Motorcycle } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface MotoListProps {
    motorcycles: Motorcycle[];
    onSelect: (motorcycle: Motorcycle) => void;
    onDelete: (id: string) => void;
    selectedMoto?: Motorcycle | null;
}

// Lista visual de motos, usada em várias telas do app
export function MotoList({ motorcycles, onSelect, onDelete, selectedMoto }: MotoListProps) {
    const { colors } = useTheme();

    const getStyles = (colors: any) => StyleSheet.create({
        listContainer: {
            paddingBottom: 20,
        },
        emptyContainer: {
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.neutral.lightGray,
            borderRadius: 8,
        },
        emptyText: {
            color: colors.neutral.gray,
            fontSize: 16,
        },
    });

    const styles = getStyles(colors);

    // Exibe mensagem se não houver motos para mostrar
    if (motorcycles.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma moto disponível</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={motorcycles}
            keyExtractor={(item) => item.id}
            // Renderiza cada moto usando o MotoCard
            renderItem={({ item }) => (
                <MotoCard
                    motorcycle={item}
                    onPress={onSelect}
                    onDelete={onDelete}
                    isInWaitingArea
                    isSelected={item.id === selectedMoto?.id}
                />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onLayout={() => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)}
            scrollEnabled={false}
        />
    );
}


