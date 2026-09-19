import React, { useState, useEffect } from 'react';
import { Appointment, AppointmentStatus } from '../types';
import { adminApi } from '../api/admin';
import { Calendar, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';

export const AdminAppointmentsPage: React.FC = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    appointment: Appointment | null;
  }>({
    isOpen: false,
    appointment: null,
  });

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getAllAppointments();
      setAppointments(data);
    } catch (err) {
      showToast('Failed to load clinic appointments', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleUpdateStatus = async (status: AppointmentStatus) => {
    if (!statusModal.appointment) return;
    try {
      await adminApi.updateAppointmentStatus(statusModal.appointment.id, status);
      showToast(`Appointment status updated to ${status}`, 'success');
      setStatusModal({ isOpen: false, appointment: null });
      loadAppointments();
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  const getFilteredAppointments = () => {
    let list = appointments;
    if (statusFilter !== 'ALL') {
      list = list.filter(a => a.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        a =>
          a.provider_name.toLowerCase().includes(q) ||
          a.patient_name?.toLowerCase().includes(q) ||
          a.clinic_name.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const filtered = getFilteredAppointments();

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Calendar className="w-6 h-6 text-rose-400" />
          Clinic Appointments Queue
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review clinic appointments, update status, and manage doctor schedules
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search patient, provider..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'UPCOMING', label: 'Upcoming Only' },
              { value: 'COMPLETED', label: 'Completed Only' },
              { value: 'CANCELLED', label: 'Cancelled Only' },
            ]}
          />
        </div>
      </div>

      {/* Appointments Data Table */}
      <Card className="p-0 overflow-hidden bg-slate-900 border-white/10">
        {isLoading ? (
          <div className="p-6">
            <Skeleton className="h-48" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Provider & Clinic</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filtered.map(apt => (
                  <tr key={apt.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">
                      {apt.patient_name || 'Alex Morgan'}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-200">{apt.provider_name}</div>
                      <div className="text-[11px] text-slate-400">{apt.clinic_name}</div>
                    </td>
                    <td className="p-4 font-semibold text-teal-400">{apt.department}</td>
                    <td className="p-4">
                      {apt.appointment_date} @ {apt.appointment_time}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          apt.status === 'UPCOMING'
                            ? 'teal'
                            : apt.status === 'COMPLETED'
                            ? 'emerald'
                            : 'rose'
                        }
                      >
                        {apt.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStatusModal({ isOpen: true, appointment: apt })}
                      >
                        Update Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">
            No clinic appointments found matching your search.
          </div>
        )}
      </Card>

      {/* Status Update Modal */}
      <Modal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, appointment: null })}
        title="Update Appointment Status"
        description={`Set status for visit with ${statusModal.appointment?.provider_name}`}
      >
        <div className="py-4 space-y-3">
          <Button
            variant="primary"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
            onClick={() => handleUpdateStatus('COMPLETED')}
            icon={<CheckCircle className="w-4 h-4" />}
          >
            Mark as COMPLETED
          </Button>

          <Button
            variant="outline"
            className="w-full text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
            onClick={() => handleUpdateStatus('CANCELLED')}
            icon={<XCircle className="w-4 h-4" />}
          >
            Mark as CANCELLED
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => handleUpdateStatus('UPCOMING')}
            icon={<Clock className="w-4 h-4" />}
          >
            Revert to UPCOMING
          </Button>
        </div>
      </Modal>
    </div>
  );
};
