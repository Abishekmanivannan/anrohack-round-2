import React from 'react';
import { Calendar, FileText, Bell, CheckCircle2, Stethoscope, Clock } from 'lucide-react';
import { TimelineEvent } from '../../types';
import { Badge } from '../ui/Badge';

export interface TimelineItemProps {
  event: TimelineEvent;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ event, isLast = false }) => {
  const getEventConfig = (type: TimelineEvent['event_type']) => {
    switch (type) {
      case 'APPOINTMENT':
        return {
          icon: <Stethoscope className="w-4 h-4 text-teal-400" />,
          bg: 'bg-teal-500/10 border-teal-500/20',
          badgeVariant: 'teal' as const,
          label: 'Appointment Scheduled',
        };
      case 'COMPLETED_APPOINTMENT':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          bg: 'bg-emerald-500/10 border-emerald-500/20',
          badgeVariant: 'emerald' as const,
          label: 'Completed Visit',
        };
      case 'DOCUMENT_UPLOAD':
        return {
          icon: <FileText className="w-4 h-4 text-indigo-400" />,
          bg: 'bg-indigo-500/10 border-indigo-500/20',
          badgeVariant: 'purple' as const,
          label: 'Document Uploaded',
        };
      case 'REMINDER':
      case 'FOLLOW_UP':
        return {
          icon: <Bell className="w-4 h-4 text-amber-400" />,
          bg: 'bg-amber-500/10 border-amber-500/20',
          badgeVariant: 'amber' as const,
          label: 'Follow-up / Reminder',
        };
      default:
        return {
          icon: <Clock className="w-4 h-4 text-slate-400" />,
          bg: 'bg-slate-500/10 border-slate-500/20',
          badgeVariant: 'slate' as const,
          label: 'Event',
        };
    }
  };

  const config = getEventConfig(event.event_type);
  const dateObj = new Date(event.event_date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="relative flex items-start gap-3 sm:gap-4 text-white">
      {/* Date & Time Column on Left */}
      <div className="w-20 sm:w-28 shrink-0 text-right pt-2">
        <span className="text-[11px] sm:text-xs font-bold text-teal-300 block leading-tight">
          {formattedDate}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
          {formattedTime}
        </span>
      </div>

      {/* Center Line & Node Icon Container */}
      <div className="relative flex flex-col items-center shrink-0">
        <div className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-md ${config.bg}`}>
          {config.icon}
        </div>
        {!isLast && (
          <span className="w-0.5 flex-1 bg-gradient-to-b from-teal-500/40 via-white/10 to-transparent min-h-[3.5rem] my-1" />
        )}
      </div>

      {/* Event Details Card on Right */}
      <div className="flex-1 pb-6">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-card hover:border-teal-500/30 transition-all">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
            <h4 className="text-sm font-bold text-white">{event.title}</h4>
            <Badge variant={config.badgeVariant} size="sm">
              {config.label}
            </Badge>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{event.description}</p>
        </div>
      </div>
    </div>
  );
};
