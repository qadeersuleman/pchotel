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
  UserPlus,
  UtensilsCrossed,
  Receipt,
} from 'lucide-react';

interface MainHubDashboardProps {
  username?: string;
  onOpenModule: (moduleId: string) => void;
  onOpenCheckIn?: () => void;
}

export default function MainHubDashboard({
  username = 'rfjalbani',
  onOpenModule,
  onOpenCheckIn,
}: MainHubDashboardProps) {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Daily Receivable reconciliation (Front Desk)', done: true, priority: true },
    { id: 2, title: 'Cash & bank balance verification (Meezan/HBL)', done: true, priority: false },
    { id: 3, title: 'Evening housekeeping shift inspection (Floor 2 & 3)', done: false, priority: true },
    { id: 4, title: 'BTC Corporate guest invoice submission (OGDCL)', done: false, priority: true },
  ]);

  const [newTaskInput, setNewTaskInput] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTaskInput.trim(),
      done: false,
      priority: true,
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskInput('');
    setShowAddTask(false);
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
      {/* 1. Creative Hero Greeting Card with #E63946 + #FFF1F2 + #18181B + #FAFAFA */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/90 shadow-sm luxury-hover flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle decorative glow in #FFF1F2 and #E63946 */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#E63946]/10 via-[#FFF1F2] to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#18181B] to-[#3f3f46] border border-white/10 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-black/20">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-semibold">Welcome back,</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FFF1F2] text-[#E63946] font-extrabold border border-[#E63946]/25 tracking-wide uppercase">
                Front Desk Live
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight">
              {username}
            </h1>
          </div>
        </div>

        {/* Date, Time & Quick Action CTA */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200/90 px-4 py-2 rounded-2xl text-xs text-zinc-700 font-medium shadow-xs">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span className="font-semibold">{currentDate}</span>
            <span className="text-zinc-300 font-bold">&bull;</span>
            <Clock className="w-4 h-4 text-zinc-400" />
            <span className="font-bold font-mono text-[#18181B]">{currentTime}</span>
          </div>

          {onOpenCheckIn && (
            <button
              onClick={onOpenCheckIn}
              className="px-4 py-2 rounded-2xl btn-luxury-red font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Check-In Guest</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Four Interactive Stat Cards with User's Recommended Combo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Modules */}
        <div
          onClick={() => onOpenModule('hms')}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/90 shadow-sm luxury-hover flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-center text-zinc-600 group-hover:bg-[#FFF1F2] group-hover:text-[#E63946] group-hover:border-[#E63946]/30 transition-all">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight leading-none">
              4
            </div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1.5">
              MODULES
            </div>
          </div>
        </div>

        {/* Card 2: Tasks */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/90 shadow-sm luxury-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight leading-none">
              {totalTasks}
            </div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1.5">
              TASKS ({doneTasks} DONE)
            </div>
          </div>
        </div>

        {/* Card 3: PENDING with #E63946 + #FFF1F2 Luxury Combo */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E63946]/30 shadow-sm luxury-hover flex items-center gap-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] border border-[#E63946]/30 flex items-center justify-center text-[#E63946] shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#E63946] tracking-tight leading-none">
              {openTasks}
            </div>
            <div className="text-[10px] font-extrabold text-[#E63946] uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
              <span>PENDING DUTIES</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] animate-ping" />
            </div>
          </div>
        </div>

        {/* Card 4: Follow-ups */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/90 shadow-sm luxury-hover flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-center text-zinc-500">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight leading-none">
              0
            </div>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1.5">
              FOLLOW-UPS
            </div>
          </div>
        </div>
      </div>

      {/* 3. Authorized Core Modules */}
      <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#18181B] flex items-center justify-center text-white">
                <LayoutGrid className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm sm:text-base font-black text-[#18181B] tracking-tight">
                Authorized System Modules
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select any core application to manage hotel front desk, dining or accounts
            </p>
          </div>

          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/25 hidden sm:inline-block">
            4 Core Apps Active
          </span>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. HMS Hotel Management System (Highlighted with Luxury Red combo) */}
          <div
            onClick={() => onOpenModule('hms')}
            className="group relative p-5 rounded-3xl border-2 border-[#E63946]/30 bg-gradient-to-b from-white to-[#FFF1F2]/30 hover:border-[#E63946] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center gap-3"
          >
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#E63946] text-white font-extrabold text-[10px] shadow-sm">
              HMS Core
            </span>
            <div className="w-14 h-14 rounded-2xl bg-[#FFF1F2] border border-[#E63946]/30 flex items-center justify-center text-[#E63946] group-hover:scale-110 group-hover:rotate-2 transition-all shadow-xs">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <span className="font-black text-sm text-[#18181B] block">Hotel PMS</span>
              <span className="text-[10px] text-zinc-500 font-semibold">Rooms, Check-In &amp; Invoices</span>
            </div>
          </div>

          {/* 2. Restaurant POS */}
          <div
            onClick={() => onOpenModule('restaurant')}
            className="group relative p-5 rounded-3xl border border-zinc-200/90 hover:border-amber-500 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center gap-3 bg-white"
          >
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] shadow-sm">
              POS Live
            </span>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:rotate-2 transition-all">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <div>
              <span className="font-black text-sm text-[#18181B] block">Lazzati Dining POS</span>
              <span className="text-[10px] text-zinc-400">Table Orders &amp; Room Service</span>
            </div>
          </div>

          {/* 3. Accounts & Ledger */}
          <div
            onClick={() => onOpenModule('accounts')}
            className="group relative p-5 rounded-3xl border border-zinc-200/90 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center gap-3 bg-white"
          >
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] shadow-sm">
              Ledger
            </span>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:rotate-2 transition-all">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <span className="font-black text-sm text-[#18181B] block">Accounts</span>
              <span className="text-[10px] text-zinc-400">Cashbook, JV &amp; Bank Recon</span>
            </div>
          </div>

          {/* 4. Payroll & Staff */}
          <div
            onClick={() => onOpenModule('payroll')}
            className="group relative p-5 rounded-3xl border border-zinc-200/90 hover:border-[#18181B] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center gap-3 bg-white"
          >
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#18181B] text-white font-extrabold text-[10px] shadow-sm">
              Staff HR
            </span>
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 group-hover:scale-110 group-hover:rotate-2 transition-all">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <span className="font-black text-sm text-[#18181B] block">Staff Payroll</span>
              <span className="text-[10px] text-zinc-400">Shifts, Salaries &amp; Attendance</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Quick Action Hub, Interactive Tasks, Recovery Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Quick Action Shortcuts */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm luxury-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#E63946]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#18181B]">
                Quick Action Shortcuts
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Check-In */}
              <button
                onClick={onOpenCheckIn || (() => onOpenModule('hms-booking'))}
                className="p-3.5 rounded-2xl bg-[#FFF1F2] border border-[#E63946]/25 hover:bg-[#E63946] hover:text-white text-[#E63946] flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs group"
              >
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-black tracking-wide">NEW CHECK-IN</span>
              </button>

              {/* Invoices */}
              <button
                onClick={() => onOpenModule('hms-invoice')}
                className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:bg-[#18181B] hover:text-white text-zinc-800 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs group"
              >
                <Receipt className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-black tracking-wide">HOTEL FOLIOS</span>
              </button>

              {/* POS */}
              <button
                onClick={() => onOpenModule('restaurant')}
                className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-600 hover:text-white text-amber-700 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs group"
              >
                <UtensilsCrossed className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-black tracking-wide">DINING POS</span>
              </button>

              {/* Ledger */}
              <button
                onClick={() => onOpenModule('accounts')}
                className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-600 hover:text-white text-emerald-700 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs group"
              >
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-black tracking-wide">LEDGER JV</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <span>Pakistan Club Inn Sukkur</span>
            <span className="text-[10px] font-bold text-[#E63946]">Instant Actions</span>
          </div>
        </div>

        {/* Card 2: Interactive Duty Checklist with Add Task feature */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm luxury-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E63946] shadow-[0_0_8px_rgba(230,57,70,0.6)]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#18181B]">
                  Duty Checklist
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-zinc-100 hover:bg-[#FFF1F2] text-zinc-600 hover:text-[#E63946] transition cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FFF1F2] text-[#E63946] font-bold border border-[#E63946]/25">
                  {openTasks} Urgent
                </span>
              </div>
            </div>

            {/* Add Task Input */}
            {showAddTask && (
              <form onSubmit={handleAddNewTask} className="mb-3 flex items-center gap-1.5 animate-fade-in-up">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  placeholder="New front desk duty..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-zinc-300 text-xs outline-none focus:border-[#E63946]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-[#E63946] text-white text-xs font-bold hover:bg-[#d62839] cursor-pointer"
                >
                  Save
                </button>
              </form>
            )}

            {/* Interactive Tasks List */}
            <div className="space-y-2 text-xs max-h-52 overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    task.done
                      ? 'bg-zinc-50 border-zinc-200/60 text-zinc-400'
                      : 'bg-[#FFF1F2]/40 border-[#E63946]/30 text-[#18181B] font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                        task.done
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-zinc-300 bg-white'
                      }`}
                    >
                      {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className={`text-[11px] ${task.done ? 'line-through text-zinc-400' : ''}`}>
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
              <div className="text-[#18181B] text-sm font-black">{totalTasks}</div>
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

        {/* Card 3: Recovery Desk with Soft Luxury Red Accent */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm luxury-hover flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E63946]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#18181B]">
                  Recovery &amp; Ledger Desk
                </h3>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FFF1F2] text-[#E63946] font-bold border border-[#E63946]/25">
                0 Overdue
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 mb-4">Corporate BTC &amp; Guest Folio Recovery</div>

            <div className="flex flex-col items-center justify-center py-4 text-zinc-400 text-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] border border-[#E63946]/25 flex items-center justify-center text-[#E63946] mb-2.5 shadow-xs">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-zinc-800">
                All guest folios current
              </span>
              <span className="text-[10px] text-zinc-400">No overdue balances recorded</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onOpenModule('hms-btc')}
              className="w-full py-2.5 rounded-2xl bg-[#FFF1F2] hover:bg-[#E63946] text-[#E63946] hover:text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[#E63946]/25"
            >
              <span>View Corporate Credit Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
