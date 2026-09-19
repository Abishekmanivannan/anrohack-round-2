# CareFlow — Product Requirements Document

## 1. Project Overview

**Project Name:** CareFlow  
**Track:** Track 3 — Digital Health & Well-being  
**Project Type:** Full-stack healthcare workflow and patient-support web platform

### Vision

CareFlow is a centralized healthcare management platform that helps patients organize appointments, medical documents, follow-ups, and caregiver access in one place.

The platform focuses on healthcare workflow, information management, patient support, and accessibility rather than medical diagnosis or treatment.

---

## 2. Problem Statement

Patients often have healthcare information scattered across different places:

- Appointment details in messages or calendars
- Medical reports stored as files or photos
- Follow-up dates remembered manually
- Prescriptions and documents difficult to organize
- Family members/caregivers unable to easily access relevant updates
- Important healthcare information difficult to understand or find quickly

### Problem

> How can we provide patients and caregivers with one simple platform to organize healthcare information, appointments, documents, and follow-ups?

---

## 3. Target Users

### Patient

A person who wants to:
- Manage appointments
- Store healthcare documents
- Track follow-ups
- View their healthcare timeline
- Receive reminders
- Share selected information with a caregiver

### Caregiver

A trusted family member or caregiver who wants to:
- View shared patient information
- Track upcoming appointments
- See important reminders
- Monitor updates shared by the patient

### Admin / Clinic Staff

Staff members who can:
- Manage appointments
- View relevant patient information
- Update appointment status
- Manage basic healthcare workflow information

---

## 4. Goals

### Primary Goals

1. Centralize patient healthcare information.
2. Make appointment management simple.
3. Organize healthcare documents.
4. Provide follow-up reminders.
5. Create a chronological healthcare journey.
6. Allow controlled caregiver access.
7. Provide AI-assisted document understanding without diagnosis or treatment claims.
8. Deliver a functional full-stack deployed prototype.

### Success Metrics

The prototype should demonstrate:
- Appointment creation and management
- Successful document upload and retrieval
- Reminder creation
- Healthcare timeline generation
- Caregiver access control
- AI document summarization
- Persistent database storage
- Working authentication
- Successful production deployment

---

## 5. Core Features

### 5.1 Authentication

Users should be able to:
- Sign up
- Log in
- Log out
- Select user role
- Access role-specific dashboards

Roles:
```text
PATIENT
CAREGIVER
ADMIN
```

---

## 6. Patient Dashboard

The dashboard is the main patient interface.

### Dashboard Components

- Welcome section
- Upcoming appointment
- Recent documents
- Pending follow-ups
- Healthcare timeline preview
- Caregiver access status
- Quick actions

### Quick Actions

```text
+ Book Appointment
+ Upload Document
+ Add Reminder
+ View Timeline
+ Manage Caregiver
```

---

## 7. Appointment Management

Patients can manage healthcare appointments.

### Features

- Create appointment
- View appointments
- Edit appointment
- Cancel appointment
- Mark appointment as completed
- Filter appointments
- View upcoming appointments

### Appointment Data

```text
Appointment
├── Doctor / Provider Name
├── Hospital / Clinic
├── Department
├── Date
├── Time
├── Purpose / Notes
├── Status
└── Created At
```

### Status

```text
UPCOMING
COMPLETED
CANCELLED
```

---

## 8. Medical Document Management

Patients can upload and organize healthcare-related documents.

### Supported Documents

Examples:
- Reports
- Prescriptions
- Bills
- Discharge documents
- Test reports
- Other healthcare documents

### Features

- Upload document
- View document
- Download document
- Delete document
- Categorize document
- Search documents
- Sort by date/category

### Categories

```text
REPORT
PRESCRIPTION
BILL
DISCHARGE
OTHER
```

Documents should be stored using secure cloud storage.

---

## 9. AI Document Assistant

CareFlow includes an AI-assisted document understanding feature.

### Purpose

The AI helps users understand the contents and structure of uploaded healthcare documents in simpler language.

### Workflow

```text
Upload Document
      ↓
Extract Text
      ↓
Send relevant text to AI
      ↓
Generate simple summary
      ↓
Display summary
```

### AI Output

The system may provide:
- Document type
- Key information extracted from the document
- Important dates
- Names of tests or procedures mentioned
- General plain-language summary
- Questions the user may consider asking their healthcare professional

### Safety Requirements

