import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { TimelineEvent } from '../types';
import { timelineApi } from '../api/timeline';
import { Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { TimelineItem } from '../components/domain/TimelineItem';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';

export const TimelinePage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadTimeline = async () => {
    setIsLoading(true);
    try {
      const data = await timelineApi.getTimelineEvents(user?.id);
      setEvents(data);
    } catch (err) {
      console.error('Failed to load timeline events', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTimeline();
  }, [user]);

  const getFilteredEvents = () => {
    if (activeFilter === 'all') return events;
    if (activeFilter === 'appointment')
      return events.filter(e => e.event_type === 'APPOINTMENT' || e.event_type === 'COMPLETED_APPOINTMENT');
    if (activeFilter === 'document') return events.filter(e => e.event_type === 'DOCUMENT_UPLOAD');
    if (activeFilter === 'reminder') return events.filter(e => e.event_type === 'REMINDER' || e.event_type === 'FOLLOW_UP');
    return events;
  };

  const filtered = getFilteredEvents();

  return (
    <div className="space-y-6 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Clock className="w-6 h-6 text-emerald-400" />
          Healthcare Journey Timeline
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Chronological story of your medical visits, lab report uploads, and follow-up reminders
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 shadow-sm">
        <Tabs
          tabs={[
            { id: 'all', label: 'Complete Timeline', count: events.length },
            { id: 'appointment', label: 'Doctor Visits', count: events.filter(e => e.event_type === 'APPOINTMENT' || e.event_type === 'COMPLETED_APPOINTMENT').length },
            { id: 'document', label: 'Uploaded Documents', count: events.filter(e => e.event_type === 'DOCUMENT_UPLOAD').length },
            { id: 'reminder', label: 'Reminders & Follow-ups', count: events.filter(e => e.event_type === 'REMINDER').length },
          ]}
          activeTab={activeFilter}
          onChange={setActiveFilter}
        />
      </div>

      {/* Timeline List */}
      <Card className="p-4 sm:p-6 md:p-8 bg-slate-900 border-white/10 max-w-5xl mx-auto">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="relative pt-2">
            {filtered.map((evt, idx) => (
              <TimelineItem key={evt.id} event={evt} isLast={idx === filtered.length - 1} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Clock className="w-8 h-8" />}
            title="No timeline events found"
            description="As you book appointments, upload medical files, or complete reminders, your healthcare journey timeline will build automatically."
          />
        )}
      </Card>
    </div>
  );
};
