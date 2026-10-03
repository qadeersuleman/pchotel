'use client';

import React, { useState } from 'react';
import {
  Building2,
  FileText,
  CalendarCheck2,
  BedDouble,
  Layers,
  FileSpreadsheet,
  PartyPopper,
  Search,
  Plus,
  Printer,
  UserPlus,
  Filter,
  DollarSign,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  HotelInvoice,
  Booking,
  Room,
  BTCContract,
  EventBooking,
} from '../types/hotel';

interface HMSModuleViewProps {
  initialSubTab?: string;
  invoices: HotelInvoice[];
  bookings: Booking[];
  rooms: Room[];
  btcContracts: BTCContract[];
  eventBookings: EventBooking[];
  onOpenCheckIn: () => void;
  onOpenCheckOut: (booking: Booking) => void;
  onViewInvoiceDetails: (invoice: HotelInvoice) => void;
}

export default function HMSModuleView({
  initialSubTab = 'invoices',
  invoices,
  bookings,
  rooms,
  btcContracts,
  eventBookings,
  onOpenCheckIn,
  onOpenCheckOut,
  onViewInvoiceDetails,
}: HMSModuleViewProps) {
  const [subTab, setSubTab] = useState<string>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [roomStatusFilter, setRoomStatusFilter] = useState<'all' | 'available' | 'occupied'>('all');

  const hmsNavItems = [
    { id: 'invoices', label: 'Hotel Invoices & Folios', icon: FileText, badge: invoices.length },
    { id: 'bookings', label: 'Front Desk Bookings', icon: CalendarCheck2, badge: bookings.length },
    { id: 'rooms', label: 'Rooms & Status Plan', icon: BedDouble, badge: rooms.length },
    { id: 'categories', label: 'Room Categories', icon: Layers, badge: 5 },
    { id: 'btc', label: 'BTC Corporate Contracts', icon: FileSpreadsheet, badge: btcContracts.length },
    { id: 'events', label: 'Event Hall & Lawn', icon: PartyPopper, badge: eventBookings.length },
  ];

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.roomNumber.includes(searchQuery) ||
      inv.cnic.includes(searchQuery)
  );

  const filteredRooms = rooms.filter((r) => {
    const matchFloor = selectedFloor === 'all' || r.floor === selectedFloor;
    const matchStatus = roomStatusFilter === 'all' || r.status === roomStatusFilter;
    return matchFloor && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in-up">
      {/* HMS Title Header with #18181B & #E63946 Accent */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF1F2] border border-[#E63946]/30 text-[#E63946] flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-[#18181B] tracking-tight">
                  HMS Operations &bull; Pakistan Club Inn
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FFF1F2] text-[#E63946] font-bold border border-[#E63946]/25">
                  SUKKUR
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Front desk check-in, checkout, invoices, room allotment &amp; corporate folios
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCheckIn}
            className="px-4 py-2.5 rounded-2xl btn-luxury-red font-black text-xs flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Check-In Guest</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Selector with Modern Pill Design */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        {hmsNavItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#18181B] text-white shadow-md'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 border border-zinc-200/90'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  isActive
                    ? 'bg-[#FFF1F2] text-[#E63946]'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* SUB-VIEW 1: HOTEL INVOICES & AMOUNTS */}
      {subTab === 'invoices' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Invoice # (e.g. PCI-INV-2026), guest, room..."
                className="w-full px-4 py-2.5 pl-10 rounded-2xl text-xs border border-zinc-300 bg-white text-zinc-900 outline-none focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/10"
              />
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 bg-[#FFF1F2] border border-[#E63946]/20 px-3.5 py-1.5 rounded-xl">
                <span className="text-[#E63946] font-semibold">Total Revenue Invoiced:</span>
                <span className="font-black text-[#E63946] font-mono text-sm">
                  Rs.{' '}
                  {invoices
                    .reduce((sum, inv) => sum + inv.totalAmount, 0)
                    .toLocaleString('en-PK')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Guest Details</th>
                    <th className="p-4">Room &amp; Category</th>
                    <th className="p-4">Stay Duration</th>
                    <th className="p-4 font-mono">Gross Total</th>
                    <th className="p-4 font-mono">Advance Paid</th>
                    <th className="p-4 font-mono">Net Due Balance</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-zinc-50/70 transition">
                      <td className="p-4 font-mono">
                        <div className="font-black text-[#18181B] text-xs">{inv.invoiceNumber}</div>
                        <div className="text-[10px] text-zinc-400 font-sans mt-0.5">{inv.dateGenerated}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-extrabold text-[#18181B]">{inv.guestName}</div>
                        <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{inv.phone}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{inv.cnic}</div>
                      </td>

                      <td className="p-4">
                        <span className="font-extrabold text-[#18181B] bg-zinc-100 px-2 py-0.5 rounded-lg">
                          Room {inv.roomNumber}
                        </span>
                        <div className="text-[11px] text-zinc-500 mt-1">{inv.roomType}</div>
                      </td>

                      <td className="p-4 text-zinc-600">
                        <div className="font-medium">
                          {inv.checkInDate} &rarr; {inv.checkOutDate}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-bold mt-0.5">
                          {inv.nights} night(s)
                        </div>
                      </td>

                      <td className="p-4 font-mono font-bold text-[#18181B]">
                        Rs. {inv.totalAmount.toLocaleString('en-PK')}
                      </td>

                      <td className="p-4 font-mono text-emerald-600 font-bold">
                        Rs. {inv.advancePaid.toLocaleString('en-PK')}
                      </td>

                      <td className="p-4 font-mono font-black text-[#E63946]">
                        Rs. {inv.netPayable.toLocaleString('en-PK')}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/25'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => onViewInvoiceDetails(inv)}
                          className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-[#FFF1F2] text-zinc-800 hover:text-[#E63946] font-bold text-[11px] inline-flex items-center gap-1.5 cursor-pointer transition border border-zinc-200/80 hover:border-[#E63946]/30"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#E63946]" />
                          <span>Folio Bill</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: FRONT DESK BOOKINGS */}
      {subTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-[#18181B] tracking-tight">
                Active Room Bookings &bull; Pakistan Club Inn
              </h2>
              <p className="text-xs text-zinc-400">
                Front desk guest register, durations &amp; checkout settlements
              </p>
            </div>
            <button
              onClick={onOpenCheckIn}
              className="px-3.5 py-2 rounded-2xl btn-luxury-red font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Check-In</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Booking #</th>
                  <th className="p-3.5">Guest &amp; CNIC</th>
                  <th className="p-3.5">Room #</th>
                  <th className="p-3.5">Stay Dates</th>
                  <th className="p-3.5 font-mono">Advance</th>
                  <th className="p-3.5 font-mono">Remaining Due</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-50/70 transition">
                    <td className="p-3.5 font-mono font-bold text-[#18181B]">{b.bookingNumber}</td>
                    <td className="p-3.5">
                      <div className="font-extrabold text-[#18181B]">{b.guestName}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">{b.cnic}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-black text-[#18181B] bg-zinc-100 px-2 py-0.5 rounded-lg">
                        Room {b.roomNumber}
                      </span>
                    </td>
                    <td className="p-3.5 text-zinc-600 font-medium">
                      {b.checkInDate} to {b.checkOutDate}
                    </td>
                    <td className="p-3.5 text-emerald-600 font-mono font-bold">
                      Rs. {b.advancePaid.toLocaleString('en-PK')}
                    </td>
                    <td className="p-3.5 text-[#E63946] font-mono font-black">
                      Rs. {b.remainingBalance.toLocaleString('en-PK')}
                    </td>
                    <td className="p-3.5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/25">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {b.status === 'Checked-In' ? (
                        <button
                          onClick={() => onOpenCheckOut(b)}
                          className="px-3 py-1.5 rounded-xl bg-[#E63946] hover:bg-[#d62839] text-white font-black text-[11px] transition cursor-pointer shadow-sm"
                        >
                          Check-Out &amp; Folio
                        </button>
                      ) : (
                        <span className="text-zinc-400 font-medium">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: ROOMS MATRIX WITH FILTERS */}
      {subTab === 'rooms' && (
        <div className="space-y-4">
          {/* Floor & Status Filter Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-zinc-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Floor:</span>
              {(['all', 1, 2, 3] as const).map((fl) => (
                <button
                  key={fl}
                  onClick={() => setSelectedFloor(fl)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedFloor === fl
                      ? 'bg-[#18181B] text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {fl === 'all' ? 'All Floors' : `Floor ${fl}`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Status:</span>
              {(['all', 'available', 'occupied'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setRoomStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                    roomStatusFilter === st
                      ? st === 'occupied'
                        ? 'bg-[#E63946] text-white'
                        : 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRooms.map((room) => {
              const isOccupied = room.status === 'occupied';
              return (
                <div
                  key={room.id}
                  className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                    isOccupied
                      ? 'bg-[#FFF1F2]/50 border-[#E63946]/40 shadow-xs'
                      : 'bg-white border-zinc-200/90 shadow-sm hover:border-emerald-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xl font-black ${isOccupied ? 'text-[#E63946]' : 'text-[#18181B]'}`}>
                        Room {room.roomNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          room.status === 'available'
                            ? 'bg-emerald-100 text-emerald-700'
                            : isOccupied
                            ? 'bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/30'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {room.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-zinc-800">{room.type}</div>
                    <div className="text-xs text-zinc-500 font-bold font-mono mt-1">
                      Rs. {room.pricePerNight.toLocaleString('en-PK')} / night
                    </div>

                    {room.currentGuest && (
                      <div className="mt-3 p-3 rounded-2xl bg-white/90 border border-[#E63946]/20 text-xs">
                        <div className="font-extrabold text-[#18181B]">{room.currentGuest.name}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5 font-medium">
                          Checkout: {room.currentGuest.checkOutDate}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-bold">Floor {room.floor}</span>
                    {room.status === 'available' ? (
                      <button
                        onClick={onOpenCheckIn}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Allot Room
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-[#E63946]">In-House Guest</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: ROOM CATEGORIES */}
      {subTab === 'categories' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-black text-[#18181B]">
              Room Categories &amp; Base Tariffs (Sukkur Property)
            </h2>
            <p className="text-xs text-zinc-400">
              Configured room suites with standard inventory &amp; bed capacity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {[
              { title: 'Standard Single', price: 5500, beds: 'Single Bed', count: 6, tag: 'Economy' },
              { title: 'Deluxe Double', price: 8500, beds: 'King Size Bed', count: 18, tag: 'Popular' },
              { title: 'Executive Suite', price: 14000, beds: 'Super King Bed + Lounge', count: 10, tag: 'Corporate' },
              { title: 'Presidential Suite', price: 28000, beds: 'Royal Master + Jacuzzi', count: 4, tag: 'Luxury' },
              { title: 'Family Suite', price: 18000, beds: '2 King Beds + Kitchenette', count: 4, tag: 'Family' },
            ].map((cat, i) => (
              <div key={i} className="p-5 rounded-3xl border border-zinc-200 bg-zinc-50/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-black text-sm text-[#18181B]">{cat.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/20">
                    {cat.tag}
                  </span>
                </div>
                <div className="text-[#E63946] font-black font-mono text-base">
                  Rs. {cat.price.toLocaleString('en-PK')} / night
                </div>
                <div className="text-zinc-500 text-[11px] font-medium">{cat.beds}</div>
                <div className="text-zinc-400 text-[10px] pt-2 border-t border-zinc-200/60">
                  Total Rooms in Inventory: {cat.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: BTC CORPORATE CONTRACTS */}
      {subTab === 'btc' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-[#18181B]">
                Bill to Company (BTC) Corporate Contracts
              </h2>
              <p className="text-xs text-zinc-400">
                Corporate clients with direct billing credit facilities at Pakistan Club Inn Hotel Sukkur
              </p>
            </div>
            <button className="px-4 py-2 rounded-2xl btn-luxury-red font-bold text-xs cursor-pointer">
              + New Contract
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Company Name</th>
                  <th className="p-3.5">Contact Person &amp; Phone</th>
                  <th className="p-3.5">NTN Number</th>
                  <th className="p-3.5">Discount Rate</th>
                  <th className="p-3.5">Credit Limit</th>
                  <th className="p-3.5">Current Outstanding</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {btcContracts.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50 transition">
                    <td className="p-3.5 font-black text-[#18181B]">{c.companyName}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-zinc-800">{c.contactPerson}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">{c.phone}</div>
                    </td>
                    <td className="p-3.5 font-mono text-zinc-600">{c.ntn}</td>
                    <td className="p-3.5 font-bold text-emerald-600">{c.discountRate}%</td>
                    <td className="p-3.5 font-mono font-bold">Rs. {c.creditLimit.toLocaleString('en-PK')}</td>
                    <td className="p-3.5 font-mono font-black text-[#E63946]">
                      Rs. {c.currentOutstanding.toLocaleString('en-PK')}
                    </td>
                    <td className="p-3.5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 6: EVENT BOOKING */}
      {subTab === 'events' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-[#18181B]">
                Marriage Hall &amp; Banquet Lawn Bookings
              </h2>
              <p className="text-xs text-zinc-400">
                Event reservations at Pakistan Club Inn Hotel, Sukkur
              </p>
            </div>
            <button className="px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-sm">
              + Book Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {eventBookings.map((ev) => (
              <div key={ev.id} className="p-5 rounded-3xl border border-zinc-200 bg-zinc-50/60 space-y-3">
                <div className="flex justify-between items-start font-bold">
                  <span className="text-sm font-black text-[#18181B]">{ev.eventName}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                    {ev.status}
                  </span>
                </div>
                <div className="text-[#E63946] font-bold">{ev.venue}</div>
                <div className="text-zinc-600 flex justify-between">
                  <span>Client: {ev.clientName} ({ev.phone})</span>
                  <span className="font-bold">{ev.date}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-zinc-200 flex justify-between font-mono">
                  <span>{ev.guestsCount} Guests @ Rs. {ev.perHeadRate}/head</span>
                  <span className="font-black text-[#E63946]">Total: Rs. {ev.totalAmount.toLocaleString('en-PK')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
