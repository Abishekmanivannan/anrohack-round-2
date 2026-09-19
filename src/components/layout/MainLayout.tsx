import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import CursorGrid from '../react-bits/CursorGrid';
import { useTheme } from '../../context/ThemeContext';

export const MainLayout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background Interactive Cursor Grid */}
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

      {/* Main Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 xl:p-10 max-w-[1600px] w-full mx-auto pb-24 relative z-10">
        <Outlet />
      </main>

      {/* Floating Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};
