'use client';

import React from 'react';
import { Briefcase, Plus, CheckCircle2 } from 'lucide-react';
import { AccountLedgerEntry } from '../types/hotel';

interface AccountsModuleViewProps {
  entries: AccountLedgerEntry[];
}

export default function AccountsModuleView({ entries }: AccountsModuleViewProps) {
  const totalDebit = entries.reduce((s, e) => s + e.debit, 0);
  const totalCredit = entries.reduce((s, e) => s + e.credit, 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-10">
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800">
              General Ledger &amp; Accounts
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
              Journal &amp; Cash Book
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pakistan Club Inn Hotel &bull; Daily Receivables, Journal Vouchers &amp; Bank Reconciliation
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm">
          <Plus className="w-4 h-4" />
          <span>New Journal Voucher (JV)</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Cash &amp; Bank Debits</span>
          <div className="text-xl font-bold font-mono text-slate-800 mt-1">
            Rs. {totalDebit.toLocaleString('en-PK')}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Revenue Credits</span>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
            Rs. {totalCredit.toLocaleString('en-PK')}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Bank Reconciliation Status</span>
          <div className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Meezan &amp; HBL Matched</span>
          </div>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-800">Recent Journal Vouchers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="p-3">Voucher #</th>
                <th className="p-3">Date</th>
                <th className="p-3">Account Title</th>
                <th className="p-3">Description</th>
                <th className="p-3 font-mono text-right">Debit (PKR)</th>
                <th className="p-3 font-mono text-right">Credit (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 font-mono font-bold text-emerald-700">{entry.voucherNumber}</td>
                  <td className="p-3 text-slate-600">{entry.date}</td>
                  <td className="p-3 font-bold text-slate-800">{entry.accountTitle}</td>
                  <td className="p-3 text-slate-500">{entry.description}</td>
                  <td className="p-3 font-mono text-right font-bold text-slate-900">
                    {entry.debit > 0 ? `Rs. ${entry.debit.toLocaleString('en-PK')}` : '-'}
                  </td>
                  <td className="p-3 font-mono text-right font-bold text-emerald-600">
                    {entry.credit > 0 ? `Rs. ${entry.credit.toLocaleString('en-PK')}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

