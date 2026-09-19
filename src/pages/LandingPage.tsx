import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Heart,
  HeartPulse,
  Home,
  Lock,
  ShieldCheck,
  Stethoscope,
  Syringe,
  User,
  WandSparkles,
} from 'lucide-react';

const navItems = ['Home', 'Services', 'Doctors', 'Appointments', 'Health Records', 'Contact'];

const sidebarItems = [
  { label: 'Dashboard', icon: Home, active: true },
  { label: 'Appointments', icon: Calendar },
  { label: 'Doctors', icon: Stethoscope },
  { label: 'Health Records', icon: FileText },
  { label: 'Prescriptions', icon: Syringe },
  { label: 'Lab Reports', icon: Activity },
  { label: 'Health Monitoring', icon: HeartPulse },
  { label: 'Messages', icon: Bell },
  { label: 'Settings', icon: User },
];

const serviceCards = [
  { title: 'Doctor Consultation', subtitle: 'Connect with experienced doctors', icon: Stethoscope, tone: 'blue' },
  { title: 'Appointments', subtitle: 'Schedule and manage your appointments', icon: Calendar, tone: 'sky' },
  { title: 'Medication', subtitle: 'Track your medicines and get reminders', icon: Syringe, tone: 'slate' },
  { title: 'Lab Reports', subtitle: 'Access your test results and reports', icon: FileText, tone: 'blue' },
  { title: 'Health Monitoring', subtitle: 'Monitor your vital health information', icon: HeartPulse, tone: 'cyan' },
  { title: 'Health Records', subtitle: 'Store and manage your medical records securely', icon: ShieldCheck, tone: 'sky' },
];

const overviewCards = [
  { label: 'Health Status', value: 'Good', detail: 'You are doing well', icon: CheckCircle2, tone: 'green' },
  { label: 'Upcoming Appointment', value: '24 May 2025', detail: '10:30 AM', icon: Calendar, tone: 'blue' },
  { label: 'Medication Reminder', value: '2 Medicines', detail: 'Due Today', icon: Syringe, tone: 'orange' },
  { label: 'Lab Report', value: 'Blood Test', detail: '20 May 2025', icon: FileText, tone: 'blue' },
  { label: 'Messages', value: '3', detail: 'Unread Messages', icon: Bell, tone: 'purple' },
  { label: 'Prescriptions', value: '1', detail: 'Active Prescription', icon: FileText, tone: 'green' },
  { label: 'Health Tips', value: 'Daily Tips', detail: 'Stay hydrated', icon: WandSparkles, tone: 'cyan' },
];

const footerColumns = [
  { title: 'Quick Links', items: ['Home', 'Services', 'Doctors', 'Appointments', 'Health Records'] },
  { title: 'Support', items: ['Help Center', 'FAQs', 'Privacy Policy', 'Terms & Conditions', 'Contact Us'] },
  { title: 'Contact Us', items: ['+1 234 567 8900', 'support@healthcare.com', '123 Health St, Medical City, USA'] },
  { title: 'Newsletter', items: ['Subscribe to get health tips and updates'] },
];

