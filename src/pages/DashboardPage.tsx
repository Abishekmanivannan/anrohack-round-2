import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Appointment, Document, Reminder, TimelineEvent, CaregiverAccess } from '../types';
import { appointmentsApi } from '../api/appointments';
import { documentsApi } from '../api/documents';
import { remindersApi } from '../api/reminders';
import { timelineApi } from '../api/timeline';
import { caregiversApi } from '../api/caregivers';
import {
  Calendar,
  Plus,
  FileText,
  Bell,
  Clock,
  HeartHandshake,
  Stethoscope,
  ChevronRight,
  Activity,
  Heart,
  Droplets,
  Moon,
  ShieldCheck,
  TrendingUp,
  Zap,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AppointmentCard } from '../components/domain/AppointmentCard';
import { DocumentCard } from '../components/domain/DocumentCard';
import { ReminderCard } from '../components/domain/ReminderCard';
import { TimelineItem } from '../components/domain/TimelineItem';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { FileUploader } from '../components/ui/FileUploader';
import { AIChatbox } from '../components/AIChatbox';
import { SpotlightCard } from '../components/react-bits/SpotlightCard';
import { GlowBorder } from '../components/react-bits/GlowBorder';
import { Counter } from '../components/react-bits/Counter';
import { BlurFade } from '../components/react-bits/BlurFade';
import { BadgePulse } from '../components/react-bits/BadgePulse';
import { useToast } from '../context/ToastContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [caregivers, setCaregivers] = useState<CaregiverAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const patientId = user?.id || 'patient-1';
      const [aptsRes, docsRes, remsRes, timeRes, cgRes] = await Promise.all([
        appointmentsApi.getAppointments(patientId),
        documentsApi.getDocuments(patientId),
        remindersApi.getReminders(patientId),
        timelineApi.getTimelineEvents(patientId),
        caregiversApi.getCaregivers(patientId),
      ]);

      setAppointments(aptsRes);
      setDocuments(docsRes);
      setReminders(remsRes);
      setTimeline(timeRes);
      setCaregivers(cgRes);
    } catch (err) {
      console.error('Failed loading dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const upcomingAppointment = appointments.find(a => a.status === 'UPCOMING');
  const recentDocuments = documents.slice(0, 2);
  const pendingReminders = reminders.filter(r => r.status === 'PENDING').slice(0, 3);
  const timelinePreview = timeline.slice(0, 3);
  const activeCaregiver = caregivers.find(c => c.status === 'ACTIVE');

  const handleDocumentUploaded = async (fileData: { name: string; size: string; category: any }) => {
    try {
      await documentsApi.uploadDocument({
        patient_id: user?.id || 'patient-1',
        file_name: fileData.name,
        file_size: fileData.size,
        category: fileData.category,
      });
      showToast('Document uploaded and added to your healthcare vault!', 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    }
  };

  const handleToggleReminder = async (id: string, currentStatus: Reminder['status']) => {
    try {
      await remindersApi.toggleStatus(id, currentStatus);
      showToast('Reminder status updated', 'success');
      loadDashboardData();
    } catch (err: any) {
      showToast('Failed to update reminder', 'error');
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Top Banner Greeting */}
      <BlurFade delay={0.1}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 border border-teal-500/20 text-white p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <BadgePulse color="teal" label="PATIENT HEALTHCARE DASHBOARD" />
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 text-white">
                Welcome back, {user?.name || 'Alex Morgan'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Your centralized digital health dashboard. Manage clinical visits, medical lab reports, AI summaries, follow-up reminders, and caregiver access.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Link to="/appointments/new">
                <Button
                  variant="gradient"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Book Visit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUploadModal(true)}
                icon={<FileText className="w-4 h-4" />}
              >
                Upload Document
              </Button>
            </div>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.15}>
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.9fr] gap-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <SpotlightCard>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Upcoming Visits
                  </span>
                  <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  <Counter value={appointments.filter(a => a.status === 'UPCOMING').length} />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Scheduled visits</span>
              </SpotlightCard>

              <SpotlightCard>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Medical Vault
                  </span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  <Counter value={documents.length} />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Uploaded documents</span>
              </SpotlightCard>

              <SpotlightCard>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Pending Actions
                  </span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Bell className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  <Counter value={pendingReminders.length} />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Reminders due</span>
              </SpotlightCard>

              <SpotlightCard>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Caregiver Link
                  </span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-sm font-bold text-white mt-3 truncate">
                  {activeCaregiver ? activeCaregiver.caregiver_name : 'No Link'}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Active caregiver access</span>
              </SpotlightCard>

              <SpotlightCard>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Vitals Score
                  </span>
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white mt-2 flex items-baseline gap-1">
                  <Counter value={98} />
                  <span className="text-xs font-bold text-teal-400">%</span>
                </div>
                <span className="text-[11px] text-teal-400 mt-1 block">Optimal status</span>
              </SpotlightCard>

              <SpotlightCard>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    AI Summaries
                  </span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  <Counter value={documents.length} />
                </div>
                <span className="text-[11px] text-purple-400 mt-1 block">Reports analyzed</span>
              </SpotlightCard>
            </div>
          </div>

          <div className="h-full">
            <AIChatbox />
          </div>
        </div>
      </BlurFade>

      {/* Quick Action Dock */}
      <BlurFade delay={0.2}>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <Link to="/appointments/new">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-card hover:border-teal-500 transition-all flex items-center gap-3 group cursor-pointer">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:bg-teal-500 group-hover:text-white dark:group-hover:text-slate-950 transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                  Book Visit
                </span>
              </div>
            </Link>

            <div
              onClick={() => setShowUploadModal(true)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-card hover:border-indigo-500 transition-all flex items-center gap-3 group cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Upload Doc
              </span>
            </div>

            <Link to="/reminders">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-card hover:border-amber-500 transition-all flex items-center gap-3 group cursor-pointer">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white dark:group-hover:text-slate-950 transition-colors">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  Set Reminder
                </span>
              </div>
            </Link>

            <Link to="/timeline">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-card hover:border-emerald-500 transition-all flex items-center gap-3 group cursor-pointer">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-slate-950 transition-colors">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  View Timeline
                </span>
              </div>
            </Link>

            <Link to="/caregiver">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-card hover:border-purple-500 transition-all flex items-center gap-3 group cursor-pointer col-span-2 sm:col-span-1">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Caregiver
                </span>
              </div>
            </Link>
          </div>
        </div>
      </BlurFade>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Upcoming Appointment & Recent Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Upcoming Appointment Highlight */}
          <BlurFade delay={0.25}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                  Upcoming Appointment
                </h3>
                <Link
                  to="/appointments"
                  className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1"
                >
                  View all ({appointments.length}) <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {isLoading ? (
                <Skeleton className="h-32" />
              ) : upcomingAppointment ? (
                <GlowBorder glowColor="from-teal-500 via-teal-400 to-emerald-400">
                  <AppointmentCard
                    appointment={upcomingAppointment}
                    onSelect={apt => navigate(`/appointments`)}
                  />
                </GlowBorder>
              ) : (
                <Card className="text-center py-8">
                  <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">No Upcoming Appointments</p>
                  <p className="text-xs text-slate-400 mt-0.5">Schedule your next doctor visit.</p>
                  <div className="mt-4">
                    <Link to="/appointments/new">
                      <Button variant="gradient" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </Card>
              )}
            </div>
          </BlurFade>

          {/* Recent Medical Documents Vault */}
          <BlurFade delay={0.3}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Recent Documents & AI Summaries
                </h3>
                <Link
                  to="/documents"
                  className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1"
                >
                  View vault ({documents.length}) <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Skeleton className="h-40" />
                  <Skeleton className="h-40" />
                </div>
              ) : recentDocuments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recentDocuments.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onSelect={d => navigate(`/documents/${d.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-8">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">No Documents Uploaded</p>
                  <p className="text-xs text-slate-400 mt-0.5">Upload lab results for AI summary.</p>
                  <div className="mt-4">
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => setShowUploadModal(true)}
                      icon={<FileText className="w-3.5 h-3.5" />}
                    >
                      Upload Document
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </BlurFade>
        </div>

        {/* Right 1 Column: Reminders, Caregiver Access, Timeline Preview */}
        <div className="space-y-6">
          <BlurFade delay={0.35}>
            {/* Pending Reminders */}
            <Card className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  Pending Reminders
                </h3>
                <Link to="/reminders" className="text-xs font-semibold text-teal-400 hover:underline">
                  Manage
                </Link>
              </div>

              {isLoading ? (
                <Skeleton className="h-24" />
              ) : pendingReminders.length > 0 ? (
                <div className="space-y-2.5">
                  {pendingReminders.map(rem => (
                    <ReminderCard
                      key={rem.id}
                      reminder={rem}
                      onToggleStatus={handleToggleReminder}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No pending reminders.</p>
              )}
            </Card>
          </BlurFade>

          <BlurFade delay={0.4}>
            {/* Caregiver Access Card */}
            <Card className="bg-slate-900 border-indigo-500/20">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Caregiver Access
                    </h4>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {activeCaregiver ? activeCaregiver.caregiver_name : 'No Active Caregiver'}
                    </p>
                  </div>
                </div>
                <Badge variant={activeCaregiver ? 'emerald' : 'amber'}>
                  {activeCaregiver ? 'CONNECTED' : 'UNLINKED'}
                </Badge>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {activeCaregiver
                  ? `Sharing ${activeCaregiver.permissions.join(', ')} with ${activeCaregiver.caregiver_name}.`
                  : 'Grant controlled access to family members to help monitor your health records.'}
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                <Link to="/caregiver">
                  <Button variant="outline" size="sm" className="text-indigo-300 border-indigo-500/30 text-xs">
                    Manage Access →
                  </Button>
                </Link>
              </div>
            </Card>
          </BlurFade>

          <BlurFade delay={0.45}>
            {/* Timeline Preview */}
            <Card className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Healthcare Timeline
                </h3>
                <Link to="/timeline" className="text-xs font-semibold text-teal-400 hover:underline">
                  Full View
                </Link>
              </div>

              {isLoading ? (
                <Skeleton className="h-32" />
              ) : timelinePreview.length > 0 ? (
                <div className="space-y-3 pt-1">
                  {timelinePreview.map((evt, idx) => (
                    <TimelineItem
                      key={evt.id}
                      event={evt}
                      isLast={idx === timelinePreview.length - 1}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No events in timeline yet.</p>
              )}
            </Card>
          </BlurFade>
        </div>
      </div>

      {/* Live Health Vitals & Telemetry Radar Section */}
      <BlurFade delay={0.5}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                Live Vitals & Clinical Telemetry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synchronized health telemetry, daily metrics, and optimal vital thresholds.
              </p>
            </div>
            <Badge variant="teal" size="sm" className="w-fit">
              LIVE SENSOR MONITORING
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-teal-500/40 transition-all">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">Heart Rate</span>
                <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400 animate-pulse" />
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                72 <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">BPM</span>
              </div>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Resting Normal
              </p>
            </Card>

            <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-teal-500/40 transition-all">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">Blood Pressure</span>
                <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                120/80 <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">mmHg</span>
              </div>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Optimal Range
              </p>
            </Card>

            <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-teal-500/40 transition-all">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">Blood Oxygen</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                99 <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">% SpO2</span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Excellent
              </p>
            </Card>

            <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-teal-500/40 transition-all">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">Hydration</span>
                <Droplets className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                2.4 <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">L / 3.0L</span>
              </div>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1 flex items-center gap-1">
                <Zap className="w-3 h-3" /> 80% Target Met
              </p>
            </Card>

            <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-teal-500/40 transition-all">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">Sleep Index</span>
                <Moon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                7.8 <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Hours</span>
              </div>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Deep Recovery
              </p>
            </Card>

            <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-teal-500/40 transition-all">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">Fasting Glucose</span>
                <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-white">
                92 <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">mg/dL</span>
              </div>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Normal Range
              </p>
            </Card>
          </div>
        </div>
      </BlurFade>

      {/* Preventative Health Action Plan Radar */}
      <BlurFade delay={0.55}>
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-none space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Preventative Health & Clinical Recommendations Radar
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                AI-driven preventive screening reminders based on your clinical history and lab records.
              </p>
            </div>
            <Badge variant="purple" size="sm">
              4 ACTIVE ACTIONS
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-2">
              <div className="flex items-center justify-between text-teal-300">
                <span className="text-xs font-bold uppercase">Annual Screening</span>
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Cardiovascular Checkup</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Recommended routine ECG and blood lipid panel review with Dr. Sarah Jenkins.
              </p>
              <div className="text-[11px] font-semibold text-teal-400 pt-1">Due Oct 2026</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between text-amber-300">
                <span className="text-xs font-bold uppercase">Lab Retest</span>
                <AlertCircle className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Vitamin D3 & Iron Check</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Follow-up lab draw to confirm vitamin D supplementation efficacy after 90 days.
              </p>
              <div className="text-[11px] font-semibold text-amber-400 pt-1">Scheduled Sept 28</div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between text-indigo-300">
                <span className="text-xs font-bold uppercase">Vaccination</span>
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Annual Flu & Booster</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seasonal flu protection booster appointment recommended for autumn clinical protection.
              </p>
              <div className="text-[11px] font-semibold text-indigo-400 pt-1">Recommended</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between text-emerald-300">
                <span className="text-xs font-bold uppercase">Caregiver Sync</span>
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Caregiver Permission Review</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Re-verify access rights for Eleanor Vance for appointment and prescription logs.
              </p>
              <div className="text-[11px] font-semibold text-emerald-400 pt-1">Up-to-Date</div>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Upload Document Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Healthcare Document"
        description="Select a medical lab report or discharge summary to add to your vault and generate an AI plain-language overview."
        maxWidth="lg"
      >
        <FileUploader
          onUpload={handleDocumentUploaded}
          onClose={() => setShowUploadModal(false)}
        />
      </Modal>
    </div>
  );
};
