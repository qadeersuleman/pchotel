'use client';

import React, { useState } from 'react';
import { Briefcase, Plus, CheckCircle2, Search, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';
import { AccountLedgerEntry } from '../types/hotel';

interface AccountsModuleViewProps {
  entries: AccountLedgerEntry[];
}

export default function AccountsModuleView({ entries: initialEntries }: AccountsModuleViewProps) {
  const [entries, setEntries] = useState<AccountLedgerEntry[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new JV
  const [voucherNumber, setVoucherNumber] = useState(`JV-2026-${String(entries.length + 1).padStart(3, '0')}`);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [accountTitle, setAccountTitle] = useState('');
  const [description, setDescription] = useState('');
  const [debit, setDebit] = useState<number>(0);
  const [credit, setCredit] = useState<number>(0);

  const totalDebit = entries.reduce((s, e) => s + e.debit, 0);
  const totalCredit = entries.reduce((s, e) => s + e.credit, 0);

  const filteredEntries = entries.filter((e) =>
    e.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.accountTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountTitle || !description) return;

    const newEntry: AccountLedgerEntry = {
      id: `jv-${Date.now()}`,
      voucherNumber,
      date,
      accountTitle,
      accountType: 'Cash in Hand',
      description,
      debit: Number(debit) || 0,
      credit: Number(credit) || 0,
    };

    setEntries([newEntry, ...entries]);
    setShowAddModal(false);
    setAccountTitle('');
    setDescription('');
    setDebit(0);
    setCredit(0);
    setVoucherNumber(`JV-2026-${String(entries.length + 2).padStart(3, '0')}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in-up">
      {/* Title Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-[#18181B] tracking-tight">
                  General Ledger &amp; Hotel Accounts
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold uppercase">
                  Cash Book &amp; JV
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Pakistan Club Inn Hotel &bull; Daily Receivables, Journal Vouchers &amp; Bank Reconciliation
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Voucher (JV)</span>
        </button>
      </div>

      {/* Summary KPI Cards with #E63946 + #FFF1F2 + #18181B + #FAFAFA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-zinc-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Debits</span>
            <div className="text-2xl font-black font-mono text-[#18181B] mt-1">
              Rs. {totalDebit.toLocaleString('en-PK')}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Credits</span>
            <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
              Rs. {totalCredit.toLocaleString('en-PK')}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-zinc-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Bank Reconciliation</span>
            <div className="text-sm font-black text-[#18181B] flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Meezan &amp; HBL Matched</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/20">
            AUDITED
          </span>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-black text-[#18181B]">Recent Journal Vouchers &amp; Postings</h2>
            <p className="text-xs text-zinc-400">All registered ledger entries for room rent, laundry, dining &amp; corporate deposits</p>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search voucher # or title..."
              className="w-full px-3.5 py-2 pl-9 rounded-xl text-xs border border-zinc-300 bg-white outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Voucher #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Account Title</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5 font-mono text-right">Debit (PKR)</th>
                <th className="p-3.5 font-mono text-right">Credit (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-zinc-50 transition">
                  <td className="p-3.5 font-mono font-black text-emerald-700">{entry.voucherNumber}</td>
                  <td className="p-3.5 text-zinc-600 font-medium">{entry.date}</td>
                  <td className="p-3.5 font-bold text-[#18181B]">{entry.accountTitle}</td>
                  <td className="p-3.5 text-zinc-500">{entry.description}</td>
                  <td className="p-3.5 font-mono text-right font-black text-[#18181B]">
                    {entry.debit > 0 ? `Rs. ${entry.debit.toLocaleString('en-PK')}` : '-'}
                  </td>
                  <td className="p-3.5 font-mono text-right font-black text-emerald-600">
                    {entry.credit > 0 ? `Rs. ${entry.credit.toLocaleString('en-PK')}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Journal Voucher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in-up">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-zinc-200 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-[#18181B]">Create Journal Voucher (JV)</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVoucher} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-500 mb-1">Voucher #</label>
                  <input
                    type="text"
                    value={voucherNumber}
                    onChange={(e) => setVoucherNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-500 mb-1">Posting Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-500 mb-1">Account Title</label>
                <input
                  type="text"
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  placeholder="e.g. Guest Receivable, Meezan Bank, Laundry Revenue"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-500 mb-1">Transaction Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Advance paid by Room 202 via Meezan Bank POS"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-500 mb-1">Debit Amount (PKR)</label>
                  <input
                    type="number"
                    value={debit || ''}
                    onChange={(e) => setDebit(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-500 mb-1">Credit Amount (PKR)</label>
                  <input
                    type="number"
                    value={credit || ''}
                    onChange={(e) => setCredit(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Post Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
