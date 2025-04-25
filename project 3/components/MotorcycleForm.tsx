import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { Save, Mic, X } from 'lucide-react-native';

type MotorcycleFormProps = {
  initialPlate: string;
  onSave: (motorcycle: any) => void;
};

export default function MotorcycleForm({ initialPlate, onSave }: MotorcycleFormProps) {
  const [formData, setFormData] = useState({
    placa: initialPlate,
    modelo: '',
    status: 'disponível',
    cor: '',
    observacoes: '',
  });

  const [isRecording, setIsRecording] = useState(false);

  const statusOptions = [
    { label: 'Disponível', value: 'disponível', color: Colors.success },
    { label: 'Em Manutenção', value: 'manutenção', color: Colors.warning },
    { label: 'Reservada', value: 'reservada', color: Colors.error },
    { label: 'Outros', value: 'outros', color: Colors.gray },
  ];

  const modeloOptions = [
    'Mottu-E',
    'Mottu-Pop',
    'Mottu-Sport',
  ];

  const corOptions = [
    'Preta',
    'Vermelha',
    'Branca',
    'Azul',
    'Prata',
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.placa || !formData.modelo) {
      alert('Os campos Placa e Modelo são obrigatórios');
      return;
    }

    // Simular posição no pátio
    const motorcycle = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      position: {
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10),
      },
      timestamp: new Date().toISOString(),
    };

    onSave(motorcycle);
  };

  const startVoiceRecording = () => {
    // Simular gravação de voz (na versão real utilizaria o SpeechRecognition)
    setIsRecording(true);
    
    // Simulando transcrição após 2 segundos
    setTimeout(() => {
      setIsRecording(false);
      handleChange('observacoes', formData.observacoes + 'Moto em bom estado, revisão feita na semana passada. ');
    }, 2000);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Moto</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Modelo</Text>
        <View style={styles.optionsContainer}>
          {modeloOptions.map((modelo) => (
            <TouchableOpacity
              key={modelo}
              style={[
                styles.optionButton,
                formData.modelo === modelo && styles.selectedOptionButton,
              ]}
              onPress={() => handleChange('modelo', modelo)}
            >
              <Text
                style={[
                  styles.optionText,
                  formData.modelo === modelo && styles.selectedOptionText,
                ]}
              >
                {modelo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.optionsContainer}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.statusButton,
                { borderColor: option.color },
                formData.status === option.value && { backgroundColor: option.color },
              ]}
              onPress={() => handleChange('status', option.value)}
            >
              <Text
                style={[
                  styles.statusText,
                  formData.status === option.value && styles.selectedStatusText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Cor</Text>
        <View style={styles.optionsContainer}>
          {corOptions.map((cor) => (
            <TouchableOpacity
              key={cor}
              style={[
                styles.optionButton,
                formData.cor === cor && styles.selectedOptionButton,
              ]}
              onPress={() => handleChange('cor', cor)}
            >
              <Text
                style={[
                  styles.optionText,
                  formData.cor === cor && styles.selectedOptionText,
                ]}
              >
                {cor}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.observacoesHeader}>
          <Text style={styles.label}>Observações</Text>
          <TouchableOpacity
            style={[styles.voiceButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? () => setIsRecording(false) : startVoiceRecording}
          >
            {isRecording ? (
              <X size={20} color={Colors.white} />
            ) : (
              <Mic size={20} color={Colors.white} />
            )}
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          value={formData.observacoes}
          onChangeText={(text) => handleChange('observacoes', text)}
          placeholder="Adicione observações ou use o botão de voz para ditar"
          placeholderTextColor={Colors.lightGray}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Save size={20} color={Colors.white} />
        <Text style={styles.saveButtonText}>Salvar Moto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.text,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.text,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: Colors.white,
  },
  selectedOptionButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    color: Colors.text,
  },
  selectedOptionText: {
    color: Colors.white,
    fontWeight: '600',
  },
  statusButton: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  statusText: {
    color: Colors.text,
  },
  selectedStatusText: {
    color: Colors.white,
    fontWeight: '600',
  },
  observacoesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  voiceButton: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: Colors.error,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  saveButtonText: {
    color: Colors.white,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});