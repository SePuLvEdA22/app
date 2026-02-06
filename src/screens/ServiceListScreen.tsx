import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useServices } from '../contexts/ServiceContext';
import { ServiceStatus, ServiceType } from '../types';
import { SERVICE_TYPES, formatDate } from '../utils/constants';
import { MaterialIcons } from '@expo/vector-icons';
import StatusBadge from '../components/StatusBadge';

const ServiceListScreen: React.FC = () => {
  const { user } = useAuth();
  const { services, isLoading } = useServices();
  const [filteredServices, setFilteredServices] = useState(services);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ServiceType | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let filtered = services;

    if (user?.role !== 'coordinator') {
      filtered = filtered.filter(service => 
        service.doctorId === user?.id || service.nurseId === user?.id
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.patientAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(service => service.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(service => service.type === typeFilter);
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, statusFilter, typeFilter, user]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <Text style={styles.subtitle}>
          Manage and track medical home services
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#6b7280"
          />
        </View>

        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[styles.filterButton, statusFilter !== 'all' && styles.filterButtonActive]}
            onPress={() => setStatusFilter(statusFilter === 'all' ? 'requested' : 'all')}
          >
            <Text style={[styles.filterText, statusFilter !== 'all' && styles.filterTextActive]}>
              Status
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, typeFilter !== 'all' && styles.filterButtonActive]}
            onPress={() => setTypeFilter(typeFilter === 'all' ? 'basic-transport' : 'all')}
          >
            <Text style={[styles.filterText, typeFilter !== 'all' && styles.filterTextActive]}>
              Type
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.servicesList}>
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.patientName}>{service.patientName}</Text>
                  <Text style={styles.serviceType}>
                    {SERVICE_TYPES[service.type]}
                  </Text>
                </View>
                <StatusBadge status={service.status} />
              </View>
              
              <View style={styles.serviceDetails}>
                <View style={styles.detailRow}>
                  <MaterialIcons name="schedule" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>
                    {formatDate(service.requestedDate)}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <MaterialIcons name="location-on" size={16} color="#6b7280" />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {service.patientAddress}
                  </Text>
                </View>
                
                {service.notes && (
                  <View style={styles.detailRow}>
                    <MaterialIcons name="note" size={16} color="#6b7280" />
                    <Text style={styles.detailText} numberOfLines={2}>
                      {service.notes}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="assignment" size={60} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptyMessage}>
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Get started by creating your first service'}
            </Text>
          </View>
        )}
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
  searchSection: {
    padding: 20,
    paddingTop: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  servicesList: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  serviceDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default ServiceListScreen;