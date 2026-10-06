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
  FileText,
  CalendarCheck2,
  BedDouble,
  Layers,
  FileSpreadsheet,
  PartyPopper,
  UtensilsCrossed,
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
      title: 'Accounts & Ledger',
      subtitle: 'Journal vouchers, cashbook & bank recon',
      items: [
        { id: 'acc-dashboard', label: 'Accounts Overview' },
        { id: 'acc-parent-types', label: 'Parent Account Types' },
        { id: 'acc-child-types', label: 'Child Accounts Types' },
        { id: 'acc-register', label: 'Account Register' },
        { id: 'acc-journal', label: 'Journal Voucher (JV)' },
        { id: 'acc-bank-recon', label: 'Bank Reconciliation' },
      ],
    },
    hms: {
      title: 'HMS Hotel Operations',
      subtitle: 'Front desk, check-ins, folios & rooms',
      directItems: [
        { id: 'hms-main', label: 'HMS Operations Hub' },
        { id: 'hms-room-category', label: 'Room Categories' },
      ],
      reportItems: [
        { id: 'hms-rooms', label: 'Rooms & Status Plan' },
        { id: 'hms-services', label: 'Guest Amenities & Services' },
        { id: 'hms-booking', label: 'Bookings & Registration' },
        { id: 'hms-invoice', label: 'Hotel Invoices & Folios' },
        { id: 'hms-btc', label: 'BTC Corporate Contracts' },
        { id: 'hms-pos-hotel', label: 'POS Room Service Billing' },
        { id: 'hms-events', label: 'Hall & Lawn Event Booking' },
      ],
    },
    payroll: {
      title: 'Staff Payroll & HR',
      subtitle: 'Departments, salaries & shift roster',
      directItems: [
        { id: 'pay-departments', label: 'Departments Roster' },
      ],
      reportItems: [
        { id: 'pay-shifts', label: 'Shift Timings (M/E/N)' },
        { id: 'pay-salaries', label: 'Generate Monthly Salaries' },
        { id: 'pay-employees', label: 'Active Employees' },
        { id: 'pay-attendance', label: 'Staff Daily Attendance' },
      ],
    },
    inventory: {
      title: 'Stock & Inventory',
      subtitle: 'Kitchen supplies & hotel consumables',
      directItems: [
        { id: 'inv-items', label: 'Stock Items' },
        { id: 'inv-suppliers', label: 'Approved Vendors' },
      ],
      reportItems: [
        { id: 'inv-restaurant', label: 'Kitchen & Chef Inventory' },
        { id: 'inv-reorder', label: 'Reorder Low-Stock Alerts' },
      ],
    },
  };

  const handleItemClick = (target: string) => {
    onSelectView(target);
    setActiveDrawer(null);
  };

  return (
    <div className="relative flex select-none z-30">
      {/* Narrow vertical bar with #FAFAFA background and micro-border */}
      <aside className="w-14 sm:w-16 bg-white border-r border-zinc-200/90 flex flex-col items-center py-3 gap-2.5 shrink-0 min-h-[calc(100vh-56px)] shadow-xs">
        {/* 1. Main Dashboard Hub (Monitor Icon) */}
        <button
          onClick={() => {
            onSelectView('hub');
            setActiveDrawer(null);
          }}
          title="Dashboard Overview"
          className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
            currentView === 'hub'
              ? 'bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/30 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          {currentView === 'hub' && (
            <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-[#E63946] rounded-r-md shadow-xs shadow-[#E63946]/40" />
          )}
          <Monitor className="w-5 h-5" />
        </button>

        {/* 2. Restaurant POS & Vouchers (UtensilsCrossed Icon) */}
        <button
          onClick={() => {
            onSelectView('restaurant');
            setActiveDrawer(null);
          }}
          title="Lazzati Restaurant POS & Vouchers"
          className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
            currentView === 'restaurant'
              ? 'bg-amber-50 text-amber-600 border border-amber-300 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          {currentView === 'restaurant' && (
            <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-amber-600 rounded-r-md" />
          )}
          <UtensilsCrossed className="w-5 h-5" />
        </button>

        {/* 3. Inventory (Hierarchy / Box tree) */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'inventory' ? null : 'inventory')}
          title="Inventory"
          className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
            activeDrawer === 'inventory' || currentView.startsWith('inv-')
              ? 'bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/30 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          {(activeDrawer === 'inventory' || currentView.startsWith('inv-')) && (
            <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-[#E63946] rounded-r-md" />
          )}
          <Boxes className="w-5 h-5" />
        </button>

        {/* 3. Accounts (Coins / Stack) */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'accounts' ? null : 'accounts')}
          title="Accounts & Ledger"
          className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
            activeDrawer === 'accounts' || currentView.startsWith('acc-')
              ? 'bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/30 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          {(activeDrawer === 'accounts' || currentView.startsWith('acc-')) && (
            <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-[#E63946] rounded-r-md" />
          )}
          <Coins className="w-5 h-5" />
        </button>

        {/* 4. HMS (Building Icon) */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'hms' ? null : 'hms')}
          title="HMS - Hotel Management System"
          className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
            activeDrawer === 'hms' || currentView.startsWith('hms-')
              ? 'bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/30 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          {(activeDrawer === 'hms' || currentView.startsWith('hms-')) && (
            <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-[#E63946] rounded-r-md" />
          )}
          <Building2 className="w-5 h-5" />
        </button>

        {/* 5. Payroll (Users / Team) */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'payroll' ? null : 'payroll')}
          title="Payroll & Staff"
          className={`relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
            activeDrawer === 'payroll' || currentView.startsWith('pay-')
              ? 'bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/30 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
        >
          {(activeDrawer === 'payroll' || currentView.startsWith('pay-')) && (
            <span className="absolute -left-2 top-2.5 bottom-2.5 w-1 bg-[#E63946] rounded-r-md" />
          )}
          <Users className="w-5 h-5" />
        </button>
      </aside>

      {/* Slide-out / Popup Drawer Card with Luxury Red & Zinc Dark Accents */}
      {activeDrawer && (
        <>
          {/* Backdrop on mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden backdrop-blur-xs"
            onClick={() => setActiveDrawer(null)}
          />

          <div className="absolute left-14 sm:left-16 top-2 z-50 w-72 rounded-3xl bg-white border border-zinc-200 shadow-2xl overflow-hidden animate-fade-in-up">
            {/* Header: Dark Luxury #18181B */}
            <div className="bg-[#18181B] text-[#FAFAFA] py-3.5 px-4 flex items-center justify-between border-b border-white/10">
              <div>
                <span className="font-extrabold text-sm block tracking-tight">
                  {menuSections[activeDrawer].title}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">
                  {menuSections[activeDrawer].subtitle}
                </span>
              </div>
              <button
                onClick={() => setActiveDrawer(null)}
                className="p-1 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu List */}
            <div className="p-2.5 space-y-1 text-xs text-zinc-700 max-h-[75vh] overflow-y-auto">
              {/* Direct Items if any */}
              {'directItems' in menuSections[activeDrawer] &&
                (menuSections[activeDrawer] as any).directItems.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-left transition cursor-pointer font-medium ${
                      currentView === item.id
                        ? 'bg-[#FFF1F2] text-[#E63946] font-bold border border-[#E63946]/20'
                        : 'hover:bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </button>
                ))}

              {/* Items for Accounts */}
              {'items' in menuSections[activeDrawer] &&
                (menuSections[activeDrawer] as any).items.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-left transition cursor-pointer font-medium ${
                      currentView === item.id
                        ? 'bg-[#FFF1F2] text-[#E63946] font-bold border border-[#E63946]/20'
                        : 'hover:bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </button>
                ))}

              {/* Report Sub-menu Folder if present */}
              {'reportItems' in menuSections[activeDrawer] && (
                <div className="pt-1 mt-1 border-t border-zinc-100">
                  <button
                    onClick={() => toggleReport(`${activeDrawer}Report`)}
                    className="w-full py-2 px-3 rounded-xl flex items-center justify-between text-left font-bold text-zinc-900 bg-zinc-50 hover:bg-zinc-100 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E63946]" />
                      <span>Detailed Modules &amp; Reports</span>
                    </div>
                    {expandedReports[`${activeDrawer}Report`] ? (
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                  </button>

                  {expandedReports[`${activeDrawer}Report`] && (
                    <div className="pl-3 pr-1 py-1 space-y-0.5 border-l-2 border-[#E63946]/30 ml-3 mt-1">
                      {(menuSections[activeDrawer] as any).reportItems.map((item: any) => (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item.id)}
                          className={`w-full py-1.5 px-2.5 rounded-lg flex items-center justify-between text-left text-[11px] transition cursor-pointer ${
                            currentView === item.id
                              ? 'bg-[#FFF1F2] text-[#E63946] font-bold'
                              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className="text-[10px] text-zinc-400">&bull;</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick jump to full module */}
            <div className="p-2.5 bg-zinc-50 border-t border-zinc-100">
              <button
                onClick={() => handleItemClick(activeDrawer)}
                className="w-full py-2 rounded-xl text-center text-xs font-bold text-[#E63946] hover:bg-[#FFF1F2] transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Open Full {menuSections[activeDrawer].title}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