The AI must not:
- Diagnose diseases
- Predict medical conditions
- Recommend treatments
- Recommend medication changes
- Replace professional medical advice
- Claim certainty about medical conditions

The system should clearly state that the AI summary is informational and users should consult an appropriate healthcare professional for medical interpretation.

---

## 10. Healthcare Timeline

CareFlow creates a chronological timeline of important healthcare events.

### Timeline Events

```text
Appointment
Document Upload
Follow-up
Completed Appointment
Reminder
```

### Example

```text
September 18
│
├── Doctor Appointment
│
September 19
│
├── Report Uploaded
│
September 22
│
├── Follow-up Reminder
│
October 03
│
└── Upcoming Appointment
```

---

## 11. Follow-up & Reminder System

Users can create reminders for healthcare-related activities.

### Examples

- Follow-up appointment
- Review a document
- Contact clinic
- Upcoming appointment

### Reminder Data

```text
Reminder
├── Title
├── Description
├── Date
├── Time
├── Status
└── User ID
```

### Reminder Status

```text
PENDING
COMPLETED
```

---

## 12. Caregiver Access

Patients can provide controlled access to a caregiver.

### Patient Controls

Patients should be able to:
- Add caregiver
- Remove caregiver
- View active caregivers
- Control what information is shared

### Shareable Information

```text
Appointments
Documents
Reminders
Timeline
```

The patient remains in control of access.

---

## 13. Caregiver Dashboard

The caregiver dashboard displays information shared by patients.

### Dashboard

- Connected patients
- Upcoming appointments
- Shared documents
- Follow-up reminders
- Recent timeline events

### Restrictions

Caregivers should only access information explicitly shared with them.

---

## 14. Admin Dashboard

The admin dashboard is intended for the prototype's clinic/workflow management functionality.

### Features

- View patients
- View appointments
- Update appointment status
- View basic workflow information
- Search appointments
- Filter appointments

Admin access must be protected using role-based authorization.

---

## 15. Database Design

Use **PostgreSQL**.

### Users

```text
users
├── id
├── name
├── email
├── role
├── created_at
└── updated_at
```

### Appointments

```text
appointments
├── id
├── patient_id
├── provider_name
├── clinic_name
├── department
├── appointment_date
├── appointment_time
├── notes
├── status
└── created_at
```

### Documents

```text
documents
├── id
├── patient_id
├── file_name
├── file_url
├── category
├── uploaded_at
└── ai_summary
```

### Reminders

```text
reminders
├── id
├── patient_id
├── title
├── description
├── reminder_date
├── reminder_time
├── status
└── created_at
```

### Caregiver Access

```text
caregiver_access
├── id
├── patient_id
├── caregiver_id
├── permissions
├── status
└── created_at
```

### Timeline

```text
timeline_events
├── id
├── patient_id
├── event_type
├── title
├── description
├── event_date
└── created_at
```

---

## 16. System Architecture

```text
                    CAREFLOW
                       │
                       ▼
              React Web Application
                       │
                 HTTPS / REST API
                       │
                       ▼
              Node.js + Express API
                 /      |       \
                /       |        \
               ▼        ▼         ▼
        PostgreSQL   AI API   File Storage
          Database              Service
               │
               ▼
       Authentication /
       Authorization
```

### Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion
- Recharts

### Backend
- Node.js
- Express.js
- REST API

### Database
- PostgreSQL

### Storage
- Cloud object/file storage

### AI
- Gemini API or another suitable AI API

### Deployment
- Frontend: Vercel
- Backend: Render / Railway
- Database: PostgreSQL / Supabase PostgreSQL

---

## 17. API Design

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Appointments

```http
GET    /api/appointments
POST   /api/appointments
GET    /api/appointments/:id
PUT    /api/appointments/:id
DELETE /api/appointments/:id
```

### Documents

```http
GET    /api/documents
POST   /api/documents
GET    /api/documents/:id
DELETE /api/documents/:id
POST   /api/documents/:id/summarize
```

### Reminders

```http
GET    /api/reminders
POST   /api/reminders
PUT    /api/reminders/:id
DELETE /api/reminders/:id
```

### Caregiver

```http
GET    /api/caregivers
POST   /api/caregivers
PUT    /api/caregivers/:id
DELETE /api/caregivers/:id
```

### Timeline

```http
GET /api/timeline
```

### Admin

```http
GET /api/admin/users
GET /api/admin/appointments
PUT /api/admin/appointments/:id
```

---

## 18. Frontend Pages

