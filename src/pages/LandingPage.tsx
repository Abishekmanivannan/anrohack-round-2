import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import {
  Activity,
  Bell,
  Calendar,
  ChevronRight,
  FileText,
  Heart,
  HeartHandshake,
  Lock,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Zap,
  ArrowRight,
  Star,
  Clock,
  Users,
  CheckCircle2,
  Brain,
  CloudUpload,
  Smartphone,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// ─── Animated counter hook ───────────────────────────────────────────────────
function useAnimatedCounter(target: number, duration = 1.8, shouldStart: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: v => setCount(Math.floor(v)),
    });
    return controls.stop;
  }, [target, duration, shouldStart]);
  return count;
}

// ─── Floating particle canvas ────────────────────────────────────────────────
const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; hue: number;
    }[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? 171 : 220, // teal or indigo
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(171, 80%, 65%, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

// ─── Typewriter effect ───────────────────────────────────────────────────────
const useTypewriter = (words: string[], speed = 80, pause = 2000) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    const word = words[index % words.length];
    if (!deleting && subIndex <= word.length) {
      const t = setTimeout(() => { setText(word.slice(0, subIndex)); setSubIndex(s => s + 1); }, speed);
      return () => clearTimeout(t);
    }
    if (!deleting && subIndex > word.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && subIndex >= 0) {
      const t = setTimeout(() => { setText(word.slice(0, subIndex)); setSubIndex(s => s - 1); }, speed / 2);
      return () => clearTimeout(t);
    }
    if (deleting && subIndex < 0) {
      setDeleting(false);
      setIndex(i => i + 1);
      setSubIndex(0);
    }
  }, [subIndex, deleting, index, words, speed, pause]);

  return text;
};

// ─── Stats Section ───────────────────────────────────────────────────────────
const stats = [
  { value: 50000, suffix: '+', label: 'Active Patients', icon: Users },
  { value: 98, suffix: '%', label: 'Satisfaction Rate', icon: Star },
  { value: 120, suffix: '+', label: 'Clinical Partners', icon: Stethoscope },
  { value: 24, suffix: '/7', label: 'AI Support', icon: Brain },
];

