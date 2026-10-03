'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  LayoutGrid,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Boxes,
  Briefcase,
  Building2,
  DollarSign,
  Plus,
  ArrowRight,
  BookOpen,
  FileText,
  Check,
  Phone,
  Sparkles,
  TrendingUp,
  Search,
} from 'lucide-react';

interface MainHubDashboardProps {
  username?: string;
  onOpenModule: (moduleId: string) => void;
}

export default function MainHubDashboard({
  username = 'rfjalbani',
  onOpenModule,
}: MainHubDashboardProps) {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Daily Receivable working', done: true, priority: true },
    { id: 2, title: 'Cash and bank reconciliation', done: true, priority: false },
    { id: 3, title: 'Evening housekeeping shift inspection', done: false, priority: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;
  const openTasks = totalTasks - doneTasks;

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in-up">
      {/* 1. Creative Hero Greeting Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/80 shadow-sm luxury-hover flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-400/10 via-rose-400/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#5b51d8] to-indigo-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/25">
            r
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-medium">Good morning,</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">
                Front Desk Live
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
              {username}
            </h1>
          </div>
        </div>

        {/* Date & Time Pill with Luxury Accents */}
        <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200/90 px-4 py-2 rounded-2xl text-xs text-zinc-700 font-medium shadow-xs relative z-10">
          <Calendar className="w-4 h-4 text-zinc-400" />
          <span className="font-semibold">{currentDate}</span>
          <span className="text-zinc-300 font-bold">&bull;</span>
          <Clock className="w-4 h-4 text-zinc-400" />
          <span className="font-semibold font-mono">{currentTime}</span>
        </div>
      </div>

      {/* 2. Four Interactive Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Modules */}
        <div
          onClick={() => onOpenModule('hms')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/80 shadow-sm luxury-hover flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-center text-zinc-500 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-none">
              4
            </div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1.5">
              MODULES
            </div>
          </div>
        </div>

        {/* Card 2: Tasks */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/80 shadow-sm luxury-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-none">
              {totalTasks}
            </div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1.5">
              TASKS ({doneTasks} DONE)
            </div>
          </div>
        </div>

        {/* Card 3: Pending with User's Friendly Luxury Red Combo (#FFF1F2 + #E63946) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/80 shadow-sm luxury-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] border border-[#E63946]/25 flex items-center justify-center text-[#E63946] shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-none">
              {openTasks}
            </div>
            <div className="text-[10px] font-bold text-[#E63946] uppercase tracking-wider mt-1.5 flex items-center gap-1">
              <span>PENDING</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E63946]" />
            </div>
          </div>
        </div>

        {/* Card 4: Follow-ups */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/80 shadow-sm luxury-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-sky-600">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight leading-none">
              0
            </div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1.5">
              FOLLOW-UPS
            </div>
          </div>
        </div>
      </div>

      {/* 3. Creative Modules Section ("Your authorized sections") */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
                <LayoutGrid className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
                Authorized Modules
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select any system module to manage hotel operations or accounts
            </p>
          </div>

          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/60 hidden sm:inline-block">
            4 Core Apps
          </span>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Inventory */}
          <div
            onClick={() => onOpenModule('inventory')}
            className="group relative p-5 rounded-2xl border border-zinc-200/80 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center gap-3 bg-white"
          >
            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-md">
              1
            </span>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#5b51d8] group-hover:scale-110 group-hover:rotate-2 transition-all">
              <Boxes className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-zinc-800 block">Inventory</span>
              <span className="text-[10px] text-zinc-400">Kitchen &amp; Raw Stock</span>
            </div>
          </div>

          {/* Accounts */}
          <div
            onClick={() => onOpenModule('accounts')}
            className="group relative p-5 rounded-2xl border border-zinc-200/80 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center gap-3 bg-white"
          >
            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-md">
              15
            </span>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:rotate-2 transition-all">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-zinc-800 block">Accounts</span>
              <span className="text-[10px] text-zinc-400">Ledger &amp; Reconciliation</span>
            </div>
          </div>

          {/* HMS */}
          <div
            onClick={() => onOpenModule('hms')}
            className="group relative p-5 rounded-2xl border border-zinc-200/80 hover:border-sky-400 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center gap-3 bg-white"
          >
            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-md">
              10
            </span>
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-110 group-hover:rotate-2 transition-all">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-zinc-800 block">HMS</span>
              <span className="text-[10px] text-zinc-400">Rooms, Invoices &amp; Bookings</span>
            </div>
          </div>

          {/* Payroll */}
          <div
            onClick={() => onOpenModule('payroll')}
            className="group relative p-5 rounded-2xl border border-zinc-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center gap-3 bg-white"
          >
            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center shadow-md">
              6
            </span>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:rotate-2 transition-all">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-zinc-800 block">Payroll</span>
              <span className="text-[10px] text-zinc-400">Shifts, Salaries &amp; Staff</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Quick Links, Tasks, Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Quick Links */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm luxury-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                Quick Action Shortcuts
              </h3>
            </div>

            <div className="flex items-center gap-3.5">
              {/* LEDGER */}
              <button
                onClick={() => onOpenModule('accounts')}
                className="w-18 h-18 rounded-2xl bg-[#5b51d8] hover:bg-[#4f46e5] text-white flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-indigo-500/20 active:scale-95"
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-[10px] font-bold tracking-wider">LEDGER</span>
              </button>

              {/* Journal Voucher */}
              <button
                onClick={() => onOpenModule('accounts')}
                className="w-18 h-18 rounded-2xl bg-[#5b51d8] hover:bg-[#4f46e5] text-white flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-indigo-500/20 active:scale-95"
              >
                <FileText className="w-5 h-5" />
                <span className="text-[9px] font-bold tracking-wider truncate w-14 text-center">
                  Journal Vouc...
                </span>
              </button>

              {/* Add */}
              <button
                onClick={() => onOpenModule('hms-invoice')}
                className="w-18 h-18 rounded-2xl border-2 border-dashed border-zinc-300 hover:border-zinc-400 text-zinc-400 hover:text-zinc-600 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[10px] font-semibold">New Folio</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 mt-4 pt-3 border-t border-zinc-100">
            Frequently accessed accounting actions
          </div>
        </div>

        {/* Card 2: Interactive Tasks with Live Checkboxes */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm luxury-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E63946] shadow-[0_0_8px_rgba(230,57,70,0.5)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  Duty Checklist
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FFF1F2] text-[#E63946] font-bold border border-[#E63946]/20">
                  {openTasks} Urgent
                </span>
              </div>
            </div>

            {/* Interactive Tasks List */}
            <div className="space-y-2 text-xs">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    task.done
                      ? 'bg-zinc-50 border-zinc-200/60 text-zinc-500'
                      : 'bg-[#FFF1F2]/40 border-[#E63946]/30 text-zinc-800 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                        task.done
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-zinc-300'
                      }`}
                    >
                      {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={`text-[11px] ${task.done ? 'line-through' : ''}`}>
                      {task.title}
                    </span>
                  </div>

                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      task.done ? 'bg-emerald-500' : 'bg-[#E63946]'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Progress Footer */}
          <div className="pt-4 mt-3 border-t border-zinc-100 flex items-center justify-around text-center text-[10px] font-bold text-zinc-400">
            <div>
              <div className="text-zinc-800 text-sm font-black">{totalTasks}</div>
              <div>TOTAL</div>
            </div>
            <div>
              <div className="text-emerald-600 text-sm font-black">{doneTasks}</div>
              <div>DONE</div>
            </div>
            <div>
              <div className="text-[#E63946] text-sm font-black">{openTasks}</div>
              <div>OPEN</div>
            </div>
          </div>
        </div>

        {/* Card 3: Follow-ups / Recovery with Soft Luxury Red Accent */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm luxury-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E63946]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  Recovery Desk
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FFF1F2] text-[#E63946] font-bold border border-[#E63946]/20">
                0 Due Overdue
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 mb-4">Credit Guest Recovery Tracking</div>

            <div className="flex flex-col items-center justify-center py-4 text-zinc-400 text-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] border border-[#E63946]/20 flex items-center justify-center text-[#E63946] mb-2.5 shadow-xs">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-zinc-600">
                All guest folios current
              </span>
              <span className="text-[10px] text-zinc-400">No overdue balances</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onOpenModule('hms-btc')}
              className="w-full py-2.5 rounded-2xl bg-zinc-50 hover:bg-[#FFF1F2] text-zinc-700 hover:text-[#E63946] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-zinc-200/80 hover:border-[#E63946]/30"
            >
              <span>View Corporate Credit Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
