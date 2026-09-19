import { Appointment } from '../types';
import { apiFetch, isMockMode } from './client';
import { MockAppointments } from '../mock/storage';

export interface CreateAppointmentInput {
  patient_id: string;
  patient_name?: string;
  provider_name: string;
  clinic_name: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  purpose?: string;
  notes?: string;
}

export const appointmentsApi = {
  getAppointments: async (patientId?: string): Promise<Appointment[]> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      return patientId ? MockAppointments.getByPatientId(patientId) : MockAppointments.getAll();
    }
    const query = patientId ? `?patient_id=${patientId}` : '';
    return apiFetch<Appointment[]>(`/appointments${query}`);
  },

  getAppointmentById: async (id: string): Promise<Appointment> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 200));
      const apt = MockAppointments.getById(id);
      if (!apt) throw new Error('Appointment not found');
      return apt;
    }
    return apiFetch<Appointment>(`/appointments/${id}`);
  },

  createAppointment: async (input: CreateAppointmentInput): Promise<Appointment> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 400));
      return MockAppointments.create({
        ...input,
        status: 'UPCOMING',
      });
    }
    return apiFetch<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  updateAppointment: async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      const updated = MockAppointments.update(id, updates);
      if (!updated) throw new Error('Appointment not found');
      return updated;
    }
    return apiFetch<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteAppointment: async (id: string): Promise<void> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      const success = MockAppointments.delete(id);
      if (!success) throw new Error('Appointment not found');
      return;
    }
    await apiFetch(`/appointments/${id}`, { method: 'DELETE' });
  },
};