const StatCard: React.FC<{ value: number; suffix: string; label: string; icon: React.ElementType; index: number }> = ({
  value, suffix, label, icon: Icon, index,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const count = useAnimatedCounter(value, 2 + index * 0.2, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="relative group text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/40 hover:bg-teal-500/5 transition-all duration-300"
    >
      <div className="inline-flex p-3 rounded-xl bg-teal-500/10 text-teal-400 mb-3 group-hover:bg-teal-500/20 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-3xl font-black text-white">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-xs font-semibold text-slate-400 mt-1">{label}</p>
    </motion.div>
  );
};

// ─── Feature cards ───────────────────────────────────────────────────────────
const features = [
  {
    icon: Calendar,
    title: 'Smart Appointment Scheduling',
    desc: 'Book, manage, and track clinical visits across providers. Get auto-reminders and status notifications for every consult.',
    color: 'teal',
    gradient: 'from-teal-500/20 to-teal-500/0',
    delay: 0,
  },
  {
    icon: FileText,
    title: 'AI Medical Document Vault',
    desc: 'Upload lab reports, prescriptions, and discharge summaries. Our AI generates plain-language summaries so you understand every finding.',
    color: 'indigo',
    gradient: 'from-indigo-500/20 to-indigo-500/0',
    delay: 0.07,
  },
  {
    icon: Bell,
    title: 'Intelligent Reminders',
    desc: 'Never miss a follow-up. Create smart reminders for medication, lab tests, and appointments with swipe-to-complete actions.',
    color: 'amber',
    gradient: 'from-amber-500/20 to-amber-500/0',
    delay: 0.14,
  },
  {
    icon: HeartHandshake,
    title: 'Caregiver Access Portal',
    desc: 'Securely share your health records with family members. Fine-grained permission controls keep you in charge at all times.',
    color: 'purple',
    gradient: 'from-purple-500/20 to-purple-500/0',
    delay: 0.21,
  },
  {
    icon: Activity,
    title: 'Health Journey Timeline',
    desc: 'Every appointment, document, and reminder is auto-recorded into a chronological health story you can review at any time.',
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-emerald-500/0',
    delay: 0.28,
  },
  {
    icon: Brain,
    title: 'AI Health Assistant',
    desc: 'Describe your symptoms and get evidence-based care suggestions, medicine ideas, and questions to ask your doctor — powered by GPT.',
    color: 'rose',
    gradient: 'from-rose-500/20 to-rose-500/0',
    delay: 0.35,
  },
];

const colorMap: Record<string, string> = {
  teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20 group-hover:bg-teal-500/20',
  indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20',
  rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:bg-rose-500/20',
};
const borderHoverMap: Record<string, string> = {
  teal: 'hover:border-teal-500/40',
  indigo: 'hover:border-indigo-500/40',
  amber: 'hover:border-amber-500/40',
  purple: 'hover:border-purple-500/40',
  emerald: 'hover:border-emerald-500/40',
  rose: 'hover:border-rose-500/40',
};

const FeatureCard: React.FC<typeof features[0] & { index: number }> = ({
  icon: Icon, title, desc, color, gradient, delay, index,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative group p-6 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-sm overflow-hidden transition-all duration-300 cursor-default ${borderHoverMap[color]}`}
    >
      {/* gradient glow on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      <div className={`relative inline-flex p-3 rounded-xl border transition-colors duration-300 mb-4 ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="relative text-sm font-bold text-white mb-2">{title}</h3>
      <p className="relative text-xs text-slate-400 leading-relaxed">{desc}</p>

      <div className="relative mt-4 flex items-center gap-1 text-xs font-semibold text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Learn more <ChevronRight className="w-3.5 h-3.5" />
      </div>
    </motion.div>
  );
};

// ─── Testimonials ────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Maria Chen',
    role: 'Patient — Oncology Care',
    avatar: 'MC',
    text: 'CareFlow completely changed how I manage my treatment journey. The AI document summaries help me actually understand my lab reports instead of feeling overwhelmed.',
    stars: 5,
  },
  {
    name: 'Dr. James Okafor',
    role: 'Cardiologist, Metro General',
    avatar: 'JO',
    text: 'My patients come to appointments better prepared than ever. They arrive with AI-generated questions from their records. This platform is the future of patient care.',
    stars: 5,
  },
  {
    name: 'Sarah Morgan',
    role: 'Family Caregiver',
    avatar: 'SM',
    text: "As a caregiver for my father, having controlled access to his appointment schedule and reminders means I'm always in the loop without privacy concerns.",
    stars: 5,
  },
];

// ─── Steps ──────────────────────────────────────────────────────────────────
const steps = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up as a patient, family caregiver, or clinic admin in under 60 seconds.', icon: Smartphone },
  { num: '02', title: 'Upload Your Records', desc: 'Add lab reports, prescriptions, and discharge summaries to your secure vault.', icon: CloudUpload },
  { num: '03', title: 'Get AI Insights', desc: 'Our AI reads your documents and produces plain-language summaries instantly.', icon: Sparkles },
  { num: '04', title: 'Stay Organized', desc: 'Book appointments, set reminders, and share access with family caregivers.', icon: CheckCircle2 },
];

