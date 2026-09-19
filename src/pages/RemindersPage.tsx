import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Reminder } from '../types';
import { remindersApi } from '../api/reminders';
import { Bell, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Tabs } from '../components/ui/Tabs';
import { ReminderCard } from '../components/domain/ReminderCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';
import SwipeRow from '../components/react-bits/SwipeRow';
import BellToggle from '../components/react-bits/BellToggle';
import { Trash2, CheckCircle2 } from 'lucide-react';

export const RemindersPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);

  // Modal Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReminders = async () => {
    setIsLoading(true);
    try {
      const data = await remindersApi.getReminders(user?.id);
      setReminders(data);
    } catch (err) {
      showToast('Failed to load reminders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, [user]);

  const handleToggleStatus = async (id: string, currentStatus: Reminder['status']) => {
    try {
      await remindersApi.toggleStatus(id, currentStatus);
      showToast('Reminder status toggled', 'success');
      loadReminders();
    } catch (err) {
      showToast('Failed to update reminder', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remindersApi.deleteReminder(id);
      showToast('Reminder removed', 'info');
      loadReminders();
    } catch (err) {
      showToast('Failed to delete reminder', 'error');
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) {
      showToast('Please provide a title and date', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await remindersApi.createReminder({
        patient_id: user?.id || 'patient-1',
        title,
        description,
        reminder_date: date,
        reminder_time: time,
      });

      showToast('New reminder created!', 'success');
      setShowAddModal(false);
      setTitle('');
      setDescription('');
      setDate('');
      loadReminders();
    } catch (err: any) {
      showToast(err.message || 'Failed to create reminder', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingList = reminders.filter(r => r.status === 'PENDING');
  const completedList = reminders.filter(r => r.status === 'COMPLETED');
  const displayedReminders = activeTab === 'pending' ? pendingList : activeTab === 'completed' ? completedList : reminders;

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-amber-400" />
            Follow-up & Reminders
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Keep track of medication refills, laboratory tests, and healthcare actions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <BellToggle
            offLabel="Enable Reminders"
            onLabel="Reminders Active"
            size="md"
            count={pendingList.length}
            color="#94a3b8"
            background="rgba(30, 41, 59, 0.8)"
            onColor="#2dd4bf"
            onBackground="rgba(20, 184, 166, 0.2)"
            badgeColor="#14b8a6"
            defaultPressed={true}
          />

          <Button
            variant="gradient"
            size="md"
            onClick={() => setShowAddModal(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Reminder
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 shadow-sm">
        <Tabs
          tabs={[
            { id: 'pending', label: 'Pending Actions', count: pendingList.length },
            { id: 'completed', label: 'Completed', count: completedList.length },
            { id: 'all', label: 'All Reminders', count: reminders.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : displayedReminders.length > 0 ? (
        <div className="space-y-3">
          {displayedReminders.map(rem => (
            <SwipeRow
              key={rem.id}
              actions={[
                {
                  id: 'delete',
                  label: 'Delete',
                  icon: <Trash2 className="w-5 h-5" />,
                  color: '#e5484d',
                  onSelect: () => handleDelete(rem.id),
                },
                {
                  id: 'toggle',
                  label: rem.status === 'COMPLETED' ? 'Reopen' : 'Done',
                  icon: <CheckCircle2 className="w-5 h-5" />,
                  color: '#14b8a6',
                  onSelect: () => handleToggleStatus(rem.id, rem.status),
                },
              ]}
              height={100}
              radius={16}
              rowColor="transparent"
              drawerColor="rgba(30, 41, 59, 0.9)"
            >
              <div className="w-full">
                <ReminderCard
                  reminder={rem}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                />
              </div>
            </SwipeRow>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bell className="w-8 h-8" />}
          title={`No ${activeTab} reminders`}
          description="You don't have any reminders matching this view."
          actionLabel="Add Reminder"
          onAction={() => setShowAddModal(true)}
          actionIcon={<Plus className="w-4 h-4" />}
        />
      )}

      {/* Create Reminder Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Follow-up Reminder"
        description="Add a healthcare task or prescription reminder for yourself."
      >
        <form onSubmit={handleCreateReminder} className="space-y-4 pt-2">
          <Input
            label="Reminder Title *"
            placeholder="e.g. Fasting Blood Test Sample"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="Description & Instructions"
            placeholder="e.g. Fast for 10 hours prior to arrival at Metro Lab"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date *"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
            <Select
              label="Time *"
              value={time}
              onChange={e => setTime(e.target.value)}
              options={[
                { value: '08:00 AM', label: '08:00 AM' },
                { value: '09:00 AM', label: '09:00 AM' },
                { value: '10:00 AM', label: '10:00 AM' },
                { value: '01:00 PM', label: '01:00 PM' },
                { value: '06:00 PM', label: '06:00 PM' },
                { value: '09:00 PM', label: '09:00 PM' },
              ]}
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="gradient" size="sm" isLoading={isSubmitting}>
              Save Reminder
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
