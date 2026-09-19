import { Reminder } from '../types';
import { apiFetch, isMockMode } from './client';
import { MockReminders } from '../mock/storage';

export interface CreateReminderInput {
  patient_id: string;
  title: string;
  description?: string;
  reminder_date: string;
  reminder_time: string;
}

export const remindersApi = {
  getReminders: async (patientId?: string): Promise<Reminder[]> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 250));
      return patientId ? MockReminders.getByPatientId(patientId) : MockReminders.getAll();
    }
    const query = patientId ? `?patient_id=${patientId}` : '';
    return apiFetch<Reminder[]>(`/reminders${query}`);
  },

  createReminder: async (input: CreateReminderInput): Promise<Reminder> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      return MockReminders.create({
        ...input,
        status: 'PENDING',
      });
    }
    return apiFetch<Reminder>('/reminders', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  updateReminder: async (id: string, updates: Partial<Reminder>): Promise<Reminder> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 250));
      const updated = MockReminders.update(id, updates);
      if (!updated) throw new Error('Reminder not found');
      return updated;
    }
    return apiFetch<Reminder>(`/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  toggleStatus: async (id: string, currentStatus: 'PENDING' | 'COMPLETED'): Promise<Reminder> => {
    const nextStatus = currentStatus === 'PENDING' ? 'COMPLETED' : 'PENDING';
    return remindersApi.updateReminder(id, { status: nextStatus });
  },

  deleteReminder: async (id: string): Promise<void> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 250));
      const success = MockReminders.delete(id);
      if (!success) throw new Error('Reminder not found');
      return;
    }
    await apiFetch(`/reminders/${id}`, { method: 'DELETE' });
  },
};
