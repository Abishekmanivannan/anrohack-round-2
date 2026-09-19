import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const apiBase = '/api';

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const readDataFile = (file) => {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeDataFile = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');
const appointmentsFile = path.join(dataDir, 'appointments.json');
const documentsFile = path.join(dataDir, 'documents.json');
const remindersFile = path.join(dataDir, 'reminders.json');
const timelineFile = path.join(dataDir, 'timeline.json');
const caregiversFile = path.join(dataDir, 'caregivers.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const defaultData = {
  users: [
    { id: 'patient-1', name: 'Alex Morgan', email: 'patient@careflow.com', role: 'PATIENT', phone: '+1 (555) 234-5678', created_at: '2026-08-01T10:00:00Z' },
    { id: 'caregiver-1', name: 'Sarah Morgan', email: 'caregiver@careflow.com', role: 'CAREGIVER', phone: '+1 (555) 876-5432', created_at: '2026-08-05T14:30:00Z' },
    { id: 'admin-1', name: 'Dr. Robert Vance (Clinic Admin)', email: 'admin@careflow.com', role: 'ADMIN', phone: '+1 (555) 999-0000', created_at: '2026-07-15T09:00:00Z' },
  ],
  appointments: [
    {
      id: 'apt-101',
      patient_id: 'patient-1',
      patient_name: 'Alex Morgan',
      provider_name: 'Dr. Elena Rostova',
      clinic_name: 'Metro General Health',
      department: 'Cardiology',
      appointment_date: '2026-09-25',
      appointment_time: '10:30 AM',
      purpose: '6-month routine cardiology follow-up & ECG review',
      notes: 'Please bring recent blood pressure logs and list of current medications.',
      status: 'UPCOMING',
      created_at: '2026-09-01T11:20:00Z',
    },
  ],
  documents: [
    {
      id: 'doc-101',
      patient_id: 'patient-1',
      file_name: 'Complete Blood Count & Metabolic Panel.pdf',
      file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      file_size: '2.4 MB',
      category: 'REPORT',
      uploaded_at: '2026-09-11T14:20:00Z',
      ai_summary: {
        documentType: 'Blood Test & Comprehensive Metabolic Panel',
        summary: 'The lab report indicates normal red and white blood cell counts. Fasting blood glucose is optimal at 92 mg/dL. Lipid panel shows total cholesterol at 210 mg/dL (slightly elevated), with healthy kidney and liver function markers.',
        importantDates: ['2026-09-10: Sample Collection Date', '2026-10-10: Suggested Repeat Lipid Panel'],
        mentionedItems: ['Hemoglobin: 14.5 g/dL (Normal: 13.8–17.2)', 'Fasting Glucose: 92 mg/dL (Normal: 70–99)', 'Total Cholesterol: 210 mg/dL (Desirable: <200)', 'eGFR: >90 mL/min (Normal kidney filtration)'],
        questionsForDoctor: ['Are dietary adjustments sufficient to address the total cholesterol level?', 'Do I need to repeat the lipid panel in 1 month or 6 months?'],
      },
    },
  ],
  reminders: [
    {
      id: 'rem-101',
      patient_id: 'patient-1',
      title: 'Take Fasting Blood Test Sample',
      description: 'Fast for at least 10 hours prior to arrival at Metro General Lab.',
      reminder_date: '2026-09-20',
      reminder_time: '08:00 AM',
      status: 'PENDING',
      created_at: '2026-09-11T16:00:00Z',
    },
  ],
  timeline: [
    {
      id: 'evt-101',
      patient_id: 'patient-1',
      event_type: 'APPOINTMENT',
      title: 'Cardiology Consultation Scheduled',
      description: 'Upcoming appointment with Dr. Elena Rostova at Metro General Health',
      event_date: '2026-09-25T10:30:00Z',
      created_at: '2026-09-01T11:20:00Z',
      reference_id: 'apt-101',
    },
  ],
  caregivers: [
    {
      id: 'caregiver-access-1',
      patient_id: 'patient-1',
      caregiver_id: 'caregiver-1',
      caregiver_email: 'caregiver@careflow.com',
      caregiver_name: 'Sarah Morgan',
      permissions: ['appointments', 'documents', 'reminders', 'timeline'],
      status: 'ACTIVE',
      created_at: '2026-08-05T14:30:00Z',
    },
  ],
};

for (const [key, file] of Object.entries({
  users: usersFile,
  appointments: appointmentsFile,
  documents: documentsFile,
  reminders: remindersFile,
  timeline: timelineFile,
  caregivers: caregiversFile,
})) {
  if (!fs.existsSync(file)) {
    writeDataFile(file, defaultData[key]);
  }
}

const getStore = () => ({
  users: readDataFile(usersFile),
  appointments: readDataFile(appointmentsFile),
  documents: readDataFile(documentsFile),
  reminders: readDataFile(remindersFile),
  timeline: readDataFile(timelineFile),
  caregivers: readDataFile(caregiversFile),
});

const updateStore = (key, data) => {
  const fileMap = {
    users: usersFile,
    appointments: appointmentsFile,
    documents: documentsFile,
    reminders: remindersFile,
    timeline: timelineFile,
    caregivers: caregiversFile,
  };

  writeDataFile(fileMap[key], data);
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = { id: token.replace('mock_jwt_token_', '') };
  next();
};

app.get('/', (req, res) => {
  res.json({
    name: 'CareFlow API',
    status: 'running',
    endpoints: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/appointments',
      '/api/documents',
      '/api/reminders',
      '/api/caregivers',
      '/api/timeline',
      '/api/admin/stats',
    ],
  });
});

