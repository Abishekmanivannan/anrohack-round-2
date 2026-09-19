import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Bell,
  Clock,
  HeartHandshake,
  User as UserIcon,
  Users,
  Activity,
  Hospital,
} from 'lucide-react';
import Dock, { DockItemData } from '../react-bits/Dock';

export const BottomNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const patientNav = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Visits & Queue', path: '/appointments', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Document Vault', path: '/documents', icon: <FileText className="w-5 h-5" /> },
    { label: 'Reminders', path: '/reminders', icon: <Bell className="w-5 h-5" /> },
    { label: 'Timeline', path: '/timeline', icon: <Clock className="w-5 h-5" /> },
    { label: 'Caregiver Access', path: '/caregiver', icon: <HeartHandshake className="w-5 h-5" /> },
    { label: 'Profile', path: '/profile', icon: <UserIcon className="w-5 h-5" /> },
  ];

  const caregiverNav = [
    { label: 'Overview', path: '/caregiver/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Patients Directory', path: '/caregiver/patients', icon: <Users className="w-5 h-5" /> },
    { label: 'Healthcare Timeline', path: '/timeline', icon: <Clock className="w-5 h-5" /> },
  ];

  const adminNav = [
    { label: 'Admin Overview', path: '/admin/dashboard', icon: <Activity className="w-5 h-5" /> },
    { label: 'Queue Management', path: '/admin/appointments', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Patient Directory', path: '/admin/patients', icon: <Hospital className="w-5 h-5" /> },
  ];

  const activeNavList =
    user?.role === 'CAREGIVER'
      ? caregiverNav
      : user?.role === 'ADMIN'
      ? adminNav
      : patientNav;

  const dockItems: DockItemData[] = activeNavList.map((item) => ({
    icon: item.icon,
    label: item.label,
    onClick: () => navigate(item.path),
    isActive: location.pathname === item.path,
  }));

  return (
    <Dock
      items={dockItems}
      panelHeight={60}
      baseItemSize={44}
      magnification={60}
      distance={140}
      dockHeight={70}
    />
  );
};
