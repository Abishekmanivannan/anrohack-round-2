import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Appointment } from '../types';
import { appointmentsApi } from '../api/appointments';
import {
  ArrowLeft,
  Stethoscope,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Trash2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { useToast } from '../context/ToastContext';

export const AppointmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointment = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentsApi.getAppointmentById(id);
      setAppointment(data);
    } catch (err: any) {
      setError(err.message || 'Appointment not found');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointment();
  }, [id]);

  const handleUpdateStatus = async (status: Appointment['status']) => {
    if (!appointment) return;
    try {
      const updated = await appointmentsApi.updateAppointment(appointment.id, { status });
      setAppointment(updated);
      showToast(`Appointment marked as ${status}`, 'success');
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!appointment) return;
    try {
      await appointmentsApi.deleteAppointment(appointment.id);
      showToast('Appointment removed', 'info');
      navigate('/appointments');
    } catch (err: any) {
      showToast('Failed to delete appointment', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="max-w-xl mx-auto">
        <ErrorState message={error || 'Appointment details unavailable'} onRetry={loadAppointment} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-white">
      <button
        onClick={() => navigate('/appointments')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-teal-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Appointments
      </button>

      <Card className="p-6 sm:p-8 space-y-6 bg-slate-900 border-white/10">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{appointment.provider_name}</h1>
              <p className="text-xs font-semibold text-teal-400 mt-0.5">{appointment.department}</p>
            </div>
          </div>
          <Badge
            variant={
              appointment.status === 'UPCOMING'
                ? 'teal'
                : appointment.status === 'COMPLETED'
                ? 'emerald'
                : 'rose'
            }
          >
            {appointment.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Clinic & Location
            </span>
            <p className="font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
              {appointment.clinic_name}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Scheduled Date & Time
            </span>
            <p className="font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              {appointment.appointment_date} at {appointment.appointment_time}
            </p>
          </div>
        </div>

        {appointment.purpose && (
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Purpose of Visit
            </span>
            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-white/10">
              {appointment.purpose}
            </p>
          </div>
        )}

        {appointment.notes && (
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Doctor Notes & Instructions
            </span>
            <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-white/10">
              {appointment.notes}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-rose-400 hover:bg-rose-500/10"
            icon={<Trash2 className="w-4 h-4" />}
          >
            Remove Appointment
          </Button>

          <div className="flex gap-2">
            {appointment.status !== 'COMPLETED' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleUpdateStatus('COMPLETED')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
                icon={<CheckCircle className="w-4 h-4" />}
              >
                Mark Completed
              </Button>
            )}
            {appointment.status !== 'CANCELLED' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus('CANCELLED')}
                icon={<XCircle className="w-4 h-4 text-rose-400" />}
              >
                Cancel Visit
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
