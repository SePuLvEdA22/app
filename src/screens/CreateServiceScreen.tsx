import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServiceContext';
import { ServiceType } from '../types';
import { SERVICE_TYPES } from '../utils/constants';
import { MaterialIcons } from '@expo/vector-icons';

const CreateServiceScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { user } = useAuth();
  const { createService, isLoading } = useServices();
  
  const [formData, setFormData] = useState({
    type: 'basic-transport' as ServiceType,
    patientName: '',
    patientPhone: '',
    patientAddress: '',
    scheduledDate: '',
    notes: '',
    doctorId: '',
    nurseId: '',
  });

  const [showDoctorSelect, setShowDoctorSelect] = useState(false);
  const [showNurseSelect, setShowNurseSelect] = useState(false);

  const handleCreateService = async () => {
    if (!formData.patientName || !formData.patientPhone || !formData.patientAddress) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const serviceData = {
      ...formData,
      coordinatorId: user?.id,
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
      doctorId: formData.doctorId || undefined,
      nurseId: formData.nurseId || undefined,
    };

    await createService(serviceData);
    if (!isLoading) {
      navigation.navigate('Services');
    }
  };

  const requiresMedicalStaff = formData.type === 'medicalized-transport' || formData.type === 'home-consultation';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Service Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Type *</Text>
            <View style={styles.typeSelector}>
              {Object.entries(SERVICE_TYPES).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.typeOption,
                    formData.type === key && styles.typeOptionSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, type: key as ServiceType })}
                >
                  <Text
                    style={[
                      styles.typeText,
                      formData.type === key && styles.typeTextSelected,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Patient Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.patientName}
              onChangeText={(text) => setFormData({ ...formData, patientName: text })}
              placeholder="Enter patient name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Patient Phone *</Text>
            <TextInput
              style={styles.input}
              value={formData.patientPhone}
              onChangeText={(text) => setFormData({ ...formData, patientPhone: text })}
              placeholder="+34 600 123 456"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Patient Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.patientAddress}
              onChangeText={(text) => setFormData({ ...formData, patientAddress: text })}
              placeholder="Enter patient address"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Scheduled Date (Optional)</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => {/* Add date picker here */}}
            >
              <Text style={formData.scheduledDate ? styles.inputText : styles.placeholderText}>
                {formData.scheduledDate || 'Select date and time'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Enter any additional notes or special requirements..."
              multiline
              numberOfLines={4}
            />
          </View>

          {requiresMedicalStaff && (
            <View style={styles.inputGroup}>
              <Text style={styles.sectionTitle}>Medical Staff Assignment</Text>
              
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowDoctorSelect(!showDoctorSelect)}
              >
                <Text style={formData.doctorId ? styles.inputText : styles.placeholderText}>
                  {formData.doctorId ? 'Dr. Carlos García' : 'Select a doctor'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowNurseSelect(!showNurseSelect)}
              >
                <Text style={formData.nurseId ? styles.inputText : styles.placeholderText}>
                  {formData.nurseId ? 'María Nurse' : 'Select a nurse'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleCreateService}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating...' : 'Create Service'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
  },
  form: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  placeholderText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  typeOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  typeOptionSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  typeText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  typeTextSelected: {
    color: '#ffffff',
  },
  selectInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#2563eb',
  },
});

export default CreateServiceScreen;