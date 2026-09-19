PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('PATIENT', 'CAREGIVER', 'ADMIN')),
  phone TEXT,
  password_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  clinic_name TEXT NOT NULL,
  department TEXT NOT NULL,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  purpose TEXT,
  notes TEXT,
  status TEXT NOT NULL CHECK(status IN ('UPCOMING', 'COMPLETED', 'CANCELLED')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('REPORT', 'PRESCRIPTION', 'BILL', 'DISCHARGE', 'OTHER')),
  uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reminder_date TEXT NOT NULL,
  reminder_time TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('PENDING', 'COMPLETED')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS caregivers (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  caregiver_id TEXT NOT NULL,
  caregiver_email TEXT NOT NULL,
  caregiver_name TEXT,
  permissions TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL CHECK(status IN ('ACTIVE', 'PENDING', 'REVOKED')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS timeline_events (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK(event_type IN ('APPOINTMENT', 'DOCUMENT_UPLOAD', 'FOLLOW_UP', 'COMPLETED_APPOINTMENT', 'REMINDER')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reference_id TEXT
);
