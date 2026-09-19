create extension if not exists "pgcrypto";

create type user_role as enum ('PATIENT', 'CAREGIVER', 'ADMIN');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  phone text,
  role user_role not null default 'PATIENT',
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  provider_name text not null,
  clinic_name text not null,
  department text not null,
  appointment_date date not null,
  appointment_time text not null,
  purpose text,
  notes text,
  status text not null default 'UPCOMING' check (status in ('UPCOMING', 'COMPLETED', 'CANCELLED')),
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  file_name text not null,
  file_url text not null,
  file_size text not null,
  category text not null default 'OTHER' check (category in ('REPORT', 'PRESCRIPTION', 'BILL', 'DISCHARGE', 'OTHER')),
  uploaded_at timestamptz not null default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  title text not null,
  description text,
  reminder_date date not null,
  reminder_time text not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'COMPLETED')),
  created_at timestamptz not null default now()
);

create table if not exists public.caregiver_access (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  caregiver_id uuid not null,
  caregiver_email text not null,
  caregiver_name text,
  permissions text[] not null default '{}',
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'PENDING', 'REVOKED')),
  created_at timestamptz not null default now()
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  event_type text not null check (event_type in ('APPOINTMENT', 'DOCUMENT_UPLOAD', 'FOLLOW_UP', 'COMPLETED_APPOINTMENT', 'REMINDER')),
  title text not null,
  description text not null,
  event_date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  reference_id uuid
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'PATIENT')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    phone = excluded.phone,
    role = excluded.role;

  return new;
end;
$$;

create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.documents enable row level security;
alter table public.reminders enable row level security;
alter table public.caregiver_access enable row level security;
alter table public.timeline_events enable row level security;

create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Profiles are insertable by authenticated users" on public.profiles for insert with check (auth.uid() = id);

create policy "Authenticated users can read appointments" on public.appointments for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert appointments" on public.appointments for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update appointments" on public.appointments for update using (auth.role() = 'authenticated');

create policy "Authenticated users can read documents" on public.documents for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert documents" on public.documents for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can read reminders" on public.reminders for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert reminders" on public.reminders for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can read caregiver access" on public.caregiver_access for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert caregiver access" on public.caregiver_access for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can read timeline events" on public.timeline_events for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert timeline events" on public.timeline_events for insert with check (auth.role() = 'authenticated');