### Public

```text
/
├── Landing Page
├── Login
└── Register
```

### Patient

```text
/dashboard
/appointments
/appointments/new
/documents
/documents/:id
/reminders
/timeline
/caregiver
/profile
```

### Caregiver

```text
/caregiver/dashboard
/caregiver/patients
/caregiver/patients/:id
```

### Admin

```text
/admin/dashboard
/admin/appointments
/admin/patients
```

---

## 19. UI/UX Requirements

### Design Direction

Modern healthcare technology interface with:
- Clean layout
- Professional appearance
- Strong readability
- Responsive design
- Accessible components
- Clear navigation
- Consistent cards and forms
- Minimal visual clutter

### Dashboard

Use visual cards for:
- Upcoming Appointment
- Recent Documents
- Pending Reminders
- Healthcare Timeline
- Caregiver Access

### Responsive

The website must work on:
- Desktop
- Tablet
- Mobile

---

## 20. Security Requirements

The application handles sensitive healthcare-related information, so security must be considered throughout the prototype.

### Requirements

- Secure authentication
- Password hashing where applicable
- Role-based authorization
- Protected API routes
- Environment variables for secrets
- No API keys in frontend code
- Controlled document access
- Server-side validation
- Input sanitization
- HTTPS in production
- Database access restrictions

### Environment Variables

```text
DATABASE_URL=
AUTH_SECRET=
AI_API_KEY=
STORAGE_URL=
STORAGE_KEY=
```

Never commit secrets to GitHub.

---

## 21. Error Handling

The system should provide useful error states.

Examples:
```text
Invalid login
Upload failed
Database unavailable
Unauthorized access
Appointment not found
Document unavailable
AI service unavailable
```

Errors should be displayed using user-friendly messages.

---

## 22. Loading States

Every asynchronous operation should have a loading state.

Examples:
```text
Loading dashboard...
Uploading document...
Generating summary...
Saving appointment...
Loading timeline...
```

Avoid blank screens while requests are processing.

---

## 23. Empty States

Create useful empty states.

Example:

```text
No upcoming appointments

You don't have any upcoming appointments.

[Book Appointment]
```

Similarly:

```text
No documents uploaded

Upload your first healthcare document.

[Upload Document]
```

---

## 24. Core User Flow

The primary hackathon demonstration should follow this flow:

```text
Register / Login
       ↓
Patient Dashboard
       ↓
Create Appointment
       ↓
Upload Healthcare Document
       ↓
View Document
       ↓
Generate AI Summary
       ↓
Create Follow-up Reminder
       ↓
View Healthcare Timeline
       ↓
Add Caregiver
       ↓
Caregiver Views Shared Information
```

This demonstrates the core value of CareFlow rather than only showing static UI.

---

## 25. Demo Data

The application should support realistic demo/test data so the complete workflow can be demonstrated reliably.

Example:

```text
Patient:
Demo Patient

Appointment:
General consultation
September 25, 2026
10:30 AM

Document:
Sample Test Report

Reminder:
Follow-up appointment
October 02, 2026
```

Clearly label synthetic/demo data where appropriate.

---

## 26. AI Implementation

AI should be an enhancement to the core workflow rather than the entire product.

### AI Pipeline

```text
Document
   ↓
File Upload
   ↓
Text Extraction
   ↓
Text Cleaning
   ↓
AI API
   ↓
Structured Response
   ↓
Database
   ↓
Patient Dashboard
```

### Structured AI Response

```json
{
  "documentType": "",
  "summary": "",
  "importantDates": [],
  "mentionedItems": [],
  "questionsForDoctor": []
}
```

The application should validate AI responses before displaying them.

---

## 27. Data & Evidence

For the prototype:
- Use synthetic patient information for the demo.
- Use sample healthcare documents that are safe to demonstrate.
- Document the source of any external healthcare information.
- Do not use real patient information without appropriate authorization.

---

## 28. Feasibility & Scalability

The system should be structured so additional functionality can be added later.

### Future Possibilities

```text
Clinic integrations
Electronic health record integrations
Calendar synchronization
Notification services
Accessibility enhancements
Mobile application
Advanced document organization
Multilingual support
Additional caregiver roles
```

These are future-scope features and should not be presented as implemented functionality.

---

## 29. MVP Scope

### Required

- Authentication
- Patient dashboard
- Appointment CRUD
- Document upload
- Document storage
- Database persistence
- Reminder system
- Healthcare timeline
- Caregiver access
- AI document summary
- Role-based access
- Deployed frontend
- Deployed backend
- Live database
- Functional API

