import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QrCode, ChevronDown } from 'lucide-react-native';
import { useMotorcycleStorage } from '@/hooks/useMotorcycleStorage';
import { MOTO_STATUSES, MOTO_MODELS } from '@/constants/motoStatuses';
import { useTheme } from '@/context/ThemeContext';
import useHistoryStorage from '@/hooks/useHistoryStorage';
import React from 'react';

export default function CadastroScreen() {
  // Hooks de navegação e armazenamento
  const router = useRouter();
  const { motorcycles, addMotorcycle, updateMotorcycle, refreshMotorcycles } = useMotorcycleStorage();
  const { addHistoryEvent } = useHistoryStorage();

  // Parâmetros vindos da navegação (QR Code ou Edição)
  const params = useLocalSearchParams();
  const isEditing = useMemo(() => !!params.id, [params.id]);

  const {
    id: existingId,
    placa: paramPlaca,
    modelo: paramModelo,
    cor: paramCor,
    status: paramStatus,
    posicao: paramPosicao
  } = params;

  // Estados controlados do formulário
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState(MOTO_MODELS[0]);
  const [cor, setCor] = useState('');
  const [status, setStatus] = useState(MOTO_STATUSES[0]);
  const [showModelOptions, setShowModelOptions] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState(false);

  // Preenche os campos automaticamente se vierem da navegação (QR Code ou Edição)
  useEffect(() => {
    if (isEditing && existingId) {
      const existingMoto = motorcycles.find(m => m.id === existingId);
      if (existingMoto) {
        setPlaca(existingMoto.placa);
        setModelo(existingMoto.modelo);
        setCor(existingMoto.cor);
        setStatus(existingMoto.status);
      }
    } else {
      if (paramPlaca) setPlaca(paramPlaca as string);
      if (paramModelo) setModelo(paramModelo as string);
      if (paramCor) setCor(paramCor as string);
      if (paramStatus) setStatus(paramStatus as string);
    }
  }, [isEditing, existingId, motorcycles, paramPlaca, paramModelo, paramCor, paramStatus]);

  // Navega para o scanner de QR Code
  const openQrCodeScanner = () => {
    router.push('/cadastro/camera');
  };

  // Função para salvar (cadastrar ou atualizar) a moto
  const handleSave = async () => {
    // Validação dos campos obrigatórios
    if (!placa || !modelo || !cor || !status) {
      Alert.alert(t('common.error'), t('common.allFieldsRequired'));
      return;
    }
    if (placa.length < 7) {
      Alert.alert(t('common.error'), t('registerMoto.plateError'));
      return;
    }

    try {
      if (isEditing) {
        // Modo Edição
        const existingMoto = motorcycles.find(m => m.id === existingId);
        const updatedMoto = {
          id: existingId as string,
          placa,
          modelo,
          cor,
          status,
          timestampEntrada: existingMoto?.timestampEntrada,
          posicao: existingMoto?.posicao,
          reservada: existingMoto?.reservada
        };
        await updateMotorcycle(updatedMoto as any);
        addHistoryEvent(t('registerMoto.historyUpdate'), `Placa: ${placa}`);
        Alert.alert(t('common.success'), t('registerMoto.updateSuccess', { placa }));
      } else {
        // Modo Cadastro - Remover id e timestampEntrada, deixar para a API gerar
        const newMotoData = { placa, modelo, cor, status };
        await addMotorcycle(newMotoData);
        addHistoryEvent(t('registerMoto.historyAdd'), `Placa: ${placa}, Modelo: ${modelo}`);
        Alert.alert(t('common.success'), t('registerMoto.addSuccess', { placa }));
      }

      // Atualiza a lista e volta para a tela principal (Home)
      refreshMotorcycles(); 
      router.back();

    } catch (error) {
      console.error('Erro ao cadastrar moto:', error);
      Alert.alert(t('common.error'), t('registerMoto.addError'));
    }
  };

  const { colors, t } = useTheme();

  // Título dinâmico para a tela
  const screenTitle = isEditing ? t('registerMoto.editTitle') : t('registerMoto.screenTitle');
  const buttonTitle = isEditing ? t('registerMoto.editButtonTitle') : t('registerMoto.buttonTitle');

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
    <View style={styles.container}>
      {/* Cabeçalho da tela */}
      <View style={styles.header}>
        <Text style={styles.title}>{screenTitle}</Text>
      </View>
      
      {/* Conteúdo principal com formulário */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Botão para escanear QR Code */}
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={openQrCodeScanner}
        >
          <QrCode size={24} color={colors.neutral.white} />
          <Text style={styles.scanButtonText}>{t('registerMoto.scanQR')}</Text>
        </TouchableOpacity>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{t('registerMoto.motoInfo')}</Text>
          
          {/* Campo Placa */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('registerMoto.plate')}</Text>
            <TextInput
              style={styles.input}
              value={placa}
              onChangeText={setPlaca}
              placeholder={t('registerMoto.platePlaceholder')}
              placeholderTextColor={colors.neutral.gray}
              autoCapitalize="characters"
              maxLength={8}
              editable={!isEditing} 
            />
          </View>
          
          {/* Campo Modelo com seleção */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('registerMoto.model')}</Text>
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
            <Text style={styles.inputLabel}>{t('registerMoto.color')}</Text>
            <TextInput
              style={styles.input}
              value={cor}
              onChangeText={setCor}
              placeholder={t('registerMoto.colorPlaceholder')}
              placeholderTextColor={colors.neutral.gray}
            />
          </View>
          
          {/* Campo Status com seleção */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('registerMoto.status')}</Text>
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
            onPress={handleSave}
          >
            <Text style={styles.submitButtonText}>{buttonTitle}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
  