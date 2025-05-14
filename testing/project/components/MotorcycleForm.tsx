import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { MotorcycleStatus, MotorcycleModel } from '@/constants/Types';
import { CircleCheck as CheckCircle2, CircleAlert as AlertCircle, QrCode, RotateCcw } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface MotorcycleFormProps {
  initialData?: {
    placa?: string;
    modelo?: string;
    cor?: string;
    status?: string;
  };
  onSubmit: (data: {
    placa: string;
    modelo: MotorcycleModel;
    cor: string;
    status: MotorcycleStatus;
  }) => void;
}

export default function MotorcycleForm({ initialData, onSubmit }: MotorcycleFormProps) {
  const router = useRouter();
  const [placa, setPlaca] = useState(initialData?.placa || '');
  const [modelo, setModelo] = useState<MotorcycleModel>((initialData?.modelo || 'Mottu Pop') as MotorcycleModel);
  const [cor, setCor] = useState(initialData?.cor || '');
  const [status, setStatus] = useState<MotorcycleStatus>((initialData?.status || 'Aguardando vistoria') as MotorcycleStatus);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Options for dropdowns
  const modelOptions: MotorcycleModel[] = ['Mottu Pop', 'Mottu Sport', 'Mottu-E'];
  const statusOptions: MotorcycleStatus[] = [
    'Pronta para aluguel',
    'Em manutenção',
    'Aguardando vistoria',
    'Em reparo emergencial',
    'Em quarentena'
  ];
  const colorOptions = ['Preto', 'Vermelho', 'Azul', 'Branco', 'Prata', 'Verde', 'Amarelo'];
  
  const handleSubmit = () => {
    // Basic validation
    if (!placa) {
      setError('A placa da moto é obrigatória');
      return;
    }
    
    if (placa.length < 4) {
      setError('A placa deve ter pelo menos 4 caracteres');
      return;
    }
    
    if (!cor) {
      setError('A cor da moto é obrigatória');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Submit the form
    onSubmit({
      placa,
      modelo,
      cor,
      status,
    });
    
    // Show success message
    setSuccess(true);
    
    // Reset form after delay
    setTimeout(() => {
      setPlaca('');
      setModelo('Mottu Pop');
      setCor('');
      setStatus('Aguardando vistoria');
      setSuccess(false);
    }, 2000);
  };
  
  const navigateToScanner = () => {
    router.push('/cadastro/camera');
  };
  
  const resetForm = () => {
    setPlaca('');
    setModelo('Mottu Pop');
    setCor('');
    setStatus('Aguardando vistoria');
    setError(null);
  };
  
  // Get status color
  const getStatusColor = (statusValue: MotorcycleStatus) => {
    switch (statusValue) {
      case 'Pronta para aluguel':
        return Colors.status.ready;
      case 'Em manutenção':
      case 'Em reparo emergencial':
        return Colors.status.maintenance;
      case 'Em quarentena':
        return Colors.status.quarantine;
      case 'Aguardando vistoria':
        return Colors.status.waiting;
      default:
        return Colors.neutral.gray;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={18} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {success && (
          <View style={styles.successContainer}>
            <CheckCircle2 size={18} color={Colors.primary.default} />
            <Text style={styles.successText}>Moto cadastrada com sucesso!</Text>
          </View>
        )}
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Placa da Moto</Text>
          <TextInput
            style={styles.input}
            value={placa}
            onChangeText={setPlaca}
            placeholder="Ex: ABC1234"
            placeholderTextColor={Colors.neutral.gray}
            autoCapitalize="characters"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Modelo</Text>
          <View style={styles.optionsContainer}>
            {modelOptions.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.optionButton,
                  modelo === option && styles.selectedOption,
                ]}
                onPress={() => setModelo(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    modelo === option && styles.selectedOptionText,
                  ]}
                >
                  {option === 'Mottu Pop' ? '🛵 ' : option === 'Mottu Sport' ? '🏍️ ' : '⚡ '}
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Cor</Text>
          <View style={styles.colorOptionsContainer}>
            {colorOptions.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.colorOption,
                  cor === option && styles.selectedColorOption,
                ]}
                onPress={() => setCor(option)}
              >
                <Text
                  style={[
                    styles.colorOptionText,
                    cor === option && styles.selectedColorOptionText,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusOptionsContainer}>
            {statusOptions.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.statusOption,
                  status === option && {
                    ...styles.selectedStatusOption,
                    borderColor: getStatusColor(option),
                    backgroundColor: `${getStatusColor(option)}15`,
                  },
                ]}
                onPress={() => setStatus(option)}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(option) },
                  ]}
                />
                <Text
                  style={[
                    styles.statusOptionText,
                    status === option && {
                      ...styles.selectedStatusOptionText,
                      color: getStatusColor(option),
                    },
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <Pressable style={styles.resetButton} onPress={resetForm}>
            <RotateCcw size={18} color={Colors.neutral.gray} />
            <Text style={styles.resetButtonText}>Limpar</Text>
          </Pressable>
          
          <Pressable style={styles.scanButton} onPress={navigateToScanner}>
            <QrCode size={18} color={Colors.neutral.white} />
            <Text style={styles.scanButtonText}>Escanear QR</Text>
          </Pressable>
          
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Cadastrar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: '#EF4444',
    marginLeft: 8,
    flex: 1,
  },
  successContainer: {
    backgroundColor: 'rgba(5, 175, 49, 0.1)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  successText: {
    color: Colors.primary.default,
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.neutral.dark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.neutral.light,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.neutral.dark,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: Colors.neutral.light,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 5,
    marginBottom: 10,
    minWidth: '30%',
  },
  selectedOption: {
    borderColor: Colors.primary.default,
    backgroundColor: 'rgba(5, 175, 49, 0.05)',
  },
  optionText: {
    color: Colors.neutral.dark,
    textAlign: 'center',
    fontSize: 14,
  },
  selectedOptionText: {
    color: Colors.primary.default,
    fontWeight: '500',
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  colorOption: {
    borderWidth: 1,
    borderColor: Colors.neutral.light,
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    marginBottom: 10,
    minWidth: '22%',
  },
  selectedColorOption: {
    borderColor: Colors.primary.default,
    backgroundColor: 'rgba(5, 175, 49, 0.05)',
  },
  colorOptionText: {
    color: Colors.neutral.dark,
    textAlign: 'center',
    fontSize: 14,
  },
  selectedColorOptionText: {
    color: Colors.primary.default,
    fontWeight: '500',
  },
  statusOptionsContainer: {
    flexDirection: 'column',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral.light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedStatusOption: {
    borderWidth: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusOptionText: {
    color: Colors.neutral.dark,
    fontSize: 14,
  },
  selectedStatusOptionText: {
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.neutral.light,
  },
  resetButtonText: {
    color: Colors.neutral.gray,
    marginLeft: 8,
    fontWeight: '500',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary.light,
    flex: 1,
    marginHorizontal: 10,
  },
  scanButtonText: {
    color: Colors.neutral.white,
    marginLeft: 8,
    fontWeight: '500',
  },
  submitButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  submitButtonText: {
    color: Colors.neutral.white,
    fontWeight: '600',
    fontSize: 16,
  },
});