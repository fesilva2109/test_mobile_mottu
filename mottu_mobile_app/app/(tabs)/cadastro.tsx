import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QrCode, ChevronDown } from 'lucide-react-native';
import { useMotorcycleStorage } from '@/hooks/useMotorcycleStorage';
import { MOTO_STATUSES, MOTO_MODELS } from '@/constants/motoStatuses';
import { useTheme } from '@/context/ThemeContext';
import { Motorcycle } from '@/types';
import * as Crypto from 'expo-crypto'; 
import useHistoryStorage from '@/hooks/useHistoryStorage';
import React from 'react';

// Função utilitária para gerar UUIDs únicos para cada moto cadastrada
const generateUUID = () => {
  return Crypto.randomUUID();
};

export default function CadastroScreen() {
  // Hooks de navegação e armazenamento
  const router = useRouter();
  const { addMotorcycle, refreshMotorcycles } = useMotorcycleStorage();
  const { addHistoryEvent } = useHistoryStorage();

  // Parâmetros vindos do QR Code (se houver)
  const { placa: scannedPlaca, modelo: scannedModelo, cor: scannedCor, status: scannedStatus } = useLocalSearchParams();

  // Estados controlados do formulário
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState(MOTO_MODELS[0]);
  const [cor, setCor] = useState('');
  const [status, setStatus] = useState(MOTO_STATUSES[0]);
  const [showModelOptions, setShowModelOptions] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  // Preenche os campos automaticamente se vierem do QR Code
  useEffect(() => {
    if (scannedPlaca) setPlaca(scannedPlaca as string);
    if (scannedModelo) setModelo(scannedModelo as string);
    if (scannedCor) setCor(scannedCor as string);
    if (scannedStatus) setStatus(scannedStatus as string);
  }, [scannedPlaca, scannedModelo, scannedCor, scannedStatus]);

  // Navega para o scanner de QR Code
  const openQrCodeScanner = () => {
    router.push('/cadastro/camera');
  };

  // Função principal de cadastro da moto
  const handleCadastro = async () => {
    // Validação dos campos obrigatórios
    if (!placa || !modelo || !cor || !status) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }
    if (placa.length < 7) {
      Alert.alert('Erro', 'A placa deve conter no mínimo 7 caracteres.');
      return;
    }

    try {
      // Cria objeto da nova moto
      const newMotorcycle: Motorcycle = {
        id: generateUUID(),
        placa,
        modelo,
        cor,
        status,
        timestampEntrada: Date.now(),
      };

      // Salva a moto no AsyncStorage e adiciona evento ao histórico
      await addMotorcycle(newMotorcycle);
      addHistoryEvent('Moto Cadastrada', `Placa: ${placa}, Modelo: ${modelo}`);

      // Aguarda um pequeno delay para garantir atualização
      await new Promise(resolve => setTimeout(resolve, 300));
      refreshMotorcycles(); 
      
      // Exibe alerta de sucesso com opções
      Alert.alert(
        'Sucesso', 
        `Moto ${placa} cadastrada com sucesso!`,
        [
          { 
            text: 'Ver no Mapa',
            onPress: () => router.push('/mapa')
          },
          { 
            text: 'Cadastrar Outra', 
            onPress: resetForm
          }
        ]
      );
      resetForm();
    } catch (error) {
      console.error('Erro ao cadastrar moto:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar a moto.');
    }
  };

  // Limpa o formulário para novo cadastro
  const resetForm = () => {
    setPlaca('');
    setModelo(MOTO_MODELS[0]);
    setCor('');
    setStatus(MOTO_STATUSES[0]);
  };

    const { colors } = useTheme();

// Estilos organizados 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightGray,
  },
  header: {
    padding: 16,
    backgroundColor: colors.primary.main,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.neutral.white,
  },
  content: {
    padding: 16,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  scanButtonText: {
    color: colors.neutral.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.neutral.black,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.neutral.darkGray,
  },
  input: {
    backgroundColor: colors.neutral.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.neutral.black,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral.lightGray,
    borderRadius: 8,
    padding: 12,
  },
  selectText: {
    fontSize: 16,
    color: colors.neutral.black,
  },
  optionsContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.neutral.lightGray,
    zIndex: 2,
  },
  optionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.lightGray,
  },
  optionText: {
    fontSize: 16,
    color: colors.neutral.black,
  },
  selectedOptionText: {
    color: colors.primary.main,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: colors.neutral.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});


  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho da tela */}
      <View style={styles.header}>
        <Text style={styles.title}>Cadastrar Moto</Text>
      </View>
      
      {/* Conteúdo principal com formulário */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Botão para escanear QR Code */}
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={openQrCodeScanner}
        >
          <QrCode size={24} color={colors.neutral.white} />
          <Text style={styles.scanButtonText}>Escanear QR Code</Text>
        </TouchableOpacity>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Informações da Moto</Text>
          
          {/* Campo Placa */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Placa</Text>
            <TextInput
              style={styles.input}
              value={placa}
              onChangeText={setPlaca}
              placeholder="ABC-1234"
              placeholderTextColor={colors.neutral.gray}
              autoCapitalize="characters"
              maxLength={8}
            />
          </View>
          
          {/* Campo Modelo com seleção */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Modelo</Text>
            <TouchableOpacity 
              style={styles.selectInput}
              onPress={() => setShowModelOptions(!showModelOptions)}
            >
              <Text style={styles.selectText}>{modelo}</Text>
              <ChevronDown size={20} color={colors.neutral.gray} />
            </TouchableOpacity>
            {showModelOptions && (
              <View style={styles.optionsContainer}>
                {MOTO_MODELS.map((item) => (
                  <TouchableOpacity 
                    key={item}
                    style={styles.optionItem}
                    onPress={() => {
                      setModelo(item);
                      setShowModelOptions(false);
                    }}
                  >
                    <Text style={[
                      styles.optionText,
                      modelo === item && styles.selectedOptionText
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          {/* Campo Cor */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cor</Text>
            <TextInput
              style={styles.input}
              value={cor}
              onChangeText={setCor}
              placeholder="Ex: Preta, Vermelha, Azul"
              placeholderTextColor={colors.neutral.gray}
            />
          </View>
          
          {/* Campo Status com seleção */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Status</Text>
            <TouchableOpacity 
              style={styles.selectInput}
              onPress={() => setShowStatusOptions(!showStatusOptions)}
            >
              <Text style={styles.selectText}>{status}</Text>
              <ChevronDown size={20} color={colors.neutral.gray} />
            </TouchableOpacity>
            {showStatusOptions && (
              <View style={styles.optionsContainer}>
                {MOTO_STATUSES.map((item) => (
                  <TouchableOpacity 
                    key={item}
                    style={styles.optionItem}
                    onPress={() => {
                      setStatus(item);
                      setShowStatusOptions(false);
                    }}
                  >
                    <Text style={[
                      styles.optionText,
                      status === item && styles.selectedOptionText
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          {/* Botão de envio do formulário */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleCadastro}
          >
            <Text style={styles.submitButtonText}>Cadastrar Moto</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );


}
  