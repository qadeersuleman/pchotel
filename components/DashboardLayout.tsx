'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck2,
  UserPlus,
  Receipt,
  UtensilsCrossed,
  BarChart3,
  Settings,
  Bell,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Plus,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCheckInModal: () => void;
  onLogout: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export default function DashboardLayout({
  children,
  activeTab,
  setActiveTab,
  onOpenCheckInModal,
  onLogout,
  isDarkTheme,
  onToggleTheme,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-PK', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'rooms', label: 'Room Matrix & Status', icon: BedDouble },
    { id: 'bookings', label: 'Reservations & Bookings', icon: CalendarCheck2 },
    { id: 'checkin', label: 'New Guest Check-In', icon: UserPlus },
    { id: 'billing', label: 'Billing & Folio Check-Out', icon: Receipt },
    { id: 'restaurant', label: 'Lazzati Restaurant / Food', icon: UtensilsCrossed },
    { id: 'reports', label: 'Daily Reports & Cash', icon: BarChart3 },
    { id: 'settings', label: 'Hotel & System Settings', icon: Settings },
  ];

  const notifications = [
    { id: 1, title: 'VIP Guest Arrival', desc: 'Malik Zulfiqar checked in Suite 301', time: '10m ago', urgent: true },
    { id: 2, title: 'Housekeeping Alert', desc: 'Room 103 marked ready for inspection', time: '25m ago', urgent: false },
    { id: 3, title: 'Lazzati Restaurant', desc: 'Room 204 ordered Dinner (PKR 2,670)', time: '40m ago', urgent: false },
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkTheme ? 'bg-[#0b1120] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Navbar */}
      <header className={`sticky top-0 z-40 h-16 border-b backdrop-blur-md flex items-center justify-between px-4 lg:px-6 transition-colors ${
        isDarkTheme ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border transition-colors cursor-pointer border-slate-700 bg-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-600/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm lg:text-base tracking-wide bg-gradient-to-r from-sky-400 to-amber-300 bg-clip-text text-transparent">
                  PAKISTAN CLUB INN
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  SUKKUR
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                City Bypass Road &bull; Front Desk PMS
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live Clock & Shift Badge */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>{currentTime || 'Loading time...'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Morning Shift</span>
          </div>
        </div>

        {/* Right: Actions, Theme, Notifications & User */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Quick Check-In CTA */}
          <button
            onClick={onOpenCheckInModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 shadow-md shadow-sky-500/25 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Check-In</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition cursor-pointer ${
              isDarkTheme
                ? 'border-slate-800 bg-slate-800/70 hover:bg-slate-700 text-amber-400'
                : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-sky-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center relative transition cursor-pointer ${
                isDarkTheme
                  ? 'border-slate-800 bg-slate-800/70 hover:bg-slate-700 text-slate-300'
                  : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
            </button>

            {notificationsOpen && (
              <div className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl border p-3 z-50 animate-fadeIn ${
                isDarkTheme ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Front Desk Alerts</span>
                  <span className="text-[10px] text-sky-400">3 New</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 transition text-xs">
                      <div className="flex justify-between items-center font-semibold">
                        <span className={n.urgent ? 'text-amber-400' : 'text-slate-200'}>{n.title}</span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm">
              TA
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold leading-tight">Tariq Ahmed</div>
              <div className="text-[10px] text-slate-400">Front Desk Manager</div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Desktop) */}
        <aside className={`w-64 border-r hidden lg:flex flex-col shrink-0 transition-colors ${
          isDarkTheme ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
          {/* Hotel Shift Info Badge */}
          <div className="p-4 border-b border-slate-800/60">
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-sky-300">Online PMS Active</div>
                <div className="text-[10px] text-slate-400">Sukkur Branch &bull; Nenosofts</div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-800/60">
            <div className="text-[11px] text-slate-500 text-center">
              PAKISTAN CLUB INN PMS v2.5
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className={`relative w-72 h-full flex flex-col p-4 shadow-2xl z-10 ${
              isDarkTheme ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
            }`}>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="font-bold text-sm text-sky-400">PAKISTAN CLUB INN</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 bg-red-500/10 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout from Front Desk</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}
