'use client';

import React, { useEffect, useState } from 'react';
import { KeyRound, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [stars, setStars] = useState<{ id: number; left: string; top: string; duration: string; delay: string; size: string }[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Generate star coordinates
    const generated = Array.from({ length: 60 }).map((_, idx) => ({
      id: idx,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${1.8 + Math.random() * 3}s`,
      delay: `${Math.random() * 2}s`,
      size: Math.random() > 0.65 ? '3px' : '2px',
    }));
    setStars(generated);

    // Auto complete after 3.8 seconds
    const timer = setTimeout(() => {
      handleExit();
    }, 3800);

    return () => clearTimeout(timer);
  }, []);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050a18] text-white overflow-hidden transition-all duration-700 select-none ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Dynamic Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-white/80"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animation: `twinkle ${star.duration} ease-in-out infinite alternate`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Radial Center Glow */}
      <div className="absolute w-[360px] h-[360px] rounded-full bg-sky-500/15 blur-3xl animate-glow-pulse pointer-events-none" />

      {/* Corner Luxury Accents */}
      <div className="absolute top-8 left-8 w-8 h-8 pointer-events-none border-t border-l border-amber-400/40" />
      <div className="absolute top-8 right-8 w-8 h-8 pointer-events-none border-t border-r border-amber-400/40" />
      <div className="absolute bottom-8 left-8 w-8 h-8 pointer-events-none border-b border-l border-amber-400/40" />
      <div className="absolute bottom-8 right-8 w-8 h-8 pointer-events-none border-b border-r border-amber-400/40" />

      {/* Decorative Lines */}
      <div className="absolute top-[35%] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-[30%] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Central Rotating Rings & Key Icon */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* SVG Progress Ring */}
        <svg className="absolute inset-0 w-full h-full animate-ring-rotate" viewBox="0 0 140 140">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <circle
            cx="70"
            cy="70"
            r="63"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="2"
          />
          <circle
            cx="70"
            cy="70"
            r="63"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="2.5"
            strokeDasharray="395"
            strokeDashoffset="80"
            strokeLinecap="round"
          />
        </svg>

        {/* Orbit 1 with colored nodes */}
        <div className="absolute w-[180px] h-[180px] rounded-full animate-orbit-1 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
        </div>

        {/* Orbit 2 Counter */}
        <div className="absolute w-[215px] h-[215px] rounded-full animate-orbit-2 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
          <div className="absolute top-[20%] right-[10%] w-1.5 h-1.5 rounded-full bg-amber-300/50" />
          <div className="absolute bottom-[20%] left-[10%] w-1.5 h-1.5 rounded-full bg-sky-300/50" />
        </div>

        {/* Central Key Icon */}
        <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-b from-amber-500/20 to-sky-500/10 border border-amber-400/30 backdrop-blur-sm shadow-[0_0_30px_rgba(245,158,11,0.25)] animate-key-float">
          <KeyRound className="w-10 h-10 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
        </div>
      </div>

      {/* Brand & Titles */}
      <div className="mt-9 text-center z-10 flex flex-col items-center">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs tracking-widest font-semibold uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Hospitality Management System</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-[0.2em] uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          PAKISTAN CLUB INN HOTEL
        </h1>
        <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-sky-200/60 mt-1 font-medium">
          Nenosofts.pk &middot; Sukkur Bypass
        </p>
      </div>

      {/* Bottom Status & Skip */}
      <div className="absolute bottom-8 flex flex-col items-center gap-3 z-10">
        <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Initializing Portal</span>
          <span className="animate-pulse">...</span>
        </div>

        <button
          onClick={handleExit}
          className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-slate-300 hover:text-white transition-all cursor-pointer backdrop-blur-sm"
        >
          Skip Intro &rarr;
        </button>
      </div>
    </div>
  );
}
