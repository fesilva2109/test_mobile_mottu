import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Filter } from 'lucide-react-native';
import { MOTO_STATUSES, MOTO_MODELS } from '@/constants/motoStatuses';
import { useTheme } from '@/context/ThemeContext';

interface FilterMenuProps {
  selectedStatus: string | null;
  selectedModel: string | null;
  onStatusChange: (status: string | null) => void;
  onModelChange: (model: string | null) => void;
}

export function FilterMenu({
  selectedStatus,
  selectedModel,
  onStatusChange,
  onModelChange
}: FilterMenuProps) {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      alignSelf: 'flex-start',
    },
    filterButtonText: {
      color: colors.neutral.white,
      marginLeft: 6,
      fontSize: 14,
    },
    filtersContainer: {
      backgroundColor: colors.neutral.white,
      borderRadius: 12,
      padding: 12,
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
      marginTop: 4,
    },
    optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 8,
    },
    filterOption: {
      backgroundColor: colors.neutral.lightGray,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    selectedOption: {
      backgroundColor: colors.primary.main,
    },
    optionText: {
      fontSize: 12,
      color: colors.neutral.darkGray,
    },
    selectedOptionText: {
      color: colors.neutral.white,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setExpanded(!expanded)}
      >
        <Filter size={18} color={colors.neutral.white} />
        <Text style={styles.filterButtonText}>
          {expanded ? 'Esconder Filtros' : 'Mostrar Filtros'}
        </Text>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.filtersContainer}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.filterOption,
                !selectedStatus && styles.selectedOption
              ]}
              onPress={() => onStatusChange(null)}
            >
              <Text style={[
                styles.optionText,
                !selectedStatus && styles.selectedOptionText
              ]}>
                Todos
              </Text>
            </TouchableOpacity>
            
            {MOTO_STATUSES.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterOption,
                  selectedStatus === status && styles.selectedOption
                ]}
                onPress={() => onStatusChange(status)}
              >
                <Text style={[
                  styles.optionText,
                  selectedStatus === status && styles.selectedOptionText
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Modelo</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.filterOption,
                !selectedModel && styles.selectedOption
              ]}
              onPress={() => onModelChange(null)}
            >
              <Text style={[
                styles.optionText,
                !selectedModel && styles.selectedOptionText
              ]}>
                Todos
              </Text>
            </TouchableOpacity>
            
            {MOTO_MODELS.map((model) => (
              <TouchableOpacity
                key={model}
                style={[
                  styles.filterOption,
                  selectedModel === model && styles.selectedOption
                ]}
                onPress={() => onModelChange(model)}
              >
                <Text style={[
                  styles.optionText,
                  selectedModel === model && styles.selectedOptionText
                ]}>
                  {model}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}


