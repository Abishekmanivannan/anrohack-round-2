import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Stethoscope,
  FileText,
  Sparkles,
  Bell,
  Clock,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SpotlightCard } from '../components/react-bits/SpotlightCard';
import CursorGrid from '../components/react-bits/CursorGrid';
import { LogoIcon } from '../components/ui/LogoIcon';
import { Counter } from '../components/react-bits/Counter';
import { BlurFade } from '../components/react-bits/BlurFade';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleQuickDemo = async (role: UserRole) => {
    await login({ email: `${role.toLowerCase()}@careflow.com`, role });
    if (role === 'CAREGIVER') navigate('/caregiver/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background Interactive Cursor Grid */}
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

      {/* Header */}
      <header className="relative z-20 max-w-[1536px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoIcon size="lg" />
          <span className="text-xl font-extrabold tracking-tight">CareFlow</span>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="gradient" size="sm" className="font-bold">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-[1536px] mx-auto px-6 sm:px-10 pt-10 pb-16 text-center">
        <BlurFade delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-teal-300 mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-teal-400 animate-pulse" />
            <span>Digital Health & Well-being Platform • Hackathon Track 3</span>
          </div>
        </BlurFade>

        <BlurFade delay={0.2}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-tight">
            Your Complete Healthcare Journey in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-300">
              One Safe Place
            </span>
          </h1>
        </BlurFade>

        <BlurFade delay={0.3}>
          <p className="mt-4 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Centralize doctor visits, upload lab reports, generate plain-language AI document summaries, track follow-up reminders, and grant family caregivers controlled access.
          </p>
        </BlurFade>

        {/* Demo Quick Launch Buttons */}
        <BlurFade delay={0.4}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => handleQuickDemo('PATIENT')}
              size="lg"
              className="bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold shadow-lg shadow-teal-500/25"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Launch Patient Demo
            </Button>

            <Button
              onClick={() => handleQuickDemo('CAREGIVER')}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-lg shadow-indigo-600/30"
              icon={<HeartHandshake className="w-5 h-5" />}
            >
              Launch Caregiver Demo
            </Button>

            <Button
              onClick={() => handleQuickDemo('ADMIN')}
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/15 font-extrabold"
              icon={<Activity className="w-5 h-5" />}
            >
              Launch Admin Demo
            </Button>
          </div>
        </BlurFade>

        {/* Animated Counter Stats Bar */}
        <BlurFade delay={0.5}>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
            <SpotlightCard className="bg-white/5 border-white/10 text-white">
              <Stethoscope className="w-6 h-6 text-teal-400 mb-2" />
              <div className="text-2xl font-black text-white">
                <Counter value={100} />%
              </div>
              <p className="text-xs text-slate-400 mt-1">Appointment Centralization</p>
            </SpotlightCard>

            <SpotlightCard className="bg-white/5 border-white/10 text-white">
              <FileText className="w-6 h-6 text-indigo-400 mb-2" />
              <div className="text-2xl font-black text-white">
                <Counter value={24} />/7
              </div>
              <p className="text-xs text-slate-400 mt-1">Document Vault Storage</p>
            </SpotlightCard>

            <SpotlightCard className="bg-white/5 border-white/10 text-white">
              <Sparkles className="w-6 h-6 text-purple-400 mb-2" />
              <div className="text-2xl font-black text-white">
                <Counter value={5} /> Sec
              </div>
              <p className="text-xs text-slate-400 mt-1">AI Plain-Language Summary</p>
            </SpotlightCard>

            <SpotlightCard className="bg-white/5 border-white/10 text-white">
              <HeartHandshake className="w-6 h-6 text-emerald-400 mb-2" />
              <div className="text-2xl font-black text-white">
                <Counter value={4} /> Roles
              </div>
              <p className="text-xs text-slate-400 mt-1">Permission Access Control</p>
            </SpotlightCard>
          </div>
        </BlurFade>
      </section>

      {/* 4-Step How It Works Workflow Section */}
      <section className="relative z-10 py-12 bg-slate-900/60 border-t border-white/10">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Streamlined Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">How CareFlow Protects Your Health</h2>
            <p className="text-sm text-slate-400 mt-2">Four simple steps to centralize clinical records, lab results, and caregiver updates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 font-black flex items-center justify-center text-lg">01</div>
              <h3 className="text-base font-bold text-white">Book & Queue Visits</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Schedule clinical appointments, choose specialty departments, and view live queue progress.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 font-black flex items-center justify-center text-lg">02</div>
              <h3 className="text-base font-bold text-white">Upload Lab Records</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Drag and drop medical PDF reports into your encrypted personal healthcare document vault.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 font-black flex items-center justify-center text-lg">03</div>
              <h3 className="text-base font-bold text-white">AI Plain-Language Summary</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Receive instant plain-language summaries of medical terms, extracted dates, and recommended questions.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-lg">04</div>
              <h3 className="text-base font-bold text-white">Caregiver Access</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Grant granual, time-bounded permissions to family members to keep your loved ones updated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="relative z-10 py-14 bg-slate-900/90 border-t border-white/10">
        <div className="max-w-[1536px] mx-auto px-6 sm:px-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Built for Patients & Caregivers</h2>
            <p className="text-sm text-slate-400 mt-2">
              Transforming fragmented medical records into a clean, modern digital home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightCard className="bg-white/5 border-white/10 text-white">
              <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 w-fit mb-4">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Appointment Workflow</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Schedule, track, and manage doctor visits across clinics and departments with status updates.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-white/5 border-white/10 text-white">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 w-fit mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">AI Document Assistant</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Upload medical PDF reports and receive plain-language summaries, extracted dates, and doctor questions.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-white/5 border-white/10 text-white">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 w-fit mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Controlled Caregiver Access</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Grant trusted family caregivers permissions to monitor your appointments, documents, and reminders.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-[1536px] mx-auto px-6 sm:px-10 py-12 border-t border-white/10 text-center text-xs text-slate-500">
        <p>© 2026 CareFlow — Digital Health & Well-being Platform. Hackathon Track 3.</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Informational software prototype. Does not provide clinical medical diagnosis or treatment advice.
        </p>
      </footer>
    </div>
  );
};
