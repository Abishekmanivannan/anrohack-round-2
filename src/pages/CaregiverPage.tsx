import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CaregiverAccess, CaregiverPermission } from '../types';
import { caregiversApi } from '../api/caregivers';
import { HeartHandshake, UserPlus, ShieldCheck, CheckSquare, Square, Trash2, Calendar, FileText, Bell, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../context/ToastContext';

export const CaregiverPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [caregivers, setCaregivers] = useState<CaregiverAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Caregiver Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<CaregiverPermission[]>([
    'appointments',
    'documents',
    'reminders',
    'timeline',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCaregivers = async () => {
    setIsLoading(true);
    try {
      const data = await caregiversApi.getCaregivers(user?.id);
      setCaregivers(data);
    } catch (err) {
      showToast('Failed to load caregiver permissions', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCaregivers();
  }, [user]);

  const togglePermissionInState = (perm: CaregiverPermission) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter(p => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleAddCaregiver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter caregiver email', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await caregiversApi.addCaregiver({
        patient_id: user?.id || 'patient-1',
        patient_name: user?.name || 'Alex Morgan',
        caregiver_email: email,
        caregiver_name: name || 'Caregiver',
        permissions,
      });

      showToast('Caregiver invitation sent & access granted!', 'success');
      setShowAddModal(false);
      setEmail('');
      setName('');
      loadCaregivers();
    } catch (err: any) {
      showToast(err.message || 'Failed to add caregiver', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCaregiverPerms = async (id: string, currentPerms: CaregiverPermission[], targetPerm: CaregiverPermission) => {
    const updatedPerms = currentPerms.includes(targetPerm)
      ? currentPerms.filter(p => p !== targetPerm)
      : [...currentPerms, targetPerm];

    try {
      await caregiversApi.updatePermissions(id, updatedPerms);
      showToast('Caregiver permissions updated', 'success');
      loadCaregivers();
    } catch (err) {
      showToast('Failed to update permissions', 'error');
    }
  };

  const handleRemoveCaregiver = async (id: string) => {
    try {
      await caregiversApi.removeCaregiver(id);
      showToast('Caregiver access revoked', 'info');
      loadCaregivers();
    } catch (err) {
      showToast('Failed to revoke access', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <HeartHandshake className="w-6 h-6 text-purple-400" />
            Caregiver Access Controls
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Grant trusted family members controlled view permissions for your medical appointments, documents, and reminders
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={() => setShowAddModal(true)}
          icon={<UserPlus className="w-4 h-4" />}
        >
          Add Family Caregiver
        </Button>
      </div>

      {/* Safety Banner */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Patient Privacy Assurance: </span>
          You remain in full control of your healthcare records. Caregivers only see categories you explicitly select below and access can be revoked at any time.
        </div>
      </div>

      {/* Caregiver Cards */}
      {isLoading ? (
        <Skeleton className="h-48" />
      ) : caregivers.length > 0 ? (
        <div className="space-y-4">
          {caregivers.map(cg => (
            <Card key={cg.id} className="p-6 bg-slate-900 border-white/10">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 flex-wrap">
                <div className="flex items-center gap-3.5">
                  <Avatar name={cg.caregiver_name || cg.caregiver_email} size="lg" />
                  <div>
                    <h3 className="text-base font-bold text-white">{cg.caregiver_name}</h3>
                    <p className="text-xs text-slate-400">{cg.caregiver_email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={cg.status === 'ACTIVE' ? 'emerald' : 'amber'}>
                    {cg.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCaregiver(cg.id)}
                    className="text-rose-400 hover:bg-rose-500/10"
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    Revoke Access
                  </Button>
                </div>
              </div>

              {/* Permissions Checkbox Matrix */}
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Shared Information Controls
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-3.5 h-3.5 text-teal-400" /> },
                    { id: 'documents', label: 'Medical Documents', icon: <FileText className="w-3.5 h-3.5 text-indigo-400" /> },
                    { id: 'reminders', label: 'Reminders', icon: <Bell className="w-3.5 h-3.5 text-amber-400" /> },
                    { id: 'timeline', label: 'Timeline Events', icon: <Clock className="w-3.5 h-3.5 text-emerald-400" /> },
                  ].map(perm => {
                    const isShared = cg.permissions.includes(perm.id as CaregiverPermission);
                    return (
                      <button
                        key={perm.id}
                        type="button"
                        onClick={() =>
                          handleUpdateCaregiverPerms(cg.id, cg.permissions, perm.id as CaregiverPermission)
                        }
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                          isShared
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {perm.icon}
                          {perm.label}
                        </span>
                        {isShared ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 bg-slate-900 border-white/10">
          <HeartHandshake className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <p className="text-base font-bold text-white">No Caregivers Connected</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            You have not added any family members or caregivers yet.
          </p>
          <div className="mt-4">
            <Button
              variant="gradient"
              size="sm"
              onClick={() => setShowAddModal(true)}
              icon={<UserPlus className="w-4 h-4" />}
            >
              Add Caregiver Now
            </Button>
          </div>
        </Card>
      )}

      {/* Add Caregiver Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Invite Family Caregiver"
        description="Grant access to a trusted family member or caregiver."
      >
        <form onSubmit={handleAddCaregiver} className="space-y-4 pt-2">
          <Input
            label="Caregiver Full Name"
            placeholder="e.g. Sarah Morgan"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <Input
            label="Caregiver Email Address *"
            type="email"
            placeholder="caregiver@careflow.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              Select Permissions to Grant
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'appointments', label: 'Appointments' },
                { id: 'documents', label: 'Medical Documents' },
                { id: 'reminders', label: 'Reminders' },
                { id: 'timeline', label: 'Healthcare Timeline' },
              ].map(item => {
                const isSelected = permissions.includes(item.id as CaregiverPermission);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePermissionInState(item.id as CaregiverPermission)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                      isSelected ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Square className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
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
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
