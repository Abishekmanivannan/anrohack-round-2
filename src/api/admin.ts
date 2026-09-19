import { User, Appointment, AdminStats, AppointmentStatus } from '../types';
import { apiFetch, isMockMode } from './client';
import { MockAuth, MockAppointments, MockDocuments, MockReminders } from '../mock/storage';

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      const users = MockAuth.getUsers();
      const appointments = MockAppointments.getAll();
      const documents = MockDocuments.getAll();
      const reminders = MockReminders.getAll();

      const patients = users.filter(u => u.role === 'PATIENT');
      const upcoming = appointments.filter(a => a.status === 'UPCOMING');
      const completed = appointments.filter(a => a.status === 'COMPLETED');
      const cancelled = appointments.filter(a => a.status === 'CANCELLED');

      return {
        patientCount: patients.length,
        appointmentCount: appointments.length,
        upcomingCount: upcoming.length,
        completedCount: completed.length,
        cancelledCount: cancelled.length,
        documentCount: documents.length,
        reminderCount: reminders.length,
      };
    }
    return apiFetch<AdminStats>('/admin/stats');
  },

  getAllPatients: async (): Promise<User[]> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      return MockAuth.getUsers().filter(u => u.role === 'PATIENT');
    }
    return apiFetch<User[]>('/admin/users?role=PATIENT');
  },

  getAllAppointments: async (): Promise<Appointment[]> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      return MockAppointments.getAll();
    }
    return apiFetch<Appointment[]>('/admin/appointments');
  },

  updateAppointmentStatus: async (appointmentId: string, status: AppointmentStatus): Promise<Appointment> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      const updated = MockAppointments.update(appointmentId, { status });
      if (!updated) throw new Error('Appointment not found');
      return updated;
    }
    return apiFetch<Appointment>(`/admin/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};
