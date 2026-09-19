import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';
import { User, Mail, Phone, ArrowRight, Sun, Moon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import CursorGrid from '../components/react-bits/CursorGrid';
import { LogoIcon } from '../components/ui/LogoIcon';
import { motion } from 'framer-motion';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    try {
      await register({ name, email, password, phone, role });
      if (role === 'CAREGIVER') navigate('/caregiver/dashboard');
      else if (role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      // toast handles error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-300">
      <CursorGrid
        cellSize={70}
        color={theme === 'dark' ? '#2dd4bf' : '#0d9488'}
        radius={160}
        falloff="smooth"
        holdTime={400}
        fadeDuration={800}
        lineWidth={1.2}
        maxOpacity={theme === 'dark' ? 0.85 : 0.4}
        fillOpacity={theme === 'dark' ? 0.15 : 0.06}
        gridOpacity={0}
        cellRadius={4}
        clickPulse
        pulseSpeed={600}
      />

      {/* Floating Theme Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </motion.button>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <LogoIcon size="lg" />
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">CareFlow</span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-4">Create Your Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Join CareFlow to manage healthcare information and caregiver support
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              icon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. patient@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              icon={<Phone className="w-4 h-4" />}
            />

            <Select
              label="Select Your User Role"
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              options={[
                { value: 'PATIENT', label: 'Patient — Manage personal appointments & docs' },
                { value: 'CAREGIVER', label: 'Caregiver — Monitor shared patient records' },
                { value: 'ADMIN', label: 'Admin — Manage clinic workflow & appointments' },
              ]}
            />

            <Button
              type="submit"
              variant="gradient"
              className="w-full mt-2"
              isLoading={isSubmitting}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
