import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { MotorcycleModel, MotorcycleStatus } from '@/types/motorcycle';
import { Mic, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';

interface RegistrationFormProps {
  licensePlate: string;
  initialObservations?: string;
  onSubmit: (data: {
    model: MotorcycleModel;
    status: MotorcycleStatus;
    observations: string;
    critical: boolean;
  }) => void;
  onCancel: () => void;
  isRecording?: boolean;
  onToggleRecording?: () => void;
}

const models: MotorcycleModel[] = ['Scooter', 'Street', 'Sport', 'Touring', 'Off-road'];
const statuses: MotorcycleStatus[] = ['available', 'unavailable', 'maintenance', 'reserved', 'transit'];

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  licensePlate,
  initialObservations = '',
  onSubmit,
  onCancel,
  isRecording = false,
  onToggleRecording,
}) => {
  const [model, setModel] = useState<MotorcycleModel>('Scooter');
  const [status, setStatus] = useState<MotorcycleStatus>('available');
  const [observations, setObservations] = useState(initialObservations);
  const [critical, setCritical] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      model,
      status,
      observations,
      critical,
    });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>Register Motorcycle</Text>
        <Text style={styles.licensePlate}>{licensePlate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Model</Text>
        <View style={styles.optionsGrid}>
          {models.map((modelOption) => (
            <TouchableOpacity
              key={modelOption}
              style={[
                styles.optionButton,
                model === modelOption && styles.selectedOption,
              ]}
              onPress={() => setModel(modelOption)}
            >
              <Text
                style={[
                  styles.optionText,
                  model === modelOption && styles.selectedOptionText,
                ]}
              >
                {modelOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.optionsGrid}>
          {statuses.map((statusOption) => (
            <TouchableOpacity
              key={statusOption}
              style={[
                styles.optionButton,
                status === statusOption && {
                  ...styles.selectedOption,
                  borderColor: Colors.status[statusOption],
                  backgroundColor: `${Colors.status[statusOption]}20`,
                },
              ]}
              onPress={() => setStatus(statusOption)}
            >
              <StatusBadge status={statusOption} size="small" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.observationsHeader}>
          <Text style={styles.sectionTitle}>Observations</Text>
          {onToggleRecording && (
            <TouchableOpacity
              onPress={onToggleRecording}
              style={[
                styles.recordButton,
                isRecording && styles.recordingActive,
              ]}
            >
              <Mic
                size={18}
                color={isRecording ? Colors.light.background : Colors.neutral[600]}
              />
              <Text 
                style={[
                  styles.recordText,
                  isRecording && styles.recordingActiveText,
                ]}
              >
                {isRecording ? 'Recording...' : 'Record'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          style={styles.observationsInput}
          multiline
          placeholder="Enter any notes or observations about this motorcycle"
          placeholderTextColor={Colors.neutral[400]}
          value={observations}
          onChangeText={setObservations}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Mark as critical</Text>
        <Switch
          value={critical}
          onValueChange={setCritical}
          trackColor={{
            false: Colors.neutral[300],
            true: `${Colors.utility.error}80`,
          }}
          thumbColor={critical ? Colors.utility.error : Colors.neutral[50]}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={onCancel}
          type="outline"
          style={styles.cancelButton}
        />
        <Button
          title="Register"
          onPress={handleSubmit}
          type="primary"
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.neutral[800],
    marginBottom: 4,
  },
  licensePlate: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.primary[500],
    letterSpacing: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.neutral[700],
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    marginHorizontal: 4,
    marginBottom: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[100],
  },
  optionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.neutral[700],
  },
  selectedOptionText: {
    color: Colors.primary[700],
  },
  observationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.neutral[100],
  },
  recordingActive: {
    backgroundColor: Colors.utility.error,
  },
  recordText: {
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.neutral[600],
  },
  recordingActiveText: {
    color: Colors.light.background,
  },
  observationsInput: {
    height: 100,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.neutral[800],
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.neutral[700],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default RegistrationForm;