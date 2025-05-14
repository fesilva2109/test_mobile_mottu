import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Motorcycle } from '@/constants/Types';
import { RotateCcw, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface ScannerProps {
  onScan: (data: Partial<Motorcycle>) => void;
}

export default function Scanner({ onScan }: ScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    requestPermission();
  }, []);

  const handleScan = ({ data }: { data: string }) => {
    if (scanned) return;
    
    try {
      // Try to parse the QR code data as JSON
      const parsedData = JSON.parse(data);
      
      // Check if required fields exist
      if (!parsedData.placa || !parsedData.modelo || !parsedData.cor || !parsedData.status) {
        throw new Error('QR Code inválido. Faltam dados obrigatórios.');
      }
      
      // Set scanned to true to prevent multiple scans
      setScanned(true);
      
      // Call the onScan callback with the parsed data
      onScan(parsedData);
      
      // Show success message
      setError(null);
      
      // Navigate back after a short delay
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (e) {
      // Handle parsing error
      setError('Formato de QR Code inválido. Verifique e tente novamente.');
      setScanned(true);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const resetScanner = () => {
    setScanned(false);
    setError(null);
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando câmera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Precisamos de permissão para usar a câmera</Text>
        <Pressable 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Permitir acesso</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      >
        {!scanned && (
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
            <Text style={styles.scanInstructions}>
              Posicione o QR Code da moto dentro do quadro
            </Text>
          </View>
        )}

        {scanned && !error && (
          <View style={styles.successOverlay}>
            <CheckCircle size={60} color={Colors.primary.default} />
            <Text style={styles.successText}>QR Code escaneado com sucesso!</Text>
          </View>
        )}

        {scanned && error && (
          <View style={styles.errorOverlay}>
            <AlertTriangle size={60} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.tryAgainButton} onPress={resetScanner}>
              <Text style={styles.tryAgainButtonText}>Tentar novamente</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.controlsContainer}>
          <Pressable
            style={styles.cameraButton}
            onPress={toggleCameraFacing}
          >
            <RotateCcw size={24} color={Colors.neutral.white} />
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.black,
  },
  camera: {
    flex: 1,
  },
  loadingText: {
    color: Colors.neutral.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  permissionText: {
    color: Colors.neutral.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  permissionButton: {
    backgroundColor: Colors.primary.default,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: Colors.neutral.white,
    fontSize: 16,
    fontWeight: '500',
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.primary.default,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  scanInstructions: {
    color: Colors.neutral.white,
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 300,
    marginTop: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 8,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: Colors.neutral.white,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: Colors.neutral.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  tryAgainButton: {
    backgroundColor: Colors.primary.default,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  tryAgainButtonText: {
    color: Colors.neutral.white,
    fontSize: 16,
    fontWeight: '500',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});