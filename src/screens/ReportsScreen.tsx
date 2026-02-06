import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import StatusBadge from '../components/StatusBadge';

const ReportsScreen: React.FC = () => {
  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Services',
      value: '156',
      icon: 'assignment',
      color: '#2563eb',
      bgColor: '#dbeafe',
    },
    {
      title: 'Completion Rate',
      value: '94%',
      icon: 'trending-up',
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      title: 'Avg Response Time',
      value: '2.5h',
      icon: 'schedule',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
    },
  ];

  const reports = [
    {
      id: '1',
      title: 'Monthly Service Report',
      description: 'Overview of all services in the current month',
      date: '2024-01-01',
      type: 'Monthly',
    },
    {
      id: '2',
      title: 'Service Status Summary',
      description: 'Current status of all active services',
      date: '2024-01-15',
      type: 'Status',
    },
    {
      id: '3',
      title: 'Performance Analysis',
      description: 'Detailed performance metrics and KPIs',
      date: '2024-01-10',
      type: 'Performance',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <Text style={styles.subtitle}>Generate and view service reports</Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
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
        <Text style={styles.sectionTitle}>Available Reports</Text>
        <View style={styles.reportsList}>
          {reports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDescription}>{report.description}</Text>
                <Text style={styles.reportDate}>Generated: {report.date}</Text>
              </View>
              <TouchableOpacity style={styles.downloadButton}>
                <MaterialIcons name="download" size={20} color="#2563eb" />
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Generate New Report</Text>
        <View style={styles.generateCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Report Type</Text>
            <TouchableOpacity style={styles.selectInput}>
              <Text style={styles.selectText}>Select report type</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date Range</Text>
            <View style={styles.dateRange}>
              <TouchableOpacity style={[styles.dateInput, { marginRight: 10 }]}>
                <Text style={styles.dateText}>Start date</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateInput}>
                <Text style={styles.dateText}>End date</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Format</Text>
            <View style={styles.formatOptions}>
              {['PDF', 'Excel', 'CSV'].map((format) => (
                <TouchableOpacity
                  key={format}
                  style={styles.formatOption}
                >
                  <Text style={styles.formatText}>{format}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.generateButton}>
            <Text style={styles.generateButtonText}>Generate Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>89%</Text>
            <Text style={styles.quickStatLabel}>On-time Completion</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>4.8</Text>
            <Text style={styles.quickStatLabel}>Avg Rating</Text>
          </View>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatValue}>12</Text>
            <Text style={styles.quickStatLabel}>Active Staff</Text>
          </View>
        </View>
      </View>
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
  formatText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  generateButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
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
});

export default ReportsScreen;