export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Doctor {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  department: string;
  specialization: string;
  qualification?: string;
  yearsOfExperience: number;
  salary: number;
}

export interface Patient {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  gender: string;
  medicalHistory?: string;
}

export interface Appointment {
  id?: number;
  patient: Patient;
  doctor: Doctor;
  appointmentDate: string;
  timeSlot?: string;
  status: AppointmentStatus;
  reason?: string;
}

export interface AppointmentRequest {
  doctorId: number;
  patientId: number;
  appointmentDate: string;
  timeSlot?: string;
  status: AppointmentStatus;
  reason?: string;
}

export interface ApiError {
  message?: string;
  fieldErrors?: Record<string, string>;
}
