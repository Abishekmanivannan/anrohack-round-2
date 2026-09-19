import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { adminApi } from '../api/admin';
import { Users, Search, Mail, Phone } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';

export const AdminPatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getAllPatients();
      setPatients(data);
    } catch (err) {
      console.error('Failed to load patient records', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-rose-400" />
          Registered Patient Directory
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Clinic administrative overview of patient user accounts and contact information
        </p>
      </div>

      {/* Search */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 shadow-sm max-w-md">
        <Input
          placeholder="Search patient name or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Patients List */}
      {isLoading ? (
        <Skeleton className="h-48" />
      ) : filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPatients.map(patient => (
            <Card key={patient.id} className="p-5 bg-slate-900 border-white/10">
              <div className="flex items-center gap-4">
                <Avatar name={patient.name} src={patient.avatarUrl} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white truncate">
                      {patient.name}
                    </h3>
                    <Badge variant="teal">PATIENT</Badge>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {patient.email}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {patient.phone || '+1 (555) 234-5678'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Account ID: {patient.id}</span>
                <span className="font-semibold text-teal-400">Active Healthcare Plan</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center text-xs text-slate-400 bg-slate-900 border-white/10">
          No patients found matching "{searchQuery}".
        </Card>
      )}
    </div>
  );
};
