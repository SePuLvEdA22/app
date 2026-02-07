import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServiceContext';
import { MaterialIcons } from '@expo/vector-icons';
import { SERVICE_STATUS_COLORS } from '../utils/constants';
import StatusBadge from '../components/StatusBadge';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { services, getDashboardStats } = useServices();
  const navigation = useNavigation();
  const stats = getDashboardStats();

  const handleStatCardPress = (status: string) => {
    (navigation as any).navigate('Services', { statusFilter: status });
  };

  const recentServices = services.slice(0, 5);

  const statCards = [
    {
      title: 'Total Servicios',
      value: stats.totalServices,
      icon: 'assignment',
      color: '#2563eb',
      bgColor: '#dbeafe',
      status: 'all' as const,
    },
    {
      title: 'Solicitados',
      value: stats.requestedServices,
      icon: 'schedule',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      status: 'requested' as const,
    },
    {
      title: 'En Progreso',
      value: stats.inProgressServices,
      icon: 'loop',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      status: 'in-progress' as const,
    },
    {
      title: 'Completados',
      value: stats.completedServices,
      icon: 'check-circle',
      color: '#10b981',
      bgColor: '#d1fae5',
      status: 'completed' as const,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.name}!</Text>
        <Text style={styles.subtitle}>Here's an overview of your medical services.</Text>
      </View>

      <View style={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.statCard, { backgroundColor: stat.bgColor }]}
            onPress={() => handleStatCardPress(stat.status)}
            activeOpacity={0.7}
          >
            <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
              <MaterialIcons name={stat.icon as any} size={24} color="#ffffff" />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Services</Text>
        <View style={styles.servicesList}>
          {recentServices.length > 0 ? (
            recentServices.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.patientName}>{service.patientName}</Text>
                  <Text style={styles.serviceType}>
                    {service.type.replace('-', ' ')}
                  </Text>
                </View>
                <StatusBadge status={service.status} />
              </View>
            ))
          ) : (
            <Text style={styles.noServices}>No services found</Text>
          )}
        </View>
      </View>

      {user?.role === 'coordinator' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('CreateService' as never)}
            >
              <MaterialIcons name="add-circle" size={24} color="#2563eb" />
              <Text style={styles.actionText}>Crear Servicio</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Reports' as never)}
            >
              <MaterialIcons name="assessment" size={24} color="#2563eb" />
              <Text style={styles.actionText}>Ver Reportes</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  welcome: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 15,
  },
  statCard: {
    width: '45%',
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
    fontSize: 24,
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
  servicesList: {
    gap: 12,
  },
  serviceCard: {
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
  serviceInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: '#6b7280',
  },
  noServices: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    paddingVertical: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DashboardScreen;