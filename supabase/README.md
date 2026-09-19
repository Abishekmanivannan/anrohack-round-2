# Supabase authentication setup

This project includes a Supabase-ready auth and profile schema.

## 1. Create a Supabase project

Create a new project in Supabase and copy these values into your local `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SESSION_STORAGE_KEY=careflow-auth
```

## 2. Run the schema

Open the Supabase SQL editor and run the contents of:

```text
supabase/schema.sql
```

This creates:

- `public.profiles`
- `public.appointments`
- `public.documents`
- `public.reminders`
- `public.caregiver_access`
- `public.timeline_events`
- the trigger that syncs auth users into the profile table

## 3. Authentication flow

The app now tries to use Supabase auth when the environment variables are configured. If they are missing, the app falls back to its demo local auth flow.