app.post(`${apiBase}/auth/login`, (req, res) => {
  const { email, role } = req.body || {};
  const users = getStore().users;
  const user = users.find((entry) => entry.email.toLowerCase() === String(email || '').toLowerCase()) || users.find((entry) => entry.role === (role || 'PATIENT')) || users[0];

  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = `mock_jwt_token_${user.id}_${Date.now()}`;
  return res.json({ user, token });
});

app.post(`${apiBase}/auth/register`, (req, res) => {
  const { name, email, role, phone } = req.body || {};
  const store = getStore();
  const exists = store.users.some((user) => user.email.toLowerCase() === String(email || '').toLowerCase());

  if (exists) return res.status(409).json({ message: 'User already exists' });

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role: role || 'PATIENT',
    phone,
    created_at: new Date().toISOString(),
  };

  store.users.push(newUser);
  updateStore('users', store.users);

  const token = `mock_jwt_token_${newUser.id}_${Date.now()}`;
  return res.json({ user: newUser, token });
});

app.post(`${apiBase}/auth/logout`, (req, res) => res.json({ success: true }));

app.get(`${apiBase}/auth/me`, authMiddleware, (req, res) => {
  const user = getStore().users.find((entry) => entry.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
});

app.get(`${apiBase}/appointments`, authMiddleware, (req, res) => {
  const { patient_id } = req.query;
  const store = getStore();
  const results = patient_id ? store.appointments.filter((item) => item.patient_id === String(patient_id)) : store.appointments;
  return res.json(results);
});

app.post(`${apiBase}/appointments`, authMiddleware, (req, res) => {
  const store = getStore();
  const newAppointment = {
    ...req.body,
    id: `apt-${Date.now()}`,
    status: 'UPCOMING',
    created_at: new Date().toISOString(),
  };
  store.appointments.unshift(newAppointment);
  updateStore('appointments', store.appointments);
  return res.status(201).json(newAppointment);
});

app.get(`${apiBase}/appointments/:id`, authMiddleware, (req, res) => {
  const item = getStore().appointments.find((entry) => entry.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Appointment not found' });
  return res.json(item);
});

app.put(`${apiBase}/appointments/:id`, authMiddleware, (req, res) => {
  const store = getStore();
  const index = store.appointments.findIndex((entry) => entry.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Appointment not found' });

  store.appointments[index] = { ...store.appointments[index], ...req.body };
  updateStore('appointments', store.appointments);
  return res.json(store.appointments[index]);
});

app.delete(`${apiBase}/appointments/:id`, authMiddleware, (req, res) => {
  const store = getStore();
  const filtered = store.appointments.filter((entry) => entry.id !== req.params.id);
  if (filtered.length === store.appointments.length) return res.status(404).json({ message: 'Appointment not found' });
  updateStore('appointments', filtered);
  return res.status(204).send();
});

app.get(`${apiBase}/documents`, authMiddleware, (req, res) => {
  const { patient_id } = req.query;
  const store = getStore();
  const results = patient_id ? store.documents.filter((item) => item.patient_id === String(patient_id)) : store.documents;
  return res.json(results);
});

app.post(`${apiBase}/documents`, authMiddleware, (req, res) => {
  const store = getStore();
  const newDocument = {
    ...req.body,
    id: `doc-${Date.now()}`,
    uploaded_at: new Date().toISOString(),
  };
  store.documents.unshift(newDocument);
  updateStore('documents', store.documents);
  return res.status(201).json(newDocument);
});

app.get(`${apiBase}/documents/:id`, authMiddleware, (req, res) => {
  const item = getStore().documents.find((entry) => entry.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Document not found' });
  return res.json(item);
});

app.delete(`${apiBase}/documents/:id`, authMiddleware, (req, res) => {
  const store = getStore();
  const filtered = store.documents.filter((entry) => entry.id !== req.params.id);
  if (filtered.length === store.documents.length) return res.status(404).json({ message: 'Document not found' });
  updateStore('documents', filtered);
  return res.status(204).send();
});

app.get(`${apiBase}/reminders`, authMiddleware, (req, res) => {
  const { patient_id } = req.query;
  const store = getStore();
  const results = patient_id ? store.reminders.filter((item) => item.patient_id === String(patient_id)) : store.reminders;
  return res.json(results);
});

app.post(`${apiBase}/reminders`, authMiddleware, (req, res) => {
  const store = getStore();
  const newReminder = {
    ...req.body,
    id: `rem-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  store.reminders.unshift(newReminder);
  updateStore('reminders', store.reminders);
  return res.status(201).json(newReminder);
});

app.put(`${apiBase}/reminders/:id`, authMiddleware, (req, res) => {
  const store = getStore();
  const index = store.reminders.findIndex((entry) => entry.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Reminder not found' });
  store.reminders[index] = { ...store.reminders[index], ...req.body };
  updateStore('reminders', store.reminders);
  return res.json(store.reminders[index]);
});

app.delete(`${apiBase}/reminders/:id`, authMiddleware, (req, res) => {
  const store = getStore();
  const filtered = store.reminders.filter((entry) => entry.id !== req.params.id);
  if (filtered.length === store.reminders.length) return res.status(404).json({ message: 'Reminder not found' });
  updateStore('reminders', filtered);
  return res.status(204).send();
});

app.get(`${apiBase}/caregivers`, authMiddleware, (req, res) => {
  const { patient_id } = req.query;
  const store = getStore();
  const results = patient_id ? store.caregivers.filter((item) => item.patient_id === String(patient_id)) : store.caregivers;
  return res.json(results);
});

app.post(`${apiBase}/caregivers`, authMiddleware, (req, res) => {
  const store = getStore();
  const newCaregiver = {
    ...req.body,
    id: `caregiver-access-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  store.caregivers.unshift(newCaregiver);
  updateStore('caregivers', store.caregivers);
  return res.status(201).json(newCaregiver);
});

app.put(`${apiBase}/caregivers/:id`, authMiddleware, (req, res) => {
  const store = getStore();
  const index = store.caregivers.findIndex((entry) => entry.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Caregiver access not found' });
  store.caregivers[index] = { ...store.caregivers[index], ...req.body };
  updateStore('caregivers', store.caregivers);
  return res.json(store.caregivers[index]);
});

app.delete(`${apiBase}/caregivers/:id`, authMiddleware, (req, res) => {
  const store = getStore();
  const filtered = store.caregivers.filter((entry) => entry.id !== req.params.id);
  if (filtered.length === store.caregivers.length) return res.status(404).json({ message: 'Caregiver access not found' });
  updateStore('caregivers', filtered);
  return res.status(204).send();
});

app.get(`${apiBase}/timeline`, authMiddleware, (req, res) => {
  const { patient_id } = req.query;
  const store = getStore();
  const results = patient_id ? store.timeline.filter((item) => item.patient_id === String(patient_id)) : store.timeline;
  return res.json(results);
});

app.get(`${apiBase}/admin/stats`, authMiddleware, (req, res) => {
  const store = getStore();
  const patients = store.users.filter((user) => user.role === 'PATIENT');
  const upcoming = store.appointments.filter((item) => item.status === 'UPCOMING');
  const completed = store.appointments.filter((item) => item.status === 'COMPLETED');
  const cancelled = store.appointments.filter((item) => item.status === 'CANCELLED');

  return res.json({
    patientCount: patients.length,
    appointmentCount: store.appointments.length,
    upcomingCount: upcoming.length,
    completedCount: completed.length,
    cancelledCount: cancelled.length,
    documentCount: store.documents.length,
    reminderCount: store.reminders.length,
  });
});

app.get(`${apiBase}/admin/users`, authMiddleware, (req, res) => {
  const { role } = req.query;
  const users = getStore().users.filter((user) => !role || user.role === String(role));
  return res.json(users);
});

app.get(`${apiBase}/admin/appointments`, authMiddleware, (req, res) => {
  return res.json(getStore().appointments);
});

app.put(`${apiBase}/admin/appointments/:id`, authMiddleware, (req, res) => {
  const store = getStore();
  const index = store.appointments.findIndex((entry) => entry.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Appointment not found' });
  store.appointments[index] = { ...store.appointments[index], ...req.body };
  updateStore('appointments', store.appointments);
  return res.json(store.appointments[index]);
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`CareFlow API running on http://localhost:${PORT}`);
});
