import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CaregiverAccess, Appointment, Document, Reminder, TimelineEvent } from '../types';
import { caregiversApi } from '../api/caregivers';
import { appointmentsApi } from '../api/appointments';
import { documentsApi } from '../api/documents';
import { remindersApi } from '../api/reminders';
import { timelineApi } from '../api/timeline';
import {
  Users,
  Calendar,
  FileText,
  Bell,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Skeleton } from '../components/ui/Skeleton';
import { AppointmentCard } from '../components/domain/AppointmentCard';
import { DocumentCard } from '../components/domain/DocumentCard';
import { ReminderCard } from '../components/domain/ReminderCard';
import { TimelineItem } from '../components/domain/TimelineItem';
import { BadgePulse } from '../components/react-bits/BadgePulse';
import { useToast } from '../context/ToastContext';

export const CaregiverDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [connectedPatients, setConnectedPatients] = useState<CaregiverAccess[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCaregiverDashboard = async () => {
    setIsLoading(true);
    try {
      const caregiverId = user?.id || 'caregiver-1';
      const patientsRes = await caregiversApi.getConnectedPatients(caregiverId);
      setConnectedPatients(patientsRes);

      if (patientsRes.length > 0) {
        const primaryAccess = patientsRes[0];
        const pId = primaryAccess.patient_id;

        const promises: Promise<any>[] = [];
        if (primaryAccess.permissions.includes('appointments')) {
          promises.push(appointmentsApi.getAppointments(pId));
        } else promises.push(Promise.resolve([]));

        if (primaryAccess.permissions.includes('documents')) {
          promises.push(documentsApi.getDocuments(pId));
        } else promises.push(Promise.resolve([]));

        if (primaryAccess.permissions.includes('reminders')) {
          promises.push(remindersApi.getReminders(pId));
        } else promises.push(Promise.resolve([]));

        if (primaryAccess.permissions.includes('timeline')) {
          promises.push(timelineApi.getTimelineEvents(pId));
        } else promises.push(Promise.resolve([]));

        const [apts, docs, rems, timeEvts] = await Promise.all(promises);
        setAppointments(apts);
        setDocuments(docs);
        setReminders(rems);
        setTimeline(timeEvts);
      }
    } catch (err) {
      showToast('Failed to load caregiver dashboard', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCaregiverDashboard();
  }, [user]);

  const activePatientAccess = connectedPatients[0];
  const upcomingApts = appointments.filter(a => a.status === 'UPCOMING');

  return (
    <div className="space-y-8 text-white">
      {/* Caregiver Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 border border-indigo-500/20 text-white p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 space-y-2">
          <BadgePulse color="indigo" label="CAREGIVER SUPPORT PORTAL" />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            Family Caregiver Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Monitor healthcare updates, upcoming visits, and medical records shared with you by your connected patients.
          </p>
        </div>
      </div>

      {/* Connected Patients Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          Connected Patients
        </h3>

        {isLoading ? (
          <Skeleton className="h-28" />
        ) : connectedPatients.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {connectedPatients.map(access => (
              <Card
                key={access.id}
                hoverable
                onClick={() => navigate(`/caregiver/patients/${access.patient_id}`)}
                className="bg-slate-900 border-indigo-500/20 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={access.patient_name || 'Patient'} size="lg" />
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {access.patient_name || 'Alex Morgan'}
                      </h4>
                      <p className="text-xs text-indigo-400 font-semibold mt-0.5">
                        Patient Record #101
                      </p>
                    </div>
                  </div>
                  <Badge variant="emerald">ACTIVE ACCESS</Badge>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    Permissions: {access.permissions.join(', ')}
                  </div>
                  <span className="text-indigo-400 font-bold flex items-center gap-1">
                    View Patient →
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-8 text-center text-xs text-slate-400 bg-slate-900">
            No connected patients sharing records with your caregiver account.
          </Card>
        )}
      </div>

      {/* Shared Records Breakdown */}
      {activePatientAccess && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Shared Appointments & Shared Documents */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shared Appointments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  Shared Patient Appointments ({appointments.length})
                </h3>
              </div>

              {activePatientAccess.permissions.includes('appointments') ? (
                upcomingApts.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingApts.map(apt => (
                      <AppointmentCard key={apt.id} appointment={apt} showActions={false} />
                    ))}
                  </div>
                ) : (
                  <Card className="py-6 text-center text-xs text-slate-400 bg-slate-900">
                    No upcoming appointments scheduled for {activePatientAccess.patient_name}.
                  </Card>
                )
              ) : (
                <Card className="py-6 text-center text-xs text-slate-400 bg-slate-900/60">
                  🔒 Appointments category is restricted by patient permissions.
                </Card>
              )}
            </div>

            {/* Shared Documents & AI Summaries */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Shared Medical Documents ({documents.length})
              </h3>

              {activePatientAccess.permissions.includes('documents') ? (
                documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {documents.slice(0, 2).map(doc => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onSelect={d => navigate(`/documents/${d.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="py-6 text-center text-xs text-slate-400 bg-slate-900">
                    No medical documents shared yet.
                  </Card>
                )
              ) : (
                <Card className="py-6 text-center text-xs text-slate-400 bg-slate-900/60">
                  🔒 Documents category is restricted by patient permissions.
                </Card>
              )}
            </div>
          </div>

          {/* Right 1 Col: Shared Reminders & Timeline */}
          <div className="space-y-6">
            <Card className="space-y-3 bg-slate-900">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                Shared Reminders
              </h3>

              {activePatientAccess.permissions.includes('reminders') ? (
                reminders.length > 0 ? (
                  <div className="space-y-2">
                    {reminders.slice(0, 3).map(rem => (
                      <ReminderCard
                        key={rem.id}
                        reminder={rem}
                        onToggleStatus={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No active reminders.</p>
                )
              ) : (
                <p className="text-xs text-slate-400 text-center py-4 bg-slate-950/60 rounded-xl">
                  🔒 Reminders restricted by patient.
                </p>
              )}
            </Card>

            <Card className="space-y-3 bg-slate-900">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Shared Timeline Feed
              </h3>

              {activePatientAccess.permissions.includes('timeline') ? (
                timeline.length > 0 ? (
                  <div className="space-y-3">
                    {timeline.slice(0, 2).map((evt, idx) => (
                      <TimelineItem key={evt.id} event={evt} isLast={idx === 1} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No timeline events.</p>
                )
              ) : (
                <p className="text-xs text-slate-400 text-center py-4 bg-slate-950/60 rounded-xl">
                  🔒 Timeline restricted by patient.
                </p>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
