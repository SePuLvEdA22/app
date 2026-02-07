import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import StatusBadge from '../components/StatusBadge';
import { useServices } from '../contexts/ServiceContext';

const ReportsScreen: React.FC = () => {
  const { services, getDashboardStats } = useServices();
  const [selectedReportType, setSelectedReportType] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReportTypeModal, setShowReportTypeModal] = useState(false);
  
  const stats = getDashboardStats();
  
  const statCards = [
    {
      title: 'Total Servicios',
      value: stats.totalServices.toString(),
      icon: 'assignment',
      color: '#2563eb',
      bgColor: '#dbeafe',
    },
    {
      title: 'Tasa Completación',
      value: stats.totalServices > 0 ? 
        Math.round((stats.completedServices / stats.totalServices) * 100) + '%' : '0%',
      icon: 'trending-up',
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      title: 'Tiempo Respuesta',
      value: '2.5h',
      icon: 'schedule',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
    },
  ];

  const reportTypes = [
    'Reporte Mensual',
    'Reporte de Servicios',
    'Reporte de Rendimiento',
    'Reporte de Estado'
  ];

  const reports = [
    {
      id: '1',
      title: 'Reporte Mensual de Servicios',
      description: 'Resumen de todos los servicios del mes actual',
      date: '2024-01-01',
      type: 'Mensual',
    },
    {
      id: '2',
      title: 'Resumen de Estado de Servicios',
      description: 'Estado actual de todos los servicios activos',
      date: '2024-01-15',
      type: 'Estado',
    },
    {
      id: '3',
      title: 'Análisis de Rendimiento',
      description: 'Métricas detalladas de rendimiento y KPIs',
      date: '2024-01-10',
      type: 'Rendimiento',
    },
  ];

  const handleGenerateReport = async () => {
    if (!selectedReportType) {
      Alert.alert('Error', 'Por favor seleccione un tipo de reporte');
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Error', 'Por favor seleccione un rango de fechas');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Éxito',
        `Reporte "${selectedReportType}" generado exitosamente en formato ${selectedFormat}`,
        [{ text: 'OK' }]
      );
      
      // Resetear formulario
      setSelectedReportType('');
      setStartDate('');
      setEndDate('');
      setSelectedFormat('PDF');
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el reporte. Intente nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = (report: any) => {
    Alert.alert(
      'Descargar Reporte',
      `¿Desea descargar "${report.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Descargar', 
          onPress: () => {
            Alert.alert('Descargando', 'El reporte se está descargando...');
            // Simular descarga
            setTimeout(() => {
              Alert.alert('Completado', 'Reporte descargado exitosamente');
            }, 1500);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Reportes</Text>
        <Text style={styles.subtitle}>Generar y ver reportes de servicios</Text>
      </View>

      <View style={styles.statsContainer}>
        {statCards.map((stat, index) => (
          <View key={index} style={[styles.statCard, { backgroundColor: stat.bgColor }]}>
            <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
              <MaterialIcons name={stat.icon as any} size={24} color="#ffffff" />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reportes Disponibles</Text>
        <View style={styles.reportsList}>
          {reports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDescription}>{report.description}</Text>
                <Text style={styles.reportDate}>Generado: {report.date}</Text>
              </View>
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => handleDownloadReport(report)}
              >
                <MaterialIcons name="download" size={20} color="#2563eb" />
                <Text style={styles.downloadText}>Descargar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Generar Nuevo Reporte</Text>
        <View style={styles.generateCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Reporte</Text>
            <TouchableOpacity 
              style={styles.selectInput}
              onPress={() => setShowReportTypeModal(true)}
            >
              <Text style={styles.selectText}>
                {selectedReportType || 'Seleccionar tipo de reporte'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rango de Fechas</Text>
            <View style={styles.dateRange}>
              <TouchableOpacity 
                style={[styles.dateInput, { marginRight: 10 }]}
                onPress={() => Alert.alert('Info', 'Selector de fecha implementación próximamente')}
              >
                <Text style={styles.dateText}>
                  {startDate || 'Fecha inicio'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => Alert.alert('Info', 'Selector de fecha implementación próximamente')}
              >
                <Text style={styles.dateText}>
                  {endDate || 'Fecha fin'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Formato</Text>
            <View style={styles.formatOptions}>
              {['PDF', 'Excel', 'CSV'].map((format) => (
                <TouchableOpacity
                  key={format}
                  style={[
                    styles.formatOption,
                    selectedFormat === format && styles.formatOptionSelected
                  ]}
                  onPress={() => setSelectedFormat(format)}
                >
                  <Text style={[
                    styles.formatText,
                    selectedFormat === format && styles.formatTextSelected
                  ]}>
                    {format}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
            onPress={handleGenerateReport}
            disabled={isGenerating}
          >
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'Generando...' : 'Generar Reporte'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas Rápidas</Text>
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>89%</Text>
            <Text style={styles.quickStatLabel}>Completación a tiempo</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>4.8</Text>
            <Text style={styles.quickStatLabel}>Calificación Promedio</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>12</Text>
            <Text style={styles.quickStatLabel}>Personal Activo</Text>
          </View>
        </View>
      </View>

      <Modal
        visible={showReportTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReportTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Tipo de Reporte</Text>
            {reportTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedReportType(type);
                  setShowReportTypeModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>{type}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowReportTypeModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  reportsList: {
    gap: 12,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  downloadText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  generateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  selectInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 16,
    color: '#1f2937',
  },
  dateRange: {
    flexDirection: 'row',
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#6b7280',
  },
  formatOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  formatOption: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  formatOptionSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  formatText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  formatTextSelected: {
    color: '#ffffff',
  },
  generateButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    gap: 15,
  },
  quickStatItem: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
  },
  modalCancelButton: {
    padding: 12,
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ReportsScreen;