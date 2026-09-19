import {
  User,
  Appointment,
  Document,
  Reminder,
  TimelineEvent,
  CaregiverAccess,
  AISummary,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_APPOINTMENTS,
  INITIAL_DOCUMENTS,
  INITIAL_REMINDERS,
  INITIAL_TIMELINE,
  INITIAL_CAREGIVERS,
} from './data';

const STORAGE_KEYS = {
  USERS: 'careflow_users',
  APPOINTMENTS: 'careflow_appointments',
  DOCUMENTS: 'careflow_documents',
  REMINDERS: 'careflow_reminders',
  TIMELINE: 'careflow_timeline',
  CAREGIVERS: 'careflow_caregivers',
  CURRENT_USER: 'careflow_current_user',
};

// Initialize localStorage with seed data if not already populated
export const initMockStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REMINDERS)) {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(INITIAL_REMINDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TIMELINE)) {
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(INITIAL_TIMELINE));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CAREGIVERS)) {
    localStorage.setItem(STORAGE_KEYS.CAREGIVERS, JSON.stringify(INITIAL_CAREGIVERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
  }
};

// Generic storage getters/setters
export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// User & Auth Storage Methods
export const MockAuth = {
  getCurrentUser: (): User | null => {
    initMockStorage();
    return getItem<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },
  setCurrentUser: (user: User | null): void => {
    setItem(STORAGE_KEYS.CURRENT_USER, user);
  },
  getUsers: (): User[] => {
    initMockStorage();
    return getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },
  addUser: (user: User): User => {
    const users = MockAuth.getUsers();
    users.push(user);
    setItem(STORAGE_KEYS.USERS, users);
    return user;
  },
};

// Appointments Storage Methods
export const MockAppointments = {
  getAll: (): Appointment[] => {
    initMockStorage();
    return getItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },
  getByPatientId: (patientId: string): Appointment[] => {
    return MockAppointments.getAll().filter(a => a.patient_id === patientId);
  },
  getById: (id: string): Appointment | undefined => {
    return MockAppointments.getAll().find(a => a.id === id);
  },
  create: (appointmentData: Omit<Appointment, 'id' | 'created_at'>): Appointment => {
    const appointments = MockAppointments.getAll();
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    appointments.unshift(newAppointment);
    setItem(STORAGE_KEYS.APPOINTMENTS, appointments);

    // Also trigger timeline event
    MockTimeline.add({
      patient_id: newAppointment.patient_id,
      event_type: 'APPOINTMENT',
      title: `Appointment Booked: ${newAppointment.provider_name}`,
      description: `${newAppointment.department} consultation scheduled at ${newAppointment.clinic_name}`,
      event_date: `${newAppointment.appointment_date}T${newAppointment.appointment_time.includes('AM') || newAppointment.appointment_time.includes('PM') ? '10:00:00Z' : '10:00:00Z'}`,
      reference_id: newAppointment.id,
    });

    return newAppointment;
  },
  update: (id: string, updates: Partial<Appointment>): Appointment | undefined => {
    const appointments = MockAppointments.getAll();
    const index = appointments.findIndex(a => a.id === id);
    if (index === -1) return undefined;

    const prevStatus = appointments[index].status;
    appointments[index] = { ...appointments[index], ...updates };
    setItem(STORAGE_KEYS.APPOINTMENTS, appointments);

    // If marked completed, add to timeline
    if (updates.status === 'COMPLETED' && prevStatus !== 'COMPLETED') {
      MockTimeline.add({
        patient_id: appointments[index].patient_id,
        event_type: 'COMPLETED_APPOINTMENT',
        title: `Appointment Completed: ${appointments[index].provider_name}`,
        description: `Consultation marked completed at ${appointments[index].clinic_name}`,
        event_date: new Date().toISOString(),
        reference_id: appointments[index].id,
      });
    }

    return appointments[index];
  },
  delete: (id: string): boolean => {
    const appointments = MockAppointments.getAll();
    const filtered = appointments.filter(a => a.id !== id);
    setItem(STORAGE_KEYS.APPOINTMENTS, filtered);
    return filtered.length < appointments.length;
  },
};

// Documents Storage Methods
export const MockDocuments = {
  getAll: (): Document[] => {
    initMockStorage();
    return getItem<Document[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  },
  getByPatientId: (patientId: string): Document[] => {
    return MockDocuments.getAll().filter(d => d.patient_id === patientId);
  },
  getById: (id: string): Document | undefined => {
    return MockDocuments.getAll().find(d => d.id === id);
  },
  upload: (docData: Omit<Document, 'id' | 'uploaded_at'>): Document => {
    const documents = MockDocuments.getAll();
    const newDoc: Document = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploaded_at: new Date().toISOString(),
    };
    documents.unshift(newDoc);
    setItem(STORAGE_KEYS.DOCUMENTS, documents);

    // Also trigger timeline event
    MockTimeline.add({
      patient_id: newDoc.patient_id,
      event_type: 'DOCUMENT_UPLOAD',
      title: `Document Uploaded: ${newDoc.file_name}`,
      description: `${newDoc.category} document added to healthcare vault`,
      event_date: newDoc.uploaded_at,
      reference_id: newDoc.id,
    });

    return newDoc;
  },
  delete: (id: string): boolean => {
    const documents = MockDocuments.getAll();
    const filtered = documents.filter(d => d.id !== id);
    setItem(STORAGE_KEYS.DOCUMENTS, filtered);
    return filtered.length < documents.length;
  },
  setAISummary: (id: string, aiSummary: AISummary): Document | undefined => {
    const documents = MockDocuments.getAll();
    const index = documents.findIndex(d => d.id === id);
    if (index === -1) return undefined;

    documents[index].ai_summary = aiSummary;
    setItem(STORAGE_KEYS.DOCUMENTS, documents);
    return documents[index];
  },
};

// Reminders Storage Methods
export const MockReminders = {
  getAll: (): Reminder[] => {
    initMockStorage();
    return getItem<Reminder[]>(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS);
  },
  getByPatientId: (patientId: string): Reminder[] => {
    return MockReminders.getAll().filter(r => r.patient_id === patientId);
  },
  create: (reminderData: Omit<Reminder, 'id' | 'created_at'>): Reminder => {
    const reminders = MockReminders.getAll();
    const newReminder: Reminder = {
      ...reminderData,
      id: `rem-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    reminders.unshift(newReminder);
    setItem(STORAGE_KEYS.REMINDERS, reminders);

    // Add timeline event
    MockTimeline.add({
      patient_id: newReminder.patient_id,
      event_type: 'REMINDER',
      title: `Reminder Created: ${newReminder.title}`,
      description: newReminder.description || 'Follow-up healthcare action set',
      event_date: `${newReminder.reminder_date}T${newReminder.reminder_time.includes('AM') || newReminder.reminder_time.includes('PM') ? '09:00:00Z' : '09:00:00Z'}`,
      reference_id: newReminder.id,
    });

    return newReminder;
  },
  update: (id: string, updates: Partial<Reminder>): Reminder | undefined => {
    const reminders = MockReminders.getAll();
    const index = reminders.findIndex(r => r.id === id);
    if (index === -1) return undefined;

    reminders[index] = { ...reminders[index], ...updates };
    setItem(STORAGE_KEYS.REMINDERS, reminders);
    return reminders[index];
  },
  delete: (id: string): boolean => {
    const reminders = MockReminders.getAll();
    const filtered = reminders.filter(r => r.id !== id);
    setItem(STORAGE_KEYS.REMINDERS, filtered);
    return filtered.length < reminders.length;
  },
};

// Timeline Storage Methods
export const MockTimeline = {
  getAll: (): TimelineEvent[] => {
    initMockStorage();
    return getItem<TimelineEvent[]>(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE);
  },
  getByPatientId: (patientId: string): TimelineEvent[] => {
    return MockTimeline.getAll()
      .filter(t => t.patient_id === patientId)
      .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
  },
  add: (eventData: Omit<TimelineEvent, 'id' | 'created_at'>): TimelineEvent => {
    const events = MockTimeline.getAll();
    const newEvent: TimelineEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    events.unshift(newEvent);
    setItem(STORAGE_KEYS.TIMELINE, events);
    return newEvent;
  },
};

// Caregivers Storage Methods
export const MockCaregivers = {
  getAll: (): CaregiverAccess[] => {
    initMockStorage();
    return getItem<CaregiverAccess[]>(STORAGE_KEYS.CAREGIVERS, INITIAL_CAREGIVERS);
  },
  getByPatientId: (patientId: string): CaregiverAccess[] => {
    return MockCaregivers.getAll().filter(c => c.patient_id === patientId);
  },
  getByCaregiverId: (caregiverId: string): CaregiverAccess[] => {
    return MockCaregivers.getAll().filter(c => c.caregiver_id === caregiverId || c.caregiver_email === 'caregiver@careflow.com');
  },
  add: (accessData: Omit<CaregiverAccess, 'id' | 'created_at'>): CaregiverAccess => {
    const caregivers = MockCaregivers.getAll();
    const newAccess: CaregiverAccess = {
      ...accessData,
      id: `cg-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    caregivers.unshift(newAccess);
    setItem(STORAGE_KEYS.CAREGIVERS, caregivers);
    return newAccess;
  },
  updatePermissions: (id: string, permissions: CaregiverAccess['permissions']): CaregiverAccess | undefined => {
    const caregivers = MockCaregivers.getAll();
    const index = caregivers.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    caregivers[index].permissions = permissions;
    setItem(STORAGE_KEYS.CAREGIVERS, caregivers);
    return caregivers[index];
  },
  remove: (id: string): boolean => {
    const caregivers = MockCaregivers.getAll();
    const filtered = caregivers.filter(c => c.id !== id);
    setItem(STORAGE_KEYS.CAREGIVERS, filtered);
    return filtered.length < caregivers.length;
  },
};
