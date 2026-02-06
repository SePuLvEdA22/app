import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Service, ServiceStatus, ServiceType, DashboardStats } from '../types';
import { generateId } from '../utils/constants';

interface ServiceState {
  services: Service[];
  isLoading: boolean;
  error: string | null;
}

interface ServiceContextType extends ServiceState {
  createService: (serviceData: any) => Promise<void>;
  updateService: (id: string, updates: Partial<Service>) => Promise<void>;
  assignService: (id: string, doctorId?: string, nurseId?: string) => Promise<void>;
  updateServiceStatus: (id: string, status: ServiceStatus) => Promise<void>;
  addVitalSigns: (serviceId: string, vitalSigns: any) => Promise<void>;
  addMedicalReport: (serviceId: string, report: any) => Promise<void>;
  getDashboardStats: () => DashboardStats;
  clearError: () => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

type ServiceAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: { id: string; updates: Partial<Service> } }
  | { type: 'CLEAR_ERROR' };

const serviceReducer = (state: ServiceState, action: ServiceAction): ServiceState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SERVICES':
      return { ...state, services: action.payload };
    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] };
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload.id
            ? { ...service, ...action.payload.updates, updatedAt: new Date() }
            : service
        ),
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState: ServiceState = {
  services: [],
  isLoading: false,
  error: null,
};

const generateMockServices = (): Service[] => {
  return [
    {
      id: generateId(),
      type: 'basic-transport',
      status: 'requested',
      patientName: 'Juan Pérez',
      patientPhone: '+34 600 123 456',
      patientAddress: 'Calle Mayor 123, Madrid',
      requestedDate: new Date(),
      coordinatorId: '1',
      notes: 'Patient needs wheelchair assistance',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: generateId(),
      type: 'medicalized-transport',
      status: 'assigned',
      patientName: 'María García',
      patientPhone: '+34 600 789 012',
      patientAddress: 'Avenida del Sol 45, Barcelona',
      requestedDate: new Date(),
      scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
      coordinatorId: '1',
      doctorId: '2',
      notes: 'Post-surgery transport required',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: generateId(),
      type: 'home-consultation',
      status: 'in-progress',
      patientName: 'Carlos López',
      patientPhone: '+34 600 345 678',
      patientAddress: 'Plaza Nueva 78, Valencia',
      requestedDate: new Date(),
      scheduledDate: new Date(Date.now() - 30 * 60 * 1000),
      coordinatorId: '1',
      doctorId: '2',
      nurseId: '3',
      notes: 'Regular checkup for chronic condition',
      vitalSigns: [
        {
          id: generateId(),
          serviceId: generateId(),
          recordedBy: '3',
          recordedAt: new Date(),
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: 72,
          temperature: 36.5,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(serviceReducer, initialState);

  useEffect(() => {
    // Initialize with mock data
    const mockServices = generateMockServices();
    dispatch({ type: 'SET_SERVICES', payload: mockServices });
  }, []);

  const createService = async (serviceData: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newService: Service = {
        id: generateId(),
        type: serviceData.type,
        status: 'requested',
        patientName: serviceData.patientName,
        patientPhone: serviceData.patientPhone,
        patientAddress: serviceData.patientAddress,
        requestedDate: new Date(),
        scheduledDate: serviceData.scheduledDate || undefined,
        coordinatorId: serviceData.coordinatorId,
        doctorId: serviceData.doctorId,
        nurseId: serviceData.nurseId,
        notes: serviceData.notes,
        vitalSigns: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: 'ADD_SERVICE', payload: newService });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create service' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'UPDATE_SERVICE', payload: { id, updates } });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update service' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const assignService = async (id: string, doctorId?: string, nurseId?: string) => {
    await updateService(id, { 
      doctorId, 
      nurseId, 
      status: doctorId || nurseId ? 'assigned' : 'requested' 
    });
  };

  const updateServiceStatus = async (id: string, status: ServiceStatus) => {
    const updates: Partial<Service> = { status };
    if (status === 'completed') {
      updates.completedDate = new Date();
    }
    await updateService(id, updates);
  };

  const addVitalSigns = async (serviceId: string, vitalSignsData: any) => {
    const newVitalSigns = {
      id: generateId(),
      serviceId,
      recordedBy: vitalSignsData.recordedBy,
      recordedAt: new Date(),
      ...vitalSignsData,
    };

    await updateService(serviceId, {
      vitalSigns: [...(state.services.find(s => s.id === serviceId)?.vitalSigns || []), newVitalSigns],
    });
  };

  const addMedicalReport = async (serviceId: string, reportData: any) => {
    const newReport = {
      id: generateId(),
      serviceId,
      doctorId: reportData.doctorId,
      ...reportData,
      createdAt: new Date(),
    };

    await updateService(serviceId, { medicalReport: newReport });
  };

  const getDashboardStats = (): DashboardStats => {
    const services = state.services;
    return {
      totalServices: services.length,
      requestedServices: services.filter(s => s.status === 'requested').length,
      assignedServices: services.filter(s => s.status === 'assigned').length,
      inProgressServices: services.filter(s => s.status === 'in-progress').length,
      completedServices: services.filter(s => s.status === 'completed').length,
      cancelledServices: services.filter(s => s.status === 'cancelled').length,
    };
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: ServiceContextType = {
    ...state,
    createService,
    updateService,
    assignService,
    updateServiceStatus,
    addVitalSigns,
    addMedicalReport,
    getDashboardStats,
    clearError,
  };

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};

export const useServices = (): ServiceContextType => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};