import { ApiError, Appointment, AppointmentRequest, Doctor, Patient } from './types';

const baseUrl = '/api';

const getErrorMessage = async (response: Response): Promise<string> => {
  const fallback = `${response.status} ${response.statusText}`.trim();

  try {
    const payload = (await response.json()) as ApiError;
    const fieldErrors = payload.fieldErrors ? Object.values(payload.fieldErrors) : [];
    return fieldErrors.length > 0 ? fieldErrors.join(', ') : payload.message || fallback;
  } catch {
    const text = await response.text();
    return text || fallback;
  }
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

const request = <T>(path: string, options?: RequestInit) =>
  fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options
  }).then(handleResponse<T>);

export const getAllDoctors = () => request<Doctor[]>('/doctors');
export const getAllPatients = () => request<Patient[]>('/patients');
export const getAllAppointments = () => request<Appointment[]>('/appointments');

export const createDoctor = (doctor: Doctor) =>
  request<Doctor>('/doctors', { method: 'POST', body: JSON.stringify(doctor) });

export const updateDoctor = (id: number, doctor: Doctor) =>
  request<Doctor>(`/doctors/${id}`, { method: 'PUT', body: JSON.stringify(doctor) });

export const deleteDoctor = (id: number) =>
  request<string>(`/doctors/${id}`, { method: 'DELETE' });

export const createPatient = (patient: Patient) =>
  request<Patient>('/patients', { method: 'POST', body: JSON.stringify(patient) });

export const updatePatient = (id: number, patient: Patient) =>
  request<Patient>(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(patient) });

export const deletePatient = (id: number) =>
  request<string>(`/patients/${id}`, { method: 'DELETE' });

export const createAppointment = (appointment: AppointmentRequest) =>
  request<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(appointment) });

export const updateAppointment = (id: number, appointment: AppointmentRequest) =>
  request<Appointment>(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(appointment) });

export const deleteAppointment = (id: number) =>
  request<string>(`/appointments/${id}`, { method: 'DELETE' });
