-- Demo seed data for local Supabase development

insert into public.profiles (id, email, full_name, phone, role)
values
  ('11111111-1111-4111-8111-111111111111', 'patient@careflow.com', 'Alex Morgan', '+1-555-0101', 'PATIENT'),
  ('22222222-2222-4222-8222-222222222222', 'caregiver@careflow.com', 'Sarah Morgan', '+1-555-0102', 'CAREGIVER'),
  ('33333333-3333-4333-8333-333333333333', 'admin@careflow.com', 'Dr. Robert Vance', '+1-555-0103', 'ADMIN')
on conflict (id) do nothing;

insert into public.appointments (id, patient_id, provider_name, clinic_name, department, appointment_date, appointment_time, purpose, notes, status)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'Dr. Sarah Chen', 'CareFlow Clinic', 'Cardiology', current_date + interval '7 day', '09:30 AM', 'Annual heart review', 'Monitor blood pressure and assess recovery plan.', 'UPCOMING')
on conflict (id) do nothing;

insert into public.documents (id, patient_id, file_name, file_url, file_size, category)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '11111111-1111-4111-8111-111111111111', 'lab-report.pdf', 'https://example.com/lab-report.pdf', '1.2 MB', 'REPORT')
on conflict (id) do nothing;

insert into public.reminders (id, patient_id, title, description, reminder_date, reminder_time, status)
values
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', '11111111-1111-4111-8111-111111111111', 'Hydration Check', 'Drink at least 2 liters of water today.', current_date + interval '1 day', '08:00 AM', 'PENDING')
on conflict (id) do nothing;

insert into public.caregiver_access (id, patient_id, caregiver_id, caregiver_email, caregiver_name, permissions, status)
values
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'caregiver@careflow.com', 'Sarah Morgan', ARRAY['appointments', 'documents', 'reminders', 'timeline'], 'ACTIVE')
on conflict (id) do nothing;

insert into public.timeline_events (id, patient_id, event_type, title, description, event_date)
values
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', '11111111-1111-4111-8111-111111111111', 'APPOINTMENT', 'Cardiology Visit Scheduled', 'Annual cardiology review has been scheduled for next week.', current_timestamp)
on conflict (id) do nothing;
