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
  Edit3,
  Save,
  X,
  Clock,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../context/ToastContext';

export const AppointmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editProvider, setEditProvider] = useState('');
  const [editClinic, setEditClinic] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editPurpose, setEditPurpose] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const loadAppointment = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentsApi.getAppointmentById(id);
      setAppointment(data);
      // Populate edit fields
      setEditProvider(data.provider_name);
      setEditClinic(data.clinic_name);
      setEditDepartment(data.department);
      setEditDate(data.appointment_date);
      setEditTime(data.appointment_time);
      setEditPurpose(data.purpose || '');
      setEditNotes(data.notes || '');
    } catch (err: any) {
      setError(err.message || 'Appointment not found');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadAppointment(); }, [id]);

  const handleCancelEdit = () => {
    if (!appointment) return;
    setEditProvider(appointment.provider_name);
    setEditClinic(appointment.clinic_name);
    setEditDepartment(appointment.department);
    setEditDate(appointment.appointment_date);
    setEditTime(appointment.appointment_time);
    setEditPurpose(appointment.purpose || '');
    setEditNotes(appointment.notes || '');
    setIsEditing(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;
    if (!editProvider.trim() || !editClinic.trim() || !editDate) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setIsSaving(true);
    try {
      const updated = await appointmentsApi.updateAppointment(appointment.id, {
        provider_name: editProvider.trim(),
        clinic_name: editClinic.trim(),
        department: editDepartment,
        appointment_date: editDate,
        appointment_time: editTime,
        purpose: editPurpose.trim(),
        notes: editNotes.trim(),
      });
      setAppointment(updated);
      setIsEditing(false);
      showToast('Appointment updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

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

  const statusVariant: Record<string, 'teal' | 'emerald' | 'rose'> = {
    UPCOMING: 'teal',
    COMPLETED: 'emerald',
    CANCELLED: 'rose',
  };

  const departmentOptions = [
    { value: 'General Practice', label: 'General Practice / PCP' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Ophthalmology', label: 'Ophthalmology' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Other', label: 'Other Specialization' },
  ];

  const timeOptions = [
    { value: '08:00 AM', label: '08:00 AM' },
    { value: '09:00 AM', label: '09:00 AM' },
    { value: '10:30 AM', label: '10:30 AM' },
    { value: '11:15 AM', label: '11:15 AM' },
    { value: '01:30 PM', label: '01:30 PM' },
    { value: '02:15 PM', label: '02:15 PM' },
    { value: '03:45 PM', label: '03:45 PM' },
    { value: '04:30 PM', label: '04:30 PM' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-white">
      {/* Back button */}
      <button
        onClick={() => navigate('/appointments')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-teal-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Appointments
      </button>

      <motion.form onSubmit={handleSaveEdit} layout>
        <Card className="p-6 sm:p-8 space-y-6 bg-slate-900 border-white/10">

          {/* Header row */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div key="edit-provider" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}>
                      <Input
                        placeholder="Doctor / Provider Name"
                        value={editProvider}
                        onChange={e => setEditProvider(e.target.value)}
                        required
                        className="text-lg font-bold"
                      />
                    </motion.div>
                  ) : (
                    <motion.h1 key="display-provider" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-xl font-bold text-white"
                    >
                      {appointment.provider_name}
                    </motion.h1>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div key="edit-dept" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2">
                      <Select
                        value={editDepartment}
                        onChange={e => setEditDepartment(e.target.value)}
                        options={departmentOptions}
                      />
                    </motion.div>
                  ) : (
                    <motion.p key="display-dept" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="text-xs font-semibold text-teal-400 mt-0.5"
                    >
                      {appointment.department}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={statusVariant[appointment.status] || 'teal'}>
                {appointment.status}
              </Badge>

              {!isEditing && appointment.status === 'UPCOMING' && (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    icon={<Edit3 className="w-3.5 h-3.5 text-teal-400" />}
                  >
                    Edit
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {/* Clinic */}
            <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${isEditing ? 'bg-slate-900 border-teal-500/30' : 'bg-slate-950/60 border-white/10'}`}>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Clinic & Location
              </span>
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div key="edit-clinic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <input
                      value={editClinic}
                      onChange={e => setEditClinic(e.target.value)}
                      placeholder="Clinic / Hospital Name"
                      className="w-full bg-transparent text-white font-bold text-sm focus:outline-none placeholder:text-slate-500"
                      required
                    />
                  </motion.div>
                ) : (
                  <motion.p key="display-clinic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="font-bold text-white flex items-center gap-1.5"
                  >
                    <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                    {appointment.clinic_name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Date & Time */}
            <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${isEditing ? 'bg-slate-900 border-teal-500/30' : 'bg-slate-950/60 border-white/10'}`}>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Scheduled Date & Time
              </span>
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div key="edit-dt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex gap-2"
                  >
                    <input
                      type="date"
                      value={editDate}
                      onChange={e => setEditDate(e.target.value)}
                      className="flex-1 bg-transparent text-white font-bold text-sm focus:outline-none"
                      required
                    />
                    <select
                      value={editTime}
                      onChange={e => setEditTime(e.target.value)}
                      className="bg-slate-800 text-white text-xs font-semibold rounded-lg px-2 focus:outline-none border border-white/10"
                    >
                      {timeOptions.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </motion.div>
                ) : (
                  <motion.p key="display-dt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="font-bold text-white flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-teal-400" />
                    {appointment.appointment_date} at {appointment.appointment_time}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              Purpose of Visit
            </span>
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div key="edit-purpose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <input
                    value={editPurpose}
                    onChange={e => setEditPurpose(e.target.value)}
                    placeholder="e.g. Routine 6-month checkup, follow-up on lab report"
                    className="w-full bg-slate-950/60 border border-teal-500/30 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 placeholder:text-slate-500"
                  />
                </motion.div>
              ) : (
                <motion.p key="display-purpose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-white/10"
                >
                  {appointment.purpose || <span className="text-slate-500 italic">No purpose specified</span>}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Notes */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              Doctor Notes & Instructions
            </span>
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div key="edit-notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Textarea
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder="Add preparation instructions or questions for the doctor..."
                    rows={3}
                  />
                </motion.div>
              ) : (
                <motion.p key="display-notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-white/10"
                >
                  {appointment.notes || <span className="text-slate-500 italic">No notes added</span>}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Edit mode unsaved warning + save/cancel */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap"
              >
                <div className="flex items-center gap-1.5 text-xs text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Unsaved changes
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    icon={<X className="w-4 h-4" />}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    size="sm"
                    isLoading={isSaving}
                    icon={<Save className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Controls (non-edit mode) */}
          {!isEditing && (
            <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-rose-400 hover:bg-rose-500/10"
                icon={<Trash2 className="w-4 h-4" />}
              >
                Remove Appointment
              </Button>

              <div className="flex gap-2 flex-wrap">
                {appointment.status !== 'COMPLETED' && (
                  <Button
                    type="button"
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
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus('CANCELLED')}
                    icon={<XCircle className="w-4 h-4 text-rose-400" />}
                  >
                    Cancel Visit
                  </Button>
                )}
                {appointment.status === 'CANCELLED' && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUpdateStatus('UPCOMING')}
                    icon={<Clock className="w-4 h-4" />}
                  >
                    Reopen
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </motion.form>
    </div>
  );
};
