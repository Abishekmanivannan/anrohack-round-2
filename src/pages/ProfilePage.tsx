import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User as UserIcon,
  Mail,
  Phone,
  Heart,
  Edit3,
  Save,
  X,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';
import { authApi } from '../api/auth';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [emergencyContact, setEmergencyContact] = useState('Sarah Morgan');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 876-5432');
  const [preferredClinic, setPreferredClinic] = useState('Metro General Health Center');
  const [preferredDoctor, setPreferredDoctor] = useState('Dr. Elena Rostova (Cardiology)');

  // Reset on cancel
  const handleCancel = () => {
    setName(user?.name || '');
    setPhone(user?.phone || '+1 (555) 234-5678');
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await authApi.updateProfile({ name: name.trim(), phone: phone.trim() });
      showToast('Profile updated successfully!', 'success');
      setIsEditing(false);
      // Reload user in context by refreshing the page state (user is refreshed on next context read)
      window.location.reload();
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'August 2026';

  const roleColor: Record<string, string> = {
    PATIENT: 'teal',
    CAREGIVER: 'purple',
    ADMIN: 'rose',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-teal-400" />
            {user?.role === 'ADMIN' ? 'Admin Profile' : user?.role === 'CAREGIVER' ? 'Caregiver Profile' : 'Patient Profile'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal details, emergency contacts, and platform preferences
          </p>
        </div>

        {!isEditing && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              icon={<Edit3 className="w-4 h-4 text-teal-400" />}
            >
              Edit Profile
            </Button>
          </motion.div>
        )}
      </div>

      {/* Profile card */}
      <motion.div layout>
        <Card className="p-6 sm:p-8 space-y-6 bg-slate-900 border-white/10">
          <form onSubmit={handleSave}>

            {/* Avatar + name block */}
            <div className="flex items-center gap-4 pb-6 border-b border-white/10 flex-wrap">
              <div className="relative group">
                <Avatar name={name || user?.name || 'User'} src={user?.avatarUrl} size="xl" />
                {isEditing && (
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Edit3 className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="editing-name"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                    >
                      <Input
                        label="Full Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="display-name"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                        <Badge variant={roleColor[user?.role || 'PATIENT'] as any}>
                          {user?.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-teal-400" />
                        Member since {memberSince}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {/* Email — always read-only */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Email Address</span>
                  <p className="font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-400" />
                    {user?.email}
                  </p>
                  <p className="text-[10px] text-slate-500">Cannot be changed</p>
                </div>

                {/* Phone — editable */}
                <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${isEditing ? 'bg-slate-900 border-teal-500/30' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Phone Number</span>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div key="phone-edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full bg-transparent text-white font-bold text-sm focus:outline-none placeholder:text-slate-500"
                          placeholder="+1 (555) 000-0000"
                        />
                      </motion.div>
                    ) : (
                      <motion.p key="phone-display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="font-bold text-white flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4 text-teal-400" />
                        {phone || '+1 (555) 234-5678'}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Emergency & Healthcare prefs */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Healthcare Preferences & Emergency Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Emergency Contact Name */}
                <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${isEditing ? 'bg-slate-900 border-teal-500/30' : 'bg-teal-500/5 border-teal-500/15'}`}>
                  <span className="text-[11px] font-bold text-teal-400 uppercase block">Emergency Contact</span>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input key="ec-edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        value={emergencyContact}
                        onChange={e => setEmergencyContact(e.target.value)}
                        className="w-full bg-transparent text-white font-bold text-sm focus:outline-none"
                        placeholder="Full name"
                      />
                    ) : (
                      <motion.p key="ec-display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="font-bold text-white flex items-center gap-2 text-sm"
                      >
                        <Heart className="w-4 h-4 text-teal-400" />
                        {emergencyContact}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Emergency Phone */}
                <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${isEditing ? 'bg-slate-900 border-teal-500/30' : 'bg-teal-500/5 border-teal-500/15'}`}>
                  <span className="text-[11px] font-bold text-teal-400 uppercase block">Emergency Phone</span>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input key="ep-edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        value={emergencyPhone}
                        onChange={e => setEmergencyPhone(e.target.value)}
                        className="w-full bg-transparent text-white font-bold text-sm focus:outline-none"
                        placeholder="+1 (555) 000-0000"
                      />
                    ) : (
                      <motion.p key="ep-display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="font-bold text-white flex items-center gap-2 text-sm"
                      >
                        <Phone className="w-4 h-4 text-teal-400" />
                        {emergencyPhone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Preferred Clinic */}
                <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${isEditing ? 'bg-slate-900 border-teal-500/30' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Primary Clinic</span>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input key="clinic-edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        value={preferredClinic}
                        onChange={e => setPreferredClinic(e.target.value)}
                        className="w-full bg-transparent text-white font-bold text-sm focus:outline-none"
                        placeholder="Clinic name"
                      />
                    ) : (
                      <motion.p key="clinic-display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="font-bold text-white text-sm"
                      >
                        {preferredClinic}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Preferred Doctor */}
                <div className={`p-3.5 rounded-xl border space-y-1 transition-colors ${isEditing ? 'bg-slate-900 border-teal-500/30' : 'bg-slate-950/60 border-white/10'}`}>
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Preferred Doctor</span>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input key="doc-edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        value={preferredDoctor}
                        onChange={e => setPreferredDoctor(e.target.value)}
                        className="w-full bg-transparent text-white font-bold text-sm focus:outline-none"
                        placeholder="Doctor name & specialty"
                      />
                    ) : (
                      <motion.p key="doc-display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="font-bold text-white text-sm"
                      >
                        {preferredDoctor}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Save / Cancel buttons */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-4 border-t border-white/10 flex items-center justify-between gap-3"
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
                      onClick={handleCancel}
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
          </form>
        </Card>
      </motion.div>

      {/* Security & Privacy card */}
      <Card className="p-5 bg-slate-900 border-white/10">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          Security & Privacy
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Two-Factor Auth',   status: 'Recommended', colorCls: 'text-amber-400',   bgCls: 'text-amber-400',   icon: AlertTriangle },
            { label: 'Data Encryption',   status: 'Active',       colorCls: 'text-emerald-400', bgCls: 'text-emerald-400', icon: CheckCircle2 },
            { label: 'Caregiver Access',  status: 'Controlled',   colorCls: 'text-teal-400',    bgCls: 'text-teal-400',    icon: ShieldCheck },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-white/10">
              <item.icon className={`w-4 h-4 ${item.colorCls} shrink-0`} />
              <div>
                <p className="text-xs font-bold text-white">{item.label}</p>
                <p className={`text-[11px] ${item.bgCls} font-semibold`}>{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
