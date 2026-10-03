'use client';

import React, { useState } from 'react';
import {
  Monitor,
  Boxes,
  Coins,
  Building2,
  Users,
  ChevronRight,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';

interface LeftIconSidebarProps {
  currentView: string;
  onSelectView: (viewId: string) => void;
  onOpenHMSFeature?: (feature: string) => void;
}

export default function LeftIconSidebar({
  currentView,
  onSelectView,
}: LeftIconSidebarProps) {
  const [activeDrawer, setActiveDrawer] = useState<'accounts' | 'hms' | 'payroll' | 'inventory' | null>(null);
  const [expandedReports, setExpandedReports] = useState<{ [key: string]: boolean }>({
    hmsReport: true,
    accountsReport: true,
    payrollReport: true,
    inventoryReport: true,
  });

  const toggleReport = (key: string) => {
    setExpandedReports((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuSections = {
    accounts: {
      title: 'Accounts',
      items: [
        { id: 'acc-dashboard', label: 'Dashboard' },
        { id: 'acc-parent-types', label: 'Parent Account Types' },
        { id: 'acc-child-types', label: 'Child Accounts Types' },
        { id: 'acc-register', label: 'Account Register' },
        { id: 'acc-journal', label: 'Journal Voucher' },
        { id: 'acc-bank-recon', label: 'Bank Reconciliation' },
      ],
    },
    hms: {
      title: 'HMS',
      directItems: [
        { id: 'hms-main', label: 'Main Dashboard' },
        { id: 'hms-room-category', label: 'Room Category' },
      ],
      reportItems: [
        { id: 'hms-rooms', label: 'Rooms' },
        { id: 'hms-services', label: 'Services' },
        { id: 'hms-booking', label: 'Booking' },
        { id: 'hms-invoice', label: 'Hotel Invoice' },
        { id: 'hms-btc', label: 'BTC CONTRACT' },
        { id: 'hms-pos-hotel', label: 'Pos Hotel' },
        { id: 'hms-events', label: 'Event Booking' },
      ],
    },
    payroll: {
      title: 'Payroll',
      directItems: [
        { id: 'pay-departments', label: 'Departments' },
      ],
      reportItems: [
        { id: 'pay-shifts', label: 'Shifts' },
        { id: 'pay-salaries', label: 'Generate Salaries' },
        { id: 'pay-employees', label: 'Employees' },
        { id: 'pay-attendance', label: 'Attendance' },
      ],
    },
    inventory: {
      title: 'Inventory',
      directItems: [
        { id: 'inv-items', label: 'Stock Items' },
        { id: 'inv-suppliers', label: 'Suppliers' },
      ],
      reportItems: [
        { id: 'inv-restaurant', label: 'Kitchen Inventory' },
        { id: 'inv-reorder', label: 'Reorder Alerts' },
      ],
    },
  };

  const handleItemClick = (target: string) => {
    onSelectView(target);
    setActiveDrawer(null);
  };

  return (
    <div className="relative flex select-none z-30">
      {/* Narrow vertical bar */}
      <aside className="w-14 sm:w-16 bg-white border-r border-slate-200/90 flex flex-col items-center py-3 gap-2 shrink-0 min-h-[calc(100vh-52px)] shadow-sm">
        {/* 1. Main Dashboard Hub (Monitor Icon) */}
        <button
          onClick={() => {
            onSelectView('hub');
            setActiveDrawer(null);
          }}
          title="Dashboard Overview"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
            currentView === 'hub'
              ? 'bg-sky-50 text-sky-600 border border-sky-200/80'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          {currentView === 'hub' && (
            <span className="absolute -left-2 top-2 bottom-2 w-1 bg-sky-600 rounded-r" />
          )}
          <Monitor className="w-5 h-5" />
        </button>

        {/* 2. Inventory (Hierarchy / Box tree) */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'inventory' ? null : 'inventory')}
          title="Inventory"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
            activeDrawer === 'inventory' || currentView.startsWith('inv-')
              ? 'bg-sky-50 text-sky-600 border border-sky-200/80'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Boxes className="w-5 h-5" />
        </button>

        {/* 3. Accounts (Coins / Stack) */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'accounts' ? null : 'accounts')}
          title="Accounts & Ledger"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
            activeDrawer === 'accounts' || currentView.startsWith('acc-')
              ? 'bg-sky-50 text-sky-600 border border-sky-200/80'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Coins className="w-5 h-5" />
        </button>

        {/* 4. HMS (Building Icon) */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'hms' ? null : 'hms')}
          title="HMS - Hotel Management System"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
            activeDrawer === 'hms' || currentView.startsWith('hms-')
              ? 'bg-sky-50 text-sky-600 border border-sky-200/80'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-5 h-5" />
        </button>

        {/* 5. Payroll (Users / Team) */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'payroll' ? null : 'payroll')}
          title="Payroll & Staff"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
            activeDrawer === 'payroll' || currentView.startsWith('pay-')
              ? 'bg-sky-50 text-sky-600 border border-sky-200/80'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Users className="w-5 h-5" />
        </button>
      </aside>

      {/* Slide-out / Popup Drawer Card matching Screenshots 3, 4, 5 */}
      {activeDrawer && (
        <>
          {/* Backdrop on mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            onClick={() => setActiveDrawer(null)}
          />

          <div className="absolute left-14 sm:left-16 top-2 z-50 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
            {/* Sky Blue Header from Screenshots */}
            <div className="bg-[#7dd3fc] text-slate-900 py-3 px-4 flex items-center justify-between font-bold text-sm tracking-wide">
              <span>{menuSections[activeDrawer].title}</span>
              <button
                onClick={() => setActiveDrawer(null)}
                className="p-1 rounded-lg hover:bg-black/10 text-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu List */}
            <div className="p-2 space-y-0.5 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
              {/* Direct Items if any */}
              {'directItems' in menuSections[activeDrawer] &&
                (menuSections[activeDrawer] as any).directItems.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-100 transition text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
                      <span className="font-medium text-slate-800">{item.label}</span>
                    </div>
                    <Check className="w-4 h-4 text-emerald-600" />
                  </button>
                ))}

              {/* Collapsible Report Category */}
              <div className="pt-1">
                <button
                  onClick={() => toggleReport(`${activeDrawer}Report`)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 font-semibold text-slate-800 cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    {expandedReports[`${activeDrawer}Report`] ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    <span className="lowercase">report</span>
                  </div>
                </button>

                {/* Sub items inside report */}
                {expandedReports[`${activeDrawer}Report`] && (
                  <div className="pl-2 pr-1 pt-1 space-y-0.5">
                    {activeDrawer === 'accounts' &&
                      menuSections.accounts.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item.id)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 transition text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
                            <span className="font-medium text-slate-700">{item.label}</span>
                          </div>
                          <Check className="w-4 h-4 text-emerald-600" />
                        </button>
                      ))}

                    {activeDrawer !== 'accounts' &&
                      (menuSections[activeDrawer] as any).reportItems.map((item: any) => (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item.id)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 transition text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
                            <span className="font-medium text-slate-700">{item.label}</span>
                          </div>
                          <Check className="w-4 h-4 text-emerald-600" />
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

