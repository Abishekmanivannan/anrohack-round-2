import { TimelineEvent } from '../types';
import { apiFetch, isMockMode } from './client';
import { MockTimeline } from '../mock/storage';

export const timelineApi = {
  getTimelineEvents: async (patientId?: string): Promise<TimelineEvent[]> => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      return patientId ? MockTimeline.getByPatientId(patientId) : MockTimeline.getAll();
    }
    const query = patientId ? `?patient_id=${patientId}` : '';
    return apiFetch<TimelineEvent[]>(`/timeline${query}`);
  },
};
