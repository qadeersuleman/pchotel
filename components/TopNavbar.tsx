'use client';

import React, { useState } from 'react';
import {
  Menu,
  Building2,
  UtensilsCrossed,
  ChevronDown,
  LogOut,
  ShieldCheck,
  Bell,
  UserPlus,
  Clock,
  Check,
} from 'lucide-react';

interface TopNavbarProps {
  currentPortal: 'hotel' | 'restaurant';
  onSwitchPortal: (portal: 'hotel' | 'restaurant') => void;
  onToggleSidebar: () => void;
  onLogout: () => void;
  username?: string;
  onOpenCheckIn?: () => void;
}

export default function TopNavbar({
  currentPortal,
  onSwitchPortal,
  onToggleSidebar,
  onLogout,
  username = 'rfjalbani',
  onOpenCheckIn,
}: TopNavbarProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Room 202 requested Checkout Folio invoice', time: '5m ago', read: false },
    { id: 2, text: 'Lazzati POS: Table 4 ordered Mutton Karahi', time: '12m ago', read: false },
    { id: 3, text: 'Sukkur IBA BTC Corporate booking approved', time: '1h ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-14 bg-[#18181B] text-[#FAFAFA] flex items-center justify-between px-3 md:px-6 border-b border-white/[0.08] select-none z-40 sticky top-0 shadow-sm backdrop-blur-md">
      {/* Left branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/[0.06] active:scale-95 transition-all cursor-pointer"
          title="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Hotel Crest & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E63946] to-amber-500 flex items-center justify-center text-white shadow-md shadow-[#E63946]/25 font-black text-xs">
            PC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-xs sm:text-sm text-[#FAFAFA] uppercase">
                PAKISTAN CLUB INN
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/30 font-extrabold uppercase hidden sm:inline-block">
                SUKKUR
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 hidden md:block">
              Luxury Hospitality &bull; City Bypass Road
            </div>
          </div>
        </div>
      </div>

      {/* Center: Creative Portal Switcher Tabs */}
      <div className="flex items-center bg-zinc-900/90 p-1 rounded-2xl border border-white/[0.08] shadow-inner text-xs font-semibold">
        <button
          onClick={() => onSwitchPortal('hotel')}
          className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
            currentPortal === 'hotel'
              ? 'bg-[#E63946] text-white shadow-md shadow-[#E63946]/30 font-black'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hotel PMS &amp; Ledger</span>
          <span className="sm:hidden">Hotel</span>
        </button>

        <button
          onClick={() => onSwitchPortal('restaurant')}
          className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
            currentPortal === 'restaurant'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 font-black'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Lazzati Restaurant POS</span>
          <span className="sm:hidden">Kitchen</span>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Check-In CTA button */}
        {onOpenCheckIn && currentPortal === 'hotel' && (
          <button
            onClick={onOpenCheckIn}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E63946] hover:bg-[#d62839] text-white text-xs font-bold transition-all shadow-sm shadow-[#E63946]/20 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Check-In</span>
          </button>
        )}

        {/* Notifications Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all relative cursor-pointer"
            title="Hotel Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E63946] ring-2 ring-[#18181B]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#18181B] border border-white/[0.12] shadow-2xl text-xs py-2 z-50 animate-fade-in-up">
              <div className="px-3.5 py-2 border-b border-white/[0.08] flex items-center justify-between">
                <span className="font-bold text-white text-xs">Hotel Activity Log</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-zinc-400 hover:text-[#E63946] transition flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark read</span>
                  </button>
                )}
              </div>
              <div className="divide-y divide-white/[0.06] max-h-56 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-left transition hover:bg-white/[0.03] ${
                      !n.read ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <div className="text-zinc-200 text-xs leading-relaxed">{n.text}</div>
                    <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BETA Pill */}
        <span className="hidden lg:inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-zinc-400 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] animate-ping" />
          <span>LIVE BETA</span>
        </span>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 py-1 px-1.5 rounded-xl hover:bg-white/[0.06] transition-all cursor-pointer border border-transparent hover:border-white/[0.08]"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-[#FAFAFA] leading-tight">{username}</div>
              <div className="text-[10px] text-zinc-400">Front Desk Manager</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-1" />
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#18181B] border border-white/[0.12] shadow-2xl text-xs py-2 z-50 animate-fade-in-up">
              <div className="px-4 py-3 border-b border-white/[0.08]">
                <div className="font-bold text-white text-sm">{username}</div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Authorized Administrator</span>
                </div>
              </div>

              {/* Mobile Portal Switch */}
              <div className="p-2 border-b border-white/[0.08] md:hidden space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-bold px-2">Switch Portal</span>
                <button
                  onClick={() => {
                    onSwitchPortal('hotel');
                    setProfileDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl flex items-center gap-2 text-left font-semibold ${
                    currentPortal === 'hotel' ? 'bg-[#E63946] text-white' : 'text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hotel Front Desk &amp; HMS</span>
                </button>
                <button
                  onClick={() => {
                    onSwitchPortal('restaurant');
                    setProfileDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl flex items-center gap-2 text-left font-semibold ${
                    currentPortal === 'restaurant' ? 'bg-amber-600 text-white' : 'text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Restaurant POS</span>
                </button>
              </div>

              <div className="p-1.5">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-2 text-left transition cursor-pointer font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Staff Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
