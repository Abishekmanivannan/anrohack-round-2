import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import CursorGrid from '../react-bits/CursorGrid';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
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