// ─── Main Landing Page ───────────────────────────────────────────────────────
export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const typeText = useTypewriter([
    'Your Health, Organized',
    'AI-Powered Medical Records',
    'Smart Appointment Tracking',
    'Caregiver Access, Secured',
  ], 70, 2200);

  // Scroll-reveal sections
  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' });

  const howRef = useRef<HTMLDivElement>(null);
  const howInView = useInView(howRef, { once: true, margin: '-80px' });

  const testimonialsRef = useRef<HTMLDivElement>(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: '-80px' });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-300">

      {/* ── Nav Bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-white/8 flex items-center justify-between px-6 sm:px-10 lg:px-20 text-slate-900 dark:text-white transition-colors duration-300">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <Heart className="w-7 h-7 text-teal-600 dark:text-teal-400" />
          </motion.div>
          <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">CareFlow</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
          {['Features', 'How It Works', 'Testimonials'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </motion.button>

          <Link
            to="/login"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:block"
          >
            Sign In
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 dark:from-teal-500 dark:to-teal-400 text-white dark:text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/25"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Particle canvas background */}
        <ParticleCanvas />

        {/* Radial gradient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-teal-500/8 blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/6 blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-teal-400/6 blur-[100px]" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(45, 212, 191, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(45, 212, 191, 1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 text-center max-w-4xl mx-auto px-6 space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-300 text-xs font-bold tracking-wider"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-teal-400"
            />
            DIGITAL HEALTH PLATFORM — AI-POWERED
          </motion.div>

          {/* Headline with typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                {typeText}
              </span>
              <span className="text-teal-400 animate-pulse">|</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            CareFlow centralizes your medical appointments, lab reports, prescriptions, and AI health insights in one beautifully designed platform — for patients, caregivers, and clinics.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(45,212,191,0.35)' }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-400 text-slate-950 font-extrabold text-base shadow-xl shadow-teal-500/30 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Start Free — No Credit Card
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm text-white font-semibold text-base hover:bg-white/10 transition-all"
              >
                <Stethoscope className="w-4 h-4 text-teal-400" />
                View Demo Dashboard
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-medium"
          >
            {[
              { icon: Lock, text: 'End-to-end Encrypted' },
              { icon: ShieldCheck, text: 'HIPAA-Aligned Design' },
              { icon: Zap, text: 'Instant AI Summaries' },
              { icon: CheckCircle2, text: 'Free for Patients' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-teal-400" />
                {text}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs text-slate-500"
        >
          <span>Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-teal-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="relative py-16 border-y border-white/8 bg-slate-900/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" ref={featuresRef} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" /> PLATFORM CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Everything your health journey needs
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
              From AI-powered document analysis to secure caregiver portals — CareFlow handles the complexity so you can focus on your wellbeing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" ref={howRef} className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={howInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold tracking-wider mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" /> GETTING STARTED
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Up and running in minutes</h2>
            <p className="text-slate-400 text-sm mt-3 max-w-md mx-auto">
              CareFlow is designed to be immediately useful with zero setup.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 35 }}
                animate={howInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="relative text-center group"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+2.5rem)] right-[-50%] h-px bg-gradient-to-r from-teal-500/40 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-teal-500/20 text-teal-400 mb-4 group-hover:border-teal-500/50 group-hover:bg-teal-500/10 transition-all duration-300 relative">
                  <step.icon className="w-7 h-7" />
                  <span className="absolute -top-2 -right-2 text-[10px] font-black text-slate-950 bg-teal-400 rounded-full w-5 h-5 flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" ref={testimonialsRef} className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wider mb-4">
              <Star className="w-3.5 h-3.5" /> REAL STORIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Loved by patients & clinicians</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 35 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-slate-900 border border-white/10 hover:border-teal-500/30 transition-all"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-xs font-black text-white shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-950 border border-teal-500/20 p-10 sm:p-14 text-center shadow-2xl"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-teal-400/15 blur-[60px] pointer-events-none" />

            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
              className="inline-flex p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-6"
            >
              <Heart className="w-8 h-8 text-teal-400" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Take control of your health journey
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-lg mx-auto">
              Join thousands of patients and caregivers who use CareFlow to stay organized, informed, and connected to their healthcare team.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(45,212,191,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-400 text-slate-950 font-extrabold text-base shadow-xl shadow-teal-500/30"
                >
                  <Sparkles className="w-5 h-5" />
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/15 bg-white/5 text-white font-semibold text-base hover:bg-white/10 transition-all"
                >
                  Sign in with demo →
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-teal-400" />
              <span className="font-black text-white text-base">CareFlow</span>
              <span className="text-slate-500 text-xs">© 2026 — Built for AnroHack</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
              <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
              <Link to="/login" className="hover:text-teal-400 transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-teal-400 transition-colors">Register</Link>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
              HIPAA-aligned design
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
