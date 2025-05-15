import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useMotorcycleStore, Motorcycle } from '@/stores/motorcycleStore'; // Import Motorcycle here
import Colors from '@/constants/Colors';
import MotorcycleForm from '@/components/MotorcycleForm';
import { Camera, Camera as FlipCamera } from 'lucide-react-native';

export default function CadastroScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [plateText, setPlateText] = useState('');
  const { addMotorcycle } = useMotorcycleStore();
  const navigation = useNavigation();

  if (!permission) {
    return <View />;
  }

  const toggleCamera = async () => {
    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          'Permissão negada',
          'Precisamos da permissão da câmera para escanear placas de motos'
        );
        return;
      }
    }
    setIsCameraActive(!isCameraActive);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleSave = (motorcycle: Motorcycle) => {
    addMotorcycle(motorcycle);
    Alert.alert('Sucesso', 'Moto cadastrada com sucesso!');
    setPlateText('');
  };

  const simulateScanPlate = () => {
    // Simulando reconhecimento de placa
    const generatedPlate = `BR${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    setPlateText(generatedPlate);
    setIsCameraActive(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {isCameraActive ? (
          <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} facing={facing}>
              <View style={styles.cameraControls}>
                <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraFacing}>
                  <FlipCamera size={24} color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.scanButton} onPress={simulateScanPlate}>
                  <Text style={styles.scanButtonText}>Escanear Placa</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        ) : (
          <TouchableOpacity style={styles.activateCameraButton} onPress={toggleCamera}>
            <Camera size={28} color={Colors.white} />
            <Text style={styles.activateCameraText}>Ativar câmera para escanear placa</Text>
          </TouchableOpacity>
        )}

        {!isCameraActive && (
          <>
            <View style={styles.plateInput}>
              <Text style={styles.label}>Placa da Moto</Text>
              <TextInput
                style={styles.input}
                value={plateText}
                onChangeText={setPlateText}
                placeholder="Digite ou escaneie a placa"
                placeholderTextColor={Colors.lightGray}
                autoCapitalize="characters"
                maxLength={7}
              />
            </View>

            <MotorcycleForm initialPlate={plateText} onSave={handleSave} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  cameraContainer: {
    aspectRatio: 4 / 3,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  scanButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  activateCameraButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  activateCameraText: {
    color: Colors.white,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  plateInput: {
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
});