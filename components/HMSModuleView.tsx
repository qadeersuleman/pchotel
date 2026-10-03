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

  const hmsNavItems = [
    { id: 'invoices', label: 'Hotel Invoices & Amounts', icon: FileText, badge: invoices.length },
    { id: 'bookings', label: 'Front Desk Bookings', icon: CalendarCheck2, badge: bookings.length },
    { id: 'rooms', label: 'Rooms & Status Plan', icon: BedDouble, badge: rooms.length },
    { id: 'categories', label: 'Room Categories', icon: Layers, badge: 5 },
    { id: 'btc', label: 'BTC Contracts', icon: FileSpreadsheet, badge: btcContracts.length },
    { id: 'events', label: 'Event Booking (Hall/Lawn)', icon: PartyPopper, badge: eventBookings.length },
  ];

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.roomNumber.includes(searchQuery) ||
      inv.cnic.includes(searchQuery)
  );

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-10">
      {/* HMS Title & Top Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800">
              HMS &bull; Hotel Management System
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-bold">
              Pakistan Club Inn
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Check-In, Check-Out, Room Allotment, Invoices &amp; Accounts Reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCheckIn}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Check-In Guest</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none">
        {hmsNavItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#1e2229] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
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
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Invoice # (e.g. PCI-INV-2026), guest, room..."
                className="w-full px-3.5 py-2 pl-9 rounded-xl text-xs border border-slate-300 outline-none focus:border-sky-500"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="text-slate-400">Total Billed:</span>
              <span className="font-bold text-slate-900 font-mono">
                Rs.{' '}
                {invoices
                  .reduce((sum, inv) => sum + inv.totalAmount, 0)
                  .toLocaleString('en-PK')}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3.5">Invoice #</th>
                    <th className="p-3.5">Guest &amp; Contact</th>
                    <th className="p-3.5">Room &amp; Category</th>
                    <th className="p-3.5">Stay Period</th>
                    <th className="p-3.5">Total Amount</th>
                    <th className="p-3.5">Advance Paid</th>
                    <th className="p-3.5">Net Payable</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-mono font-bold text-sky-700">
                        {inv.invoiceNumber}
                        <div className="text-[10px] text-slate-400 font-sans">{inv.dateGenerated}</div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{inv.guestName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                          {inv.phone}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{inv.cnic}</div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-slate-800">Room {inv.roomNumber}</span>
                        <div className="text-[11px] text-slate-500">{inv.roomType}</div>
                      </td>

                      <td className="p-3.5 text-slate-600">
                        <div>
                          {inv.checkInDate} &rarr; {inv.checkOutDate}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold">
                          {inv.nights} night(s)
                        </div>
                      </td>

                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        Rs. {inv.totalAmount.toLocaleString('en-PK')}
                      </td>

                      <td className="p-3.5 font-mono text-emerald-600 font-semibold">
                        Rs. {inv.advancePaid.toLocaleString('en-PK')}
                      </td>

                      <td className="p-3.5 font-mono font-bold text-[#E63946]">
                        Rs. {inv.netPayable.toLocaleString('en-PK')}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/25'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => onViewInvoiceDetails(inv)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 ml-auto cursor-pointer transition"
                        >
                          <Printer className="w-3.5 h-3.5 text-sky-600" />
                          <span>View &amp; Print</span>
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
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              Active Room Bookings &bull; Pakistan Club Inn
            </h2>
            <button
              onClick={onOpenCheckIn}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Check-In</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Booking #</th>
                  <th className="p-3">Guest Name &amp; CNIC</th>
                  <th className="p-3">Room #</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Advance</th>
                  <th className="p-3">Remaining Due</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-sky-700">{b.bookingNumber}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{b.guestName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{b.cnic}</div>
                    </td>
                    <td className="p-3 font-bold text-slate-800">Room {b.roomNumber}</td>
                    <td className="p-3 text-slate-600">{b.checkInDate} to {b.checkOutDate}</td>
                    <td className="p-3 text-emerald-600 font-mono font-semibold">
                      Rs. {b.advancePaid.toLocaleString('en-PK')}
                    </td>
                    <td className="p-3 text-amber-600 font-mono font-bold">
                      Rs. {b.remainingBalance.toLocaleString('en-PK')}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {b.status === 'Checked-In' ? (
                        <button
                          onClick={() => onOpenCheckOut(b)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer"
                        >
                          Check-Out
                        </button>
                      ) : (
                        <span className="text-slate-400">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: ROOMS MATRIX */}
      {subTab === 'rooms' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`bg-white p-4 rounded-2xl border shadow-sm flex flex-col justify-between ${
                room.status === 'occupied' ? 'border-[#E63946]/30' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-black text-sky-700">Room {room.roomNumber}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      room.status === 'available'
                        ? 'bg-emerald-100 text-emerald-700'
                        : room.status === 'occupied'
                        ? 'bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/25'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {room.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800">{room.type}</div>
                <div className="text-xs text-amber-600 font-semibold font-mono mt-0.5">
                  Rs. {room.pricePerNight.toLocaleString('en-PK')} / night
                </div>

                {room.currentGuest && (
                  <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="font-bold text-slate-800">{room.currentGuest.name}</div>
                    <div className="text-[10px] text-slate-500">Out: {room.currentGuest.checkOutDate}</div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Floor {room.floor}</span>
                {room.status === 'available' && (
                  <button
                    onClick={onOpenCheckIn}
                    className="px-2.5 py-1 rounded-lg bg-sky-600 text-white font-bold text-xs cursor-pointer hover:bg-sky-700"
                  >
                    Allot Room
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-VIEW 4: ROOM CATEGORIES */}
      {subTab === 'categories' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800">
            Room Categories &amp; Base Tariffs (Sukkur Property)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            {[
              { title: 'Standard Single', price: 5500, beds: 'Single Bed', count: 6 },
              { title: 'Deluxe Double', price: 8500, beds: 'King Size Bed', count: 18 },
              { title: 'Executive Suite', price: 14000, beds: 'Super King Bed + Lounge', count: 10 },
              { title: 'Presidential Suite', price: 28000, beds: 'Royal Master + Jacuzzi', count: 4 },
              { title: 'Family Suite', price: 18000, beds: '2 King Beds + Kitchenette', count: 4 },
            ].map((cat, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="font-bold text-sm text-slate-900">{cat.title}</div>
                <div className="text-amber-600 font-bold font-mono">Rs. {cat.price.toLocaleString('en-PK')} / night</div>
                <div className="text-slate-500 text-[11px]">{cat.beds}</div>
                <div className="text-slate-400 text-[10px] pt-2">Total Inventory: {cat.count} Rooms</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: BTC CONTRACTS */}
      {subTab === 'btc' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Bill to Company (BTC) Corporate Contracts
              </h2>
              <p className="text-xs text-slate-400">
                Corporate clients with direct billing credit facilities at Pakistan Club Inn
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer">
              + New Contract
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Company Name</th>
                  <th className="p-3">Contact Person &amp; Phone</th>
                  <th className="p-3">NTN Number</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Credit Limit</th>
                  <th className="p-3">Outstanding Balance</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {btcContracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900">{c.companyName}</td>
                    <td className="p-3">
                      <div>{c.contactPerson}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{c.phone}</div>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{c.ntn}</td>
                    <td className="p-3 font-bold text-emerald-600">{c.discountRate}%</td>
                    <td className="p-3 font-mono">Rs. {c.creditLimit.toLocaleString('en-PK')}</td>
                    <td className="p-3 font-mono font-bold text-amber-600">
                      Rs. {c.currentOutstanding.toLocaleString('en-PK')}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
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
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Marriage Hall &amp; Banquet Lawn Bookings
              </h2>
              <p className="text-xs text-slate-400">
                Event reservations at Pakistan Club Inn Hotel, Sukkur
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer">
              + Book Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {eventBookings.map((ev) => (
              <div key={ev.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-start font-bold">
                  <span className="text-sm text-slate-900">{ev.eventName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    {ev.status}
                  </span>
                </div>
                <div className="text-sky-700 font-semibold">{ev.venue}</div>
                <div className="text-slate-600 flex justify-between">
                  <span>Client: {ev.clientName} ({ev.phone})</span>
                  <span>Date: {ev.date}</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200 flex justify-between font-mono">
                  <span>{ev.guestsCount} Guests @ Rs. {ev.perHeadRate}/head</span>
                  <span className="font-bold text-amber-600">Total: Rs. {ev.totalAmount.toLocaleString('en-PK')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

