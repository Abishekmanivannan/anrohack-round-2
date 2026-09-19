import { CaregiverAccess, CaregiverPermission } from '../types';
import { apiFetch, isMockMode } from './client';
import { MockCaregivers } from '../mock/storage';

export interface AddCaregiverInput {
  patient_id: string;
  patient_name?: string;
  caregiver_email: string;
  caregiver_name?: string;
  permissions: CaregiverPermission[];
}

export const caregiversApi = {
  getCaregivers: async (patientId?: string): Promise<CaregiverAccess[]> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 250));
      return patientId ? MockCaregivers.getByPatientId(patientId) : MockCaregivers.getAll();
    }
    const query = patientId ? `?patient_id=${patientId}` : '';
    return apiFetch<CaregiverAccess[]>(`/caregivers${query}`);
  },

  getConnectedPatients: async (caregiverId: string): Promise<CaregiverAccess[]> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 250));
      return MockCaregivers.getByCaregiverId(caregiverId);
    }
    return apiFetch<CaregiverAccess[]>(`/caregivers/connected-patients?caregiver_id=${caregiverId}`);
  },

  addCaregiver: async (input: AddCaregiverInput): Promise<CaregiverAccess> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 400));
      return MockCaregivers.add({
        ...input,
        caregiver_id: 'caregiver-1',
        caregiver_name: input.caregiver_name || 'Sarah Morgan',
        status: 'ACTIVE',
      });
    }
    return apiFetch<CaregiverAccess>('/caregivers', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  updatePermissions: async (id: string, permissions: CaregiverPermission[]): Promise<CaregiverAccess> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      const updated = MockCaregivers.updatePermissions(id, permissions);
      if (!updated) throw new Error('Caregiver record not found');
      return updated;
    }
    return apiFetch<CaregiverAccess>(`/caregivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ permissions }),
    });
  },

  removeCaregiver: async (id: string): Promise<void> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      const success = MockCaregivers.remove(id);
      if (!success) throw new Error('Caregiver record not found');
      return;
    }
    await apiFetch(`/caregivers/${id}`, { method: 'DELETE' });
  },
};
