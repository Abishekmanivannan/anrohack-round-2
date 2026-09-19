import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Bell,
  Clock,
  Users,
  User as UserIcon,
  Activity,
  Hospital,
  HeartHandshake,
  X,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { LogoIcon } from '../ui/LogoIcon';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const patientNav = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Appointments', path: '/appointments', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Medical Documents', path: '/documents', icon: <FileText className="w-4 h-4" /> },
    { label: 'Reminders', path: '/reminders', icon: <Bell className="w-4 h-4" /> },
    { label: 'Healthcare Timeline', path: '/timeline', icon: <Clock className="w-4 h-4" /> },
    { label: 'Caregiver Access', path: '/caregiver', icon: <HeartHandshake className="w-4 h-4" /> },
    { label: 'Patient Profile', path: '/profile', icon: <UserIcon className="w-4 h-4" /> },
  ];

  const caregiverNav = [
    { label: 'Caregiver Dashboard', path: '/caregiver/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Connected Patients', path: '/caregiver/patients', icon: <Users className="w-4 h-4" /> },
  ];

  const adminNav = [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: <Activity className="w-4 h-4" /> },
    { label: 'All Appointments', path: '/admin/appointments', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Patient Records', path: '/admin/patients', icon: <Hospital className="w-4 h-4" /> },
  ];

  const navItems = user?.role === 'CAREGIVER'
    ? caregiverNav
    : user?.role === 'ADMIN'
    ? adminNav
    : patientNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
          <NavLink to="/" className="flex items-center gap-2.5">
            <LogoIcon size="md" />
            <div>
              <span className="text-lg font-black tracking-tight text-white">CareFlow</span>
              <span className="block text-[10px] font-semibold text-teal-400 -mt-1 tracking-wider uppercase">
                Health Platform
              </span>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Active Workflow Mode
          </div>
          <Badge
            variant={
              user?.role === 'ADMIN'
                ? 'rose'
                : user?.role === 'CAREGIVER'
                ? 'purple'
                : 'teal'
            }
          >
            {user?.role || 'PATIENT'} PORTAL
          </Badge>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/25'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-slate-950' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10 text-center">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-400">
            CareFlow Frontend v1.0
            <span className="block text-[10px] text-teal-400 font-semibold mt-0.5">
              API Ready Abstraction
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