### Optional

- Advanced animations
- Advanced analytics
- Calendar integration
- Email notifications
- Multilingual support
- Advanced search
- Clinic integrations

**Core functionality must be completed before optional features.**

---

## 30. Testing Requirements

### Authentication
- Register
- Login
- Logout
- Invalid credentials

### Appointments
- Create
- Read
- Update
- Delete
- Status changes

### Documents
- Upload
- View
- Delete
- AI summary
- Unauthorized access

### Caregiver
- Add caregiver
- Share information
- Remove access
- Verify unauthorized access

### Deployment

Test the production URL, not only localhost.

Verify:

```text
Frontend → Backend → Database
Frontend → Backend → Storage
Frontend → Backend → AI API
Authentication → Protected Routes
```

---

## 31. Deployment Checklist

```text
[ ] Frontend deployed
[ ] Backend deployed
[ ] Database live
[ ] Storage live
[ ] Environment variables configured
[ ] Authentication working
[ ] API endpoints working
[ ] Database CRUD working
[ ] Document upload working
[ ] AI functionality working
[ ] Caregiver access working
[ ] Production testing completed
[ ] No localhost URLs in production
[ ] No API keys exposed
[ ] Demo account/data prepared
```

---

## 32. Hackathon Evaluation Alignment

| Evaluation Area | CareFlow Demonstration |
|---|---|
| Problem Identification | Fragmented healthcare information and workflow |
| Real-World Relevance | Patients and caregivers |
| Solution & Feasibility | Centralized healthcare workflow platform |
| Working Prototype | Full-stack deployed application |
| Technical Implementation | React + Node.js + PostgreSQL + AI + storage |
| Innovation | Healthcare journey + caregiver collaboration + AI document understanding |
| Impact | Better organization and accessibility of healthcare information |
| Final Demo | Complete patient → caregiver workflow |

---

## 33. Final Presentation Flow

```text
1. Problem
       ↓
2. Target Users
       ↓
3. Evidence / Real-world relevance
       ↓
4. CareFlow Solution
       ↓
5. Architecture
       ↓
6. Patient Dashboard
       ↓
7. Appointment Creation
       ↓
8. Document Upload
       ↓
9. AI Document Summary
       ↓
10. Reminder
       ↓
11. Healthcare Timeline
       ↓
12. Caregiver Dashboard
       ↓
13. Technical Implementation
       ↓
14. Impact
       ↓
15. Limitations & Future Scope
```

---

## 34. Definition of Done

CareFlow is considered complete when:

- A new user can register.
- A patient can log in.
- Patient information persists in the database.
- A patient can create an appointment.
- Appointment information persists after refresh.
- A patient can upload a document.
- The document is stored securely.
- The document can be retrieved.
- AI can generate an informational summary.
- The patient can create a reminder.
- Timeline events are generated.
- A caregiver can be connected.
- Caregiver permissions are enforced.
- Admin functionality works.
- Backend APIs are deployed.
- Database is live.
- Frontend is deployed.
- Production environment works without localhost dependencies.

---

## 35. Important Constraints

CareFlow must:

1. Be a full-stack application, not a frontend-only prototype.
2. Have a working backend.
3. Have a persistent database.
4. Have functional APIs.
5. Have working integrations.
6. Have a deployed production environment.
7. Clearly distinguish implemented features from future scope.
8. Avoid unsupported medical diagnosis/treatment claims.
9. Keep healthcare information access controlled.
10. Prioritize the core user workflow before advanced features.

---

## 36. Project Structure

Recommended structure:

```text
careflow/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── models/
│   │   ├── utils/
│   │   └── config/
│   └── package.json
│
├── database/
│   ├── migrations/
│   └── seed/
│
├── .env.example
├── README.md
└── package.json
```

---

## 37. Final Product Vision

CareFlow should feel like a single digital home for a patient's healthcare journey.

Instead of information being scattered between files, messages, calendars, and family members, CareFlow connects:

```text
Appointments
     +
Documents
     +
Reminders
     +
Timeline
     +
Caregiver
     +
AI Document Understanding
     ↓
       CAREFLOW
```

The primary objective is not to build the largest healthcare platform possible.

The objective is to build a clear, practical, secure, and fully functional healthcare workflow prototype that solves a real user problem and can be demonstrated end-to-end.
