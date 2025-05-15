import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { BarCodeScanningResult } from 'expo-camera/build/Camera.types';
import { useRouter } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import { colors } from '@/theme/colors';

export default function CameraScreen() {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarCodeScanned = ({ data }: BarCodeScanningResult) => {
    setScanned(true);
    
    try {
      // Try to parse the QR code data as JSON
      const parsedData = JSON.parse(data);
      
      // Validate the data
      if (!parsedData.placa || !parsedData.modelo || !parsedData.cor || !parsedData.status) {
        Alert.alert(
          'QR Code Inválido', 
          'O QR Code escaneado não contém todas as informações necessárias.'
        );
        return;
      }
      
      // Navigate back to form with the scanned data
      router.push({
        pathname: '/(tabs)/cadastro',
        params: {
          placa: parsedData.placa,
          modelo: parsedData.modelo,
          cor: parsedData.cor,
          status: parsedData.status
        }
      });
    } catch (error) {
      Alert.alert(
        'Erro ao Processar QR Code', 
        'O QR Code escaneado não está no formato correto. Certifique-se de escanear um código QR válido da Mottu.'
      );
    }
  };

  // If camera permission is not granted yet
  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Precisamos de permissão para acessar a câmera
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color={colors.neutral.white} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['qr']
        }}
        facing={facing}
      >
        <View style={styles.overlay}>
          <View style={styles.scannerContainer}>
            <Text style={styles.scannerText}>
              Posicione o QR Code da moto dentro da área
            </Text>
            <View style={styles.scannerFrame} />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.neutral.white} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => setScanned(false)}
              disabled={!scanned}
            >
              <Text style={[
                styles.scanButtonText,
                scanned ? {} : { opacity: 0.6 }
              ]}>
                {scanned ? 'Escanear Novamente' : 'Escaneando...'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
            >
              <Text style={styles.flipButtonText}>Virar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerText: {
    color: colors.neutral.white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.primary.main,
    backgroundColor: 'transparent',
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary.main,
    borderRadius: 30,
  },
  scanButtonText: {
    color: colors.neutral.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    color: colors.neutral.white,
    fontSize: 12,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.neutral.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: colors.neutral.white,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary.main,
    borderRadius: 30,
  },
  permissionButtonText: {
    color: colors.neutral.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});