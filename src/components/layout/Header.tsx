import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Bell, LogOut, Shield, ChevronDown } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

import BellToggle from '../react-bits/BellToggle';

import { LogoIcon } from '../ui/LogoIcon';

export interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { user, logout, switchRole } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setShowRoleDropdown(false);
  };

  const getRoleBadgeVariant = (role?: UserRole) => {
    switch (role) {
      case 'PATIENT':
        return 'teal' as const;
      case 'CAREGIVER':
        return 'purple' as const;
      case 'ADMIN':
        return 'rose' as const;
      default:
        return 'slate' as const;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 lg:px-12 flex items-center justify-between text-white">
      {/* Left Header Branding & Greeting */}
      <div className="flex items-center gap-3">
        <NavLink to="/" className="flex items-center gap-2.5">
          <LogoIcon size="md" />
          <div>
            <span className="text-base sm:text-lg font-black tracking-tight text-white leading-none block">CareFlow</span>
            <span className="text-[10px] font-semibold text-teal-400 tracking-wider uppercase hidden sm:block">
              Health Platform
            </span>
          </div>
        </NavLink>

        <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

        <div className="hidden md:block">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            Welcome back, {user?.name.split(' ')[0] || 'User'}! 👋
          </h2>
        </div>
      </div>

      {/* Right Toolbar Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher for Hackathon Evaluation */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-semibold transition-all shadow-2xs"
          >
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Role:</span>
            <Badge variant={getRoleBadgeVariant(user?.role)} size="sm">
              {user?.role || 'PATIENT'}
            </Badge>
            <ChevronDown className="w-3.5 h-3.5 text-teal-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 p-2 shadow-2xl border border-white/10 z-50 text-xs text-white">
              <div className="px-3 py-1.5 font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                Switch Demo Role
              </div>
              <button
                onClick={() => handleRoleSwitch('PATIENT')}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left font-semibold ${
                  user?.role === 'PATIENT' ? 'bg-teal-500/20 text-teal-300' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <span>Patient Dashboard</span>
                {user?.role === 'PATIENT' && <span className="w-2 h-2 rounded-full bg-teal-400" />}
              </button>
              <button
                onClick={() => handleRoleSwitch('CAREGIVER')}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left font-semibold ${
                  user?.role === 'CAREGIVER' ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <span>Caregiver Dashboard</span>
                {user?.role === 'CAREGIVER' && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
              </button>
              <button
                onClick={() => handleRoleSwitch('ADMIN')}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left font-semibold ${
                  user?.role === 'ADMIN' ? 'bg-rose-500/20 text-rose-300' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <span>Admin Clinic View</span>
                {user?.role === 'ADMIN' && <span className="w-2 h-2 rounded-full bg-rose-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Bell Toggle Component */}
        <div className="hidden lg:block">
          <BellToggle
            offLabel="Push Alerts"
            onLabel="Push Alerts Active"
            size="sm"
            count={2}
            color="#94a3b8"
            background="rgba(255, 255, 255, 0.05)"
            onColor="#2dd4bf"
            onBackground="rgba(20, 184, 166, 0.18)"
            badgeColor="#14b8a6"
            defaultPressed={true}
          />
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 p-3 shadow-2xl border border-white/10 z-50 text-xs text-white">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 font-bold text-slate-200">
                <span>Recent Notifications</span>
                <span className="text-[10px] text-teal-400">2 New</span>
              </div>
              <div className="py-2 space-y-2">
                <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20">
                  <p className="font-semibold text-teal-300">Upcoming Cardiology Consult</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Scheduled for Sept 25 at 10:30 AM</p>
                </div>
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <p className="font-semibold text-indigo-300">AI Document Summary Ready</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Blood test lab report processed</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <Avatar name={user?.name || 'User'} src={user?.avatarUrl} size="sm" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 p-2 shadow-2xl border border-white/10 z-50 text-xs text-white">
              <div className="px-3 py-2 border-b border-white/10">
                <p className="font-bold text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <div className="pt-1 space-y-0.5">
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 font-semibold text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
