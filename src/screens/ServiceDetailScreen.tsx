import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServiceContext';
import { Service, ServiceStatus } from '../types';
import { formatDate, SERVICE_TYPES } from '../utils/constants';
import { MaterialIcons } from '@expo/vector-icons';
import StatusBadge from '../components/StatusBadge';

type ServiceDetailRouteProp = RouteProp<{ params: { serviceId: string } }, 'params'>;

const ServiceDetailScreen: React.FC = () => {
  const route = useRoute<ServiceDetailRouteProp>();
  const { serviceId } = route.params;
  const { user } = useAuth();
  const { services, updateServiceStatus, addVitalSigns, addMedicalReport, isLoading } = useServices();
  
  const [service, setService] = useState<Service | null>(null);
  const [showVitalSignsModal, setShowVitalSignsModal] = useState(false);
  const [showMedicalReportModal, setShowMedicalReportModal] = useState(false);
  const [vitalSignsData, setVitalSignsData] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    oxygenSaturation: '',
    bloodSugar: '',
    notes: '',
  });
  const [medicalReportData, setMedicalReportData] = useState({
    patientCondition: '',
    diagnosis: '',
    treatment: '',
    recommendations: '',
  });

  useState(() => {
    const foundService = services.find(s => s.id === serviceId);
    setService(foundService || null);
  }, [services, serviceId]);

  const handleStatusChange = async (newStatus: ServiceStatus) => {
    try {
      await updateServiceStatus(serviceId, newStatus);
      Alert.alert('Success', 'Service status updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update service status');
    }
  };

  const handleAddVitalSigns = async () => {
    if (!vitalSignsData.heartRate && !vitalSignsData.temperature) {
      Alert.alert('Error', 'Please enter at least one vital sign');
      return;
    }

    try {
      const vitalSigns = {
        bloodPressure: vitalSignsData.bloodPressureSystolic && vitalSignsData.bloodPressureDiastolic
          ? {
              systolic: parseInt(vitalSignsData.bloodPressureSystolic),
              diastolic: parseInt(vitalSignsData.bloodPressureDiastolic),
            }
          : undefined,
        heartRate: vitalSignsData.heartRate ? parseInt(vitalSignsData.heartRate) : undefined,
        temperature: vitalSignsData.temperature ? parseFloat(vitalSignsData.temperature) : undefined,
        oxygenSaturation: vitalSignsData.oxygenSaturation ? parseInt(vitalSignsData.oxygenSaturation) : undefined,
        bloodSugar: vitalSignsData.bloodSugar ? parseInt(vitalSignsData.bloodSugar) : undefined,
        notes: vitalSignsData.notes || undefined,
        recordedBy: user?.id,
      };

      await addVitalSigns(serviceId, vitalSigns);
      setShowVitalSignsModal(false);
      setVitalSignsData({
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        heartRate: '',
        temperature: '',
        oxygenSaturation: '',
        bloodSugar: '',
        notes: '',
      });
      Alert.alert('Success', 'Vital signs added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add vital signs');
    }
  };

  const handleAddMedicalReport = async () => {
    if (!medicalReportData.patientCondition) {
      Alert.alert('Error', 'Patient condition is required');
      return;
    }

    try {
      const report = {
        ...medicalReportData,
        doctorId: user?.id,
      };

      await addMedicalReport(serviceId, report);
      setShowMedicalReportModal(false);
      setMedicalReportData({
        patientCondition: '',
        diagnosis: '',
        treatment: '',
        recommendations: '',
      });
      Alert.alert('Success', 'Medical report added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add medical report');
    }
  };

  const canUpdateStatus = user?.role === 'coordinator' || 
    (user?.role === 'doctor' && service?.doctorId === user.id) ||
    (user?.role === 'nurse' && service?.nurseId === user.id);

  if (!service) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading service details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.serviceInfo}>
            <Text style={styles.patientName}>{service.patientName}</Text>
            <Text style={styles.serviceId}>Service ID: {service.id}</Text>
          </View>
          <StatusBadge status={service.status} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.infoCard}>
          <InfoRow icon="phone" label="Phone" value={service.patientPhone} />
          <InfoRow icon="location-on" label="Address" value={service.patientAddress} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Information</Text>
        <View style={styles.infoCard}>
          <InfoRow icon="category" label="Type" value={SERVICE_TYPES[service.type]} />
          <InfoRow icon="schedule" label="Requested" value={formatDate(service.requestedDate)} />
          {service.scheduledDate && (
            <InfoRow icon="event" label="Scheduled" value={formatDate(service.scheduledDate)} />
          )}
          {service.completedDate && (
            <InfoRow icon="check-circle" label="Completed" value={formatDate(service.completedDate)} />
          )}
          {service.notes && <InfoRow icon="note" label="Notes" value={service.notes} />}
        </View>
      </View>

      {service.vitalSigns && service.vitalSigns.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vital Signs</Text>
          <View style={styles.vitalSignsList}>
            {service.vitalSigns.map((vital, index) => (
              <View key={vital.id} style={styles.vitalSignCard}>
                <Text style={styles.vitalSignDate}>
                  {formatDate(vital.recordedAt)}
                </Text>
                <View style={styles.vitalSignGrid}>
                  {vital.bloodPressure && (
                    <View style={styles.vitalSignItem}>
                      <Text style={styles.vitalSignLabel}>Blood Pressure</Text>
                      <Text style={styles.vitalSignValue}>
                        {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic} mmHg
                      </Text>
                    </View>
                  )}
                  {vital.heartRate && (
                    <View style={styles.vitalSignItem}>
                      <Text style={styles.vitalSignLabel}>Heart Rate</Text>
                      <Text style={styles.vitalSignValue}>{vital.heartRate} bpm</Text>
                    </View>
                  )}
                  {vital.temperature && (
                    <View style={styles.vitalSignItem}>
                      <Text style={styles.vitalSignLabel}>Temperature</Text>
                      <Text style={styles.vitalSignValue}>{vital.temperature}°C</Text>
                    </View>
                  )}
                  {vital.oxygenSaturation && (
                    <View style={styles.vitalSignItem}>
                      <Text style={styles.vitalSignLabel}>O2 Saturation</Text>
                      <Text style={styles.vitalSignValue}>{vital.oxygenSaturation}%</Text>
                    </View>
                  )}
                </View>
                {vital.notes && (
                  <Text style={styles.vitalSignNotes}>Notes: {vital.notes}</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {service.medicalReport && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Report</Text>
          <View style={styles.reportCard}>
            <InfoRow icon="healing" label="Patient Condition" value={service.medicalReport.patientCondition} />
            {service.medicalReport.diagnosis && (
              <InfoRow icon="search" label="Diagnosis" value={service.medicalReport.diagnosis} />
            )}
            {service.medicalReport.treatment && (
              <InfoRow icon="medical-services" label="Treatment" value={service.medicalReport.treatment} />
            )}
            {service.medicalReport.recommendations && (
              <InfoRow icon="lightbulb" label="Recommendations" value={service.medicalReport.recommendations} />
            )}
            <InfoRow icon="today" label="Report Date" value={formatDate(service.medicalReport.createdAt)} />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsGrid}>
          {canUpdateStatus && service.status !== 'completed' && service.status !== 'cancelled' && (
            <>
              {service.status === 'requested' && (
                <ActionButton
                  icon="assignment-turned-in"
                  label="Mark as Assigned"
                  color="#2563eb"
                  onPress={() => handleStatusChange('assigned')}
                />
              )}
              {service.status === 'assigned' && (
                <ActionButton
                  icon="play-arrow"
                  label="Start Service"
                  color="#10b981"
                  onPress={() => handleStatusChange('in-progress')}
                />
              )}
              {service.status === 'in-progress' && (
                <ActionButton
                  icon="check-circle"
                  label="Complete Service"
                  color="#10b981"
                  onPress={() => handleStatusChange('completed')}
                />
              )}
              <ActionButton
                icon="cancel"
                label="Cancel Service"
                color="#ef4444"
                onPress={() => handleStatusChange('cancelled')}
              />
            </>
          )}
          
          {(user?.role === 'doctor' || user?.role === 'nurse') && (
            <ActionButton
              icon="favorite"
              label="Add Vital Signs"
              color="#8b5cf6"
              onPress={() => setShowVitalSignsModal(true)}
            />
          )}
          
          {user?.role === 'doctor' && !service.medicalReport && (
            <ActionButton
              icon="description"
              label="Medical Report"
              color="#2563eb"
              onPress={() => setShowMedicalReportModal(true)}
            />
          )}
        </View>
      </View>

      {/* Vital Signs Modal */}
      <Modal
        visible={showVitalSignsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Vital Signs</Text>
            <TouchableOpacity onPress={() => setShowVitalSignsModal(false)}>
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Blood Pressure</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 10 }]}
                  placeholder="Systolic"
                  value={vitalSignsData.bloodPressureSystolic}
                  onChangeText={(text) => setVitalSignsData({ ...vitalSignsData, bloodPressureSystolic: text })}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Diastolic"
                  value={vitalSignsData.bloodPressureDiastolic}
                  onChangeText={(text) => setVitalSignsData({ ...vitalSignsData, bloodPressureDiastolic: text })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Heart Rate (bpm)</Text>
              <TextInput
                style={styles.input}
                placeholder="72"
                value={vitalSignsData.heartRate}
                onChangeText={(text) => setVitalSignsData({ ...vitalSignsData, heartRate: text })}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Temperature (°C)</Text>
              <TextInput
                style={styles.input}
                placeholder="36.5"
                value={vitalSignsData.temperature}
                onChangeText={(text) => setVitalSignsData({ ...vitalSignsData, temperature: text })}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>O2 Saturation (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="98"
                value={vitalSignsData.oxygenSaturation}
                onChangeText={(text) => setVitalSignsData({ ...vitalSignsData, oxygenSaturation: text })}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Blood Sugar (mg/dL)</Text>
              <TextInput
                style={styles.input}
                placeholder="100"
                value={vitalSignsData.bloodSugar}
                onChangeText={(text) => setVitalSignsData({ ...vitalSignsData, bloodSugar: text })}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Additional notes..."
                value={vitalSignsData.notes}
                onChangeText={(text) => setVitalSignsData({ ...vitalSignsData, notes: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={handleAddVitalSigns}>
              <Text style={styles.modalButtonText}>Save Vital Signs</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Medical Report Modal */}
      <Modal
        visible={showMedicalReportModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Medical Report</Text>
            <TouchableOpacity onPress={() => setShowMedicalReportModal(false)}>
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Patient Condition *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the patient's condition..."
                value={medicalReportData.patientCondition}
                onChangeText={(text) => setMedicalReportData({ ...medicalReportData, patientCondition: text })}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Diagnosis</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter diagnosis..."
                value={medicalReportData.diagnosis}
                onChangeText={(text) => setMedicalReportData({ ...medicalReportData, diagnosis: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Treatment</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe treatment plan..."
                value={medicalReportData.treatment}
                onChangeText={(text) => setMedicalReportData({ ...medicalReportData, treatment: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Recommendations</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Provide recommendations..."
                value={medicalReportData.recommendations}
                onChangeText={(text) => setMedicalReportData({ ...medicalReportData, recommendations: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={handleAddMedicalReport}>
              <Text style={styles.modalButtonText}>Save Report</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
};

const InfoRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <MaterialIcons name={icon as any} size={16} color="#6b7280" />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const ActionButton: React.FC<{ icon: string; label: string; color: string; onPress: () => void }> = 
  ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={[styles.actionButton, { backgroundColor: color }]} onPress={onPress}>
    <MaterialIcons name={icon as any} size={20} color="#ffffff" />
    <Text style={styles.actionButtonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  serviceId: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
  },
  vitalSignsList: {
    gap: 12,
  },
  vitalSignCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  vitalSignDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  vitalSignGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  vitalSignItem: {
    width: '45%',
  },
  vitalSignLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  vitalSignValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  vitalSignNotes: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalContent: {
    padding: 20,
    gap: 20,
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
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  modalButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServiceDetailScreen;