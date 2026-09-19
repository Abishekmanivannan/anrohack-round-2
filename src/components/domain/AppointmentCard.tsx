import React from 'react';
import { Calendar, Clock, MapPin, Stethoscope, CheckCircle, XCircle } from 'lucide-react';
import { Appointment } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export interface AppointmentCardProps {
  appointment: Appointment;
  onSelect?: (appointment: Appointment) => void;
  onStatusChange?: (id: string, status: Appointment['status']) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onSelect,
  onStatusChange,
  showActions = true,
}) => {
  const getBadgeVariant = (status: Appointment['status']) => {
    switch (status) {
      case 'UPCOMING':
        return 'teal';
      case 'COMPLETED':
        return 'emerald';
      case 'CANCELLED':
        return 'rose';
      default:
        return 'slate';
    }
  };

  return (
    <Card hoverable={!!onSelect} onClick={() => onSelect && onSelect(appointment)} className="relative group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                {appointment.provider_name}
              </h4>
              <Badge variant={getBadgeVariant(appointment.status)}>
                {appointment.status}
              </Badge>
            </div>
            <p className="text-xs font-semibold text-teal-400 mt-0.5">
              {appointment.department}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              {appointment.clinic_name}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            {appointment.appointment_date}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-200">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            {appointment.appointment_time}
          </span>
        </div>

        {showActions && appointment.status === 'UPCOMING' && onStatusChange && (
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => onStatusChange(appointment.id, 'COMPLETED')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 font-semibold transition-colors flex items-center gap-1 text-[11px]"
            >
              <CheckCircle className="w-3 h-3" /> Mark Done
            </button>
            <button
              onClick={() => onStatusChange(appointment.id, 'CANCELLED')}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 font-semibold transition-colors flex items-center gap-1 text-[11px]"
            >
              <XCircle className="w-3 h-3" /> Cancel
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};
