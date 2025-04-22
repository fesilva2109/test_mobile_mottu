import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Mic, Check, X, Bike as MotorcycleIcon, Camera as CameraIcon } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import Colors from '@/constants/Colors';
import { useMotorcycles } from '@/contexts/MotorcycleContext';
import { Motorcycle, MotorcycleStatus } from '@/types/motorcycle';
import RegistrationForm from '@/components/registration/RegistrationForm';
import Button from '@/components/ui/Button';

export default function RegistrationScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [licensePlate, setLicensePlate] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [observations, setObservations] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const cameraRef = useRef<any>(null);

  const { addMotorcycle } = useMotorcycles();

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const startCamera = async () => {
    if (!permission?.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        Alert.alert(
          "Camera Permission Required",
          "We need camera permission to scan license plates. Please enable it in your device settings."
        );
        return;
      }
    }
    setCameraActive(true);
  };

  const stopCamera = () => {
    setCameraActive(false);
  };

  // Mock function to simulate license plate recognition
  const recognizeLicensePlate = async () => {
    // In a real implementation, this would use vision APIs or ML models
    // to extract text from the camera feed
    
    // Simulate processing delay
    setLicensePlate('');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a random license plate for demo purposes
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array(3).fill(0).map(() => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
    const randomNumbers = Math.floor(Math.random() * 9000) + 1000;
    const generatedPlate = `${randomLetters}${randomNumbers}`;
    
    setLicensePlate(generatedPlate);
    stopCamera();
    setIsFormVisible(true);
    
    // Provide audio feedback
    Speech.speak("License plate detected", {
      language: "en",
      pitch: 1.0,
      rate: 0.9,
    });
  };

  // Mock function to simulate voice-to-text
  const toggleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      
      // In a real implementation, this would process the recorded audio
      // and convert it to text using a speech-to-text API
      
      // For this demo, we'll just set some sample text
      setObservations(prev => 
        prev + "Motorcycle has a small scratch on the right side. Needs inspection before rental. "
      );
    } else {
      // Start recording
      setIsRecording(true);
      
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setObservations(prev => 
          prev + "Motorcycle has a small scratch on the right side. Needs inspection before rental. "
        );
      }, 3000);
    }
  };

  const handleRegistrationSubmit = async (data: {
    model: Motorcycle['model'];
    status: MotorcycleStatus;
    observations: string;
    critical: boolean;
  }) => {
    try {
      // Create new motorcycle object
      const newMotorcycle: Motorcycle = {
        id: Date.now().toString(),
        licensePlate,
        model: data.model,
        status: data.status,
        location: {
          // Using hard-coded coordinates for demo purposes
          // In a real app, would use geolocation or yard map selection
          latitude: -23.550520 + (Math.random() * 0.002 - 0.001),
          longitude: -46.633308 + (Math.random() * 0.002 - 0.001),
          section: 'section-1',
        },
        lastUpdated: new Date().toISOString(),
        observations: data.observations,
        critical: data.critical,
      };
      
      await addMotorcycle(newMotorcycle);
      
      Alert.alert(
        "Success", 
        `Motorcycle ${licensePlate} has been registered successfully!`,
        [
          { 
            text: "View in Yard Map", 
            onPress: () => router.push('/yard')
          },
          { 
            text: "OK", 
            onPress: () => {
              setLicensePlate('');
              setObservations('');
              setIsFormVisible(false);
            }
          },
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to register motorcycle. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Register Motorcycle</Text>
        <Text style={styles.headerSubtitle}>
          {cameraActive 
            ? "Scan license plate" 
            : licensePlate 
              ? `License Plate: ${licensePlate}` 
              : "Capture license plate or enter manually"}
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {cameraActive ? (
          <View style={styles.cameraContainer}>
            <CameraView 
              ref={cameraRef}
              style={styles.camera} 
              facing={facing}
              onBarcodeScanned={result => {
                console.log("Barcode scanned:", result);
                // Would handle QR code scanning here
              }}
            >
              <View style={styles.cameraOverlay}>
                <View style={styles.scanArea}>
                  <View style={styles.scanCorner} />
                  <View style={styles.scanCorner} />
                  <View style={styles.scanCorner} />
                  <View style={styles.scanCorner} />
                </View>
                <Text style={styles.scanText}>Position license plate in frame</Text>
              </View>
              <View style={styles.cameraControls}>
                <TouchableOpacity 
                  style={styles.cameraButton}
                  onPress={stopCamera}
                >
                  <X size={24} color={Colors.light.background} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.cameraButton, styles.captureButton]}
                  onPress={recognizeLicensePlate}
                >
                  <CameraIcon size={24} color={Colors.light.background} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cameraButton}
                  onPress={toggleCameraFacing}
                >
                  <MotorcycleIcon size={24} color={Colors.light.background} />
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        ) : isFormVisible ? (
          <RegistrationForm
            licensePlate={licensePlate}
            initialObservations={observations}
            onSubmit={handleRegistrationSubmit}
            onCancel={() => {
              setIsFormVisible(false);
              setLicensePlate('');
              setObservations('');
            }}
            isRecording={isRecording}
            onToggleRecording={toggleVoiceRecording}
          />
        ) : (
          <View style={styles.initialView}>
            <Text style={styles.instructionText}>
              Scan a motorcycle's license plate to register it in the system
            </Text>
            <Button
              title="Start Scanning"
              onPress={startCamera}
              type="primary"
              icon={<CameraIcon size={18} color={Colors.light.background} />}
              style={styles.startButton}
            />
            <TouchableOpacity
              style={styles.manualEntryButton}
              onPress={() => {
                setLicensePlate('MANUAL');
                setIsFormVisible(true);
              }}
            >
              <Text style={styles.manualEntryText}>
                Or enter details manually
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[800],
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[500],
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  initialView: {
    alignItems: 'center',
    padding: 24,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  startButton: {
    width: '100%',
    marginBottom: 16,
  },
  manualEntryButton: {
    padding: 12,
  },
  manualEntryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary[500],
  },
  cameraContainer: {
    overflow: 'hidden',
    borderRadius: 12,
    height: 500,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 280,
    height: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scanCorner: {
    width: 20,
    height: 20,
    borderColor: Colors.light.background,
    position: 'absolute',
  },
  scanText: {
    color: Colors.light.background,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cameraButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary[500],
  },
});