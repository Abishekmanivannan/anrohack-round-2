import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Appointment } from '../types';
import { appointmentsApi } from '../api/appointments';
import { Calendar, Plus, Search, Stethoscope } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Tabs } from '../components/ui/Tabs';
import { AppointmentCard } from '../components/domain/AppointmentCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';

export const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    appointmentId: string | null;
    newStatus: Appointment['status'] | 'DELETE' | null;
    title: string;
  }>({
    isOpen: false,
    appointmentId: null,
    newStatus: null,
    title: '',
  });

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await appointmentsApi.getAppointments(user?.id);
      setAppointments(data);
    } catch (err) {
      showToast('Failed to load appointments', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const upcomingList = appointments.filter(a => a.status === 'UPCOMING');
  const pastList = appointments.filter(a => a.status === 'COMPLETED');
  const cancelledList = appointments.filter(a => a.status === 'CANCELLED');

  const getFilteredList = () => {
    let list = appointments;
    if (activeTab === 'upcoming') list = upcomingList;
    else if (activeTab === 'past') list = pastList;
    else if (activeTab === 'cancelled') list = cancelledList;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        a =>
          a.provider_name.toLowerCase().includes(q) ||
          a.clinic_name.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const handleStatusChangeClick = (id: string, status: Appointment['status']) => {
    setConfirmModal({
      isOpen: true,
      appointmentId: id,
      newStatus: status,
      title: status === 'COMPLETED' ? 'Mark Appointment Completed?' : 'Cancel Appointment?',
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.appointmentId || !confirmModal.newStatus) return;

    try {
      if (confirmModal.newStatus === 'DELETE') {
        await appointmentsApi.deleteAppointment(confirmModal.appointmentId);
        showToast('Appointment removed', 'info');
      } else {
        await appointmentsApi.updateAppointment(confirmModal.appointmentId, {
          status: confirmModal.newStatus,
        });
        showToast(`Appointment status updated to ${confirmModal.newStatus}`, 'success');
      }
      loadAppointments();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setConfirmModal({ isOpen: false, appointmentId: null, newStatus: null, title: '' });
    }
  };

  const filteredAppointments = getFilteredList();

  return (
    <div className="space-y-6 text-white">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Stethoscope className="w-6 h-6 text-teal-400" />
            Appointments Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Book, edit, cancel, and track clinical visits across healthcare providers
          </p>
        </div>

        <Link to="/appointments/new">
          <Button variant="gradient" size="md" icon={<Plus className="w-4 h-4" />}>
            Book New Appointment
          </Button>
        </Link>
      </div>

      {/* Filter Bar & Tabs */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: 'upcoming', label: 'Upcoming', count: upcomingList.length },
              { id: 'past', label: 'Completed', count: pastList.length },
              { id: 'cancelled', label: 'Cancelled', count: cancelledList.length },
              { id: 'all', label: 'All Visits', count: appointments.length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="w-full md:w-64">
            <Input
              placeholder="Search doctor, clinic..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAppointments.map(apt => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onSelect={a => navigate(`/appointments/${a.id}`)}
              onStatusChange={handleStatusChangeClick}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Calendar className="w-8 h-8" />}
          title={`No ${activeTab} appointments found`}
          description={
            searchQuery
              ? `No appointments matching "${searchQuery}".`
              : 'You currently have no appointments listed in this category.'
          }
          actionLabel="Book Appointment"
          onAction={() => navigate('/appointments/new')}
          actionIcon={<Plus className="w-4 h-4" />}
        />
      )}

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        title={confirmModal.title}
        description="Are you sure you want to proceed with this appointment status change?"
      >
        <div className="py-4 flex justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          >
            Go Back
          </Button>
          <Button variant="gradient" size="sm" onClick={handleConfirmAction}>
            Confirm Change
          </Button>
        </div>
      </Modal>
    </div>
  );
};
