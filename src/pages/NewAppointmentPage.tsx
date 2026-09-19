import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentsApi } from '../api/appointments';
import { ArrowLeft, Stethoscope, Calendar, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Card } from '../components/ui/Card';
import { useToast } from '../context/ToastContext';

export const NewAppointmentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [providerName, setProviderName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [department, setDepartment] = useState('General Practice');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName || !clinicName || !date) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await appointmentsApi.createAppointment({
        patient_id: user?.id || 'patient-1',
        patient_name: user?.name || 'Alex Morgan',
        provider_name: providerName,
        clinic_name: clinicName,
        department,
        appointment_date: date,
        appointment_time: time,
        purpose,
        notes,
      });

      showToast('Appointment successfully scheduled!', 'success');
      navigate('/appointments');
    } catch (err: any) {
      showToast(err.message || 'Failed to schedule appointment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-white">
      {/* Back button */}
      <button
        onClick={() => navigate('/appointments')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-teal-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Appointments
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-teal-400" />
          Schedule Healthcare Visit
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Enter appointment details to track upcoming provider visits and generate timeline reminders.
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-6 sm:p-8 bg-slate-900 border-white/10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Doctor / Provider Name *"
              placeholder="e.g. Dr. Elena Rostova"
              value={providerName}
              onChange={e => setProviderName(e.target.value)}
              required
              icon={<Stethoscope className="w-4 h-4" />}
            />

            <Input
              label="Clinic / Hospital Name *"
              placeholder="e.g. Metro General Health"
              value={clinicName}
              onChange={e => setClinicName(e.target.value)}
              required
              icon={<MapPin className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Department *"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              options={[
                { value: 'General Practice', label: 'General Practice / PCP' },
                { value: 'Cardiology', label: 'Cardiology' },
                { value: 'Dermatology', label: 'Dermatology' },
                { value: 'Neurology', label: 'Neurology' },
                { value: 'Orthopedics', label: 'Orthopedics' },
                { value: 'Ophthalmology', label: 'Ophthalmology' },
                { value: 'Pediatrics', label: 'Pediatrics' },
                { value: 'Other', label: 'Other Specialization' },
              ]}
            />

            <Input
              label="Date *"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              icon={<Calendar className="w-4 h-4" />}
            />

            <Select
              label="Time *"
              value={time}
              onChange={e => setTime(e.target.value)}
              options={[
                { value: '08:00 AM', label: '08:00 AM' },
                { value: '09:00 AM', label: '09:00 AM' },
                { value: '10:30 AM', label: '10:30 AM' },
                { value: '11:15 AM', label: '11:15 AM' },
                { value: '01:30 PM', label: '01:30 PM' },
                { value: '02:15 PM', label: '02:15 PM' },
                { value: '03:45 PM', label: '03:45 PM' },
                { value: '04:30 PM', label: '04:30 PM' },
              ]}
            />
          </div>

          <Input
            label="Purpose of Visit"
            placeholder="e.g. Routine 6-month checkup, follow-up on lab report"
            value={purpose}
            onChange={e => setPurpose(e.target.value)}
            icon={<FileText className="w-4 h-4" />}
          />

          <Textarea
            label="Doctor Notes & Instructions"
            placeholder="Add any specific questions to ask or preparation instructions (e.g. fast for 10 hours)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
          />

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/appointments')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="gradient"
              isLoading={isSubmitting}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Save Appointment
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
