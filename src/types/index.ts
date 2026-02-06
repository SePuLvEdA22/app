// User Roles
export type UserRole = 'coordinator' | 'doctor' | 'nurse';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

// Service Types
export type ServiceType = 'basic-transport' | 'medicalized-transport' | 'home-consultation';

export type ServiceStatus = 'requested' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';

// Service Interface
export interface Service {
  id: string;
  type: ServiceType;
  status: ServiceStatus;
  patientName: string;
  patientPhone: string;
  patientAddress: string;
  requestedDate: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  coordinatorId: string;
  doctorId?: string;
  nurseId?: string;
  notes: string;
  vitalSigns?: VitalSigns[];
  medicalReport?: MedicalReport;
  createdAt: Date;
  updatedAt: Date;
}

// Vital Signs
export interface VitalSigns {
  id: string;
  serviceId: string;
  recordedBy: string; // User ID
  recordedAt: Date;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  bloodSugar?: number;
  notes?: string;
}

// Medical Report
export interface MedicalReport {
  id: string;
  serviceId: string;
  doctorId: string;
  patientCondition: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  recommendations?: string;
  createdAt: Date;
}

// Activity Log
export interface ActivityLog {
  id: string;
  serviceId: string;
  userId: string;
  action: string;
  description: string;
  timestamp: Date;
}

// Form Types
export interface ServiceFormData {
  type: ServiceType;
  patientName: string;
  patientPhone: string;
  patientAddress: string;
  scheduledDate?: Date;
  notes: string;
  doctorId?: string;
  nurseId?: string;
}

export interface VitalSignsFormData {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  bloodSugar?: number;
  notes?: string;
}

export interface MedicalReportFormData {
  patientCondition: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  recommendations?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalServices: number;
  requestedServices: number;
  assignedServices: number;
  inProgressServices: number;
  completedServices: number;
  cancelledServices: number;
}

// Navigation Items
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  screen: string;
  roles?: UserRole[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}