import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LogoIcon } from '../components/ui/LogoIcon';
import CursorGrid from '../components/react-bits/CursorGrid';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('alex.morgan@patient.careflow.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, role });
      if (role === 'CAREGIVER') navigate('/caregiver/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      // toast handles error
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickPreset = (presetRole: UserRole, presetEmail: string) => {
    setRole(presetRole);
    setEmail(presetEmail);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <CursorGrid
        cellSize={70}
        color="#2dd4bf"
        radius={160}
        falloff="smooth"
        holdTime={400}
        fadeDuration={800}
        lineWidth={1.2}
        maxOpacity={0.85}
        fillOpacity={0.15}
        gridOpacity={0}
        cellRadius={4}
        clickPulse
        pulseSpeed={600}
      />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <LogoIcon size="lg" />
            <span className="text-2xl font-black text-white tracking-tight">CareFlow</span>
          </Link>
          <h2 className="text-xl font-extrabold text-white mt-4">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your healthcare dashboard, documents, and reminders
          </p>
        </div>

        {/* Quick Demo Credentials Box */}
        <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs">
          <p className="font-bold text-teal-300 flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" /> Quick Hackathon Demo Accounts
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillQuickPreset('PATIENT', 'patient@careflow.com')}
              className={`p-2 rounded-xl text-center font-bold transition-all border ${
                role === 'PATIENT' ? 'bg-teal-500 text-slate-950 border-teal-400' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => fillQuickPreset('CAREGIVER', 'caregiver@careflow.com')}
              className={`p-2 rounded-xl text-center font-bold transition-all border ${
                role === 'CAREGIVER' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              Caregiver
            </button>
            <button
              type="button"
              onClick={() => fillQuickPreset('ADMIN', 'admin@careflow.com')}
              className={`p-2 rounded-xl text-center font-bold transition-all border ${
                role === 'ADMIN' ? 'bg-rose-600 text-white border-rose-500' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              icon={<Mail className="w-4 h-4" />}
            />

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Sign In As Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-white/15 bg-slate-900 px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="PATIENT">PATIENT (Alex Morgan)</option>
                <option value="CAREGIVER">CAREGIVER (Sarah Morgan)</option>
                <option value="ADMIN">ADMIN / CLINIC STAFF (Dr. Vance)</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full mt-2"
              isLoading={isSubmitting}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to CareFlow
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-teal-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