const getToneClasses = (tone: string) => {
  switch (tone) {
    case 'green':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'blue':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'sky':
      return 'bg-sky-100 text-sky-700 border-sky-200';
    case 'slate':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'cyan':
      return 'bg-cyan-100 text-cyan-700 border-cyan-200';
    case 'orange':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'purple':
      return 'bg-violet-100 text-violet-700 border-violet-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#eff4f9] text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edfaff] text-[#1c7ae0] shadow-sm ring-1 ring-sky-200">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[2rem] font-bold tracking-tight leading-none text-slate-800">HealthCare</div>
              <div className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-500">Better Health, Better Life</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className={`transition ${item === 'Home' ? 'text-sky-600' : 'hover:text-slate-900'}`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-sky-200 bg-white px-5 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50">
              Log In
            </button>
            <button className="rounded-xl bg-[#1e5be8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#174ac0]">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-6">
        <div className="flex gap-6">
          <aside className="hidden w-[250px] shrink-0 rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm lg:flex lg:flex-col">
            <nav className="space-y-1.5">
              {sidebarItems.map(({ label, icon: Icon, active }) => (
                <button
                  key={label}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                    active
                      ? 'bg-[#eaf3ff] text-[#1d5dd7] shadow-sm ring-1 ring-sky-100'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-auto rounded-2xl border border-sky-100 bg-[#f2fbff] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ShieldCheck className="h-4 w-4 text-sky-600" />
                Secure & Private
              </div>
              <p className="text-xs leading-5 text-slate-500">
                We protect your health data and ensure complete privacy.
              </p>
              <Link to="#" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-700">
                Learn More <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>

          <main className="flex-1 rounded-[28px] bg-transparent">
            <div className="mb-6 rounded-[28px] border border-slate-200 bg-[#f6f9fc] p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-sky-700">
                Welcome to Healthcare
              </div>

              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="max-w-[560px]">
                  <h1 className="text-4xl font-bold tracking-[-0.05em] text-slate-800 sm:text-5xl">
                    Your Health, <span className="text-[#1d5dd7]">Our Priority</span>
                  </h1>
                  <p className="mt-4 max-w-lg text-lg leading-8 text-slate-600">
                    A trusted healthcare platform that connects you with doctors, services, and health information — anytime, anywhere.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="rounded-xl bg-[#1e5be8] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#174ac0]">
                      Book Appointment
                    </button>
                    <button className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                      Explore Services
                    </button>
                  </div>
                </div>

                <div className="grid w-full max-w-[470px] grid-cols-2 gap-4">
                  <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700">
                        <div className="rounded-xl bg-[#edf5ff] p-2 text-sky-700"><HeartPulse className="h-4 w-4" /></div>
                        <span className="text-sm font-semibold">Heart Rate</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="text-3xl font-bold text-slate-800">72</div>
                      <div className="pb-1 text-xs text-slate-500">bpm</div>
                    </div>
                    <div className="mt-4 h-10 rounded-xl bg-gradient-to-r from-sky-100 to-sky-50 p-2">
                      <div className="h-full w-full rounded-lg bg-[radial-gradient(circle_at_10%_50%,rgba(59,130,246,0.18),transparent_28%),linear-gradient(135deg,#dbeafe_0%,#eff6ff_30%,#dbeafe_100%)]" />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700">
                        <div className="rounded-xl bg-[#edf5ff] p-2 text-sky-700"><Activity className="h-4 w-4" /></div>
                        <span className="text-sm font-semibold">Blood Pressure</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="text-3xl font-bold text-slate-800">120/80</div>
                      <div className="pb-1 text-xs text-slate-500">mmHg</div>
                    </div>
                    <div className="mt-4 h-10 rounded-xl bg-gradient-to-r from-sky-100 to-sky-50 p-2">
                      <div className="h-full w-full rounded-lg bg-[radial-gradient(circle_at_15%_45%,rgba(59,130,246,0.18),transparent_26%),linear-gradient(135deg,#dbeafe_0%,#eff6ff_30%,#dbeafe_100%)]" />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700">
                        <div className="rounded-xl bg-[#edf5ff] p-2 text-sky-700"><Heart className="h-4 w-4" /></div>
                        <span className="text-sm font-semibold">Oxygen Level</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="text-3xl font-bold text-slate-800">98%</div>
                    </div>
                    <div className="mt-4 flex items-center justify-center">
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-[8px] border-sky-100 bg-white">
                        <div className="absolute inset-0 rounded-full border-[6px] border-sky-500 border-t-transparent" style={{ transform: 'rotate(40deg)' }} />
                        <span className="text-sm font-bold text-sky-700">85</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700">
                        <div className="rounded-xl bg-[#edf5ff] p-2 text-sky-700"><Activity className="h-4 w-4" /></div>
                        <span className="text-sm font-semibold">Health Score</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-slate-800">85</div>
                      <div className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">Good</div>
                    </div>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-emerald-400 to-sky-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[2rem] font-bold tracking-[-0.05em] text-slate-800">Our Services</h2>
                <button className="text-sm font-semibold text-sky-700 hover:text-sky-800">View All Services</button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {serviceCards.map(({ title, subtitle, icon: Icon, tone }) => (
                  <div key={title} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] border ${getToneClasses(tone)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-[1.05rem] font-bold text-slate-800">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-5 text-[2rem] font-bold tracking-[-0.05em] text-slate-800">Dashboard Overview</h2>

              <div className="grid gap-4 xl:grid-cols-[1.45fr_0.9fr]">
                <div className="grid gap-4 md:grid-cols-2">
                  {overviewCards.slice(0, 6).map(({ label, value, detail, icon: Icon, tone }) => (
                    <div key={label} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${getToneClasses(tone)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</div>
                      </div>
                      <div className="mt-4 text-2xl font-bold tracking-tight text-slate-800">{value}</div>
                      <div className="mt-1 text-sm text-slate-500">{detail}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-800">Upcoming Appointment</h3>
                    <div className="rounded-xl bg-slate-100 p-2 text-slate-700"><Calendar className="h-4 w-4" /></div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center gap-3 text-slate-700">
                      <Calendar className="h-4 w-4 text-sky-600" />
                      <span className="text-lg font-semibold">24 May 2025</span>
                    </div>
                    <div className="mb-3 flex items-center gap-3 text-slate-700">
                      <Clock3 className="h-4 w-4 text-sky-600" />
                      <span className="text-lg font-semibold">10:30 AM</span>
                    </div>
                    <div className="mb-3 flex items-center gap-3 text-slate-700">
                      <Stethoscope className="h-4 w-4 text-sky-600" />
                      <span className="font-medium">Dr. John Smith</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <Heart className="h-4 w-4 text-sky-600" />
                      <span>City Care Hospital</span>
                    </div>
                  </div>

                  <button className="mt-5 w-full rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100">
                    View Details
                  </button>

                  <div className="mt-6 space-y-3">
                    {[
                      'Book Appointment',
                      'Upload Report',
                      'Find Doctor',
                      'Health Calculator',
                    ].map((action, index) => (
                      <div
                        key={action}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-lg ${index % 2 === 0 ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-700'} flex items-center justify-center`}>
                            {index === 0 ? <Calendar className="h-4 w-4" /> : index === 1 ? <FileText className="h-4 w-4" /> : index === 2 ? <Stethoscope className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                          </div>
                          {action}
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-red-200 bg-[#fff1f1] p-4 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-800">Emergency Assistance</div>
                    <div className="text-sm text-slate-600">Get immediate help in case of a medical emergency.</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3 text-slate-700 ring-1 ring-red-100">
                    <div className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-slate-500">Call Emergency</div>
                    <div className="text-2xl font-bold text-red-600">911</div>
                  </div>
                  <button className="rounded-xl border border-red-300 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                    Emergency Contacts
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <footer className="mt-6 border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-6 py-10 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edfaff] text-[#1c7ae0] shadow-sm ring-1 ring-sky-200">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[2rem] font-bold tracking-tight leading-none text-slate-800">HealthCare</div>
                <div className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-slate-500">Better Health, Better Life</div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
              A modern healthcare platform designed to make healthcare simple, accessible, and secure.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-base font-bold text-slate-800">{column.title}</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto flex max-w-[1400px] items-center justify-center px-6 py-4 text-sm text-slate-500">
            © 2025 HealthCare. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
