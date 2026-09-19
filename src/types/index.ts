export type UserRole = 'PATIENT' | 'CAREGIVER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  created_at?: string;
}

export type AppointmentStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name?: string;
  provider_name: string;
  clinic_name: string;
  department: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:MM AM/PM
  purpose?: string;
  notes?: string;
  status: AppointmentStatus;
  created_at: string;
}

export type DocumentCategory = 'REPORT' | 'PRESCRIPTION' | 'BILL' | 'DISCHARGE' | 'OTHER';

export interface AISummary {
  documentType: string;
  summary: string;
  importantDates: string[];
  mentionedItems: string[];
  questionsForDoctor: string[];
}

export interface Document {
  id: string;
  patient_id: string;
  file_name: string;
  file_url: string;
  file_size: string; // e.g., "1.2 MB"
  category: DocumentCategory;
  uploaded_at: string;
  ai_summary?: AISummary;
}

export type ReminderStatus = 'PENDING' | 'COMPLETED';

export interface Reminder {
  id: string;
  patient_id: string;
  title: string;
  description?: string;
  reminder_date: string; // YYYY-MM-DD
  reminder_time: string; // HH:MM AM/PM
  status: ReminderStatus;
  created_at: string;
}

export type CaregiverPermission = 'appointments' | 'documents' | 'reminders' | 'timeline';

export interface CaregiverAccess {
  id: string;
  patient_id: string;
  patient_name?: string;
  caregiver_id: string;
  caregiver_name?: string;
  caregiver_email: string;
  permissions: CaregiverPermission[];
  status: 'ACTIVE' | 'PENDING' | 'REVOKED';
  created_at: string;
}

export type EventType = 'APPOINTMENT' | 'DOCUMENT_UPLOAD' | 'FOLLOW_UP' | 'COMPLETED_APPOINTMENT' | 'REMINDER';

export interface TimelineEvent {
  id: string;
  patient_id: string;
  event_type: EventType;
  title: string;
  description: string;
  event_date: string; // ISO or YYYY-MM-DD
  created_at: string;
  reference_id?: string;
}

export interface AdminStats {
  patientCount: number;
  appointmentCount: number;
  upcomingCount: number;
  completedCount: number;
  cancelledCount: number;
  documentCount: number;
  reminderCount: number;
}
