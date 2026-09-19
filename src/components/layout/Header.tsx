import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { UserRole } from '../../types';
import {
  Bell,
  LogOut,
  Shield,
  ChevronDown,
  User as UserIcon,
  Calendar,
  Clock,
  CheckCircle2,
  BellOff,
  Settings,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { LogoIcon } from '../ui/LogoIcon';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const navigate = useNavigate();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roleRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node))
        setShowRoleDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfileDropdown(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setShowRoleDropdown(false);
    if (role === 'CAREGIVER') navigate('/caregiver/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
    else navigate('/dashboard');
  };

  const getRoleBadgeVariant = (role?: UserRole) => {
    switch (role) {
      case 'PATIENT': return 'teal' as const;
      case 'CAREGIVER': return 'purple' as const;
      case 'ADMIN': return 'rose' as const;
      default: return 'slate' as const;
    }
  };

  const notifTypeIcon = (type: string) => {
    if (type === 'appointment') return <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />;
    if (type === 'reminder') return <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />;
    return <Bell className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />;
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -6 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: -6, transition: { duration: 0.1 } },
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 lg:px-12 flex items-center justify-between text-white">
      {/* Left — Brand */}
      <div className="flex items-center gap-3">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
            <LogoIcon size="md" />
          </motion.div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-tight text-white leading-none block">CareFlow</span>
            <span className="text-[10px] font-semibold text-teal-400 tracking-wider uppercase hidden sm:block">Health Platform</span>
          </div>
        </NavLink>

        <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />
        <div className="hidden md:block">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            Welcome back, {user?.name.split(' ')[0] || 'User'}! 👋
          </h2>
        </div>
      </div>

      {/* Right — Controls */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Role switcher */}
        <div className="relative" ref={roleRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowRoleDropdown(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-semibold transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Role:</span>
            <Badge variant={getRoleBadgeVariant(user?.role)} size="sm">{user?.role || 'PATIENT'}</Badge>
            <ChevronDown className={`w-3.5 h-3.5 text-teal-400 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showRoleDropdown && (
              <motion.div
                variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 p-2 shadow-2xl border border-white/10 z-50 text-xs text-white"
              >
                <div className="px-3 py-1.5 font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                  Switch Demo Role
                </div>
                {([
                  { role: 'PATIENT' as UserRole,   label: '🏥 Patient Dashboard',  activeCls: 'bg-teal-500/20 text-teal-300',   dotCls: 'bg-teal-400' },
                  { role: 'CAREGIVER' as UserRole, label: '💙 Caregiver Portal',    activeCls: 'bg-indigo-500/20 text-indigo-300', dotCls: 'bg-indigo-400' },
                  { role: 'ADMIN' as UserRole,     label: '⚕️ Admin Clinic View',   activeCls: 'bg-rose-500/20 text-rose-300',   dotCls: 'bg-rose-400' },
                ]).map(({ role, label, activeCls, dotCls }) => {
                  const active = user?.role === role;
                  return (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left font-semibold transition-all ${
                        active ? activeCls : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span>{label}</span>
                      {active && <span className={`w-2 h-2 rounded-full ${dotCls}`} />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowNotifications(v => !v); if (!showNotifications && unreadCount > 0) markAllRead(); }}
            className="relative p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-teal-400 text-slate-950 text-[10px] font-black flex items-center justify-center px-1"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 shadow-2xl border border-white/10 z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold text-white">Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[10px] text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                      <BellOff className="w-6 h-6 text-slate-600" />
                      No notifications right now
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {notifications.map(n => (
                        <motion.button
                          key={n.id}
                          whileHover={{ x: 2 }}
                          onClick={() => {
                            markRead(n.id);
                            navigate(n.type === 'appointment' ? '/appointments' : '/reminders');
                            setShowNotifications(false);
                          }}
                          className={`w-full text-left p-3 rounded-xl flex items-start gap-2.5 transition-colors ${
                            n.read ? 'bg-transparent hover:bg-white/5' : 'bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20'
                          }`}
                        >
                          {notifTypeIcon(n.type)}
                          <div className="min-w-0">
                            <p className={`text-xs font-semibold truncate ${n.read ? 'text-slate-300' : 'text-white'}`}>
                              {n.title}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 text-left">{n.body}</p>
                          </div>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0 mt-1" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 p-2">
                  <button
                    onClick={() => { navigate('/reminders'); setShowNotifications(false); }}
                    className="w-full text-center text-xs font-semibold text-teal-400 hover:text-teal-300 py-1.5 rounded-xl hover:bg-teal-500/10 transition-colors"
                  >
                    View all reminders →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfileDropdown(v => !v)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <Avatar name={user?.name || 'User'} src={user?.avatarUrl} size="sm" />
          </motion.button>

          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div
                variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 p-2 shadow-2xl border border-white/10 z-50 text-xs text-white"
              >
                <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                  <p className="font-bold text-white">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                  <Badge variant={getRoleBadgeVariant(user?.role)} size="sm" className="mt-1.5">
                    {user?.role}
                  </Badge>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => { setShowProfileDropdown(false); navigate('/profile'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-white/10 font-semibold text-left transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-teal-400" /> My Profile
                  </button>
                  <button
                    onClick={() => { setShowProfileDropdown(false); navigate('/profile'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:bg-white/10 font-semibold text-left transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" /> Settings
                  </button>
                  <div className="border-t border-white/10 my-1" />
                  <button
                    onClick={() => { setShowProfileDropdown(false); logout(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 font-semibold text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
