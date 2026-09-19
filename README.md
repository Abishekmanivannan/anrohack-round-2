# CareFlow — Frontend Web Platform

CareFlow is a modern digital health and well-being application designed to centralize healthcare management for patients, family caregivers, and clinic administrators.

This repository contains the **complete React + Vite + TypeScript frontend application**.

---

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Application Architecture & Folder Structure

```text
src/
├── api/                  # Isolated API service layer (client, auth, appointments, docs, reminders, caregivers, timeline, admin)
├── assets/               # Static images and icons
├── components/
│   ├── domain/           # Healthcare-specific widgets (AppointmentCard, DocumentCard, AISummarySection, ReminderCard, TimelineItem)
│   ├── layout/           # MainLayout, Sidebar, Header, ProtectedRoute
│   └── ui/               # Reusable UI primitives (Button, Input, Select, Textarea, Modal, Card, Badge, Avatar, Tabs, Skeleton, EmptyState, ErrorState, FileUploader)
├── context/              # AuthContext (with live role switching) & ToastContext
├── mock/                 # Realistic seed data and localStorage persistence engine
├── pages/                # Public, Patient, Caregiver, and Admin pages
├── types/                # TypeScript domain models (User, Appointment, Document, AISummary, Reminder, CaregiverAccess, TimelineEvent)
├── App.tsx               # Main routing definition
├── main.tsx              # React entry point
└── index.css             # Tailwind & custom CSS styles
```

---

## ⚡ API Service Layer Abstraction & Backend Integration Guide

The frontend features a **clean 3-tier API abstraction architecture**:

```text
UI Page / Component
       ↓
Auth / Context / Custom Hook
       ↓
API Service Layer (`src/api/*`)
       ↓
Backend REST API  OR  Mock Data Service (`localStorage`)
```

### How to Connect to a Real Backend API

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set your backend base API URL in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. When `VITE_API_URL` is set, `src/api/client.ts` automatically forwards HTTP requests to your backend endpoints with Bearer Authorization tokens!

### Expected Backend API Endpoint Contracts

- **Authentication**:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `POST /api/auth/logout`
  - `GET  /api/auth/me`
- **Appointments**:
  - `GET    /api/appointments`
  - `POST   /api/appointments`
  - `GET    /api/appointments/:id`
  - `PUT    /api/appointments/:id`
  - `DELETE /api/appointments/:id`
- **Documents & AI**:
  - `GET    /api/documents`
  - `POST   /api/documents`
  - `GET    /api/documents/:id`
  - `DELETE /api/documents/:id`
  - `POST   /api/documents/:id/summarize`
- **Reminders**:
  - `GET    /api/reminders`
  - `POST   /api/reminders`
  - `PUT    /api/reminders/:id`
  - `DELETE /api/reminders/:id`
- **Caregiver Access**:
  - `GET    /api/caregivers`
  - `POST   /api/caregivers`
  - `PUT    /api/caregivers/:id`
  - `DELETE /api/caregivers/:id`
- **Timeline**:
  - `GET /api/timeline`
- **Admin**:
  - `GET /api/admin/stats`
  - `GET /api/admin/users`
  - `GET /api/admin/appointments`
  - `PUT /api/admin/appointments/:id`

---

## 🛠️ Local Development & Build

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Type Verification
```bash
npm run build
```

---

## 🌟 Hackathon Demo User Flow

To demonstrate the full CareFlow experience during evaluations:

1. **Landing Page (`/`)**: Click **"Launch Patient Demo"**.
2. **Patient Dashboard (`/dashboard`)**: Inspect upcoming cardiology appointment, lab reports, pending reminders, timeline preview, and active caregiver status.
3. **Book Appointment (`/appointments/new`)**: Schedule a new visit. The new appointment instantly appears in your list and triggers a timeline event.
4. **Upload Document & AI Assistant (`/documents`)**: Upload a lab PDF or test report. Click on the document card to view details and click **"Generate AI Summary"** to view plain-language breakdowns, extracted dates, doctor questions, and safety disclaimers.
5. **Reminders & Timeline (`/reminders`, `/timeline`)**: Add a new follow-up task, toggle completion, and view the vertical chronological timeline.
6. **Caregiver Access (`/caregiver`)**: View and modify shared information permissions (Appointments, Documents, Reminders, Timeline).
7. **Role Quick-Switcher**: Click the **"Role: PATIENT"** dropdown in the top header and switch to **CAREGIVER** or **ADMIN** to view the connected patient dashboard or clinic queue in real-time!
