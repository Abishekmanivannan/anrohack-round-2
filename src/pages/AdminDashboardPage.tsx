import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminStats, Appointment } from '../types';
import { adminApi } from '../api/admin';
import {
  Activity,
  Users,
  Calendar,
  FileText,
  CheckCircle,
  Hospital,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { AppointmentCard } from '../components/domain/AppointmentCard';
import { SpotlightCard } from '../components/react-bits/SpotlightCard';
import { Counter } from '../components/react-bits/Counter';
import { BlurFade } from '../components/react-bits/BlurFade';
import { BadgePulse } from '../components/react-bits/BadgePulse';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, aptsData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getAllAppointments(),
      ]);
      setStats(statsData);
      setRecentAppointments(aptsData);
    } catch (err) {
      console.error('Failed loading admin overview', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const chartData = [
    { name: 'Upcoming', count: stats?.upcomingCount || 0 },
    { name: 'Completed', count: stats?.completedCount || 0 },
    { name: 'Cancelled', count: stats?.cancelledCount || 0 },
  ];

  const pieData = [
    { name: 'Patients', value: stats?.patientCount || 1, color: '#0f766e' },
    { name: 'Appointments', value: stats?.appointmentCount || 1, color: '#2563eb' },
    { name: 'Documents', value: stats?.documentCount || 1, color: '#7c3aed' },
  ];

  return (
    <div className="space-y-8">
      {/* Admin Top Banner */}
      <BlurFade delay={0.1}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white p-6 sm:p-8 shadow-xl">
          <div className="relative z-10 space-y-2">
            <BadgePulse color="rose" label="CLINIC ADMIN & WORKFLOW MANAGEMENT" />
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Clinic Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Monitor clinic-wide patient volume, manage appointment queues, update consult status, and audit system workflow metrics.
            </p>
          </div>
        </div>
      </BlurFade>

      {/* Metrics Grid with SpotlightCards & Counters */}
      <BlurFade delay={0.15}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SpotlightCard className="border-rose-100 bg-rose-50/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                Total Patients
              </span>
              <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                <Users className="w-4 h-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-2" />
            ) : (
              <h3 className="text-3xl font-black text-slate-900 mt-2">
                <Counter value={stats?.patientCount || 0} />
              </h3>
            )}
            <span className="text-[11px] text-slate-500 mt-1 block">Registered in platform</span>
          </SpotlightCard>

          <SpotlightCard className="border-sky-100 bg-sky-50/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                Total Appointments
              </span>
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-2" />
            ) : (
              <h3 className="text-3xl font-black text-slate-900 mt-2">
                <Counter value={stats?.appointmentCount || 0} />
              </h3>
            )}
            <span className="text-[11px] text-slate-500 mt-1 block">Across all providers</span>
          </SpotlightCard>

          <SpotlightCard className="border-emerald-100 bg-emerald-50/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Completed Visits
              </span>
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-2" />
            ) : (
              <h3 className="text-3xl font-black text-slate-900 mt-2">
                <Counter value={stats?.completedCount || 0} />
              </h3>
            )}
            <span className="text-[11px] text-slate-500 mt-1 block">Successfully fulfilled</span>
          </SpotlightCard>

          <SpotlightCard className="border-indigo-100 bg-indigo-50/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">
                Medical Documents
              </span>
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-2" />
            ) : (
              <h3 className="text-3xl font-black text-slate-900 mt-2">
                <Counter value={stats?.documentCount || 0} />
              </h3>
            )}
            <span className="text-[11px] text-slate-500 mt-1 block">Uploaded & processed</span>
          </SpotlightCard>
        </div>
      </BlurFade>

      {/* Analytics Visualizations with Recharts */}
      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-600" />
              Appointment Status Distribution
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#0f766e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Hospital className="w-4 h-4 text-indigo-600" />
              Platform System Records
            </h3>
            <div className="h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </BlurFade>

      {/* Clinic Appointment Queue */}
      <BlurFade delay={0.25}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-700" />
              Recent Clinic Appointments Queue
            </h3>
            <Link
              to="/admin/appointments"
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
            >
              Manage all appointments <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <Skeleton className="h-32" />
          ) : recentAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentAppointments.slice(0, 4).map(apt => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  onSelect={() => navigate('/admin/appointments')}
                />
              ))}
            </div>
          ) : (
            <Card className="py-6 text-center text-xs text-slate-400">
              No appointments registered in clinic queue.
            </Card>
          )}
        </div>
      </BlurFade>
    </div>
  );
};
