'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  FileSpreadsheet,
  Printer,
  RefreshCw,
  CheckCircle2,
  X,
  Trash2,
  HelpCircle,
  Wallet,
  Coins,
  Sparkles,
  Download,
} from 'lucide-react';
import { RestaurantVoucher, VoucherType, RestaurantOrder } from '../types/hotel';

interface RestaurantVouchersViewProps {
  vouchers: RestaurantVoucher[];
  onAddVoucher: (voucher: Omit<RestaurantVoucher, 'id' | 'voucherNumber'> & { customVoucherNumber?: string }) => void;
  onDeleteVoucher: (id: string) => void;
  onImportVouchers: (incoming: Array<Partial<RestaurantVoucher> & { voucherType: VoucherType; amount: number; narration: string }>) => void;
  onAutoSyncOrders: () => void;
  onResetDb: () => void;
  orders: RestaurantOrder[];
}

// Pre-set Pakistan restaurant account heads for quick selection
const PRESET_ACCOUNT_HEADS: Record<VoucherType, string[]> = {
  CRV: [
    'Dine-In Table Cash Collection',
    'Counter Takeaway Cash Sales',
    'Advance Catering & Party Booking',
    'Beverages & Chai Counter Cash',
    'Cash Drawer Float Deposit from Front Desk',
    'Customer Credit Clearance (Debtor Settlement)',
    'Other Cash Inflow',
  ],
  CPV: [
    'Kitchen Fresh Poultry & Meat',
    'Fresh Mandi Vegetables & Grocery',
    'LPG Gas Cylinder Refill',
    'BBQ Charcoal & Commercial Ice Block',
    'Kitchen Spices, Rice & Cooking Oil',
    'Kitchen Dishwashing & Cleaning Petty Cash',
    'Takeaway Packaging Containers & Foil',
    'Kitchen Helper Daily Wages / Tips',
    'Emergency Delivery Fuel / Transport',
    'Other Petty Cash Expense',
  ],
  JV: [
    'Room Folio Food Transfer (Receivable)',
    'Kitchen Raw Stock Spoilage / Wastage',
    'VIP Courtesy & Manager Complimentary Discount',
    'Credit Vendor Purchase (Accounts Payable)',
    'Internal Staff Meal Duty Adjustment',
    'Inter-Department Stock Transfer',
    'Other Journal Adjustment',
  ],
};

const SAMPLE_CSV_DATA = `Type,Date,AccountHead,PartyName,Amount,PaymentMode,Narration
CRV,2026-10-06,Dine-In Table Cash Collection,Table #8 Dinner Guests,6400,Cash,Cash payment for Mutton Karahi and Tandoor Naan
CPV,2026-10-06,Kitchen Fresh Poultry & Meat,Madina Poultry Sukkur,4800,Cash,Purchased 6kg fresh broilers for BBQ seekh kabab
CPV,2026-10-06,Fresh Mandi Vegetables & Grocery,Subzi Mandi Stall 4,1950,Cash,Fresh onions mint green chillies and coriander
JV,2026-10-06,Room Folio Food Transfer (Receivable),Room 204 Chaudhry Waqas,3750,Room Folio Credit,Dinner room service billed to guest room folio
JV,2026-10-06,Kitchen Raw Stock Spoilage / Wastage,Kitchen Store,850,Adjustment,Spoiled tomatoes and curdled milk written off`;

