'use client';

import React, { useState } from 'react';
import { Search, Filter, CalendarCheck2, UserPlus, Receipt, Phone, MapPin, Download, CheckCircle2 } from 'lucide-react';
import { Booking } from '../types/hotel';

interface BookingsListProps {
  bookings: Booking[];
  onOpenCheckIn: () => void;
  onOpenCheckOut: (booking: Booking) => void;
  isDarkTheme: boolean;
}

export default function BookingsList({
  bookings,
  onOpenCheckIn,
  onOpenCheckOut,
  isDarkTheme,
}: BookingsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchSearch =
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.roomNumber.includes(searchQuery) ||
      b.cnic.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Checked-In':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Confirmed':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Checked-Out':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Search */}
      <div className={`p-5 rounded-2xl border ${
        isDarkTheme ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Reservations &amp; Booking Records</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive guest history and room booking log &bull; Pakistan Club Inn Hotel
            </p>
          </div>

          <button
            onClick={onOpenCheckIn}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black text-white btn-luxury-red transition shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New Reservation</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-200">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, CNIC, phone, room #..."
              className="w-full px-3.5 py-2 pl-9 rounded-xl text-xs border border-zinc-300 bg-white text-zinc-900 outline-none focus:border-[#E63946]"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-zinc-500 text-[11px] font-semibold mr-1">Status:</span>
            {['all', 'Checked-In', 'Confirmed', 'Checked-Out'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {st === 'all' ? 'All Records' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className={`rounded-2xl border overflow-hidden ${
        isDarkTheme ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-slate-400 ${
              isDarkTheme ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <tr>
                <th className="p-3.5 font-semibold">Booking ID</th>
                <th className="p-3.5 font-semibold">Guest Details</th>
                <th className="p-3.5 font-semibold">Room &amp; Category</th>
                <th className="p-3.5 font-semibold">Dates &amp; Duration</th>
                <th className="p-3.5 font-semibold">Total &amp; Advance</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/20 transition">
                  <td className="p-3.5 font-mono text-[11px] font-bold text-sky-400">
                    {b.bookingNumber}
                    <div className="text-[10px] text-slate-500 font-sans">{b.createdAt}</div>
                  </td>

                  <td className="p-3.5">
                    <div className="font-bold text-slate-200">{b.guestName}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-sky-400" />
                      <span>{b.phone}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">{b.cnic} ({b.city})</div>
                  </td>

                  <td className="p-3.5">
                    <span className="font-bold text-amber-400">Room {b.roomNumber}</span>
                    <div className="text-[11px] text-slate-400">{b.roomType}</div>
                  </td>

                  <td className="p-3.5">
                    <div>{b.checkInDate} to {b.checkOutDate}</div>
                    <div className="text-[11px] text-slate-500">{b.nights} night(s)</div>
                  </td>

                  <td className="p-3.5 font-mono">
                    <div className="text-slate-200 font-bold">Rs. {b.totalAmount.toLocaleString('en-PK')}</div>
                    <div className="text-emerald-400 text-[11px]">Adv: Rs. {b.advancePaid.toLocaleString('en-PK')}</div>
                    {b.remainingBalance > 0 && (
                      <div className="text-amber-400 text-[10px]">Due: Rs. {b.remainingBalance.toLocaleString('en-PK')}</div>
                    )}
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    {b.status === 'Checked-In' ? (
                      <button
                        onClick={() => onOpenCheckOut(b)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] transition cursor-pointer"
                      >
                        Check-Out
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Settled</span>
                    )}
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
