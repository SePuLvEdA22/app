import { UserRole, ServiceType, ServiceStatus } from '../types';

export const USER_ROLES: Record<UserRole, string> = {
  coordinator: 'Operations Coordinator',
  doctor: 'Doctor',
  nurse: 'Nurse Assistant',
};

export const SERVICE_TYPES: Record<ServiceType, string> = {
  'basic-transport': 'Basic Transport',
  'medicalized-transport': 'Medicalized Transport',
  'home-consultation': 'Home Medical Consultation',
};

export const SERVICE_STATUS: Record<ServiceStatus, string> = {
  requested: 'Requested',
  assigned: 'Assigned',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const SERVICE_STATUS_COLORS: Record<ServiceStatus, string> = {
  requested: '#f59e0b',
  assigned: '#3b82f6',
  'in-progress': '#8b5cf6',
  completed: '#10b981',
  cancelled: '#ef4444',
};

export const MOCK_USERS = [
  {
    id: '1',
    name: 'Ana Coordinator',
    email: 'ana@medical.com',
    role: 'coordinator' as UserRole,
    isActive: true,
  },
  {
    id: '2',
    name: 'Dr. Carlos García',
    email: 'carlos@medical.com',
    role: 'doctor' as UserRole,
    isActive: true,
  },
  {
    id: '3',
    name: 'María Nurse',
    email: 'maria@medical.com',
    role: 'nurse' as UserRole,
    isActive: true,
  },
];

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateShort = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[+]?[\d\s-()]+$/;
  return re.test(phone) && phone.length >= 8;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};