export default function RestaurantVouchersView({
  vouchers,
  onAddVoucher,
  onDeleteVoucher,
  onImportVouchers,
  onAutoSyncOrders,
  onResetDb,
  orders,
}: RestaurantVouchersViewProps) {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'ALL' | VoucherType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [inspectedVoucher, setInspectedVoucher] = useState<RestaurantVoucher | null>(null);

  // New Voucher Form State
  const [vType, setVType] = useState<VoucherType>('CRV');
  const [vDate, setVDate] = useState(new Date().toISOString().slice(0, 10));
  const [vAccountHead, setVAccountHead] = useState(PRESET_ACCOUNT_HEADS.CRV[0]);
  const [vCustomHead, setVCustomHead] = useState('');
  const [vPartyName, setVPartyName] = useState('');
  const [vAmount, setVAmount] = useState<number | ''>('');
  const [vPaymentMode, setVPaymentMode] = useState<RestaurantVoucher['paymentMode']>('Cash');
  const [vRefNo, setVRefNo] = useState('');
  const [vNarration, setVNarration] = useState('');
  const [vCustomNumber, setVCustomNumber] = useState('');

  // Import Modal State
  const [csvRawText, setCsvRawText] = useState(SAMPLE_CSV_DATA);
  const [importStatusMessage, setImportStatusMessage] = useState<string | null>(null);

  // Financial calculations
  const totalCrv = vouchers
    .filter((v) => v.voucherType === 'CRV' && v.status === 'Posted')
    .reduce((s, v) => s + v.amount, 0);

  const totalCpv = vouchers
    .filter((v) => v.voucherType === 'CPV' && v.status === 'Posted')
    .reduce((s, v) => s + v.amount, 0);

  const totalJv = vouchers
    .filter((v) => v.voucherType === 'JV' && v.status === 'Posted')
    .reduce((s, v) => s + v.amount, 0);

  const netCashInDrawer = totalCrv - totalCpv;

  // Filter vouchers
  const filteredVouchers = vouchers.filter((v) => {
    const matchType = selectedTypeFilter === 'ALL' || v.voucherType === selectedTypeFilter;
    const matchSearch =
      v.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.accountHead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.narration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.referenceNo && v.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchSearch;
  });

  const handleOpenAddModal = (type: VoucherType = 'CRV') => {
    setVType(type);
    setVAccountHead(PRESET_ACCOUNT_HEADS[type][0]);
    setVCustomHead('');
    setVPartyName('');
    setVAmount('');
    setVPaymentMode(type === 'JV' ? 'Room Folio Credit' : 'Cash');
    setVRefNo('');
    setVNarration('');
    setVCustomNumber('');
    setShowAddModal(true);
  };

  const handleTypeChange = (type: VoucherType) => {
    setVType(type);
    setVAccountHead(PRESET_ACCOUNT_HEADS[type][0]);
    setVPaymentMode(type === 'JV' ? 'Room Folio Credit' : 'Cash');
  };

  const handleSubmitVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vAmount || Number(vAmount) <= 0 || !vPartyName) return;

    const finalAccountHead = vAccountHead === '__CUSTOM__' ? vCustomHead || 'Custom Head' : vAccountHead;

    onAddVoucher({
      voucherType: vType,
      date: vDate,
      accountHead: finalAccountHead,
      partyName: vPartyName,
      amount: Number(vAmount),
      paymentMode: vPaymentMode,
      referenceNo: vRefNo,
      narration: vNarration || `${vType} entry for ${vPartyName}`,
      createdBy: 'Cashier Counter',
      status: 'Posted',
      customVoucherNumber: vCustomNumber ? vCustomNumber.trim() : undefined,
    });

    setShowAddModal(false);
  };

  // CSV Bulk Import parser
  const handleProcessImport = () => {
    try {
      const lines = csvRawText.trim().split('\n').filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        setImportStatusMessage('Error: CSV must contain at least one data row below header.');
        return;
      }

      const rows: Array<Partial<RestaurantVoucher> & { voucherType: VoucherType; amount: number; narration: string }> = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim());
        if (parts.length >= 5) {
          const rawType = parts[0]?.toUpperCase();
          const validTypes: VoucherType[] = ['CRV', 'CPV', 'JV'];
          const vTypeVal: VoucherType = validTypes.includes(rawType as VoucherType) ? (rawType as VoucherType) : 'CRV';
          const dateVal = parts[1] || new Date().toISOString().slice(0, 10);
          const accountHeadVal = parts[2] || `${vTypeVal} General Head`;
          const partyNameVal = parts[3] || 'Counter Guest / Vendor';
          const amountVal = parseFloat(parts[4]) || 0;
          const paymentModeVal = (parts[5] as RestaurantVoucher['paymentMode']) || (vTypeVal === 'JV' ? 'Adjustment' : 'Cash');
          const narrationVal = parts.slice(6).join(',') || `Bulk imported ${vTypeVal} record`;

          if (amountVal > 0) {
            rows.push({
              voucherType: vTypeVal,
              date: dateVal,
              accountHead: accountHeadVal,
              partyName: partyNameVal,
              amount: amountVal,
              paymentMode: paymentModeVal,
              narration: narrationVal,
              referenceNo: `CSV-IMP-${i}`,
            });
          }
        }
      }

      if (rows.length === 0) {
        setImportStatusMessage('No valid voucher records found in CSV. Please follow the format.');
        return;
      }

      onImportVouchers(rows);
      setImportStatusMessage(`Success! ${rows.length} vouchers imported and stored into DB.`);
      setTimeout(() => {
        setShowImportModal(false);
        setImportStatusMessage(null);
      }, 1200);
    } catch {
      setImportStatusMessage('Error parsing CSV. Please check formatting.');
    }
  };

  // Export current vouchers as CSV
  const handleExportCsv = () => {
    const headers = ['VoucherNumber', 'VoucherType', 'Date', 'AccountHead', 'PartyName', 'AmountPKR', 'PaymentMode', 'ReferenceNo', 'Narration', 'Status'];
    const rows = vouchers.map((v) => [
      `"${v.voucherNumber}"`,
      `"${v.voucherType}"`,
      `"${v.date}"`,
      `"${v.accountHead.replace(/"/g, '""')}"`,
      `"${v.partyName.replace(/"/g, '""')}"`,
      v.amount,
      `"${v.paymentMode}"`,
      `"${(v.referenceNo || '').replace(/"/g, '""')}"`,
      `"${v.narration.replace(/"/g, '""')}"`,
      `"${v.status}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `restaurant_vouchers_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 1. Header Banner & Education Pill */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#18181B] tracking-tight">
                  Restaurant Accounts &amp; Vouchers
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold uppercase tracking-wide">
                  CRV &bull; CPV &bull; JV Register
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Pakistan Club Inn &bull; Lazzati Restaurant Daily Cash Inflow, Kitchen Outflow &amp; Room Folio Adjustments
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Info Guide Button */}
          <button
            onClick={() => setShowInfoModal(true)}
            className="px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="CRV, CPV, JV Guide"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">What are CRV/CPV/JV?</span>
          </button>

          {/* Sync POS Orders Button */}
          <button
            onClick={onAutoSyncOrders}
            className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            title="Scan active POS orders and create CRV (Cash) / JV (Room Folio)"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Auto-Sync POS Orders</span>
          </button>

          {/* Import Vouchers Button */}
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#18181B] hover:bg-zinc-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Import Vouchers (CSV)</span>
          </button>

          {/* Create Voucher CTA */}
          <button
            onClick={() => handleOpenAddModal('CRV')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-emerald-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Voucher</span>
          </button>
        </div>
      </div>

      {/* 2. Key Accounting Metrics: CRV, CPV, JV & Net Cash Drawer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CRV Card */}
        <div
          onClick={() => setSelectedTypeFilter('CRV')}
          className={`p-5 rounded-3xl border transition cursor-pointer bg-white shadow-sm flex flex-col justify-between ${
            selectedTypeFilter === 'CRV' ? 'ring-2 ring-emerald-500 border-emerald-400' : 'border-zinc-200/90 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider text-emerald-700 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              CRV (Cash Receipts)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-mono text-[#18181B]">
              Rs. {totalCrv.toLocaleString('en-PK')}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 flex items-center justify-between">
              <span>Dining cash &amp; advances</span>
              <span className="font-bold text-emerald-700">
                {vouchers.filter((v) => v.voucherType === 'CRV').length} Vouchers
              </span>
            </div>
          </div>
        </div>

        {/* CPV Card */}
        <div
          onClick={() => setSelectedTypeFilter('CPV')}
          className={`p-5 rounded-3xl border transition cursor-pointer bg-white shadow-sm flex flex-col justify-between ${
            selectedTypeFilter === 'CPV' ? 'ring-2 ring-rose-500 border-rose-400' : 'border-zinc-200/90 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider text-rose-700 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              CPV (Cash Payments)
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-mono text-rose-600">
              Rs. {totalCpv.toLocaleString('en-PK')}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 flex items-center justify-between">
              <span>Chicken, Mandi &amp; Petty Cash</span>
              <span className="font-bold text-rose-700">
                {vouchers.filter((v) => v.voucherType === 'CPV').length} Vouchers
              </span>
            </div>
          </div>
        </div>

        {/* JV Card */}
        <div
          onClick={() => setSelectedTypeFilter('JV')}
          className={`p-5 rounded-3xl border transition cursor-pointer bg-white shadow-sm flex flex-col justify-between ${
            selectedTypeFilter === 'JV' ? 'ring-2 ring-indigo-500 border-indigo-400' : 'border-zinc-200/90 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider text-indigo-700 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              JV (Journal Adjustments)
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black font-mono text-indigo-700">
              Rs. {totalJv.toLocaleString('en-PK')}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 flex items-center justify-between">
              <span>Room Folio, Spoilage &amp; Discs</span>
              <span className="font-bold text-indigo-700">
                {vouchers.filter((v) => v.voucherType === 'JV').length} Vouchers
              </span>
            </div>
          </div>
        </div>

        {/* Net Cash in Drawer Card */}
        <div className="p-5 rounded-3xl border border-zinc-200/90 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider text-zinc-700 uppercase flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-zinc-500" />
              Net Drawer Cash (CRV - CPV)
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              BALANCED
            </span>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-black font-mono ${netCashInDrawer >= 0 ? 'text-[#18181B]' : 'text-rose-600'}`}>
              Rs. {netCashInDrawer.toLocaleString('en-PK')}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 flex items-center justify-between">
              <span>Physical Cash in Register</span>
              <span className="font-mono font-bold text-zinc-700">Audit Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Vouchers Ledger Table & Filters */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm p-5 sm:p-6 space-y-4">
        {/* Sub-Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none">
            <button
              onClick={() => setSelectedTypeFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl font-black transition cursor-pointer ${
                selectedTypeFilter === 'ALL'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              All Types ({vouchers.length})
            </button>
            <button
              onClick={() => setSelectedTypeFilter('CRV')}
              className={`px-3.5 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 ${
                selectedTypeFilter === 'CRV'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span>CRV Receipts</span>
              <span className="text-[10px] opacity-80">({vouchers.filter((v) => v.voucherType === 'CRV').length})</span>
            </button>
            <button
              onClick={() => setSelectedTypeFilter('CPV')}
              className={`px-3.5 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 ${
                selectedTypeFilter === 'CPV'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <span>CPV Payments</span>
              <span className="text-[10px] opacity-80">({vouchers.filter((v) => v.voucherType === 'CPV').length})</span>
            </button>
            <button
              onClick={() => setSelectedTypeFilter('JV')}
              className={`px-3.5 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 ${
                selectedTypeFilter === 'JV'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              <span>JV Adjustments</span>
              <span className="text-[10px] opacity-80">({vouchers.filter((v) => v.voucherType === 'JV').length})</span>
            </button>
          </div>

          {/* Search & Export Toolbar */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search voucher #, party or head..."
                className="w-full px-3.5 py-2 pl-9 rounded-xl text-xs border border-zinc-300 bg-white outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>

            <button
              onClick={handleExportCsv}
              className="p-2 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 transition cursor-pointer"
              title="Export Vouchers to CSV"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onResetDb}
              className="p-2 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 transition cursor-pointer"
              title="Reset Demo DB to Initial Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Voucher #</th>
                <th className="p-3">Type</th>
                <th className="p-3">Date</th>
                <th className="p-3">Account Head &amp; Narration</th>
                <th className="p-3">Party / Received From / Paid To</th>
                <th className="p-3">Payment Mode</th>
                <th className="p-3 font-mono text-right">Amount (PKR)</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-400">
                    No vouchers found matching your query. Click "+ New Voucher" or "Import Vouchers" to add.
                  </td>
                </tr>
              ) : (
                filteredVouchers.map((voucher) => {
                  const isCrv = voucher.voucherType === 'CRV';
                  const isCpv = voucher.voucherType === 'CPV';
                  const isJv = voucher.voucherType === 'JV';

                  return (
                    <tr key={voucher.id} className="hover:bg-zinc-50/80 transition">
                      {/* Voucher # */}
                      <td className="p-3 font-mono font-black text-[#18181B] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{voucher.voucherNumber}</span>
                          {voucher.isAutoGenerated && (
                            <span
                              className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-extrabold"
                              title="Auto-generated from POS Order"
                            >
                              AUTO
                            </span>
                          )}
                        </div>
                        {voucher.referenceNo && (
                          <span className="text-[10px] text-zinc-400 block font-mono">
                            Ref: {voucher.referenceNo}
                          </span>
                        )}
                      </td>

                      {/* Type Badge */}
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            isCrv
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isCpv
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                          }`}
                        >
                          {voucher.voucherType}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-3 font-medium text-zinc-600 whitespace-nowrap">{voucher.date}</td>

                      {/* Account Head & Narration */}
                      <td className="p-3 max-w-xs">
                        <div className="font-extrabold text-[#18181B] truncate">{voucher.accountHead}</div>
                        <div className="text-[11px] text-zinc-500 line-clamp-1">{voucher.narration}</div>
                      </td>

                      {/* Party */}
                      <td className="p-3 font-bold text-zinc-800 whitespace-nowrap">{voucher.partyName}</td>

                      {/* Mode */}
                      <td className="p-3 whitespace-nowrap">
                        <span className="text-[11px] font-semibold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-lg">
                          {voucher.paymentMode}
                        </span>
                      </td>

                      {/* Amount */}
                      <td
                        className={`p-3 font-mono text-right font-black whitespace-nowrap ${
                          isCrv ? 'text-emerald-700' : isCpv ? 'text-rose-600' : 'text-indigo-700'
                        }`}
                      >
                        Rs. {voucher.amount.toLocaleString('en-PK')}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setInspectedVoucher(voucher)}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-700 text-zinc-600 transition cursor-pointer"
                            title="Print Voucher Slip"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteVoucher(voucher.id)}
                            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-rose-50 hover:text-rose-600 text-zinc-400 transition cursor-pointer"
                            title="Delete Voucher"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL: Create New Voucher (CRV / CPV / JV) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-zinc-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                    vType === 'CRV'
                      ? 'bg-emerald-100 text-emerald-800'
                      : vType === 'CPV'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {vType}
                </div>
                <h3 className="text-base font-black text-[#18181B]">
                  New {vType === 'CRV' ? 'Cash Receipt Voucher (CRV)' : vType === 'CPV' ? 'Cash Payment Voucher (CPV)' : 'Journal Voucher (JV)'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitVoucher} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="block font-bold text-zinc-500 uppercase text-[10px] mb-1.5">
                  Select Voucher Class
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('CRV')}
                    className={`py-2 px-3 rounded-xl font-black text-center transition cursor-pointer ${
                      vType === 'CRV'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    CRV (Cash In)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('CPV')}
                    className={`py-2 px-3 rounded-xl font-black text-center transition cursor-pointer ${
                      vType === 'CPV'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    CPV (Cash Out)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('JV')}
                    className={`py-2 px-3 rounded-xl font-black text-center transition cursor-pointer ${
                      vType === 'JV'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    JV (Adjustment)
                  </button>
                </div>
              </div>

              {/* Date & Custom Voucher # */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-500 mb-1">Date</label>
                  <input
                    type="date"
                    value={vDate}
                    onChange={(e) => setVDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-500 mb-1">
                    Voucher # (Auto or Custom)
                  </label>
                  <input
                    type="text"
                    value={vCustomNumber}
                    onChange={(e) => setVCustomNumber(e.target.value)}
                    placeholder={`e.g. ${vType}-2026-AUTO`}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 font-mono text-zinc-700"
                  />
                </div>
              </div>

              {/* Account Head Dropdown & Custom Option */}
              <div>
                <label className="block font-bold text-zinc-500 mb-1">
                  Accounting Head / Category
                </label>
                <select
                  value={vAccountHead}
                  onChange={(e) => setVAccountHead(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 bg-white font-bold text-[#18181B]"
                >
                  {PRESET_ACCOUNT_HEADS[vType].map((head) => (
                    <option key={head} value={head}>
                      {head}
                    </option>
                  ))}
                  <option value="__CUSTOM__">+ Type Custom Account Head...</option>
                </select>

                {vAccountHead === '__CUSTOM__' && (
                  <input
                    type="text"
                    value={vCustomHead}
                    onChange={(e) => setVCustomHead(e.target.value)}
                    placeholder="Enter custom account title..."
                    className="w-full mt-2 px-3 py-2 rounded-xl border border-emerald-400 bg-emerald-50/20"
                    required
                  />
                )}
              </div>

              {/* Party Name / Received From / Paid To */}
              <div>
                <label className="block font-bold text-zinc-500 mb-1">
                  {vType === 'CRV'
                    ? 'Received From (Customer / Guest Name)'
                    : vType === 'CPV'
                    ? 'Paid To (Vendor / Market Supplier / Person)'
                    : 'Account / Room Reference (e.g. Room 105 Guest / Wastage)'}
                </label>
                <input
                  type="text"
                  value={vPartyName}
                  onChange={(e) => setVPartyName(e.target.value)}
                  placeholder={
                    vType === 'CRV'
                      ? 'e.g. Table #4 Cash Guest or Mr. Farooq'
                      : vType === 'CPV'
                      ? 'e.g. Al-Madina Halal Poultry Market'
                      : 'e.g. Room 202 Folio Transfer or Kitchen Spoilage'
                  }
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 font-bold"
                  required
                />
              </div>

              {/* Amount & Payment Mode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-500 mb-1">Amount (PKR)</label>
                  <input
                    type="number"
                    value={vAmount}
                    onChange={(e) => setVAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 5000"
                    min="1"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 font-mono font-bold text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-500 mb-1">Payment Mode</label>
                  <select
                    value={vPaymentMode}
                    onChange={(e) => setVPaymentMode(e.target.value as RestaurantVoucher['paymentMode'])}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 bg-white font-bold"
                  >
                    <option value="Cash">Cash (Drawer / Till)</option>
                    <option value="Room Folio Credit">Room Folio Credit</option>
                    <option value="Bank Meezan">Bank Meezan (POS Card)</option>
                    <option value="Bank HBL">Bank HBL (Online)</option>
                    <option value="Adjustment">Book Adjustment / Non-Cash</option>
                  </select>
                </div>
              </div>

              {/* Reference # */}
              <div>
                <label className="block font-bold text-zinc-500 mb-1">
                  Reference # (Order #, Bill #, Vendor Inv #)
                </label>
                <input
                  type="text"
                  value={vRefNo}
                  onChange={(e) => setVRefNo(e.target.value)}
                  placeholder="e.g. LAZ-910, MANDI-REC-44, FOLIO-202"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 font-mono"
                />
              </div>

              {/* Narration */}
              <div>
                <label className="block font-bold text-zinc-500 mb-1">Narration / Detailed Notes</label>
                <textarea
                  value={vNarration}
                  onChange={(e) => setVNarration(e.target.value)}
                  placeholder="Enter complete description of the transaction..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-600 font-bold hover:bg-zinc-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-white font-black cursor-pointer shadow-md ${
                    vType === 'CRV'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : vType === 'CPV'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Post &amp; Save {vType} Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: Import Vouchers (CSV / Excel format) */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-zinc-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-black text-[#18181B]">
                    Import Vouchers (CRV, CPV, JV)
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Paste CSV or Excel data to import general vouchers into the Restaurant Dummy DB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-emerald-900 space-y-1">
                <div className="font-extrabold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>CSV Column Structure:</span>
                </div>
                <p className="font-mono text-[10px] text-emerald-800">
                  Type, Date, AccountHead, PartyName, Amount, PaymentMode, Narration
                </p>
                <p className="text-[11px] text-emerald-700">
                  Supported Types: <strong>CRV</strong> (Cash In), <strong>CPV</strong> (Cash Out), <strong>JV</strong> (Adjustment / Room Folio Transfer).
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-zinc-600">CSV Data Text (Editable)</label>
                  <button
                    onClick={() => setCsvRawText(SAMPLE_CSV_DATA)}
                    className="text-[11px] text-emerald-600 font-bold hover:underline"
                  >
                    Reset to Sample Data
                  </button>
                </div>
                <textarea
                  value={csvRawText}
                  onChange={(e) => setCsvRawText(e.target.value)}
                  rows={8}
                  className="w-full p-3 rounded-2xl border border-zinc-300 font-mono text-[11px] bg-zinc-50 text-zinc-900 focus:bg-white outline-none focus:border-emerald-500"
                />
              </div>

              {importStatusMessage && (
                <div
                  className={`p-3 rounded-xl font-bold text-xs ${
                    importStatusMessage.startsWith('Success')
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {importStatusMessage}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                <span className="text-[11px] text-zinc-400">
                  {csvRawText.trim().split('\n').length - 1} records ready to import
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-300 text-zinc-600 font-bold hover:bg-zinc-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProcessImport}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm &amp; Import to DB</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: Printable Voucher Slip */}
      {inspectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-zinc-200 shadow-2xl relative text-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200">
              <span className="font-black text-sm text-[#18181B] font-mono">
                {inspectedVoucher.voucherNumber} &bull; {inspectedVoucher.voucherType}
              </span>
              <button
                onClick={() => setInspectedVoucher(null)}
                className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Letterhead */}
            <div className="text-center py-2 border-b border-zinc-100">
              <h2 className="text-base font-black uppercase text-[#18181B] tracking-wider">
                LAZZATI RESTAURANT &bull; PAKISTAN CLUB INN
              </h2>
              <p className="text-[11px] text-zinc-500">
                City Bypass Road, Sukkur &bull; Accounts &amp; Finance Wing
              </p>
              <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-zinc-100 text-zinc-800 border border-zinc-300">
                {inspectedVoucher.voucherType === 'CRV'
                  ? 'CASH RECEIPT VOUCHER (CRV)'
                  : inspectedVoucher.voucherType === 'CPV'
                  ? 'CASH PAYMENT VOUCHER (CPV)'
                  : 'JOURNAL VOUCHER (JV)'}
              </div>
            </div>

            {/* Body Info */}
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Posting Date</span>
                  <span className="font-extrabold text-[#18181B]">{inspectedVoucher.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Payment Mode</span>
                  <span className="font-extrabold text-zinc-800">{inspectedVoucher.paymentMode}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Account Head</span>
                  <span className="font-black text-emerald-800">{inspectedVoucher.accountHead}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">
                    {inspectedVoucher.voucherType === 'CRV' ? 'Received From' : inspectedVoucher.voucherType === 'CPV' ? 'Paid To' : 'Party / Ref'}
                  </span>
                  <span className="font-extrabold text-[#18181B]">{inspectedVoucher.partyName}</span>
                </div>
              </div>

              {inspectedVoucher.referenceNo && (
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Reference Bill / Order</span>
                  <span className="font-mono font-bold text-zinc-700">{inspectedVoucher.referenceNo}</span>
                </div>
              )}

              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase block">Narration / Particulars</span>
                <p className="p-2.5 rounded-xl bg-zinc-50 text-zinc-700 text-xs border border-zinc-200/80 leading-relaxed">
                  {inspectedVoucher.narration}
                </p>
              </div>

              {/* Total Amount Box */}
              <div className="p-3 rounded-2xl bg-zinc-100 flex items-center justify-between">
                <span className="font-black text-zinc-600 text-xs">VOUCHER TOTAL AMOUNT:</span>
                <span className="font-black font-mono text-base text-[#18181B]">
                  Rs. {inspectedVoucher.amount.toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-6 border-t border-zinc-200 grid grid-cols-3 gap-2 text-center text-[10px] text-zinc-400">
              <div className="border-t border-zinc-300 pt-1">
                <span>Prepared By</span>
                <div className="font-bold text-zinc-700">{inspectedVoucher.createdBy || 'Cashier Ahmed'}</div>
              </div>
              <div className="border-t border-zinc-300 pt-1">
                <span>Restaurant Incharge</span>
                <div className="font-bold text-zinc-700">Supervisor</div>
              </div>
              <div className="border-t border-zinc-300 pt-1">
                <span>Accounts Approval</span>
                <div className="font-bold text-zinc-700">Audit / Manager</div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setInspectedVoucher(null)}
                className="px-4 py-2 rounded-xl border border-zinc-300 font-bold text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#18181B] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Voucher Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: Educational Explanation (What are CRV, CPV, JV?) */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-zinc-200 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-[#18181B]">
                  CRV, CPV, JV Explained for Restaurant Management
                </h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-zinc-700">
              {/* CRV */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center gap-2 font-black text-emerald-900 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 text-[10px]">CRV</span>
                  <span>Cash Receipt Voucher (کیش وصولی واؤچر)</span>
                </div>
                <p className="mt-1 text-zinc-600 text-[11px] leading-relaxed">
                  Jab bhi restaurant cash drawer mein raqam / cash <strong>aaye</strong> (incoming money):
                  Jaise table dine-in cash bill settled, takeaway cash parcel, customer advance party booking, ya counter pe cold drink / chai sales.
                </p>
              </div>

              {/* CPV */}
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80">
                <div className="flex items-center gap-2 font-black text-rose-900 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-rose-200 text-rose-900 text-[10px]">CPV</span>
                  <span>Cash Payment Voucher (کیش ادائیگی واؤچر)</span>
                </div>
                <p className="mt-1 text-zinc-600 text-[11px] leading-relaxed">
                  Jab bhi restaurant cash drawer se kharcha / cash <strong>ada ho</strong> (outgoing money):
                  Jaise daily mandi se taaza sabziyan, poultry market se chicken/gosht, LPG gas cylinder refill, BBQ koyla, ice blocks, aur safai petty cash.
                </p>
              </div>

              {/* JV */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
                <div className="flex items-center gap-2 font-black text-indigo-900 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-200 text-indigo-900 text-[10px]">JV</span>
                  <span>Journal Voucher (جرنل واؤچر - نان کیش ایڈجسٹمنٹ)</span>
                </div>
                <p className="mt-1 text-zinc-600 text-[11px] leading-relaxed">
                  Non-cash transactions aur internal book adjustments:
                  Sab se ahem: <strong>Room Service Folio Billing</strong> (jab in-house hotel guest room 105 mein khana khaye aur bill room account mein transfer ho!), kharab hone wala saaman (kitchen spoilage / wastage write-off), aur VIP discount adjustments.
                </p>
              </div>

              {/* Import note */}
              <div className="p-3 rounded-2xl bg-zinc-100 text-zinc-800 text-[11px]">
                <span className="font-extrabold text-[#18181B] block mb-0.5">💡 Import &amp; Dummy DB Integration:</span>
                Aap excel / CSV se bulk vouchers import kar sakte hain, ya direct POS orders se 1-click Auto-Sync chala kar automatic CRV aur JV register bana sakte hain! Sab data browser dummy DB mein save rehta hai.
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 rounded-xl bg-[#18181B] text-white font-bold cursor-pointer"
              >
                Samajh Aa Gaya (Got It)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

