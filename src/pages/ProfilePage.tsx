import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, Phone, Heart } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <UserIcon className="w-6 h-6 text-teal-400" />
          Patient Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Personal identification, emergency contact details, and platform preferences
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6 bg-slate-900 border-white/10">
        <div className="flex items-center gap-4 pb-6 border-b border-white/10 flex-wrap">
          <Avatar name={user?.name || 'Alex Morgan'} src={user?.avatarUrl} size="xl" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <Badge variant="teal">{user?.role}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-1">Member since August 2026</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Contact & Medical Record Identification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Email Address</span>
              <p className="font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                {user?.email}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Phone Number</span>
              <p className="font-bold text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400" />
                {user?.phone || '+1 (555) 234-5678'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Primary Healthcare Preferences
          </h3>
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-teal-300">
              <Heart className="w-4 h-4 text-teal-400" /> Emergency & Preferred Clinic
            </div>
            <p>Primary Clinic: Metro General Health Center</p>
            <p>Preferred Doctor: Dr. Elena Rostova (Cardiology)</p>
            <p>Emergency Contact: Sarah Morgan (+1 (555) 876-5432)</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
