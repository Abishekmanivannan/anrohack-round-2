import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CaregiverAccess, Appointment, Document, Reminder, TimelineEvent } from '../types';
import { caregiversApi } from '../api/caregivers';
import { appointmentsApi } from '../api/appointments';
import { documentsApi } from '../api/documents';
import { remindersApi } from '../api/reminders';
import { timelineApi } from '../api/timeline';
import {
  ArrowLeft,
  ShieldCheck,
  Calendar,
  FileText,
  Bell,
  Lock,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Skeleton } from '../components/ui/Skeleton';
import { AppointmentCard } from '../components/domain/AppointmentCard';
import { DocumentCard } from '../components/domain/DocumentCard';
import { ReminderCard } from '../components/domain/ReminderCard';

export const CaregiverPatientPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [access, setAccess] = useState<CaregiverAccess | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPatientRecords = async () => {
    if (!patientId) return;
    setIsLoading(true);
    try {
      const caregiverId = user?.id || 'caregiver-1';
      const patientsRes = await caregiversApi.getConnectedPatients(caregiverId);
      const match = patientsRes.find(p => p.patient_id === patientId) || patientsRes[0];

      if (match) {
        setAccess(match);
        const pId = match.patient_id;

        const promises: Promise<any>[] = [];
        if (match.permissions.includes('appointments')) {
          promises.push(appointmentsApi.getAppointments(pId));
        } else promises.push(Promise.resolve([]));

        if (match.permissions.includes('documents')) {
          promises.push(documentsApi.getDocuments(pId));
        } else promises.push(Promise.resolve([]));

        if (match.permissions.includes('reminders')) {
          promises.push(remindersApi.getReminders(pId));
        } else promises.push(Promise.resolve([]));

        if (match.permissions.includes('timeline')) {
          promises.push(timelineApi.getTimelineEvents(pId));
        } else promises.push(Promise.resolve([]));

        const [apts, docs, rems] = await Promise.all(promises);
        setAppointments(apts);
        setDocuments(docs);
        setReminders(rems);
      }
    } catch (err) {
      console.error('Error fetching patient records', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatientRecords();
  }, [patientId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white">
      <button
        onClick={() => navigate('/caregiver/dashboard')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Caregiver Overview
      </button>

      {/* Patient Card */}
      <Card className="p-6 bg-slate-900 border-indigo-500/20">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Avatar name={access?.patient_name || 'Alex Morgan'} size="xl" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{access?.patient_name}</h1>
                <Badge variant="emerald">ACTIVE CAREGIVER ACCESS</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Connected Patient #101 • Primary Contact: Alex Morgan
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-indigo-300">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="font-semibold">Granted Permissions:</span>
          <div className="flex gap-1.5 flex-wrap">
            {access?.permissions.map(p => (
              <Badge key={p} variant="purple" size="sm">
                {p}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Granted Information Sections */}
      <div className="space-y-6">
        {/* Appointments */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-400" />
            Patient Appointments ({appointments.length})
          </h3>
          {access?.permissions.includes('appointments') ? (
            appointments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {appointments.map(apt => (
                  <AppointmentCard key={apt.id} appointment={apt} showActions={false} />
                ))}
              </div>
            ) : (
              <Card className="py-6 text-center text-xs text-slate-400 bg-slate-900">
                No appointments listed.
              </Card>
            )
          ) : (
            <Card className="py-6 text-center text-xs text-slate-400 bg-slate-950/60 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              Appointments view restricted by patient access control.
            </Card>
          )}
        </div>

        {/* Medical Documents */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Medical Documents & Lab Reports ({documents.length})
          </h3>
          {access?.permissions.includes('documents') ? (
            documents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onSelect={d => navigate(`/documents/${d.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card className="py-6 text-center text-xs text-slate-400 bg-slate-900">
                No documents shared.
              </Card>
            )
          ) : (
            <Card className="py-6 text-center text-xs text-slate-400 bg-slate-950/60 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              Documents view restricted by patient access control.
            </Card>
          )}
        </div>

        {/* Reminders */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            Follow-up Reminders ({reminders.length})
          </h3>
          {access?.permissions.includes('reminders') ? (
            reminders.length > 0 ? (
              <div className="space-y-2">
                {reminders.map(rem => (
                  <ReminderCard key={rem.id} reminder={rem} onToggleStatus={() => {}} />
                ))}
              </div>
            ) : (
              <Card className="py-6 text-center text-xs text-slate-400 bg-slate-900">
                No reminders listed.
              </Card>
            )
          ) : (
            <Card className="py-6 text-center text-xs text-slate-400 bg-slate-950/60 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              Reminders view restricted by patient access control.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
