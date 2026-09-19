import React from 'react';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { Reminder } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import StatusMark from '../react-bits/StatusMark';

export interface ReminderCardProps {
  reminder: Reminder;
  onToggleStatus: (id: string, currentStatus: Reminder['status']) => void;
  onDelete?: (id: string) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onToggleStatus,
  onDelete,
}) => {
  const isCompleted = reminder.status === 'COMPLETED';

  return (
    <Card className={`transition-all ${isCompleted ? 'bg-slate-900/40 border-white/5 opacity-70' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleStatus(reminder.id, reminder.status)}
            className="mt-0.5"
            title="Toggle Reminder Status"
          >
            <StatusMark
              status={isCompleted ? 'done' : 'pending'}
              size={22}
              doneColor="#2dd4bf"
              color="#94a3b8"
              strike={false}
            />
          </button>
          <div>
            <h4
              className={`text-sm font-bold text-white ${
                isCompleted ? 'line-through text-slate-400' : ''
              }`}
            >
              {reminder.title}
            </h4>
            {reminder.description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{reminder.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2.5 text-xs text-slate-300 flex-wrap">
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                {reminder.reminder_date}
              </span>
              <span className="flex items-center gap-1 font-medium text-slate-300">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                {reminder.reminder_time}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isCompleted ? 'emerald' : 'amber'}>
            {reminder.status}
          </Badge>
          {onDelete && (
            <button
              onClick={() => onDelete(reminder.id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete Reminder"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
