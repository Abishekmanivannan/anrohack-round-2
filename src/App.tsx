import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Patient Pages
import { DashboardPage } from './pages/DashboardPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { NewAppointmentPage } from './pages/NewAppointmentPage';
import { AppointmentDetailsPage } from './pages/AppointmentDetailsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { DocumentDetailsPage } from './pages/DocumentDetailsPage';
import { RemindersPage } from './pages/RemindersPage';
import { TimelinePage } from './pages/TimelinePage';
import { CaregiverPage } from './pages/CaregiverPage';
import { ProfilePage } from './pages/ProfilePage';

// Caregiver Pages
import { CaregiverDashboardPage } from './pages/CaregiverDashboardPage';
import { CaregiverPatientPage } from './pages/CaregiverPatientPage';

// Admin Pages
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminAppointmentsPage } from './pages/AdminAppointmentsPage';
import { AdminPatientsPage } from './pages/AdminPatientsPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
          <Router>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Application Routes inside MainLayout */}
            <Route element={<MainLayout />}>
              {/* Patient Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'CAREGIVER', 'ADMIN']}>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'CAREGIVER', 'ADMIN']}>
                    <AppointmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/new"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'ADMIN']}>
                    <NewAppointmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/:id"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'CAREGIVER', 'ADMIN']}>
                    <AppointmentDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'CAREGIVER', 'ADMIN']}>
                    <DocumentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents/:id"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'CAREGIVER', 'ADMIN']}>
                    <DocumentDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reminders"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'CAREGIVER', 'ADMIN']}>
                    <RemindersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/timeline"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'CAREGIVER', 'ADMIN']}>
                    <TimelinePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/caregiver"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'CAREGIVER', 'ADMIN']}>
                    <CaregiverPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['PATIENT', 'CAREGIVER', 'ADMIN']}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Caregiver Routes */}
              <Route
                path="/caregiver/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['CAREGIVER', 'PATIENT', 'ADMIN']}>
                    <CaregiverDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/caregiver/patients"
                element={
                  <ProtectedRoute allowedRoles={['CAREGIVER', 'PATIENT', 'ADMIN']}>
                    <CaregiverDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/caregiver/patients/:patientId"
                element={
                  <ProtectedRoute allowedRoles={['CAREGIVER', 'PATIENT', 'ADMIN']}>
                    <CaregiverPatientPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PATIENT', 'CAREGIVER']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PATIENT', 'CAREGIVER']}>
                    <AdminAppointmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/patients"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'PATIENT', 'CAREGIVER']}>
                    <AdminPatientsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Router>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
