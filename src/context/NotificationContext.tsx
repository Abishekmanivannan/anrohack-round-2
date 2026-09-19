import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Appointment, Reminder } from '../types';
import { appointmentsApi } from '../api/appointments';
import { remindersApi } from '../api/reminders';
import { useAuth } from './AuthContext';

export interface AppNotification {
  id: string;
  type: 'appointment' | 'reminder' | 'info';
  title: string;
  body: string;
  date: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  refresh: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const buildNotifications = useCallback(
    (appointments: Appointment[], reminders: Reminder[]): AppNotification[] => {
      const items: AppNotification[] = [];

      // Upcoming appointments
      appointments
        .filter(a => a.status === 'UPCOMING')
        .forEach(a => {
          items.push({
            id: `notif-apt-${a.id}`,
            type: 'appointment',
            title: `Upcoming: ${a.provider_name}`,
            body: `${a.department} at ${a.clinic_name} on ${a.appointment_date} at ${a.appointment_time}`,
            date: a.appointment_date,
            read: false,
          });
        });

      // Pending reminders
      reminders
        .filter(r => r.status === 'PENDING')
        .slice(0, 5)
        .forEach(r => {
          items.push({
            id: `notif-rem-${r.id}`,
            type: 'reminder',
            title: `Reminder: ${r.title}`,
            body: r.description || `Scheduled for ${r.reminder_date} at ${r.reminder_time}`,
            date: r.reminder_date,
            read: false,
          });
        });

      // Sort by date ascending
      return items.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    },
    []
  );

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    try {
      const [apts, rems] = await Promise.all([
        appointmentsApi.getAppointments(user.id),
        remindersApi.getReminders(user.id),
      ]);
      setNotifications(prev => {
        const fresh = buildNotifications(apts, rems);
        // Preserve read state from previous fetch
        const readIds = new Set(prev.filter(n => n.read).map(n => n.id));
        return fresh.map(n => ({ ...n, read: readIds.has(n.id) }));
      });
    } catch {
      // silently fail — notifications are best-effort
    }
  }, [user, isAuthenticated, buildNotifications]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60_000); // refresh every minute
    return () => clearInterval(interval);
  }, [refresh]);

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllRead, markRead, refresh }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
