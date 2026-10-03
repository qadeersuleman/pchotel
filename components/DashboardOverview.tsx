'use client';

import React from 'react';
import {
  BedDouble,
  Users,
  CheckCircle2,
  Brush,
  Wrench,
  TrendingUp,
  Wallet,
  Clock,
  ArrowUpRight,
  UserPlus,
  Receipt,
  UtensilsCrossed,
  Layers,
  MapPin,
  Phone,
  CreditCard,
} from 'lucide-react';
import { Room, Booking, RestaurantOrder, DashboardStats } from '../types/hotel';

interface DashboardOverviewProps {
  stats: DashboardStats;
  rooms: Room[];
  bookings: Booking[];
  restaurantOrders: RestaurantOrder[];
  onOpenCheckIn: () => void;
  onOpenCheckOut: (booking: Booking) => void;
  onNavigateToRooms: () => void;
  onNavigateToRestaurant: () => void;
  isDarkTheme: boolean;
}

export default function DashboardOverview({
  stats,
  rooms,
  bookings,
  restaurantOrders,
  onOpenCheckIn,
  onOpenCheckOut,
  onNavigateToRooms,
  onNavigateToRestaurant,
  isDarkTheme,
}: DashboardOverviewProps) {
  // Format PKR currency
  const formatPKR = (amount: number) => {
    return 'Rs. ' + amount.toLocaleString('en-PK');
  };

  const statCards = [
    {
      title: 'Total Rooms',
      value: stats.totalRooms,
      sub: 'Pakistan Club Inn',
      icon: BedDouble,
      color: 'from-blue-500 to-indigo-600',
      badge: '100% Total',
    },
    {
      title: 'Occupied Rooms',
      value: stats.occupiedRooms,
      sub: `${stats.occupancyRate}% Current Occupancy`,
      icon: Users,
      color: 'from-amber-500 to-amber-600',
      badge: 'Active Guests',
    },
    {
      title: 'Available Clean',
      value: stats.availableRooms,
      sub: 'Ready for Check-In',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-emerald-600',
      badge: 'Instant Allot',
    },
    {
      title: 'Housekeeping',
      value: stats.cleaningRooms,
      sub: `${stats.maintenanceRooms} in Maintenance`,
      icon: Brush,
      color: 'from-purple-500 to-pink-600',
      badge: 'Needs Cleaning',
    },
    {
      title: "Today's Revenue",
      value: formatPKR(stats.todayRevenue),
      sub: 'All collections combined',
      icon: TrendingUp,
      color: 'from-sky-500 to-cyan-600',
      badge: '+14% vs yesterday',
    },
    {
      title: 'Cash in Hand',
      value: formatPKR(stats.cashInHand),
      sub: 'Front Desk Drawer',
      icon: Wallet,
      color: 'from-teal-500 to-emerald-600',
      badge: 'Physical Cash',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar */}
      <div className={`p-5 rounded-2xl border backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDarkTheme ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight">Front Desk Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pakistan Club Inn Hotel, Sukkur Bypass &bull; Welcome back, Front Desk Manager
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenCheckIn}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 shadow-md shadow-sky-500/20 cursor-pointer active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Check-In Guest</span>
          </button>

          <button
            onClick={onNavigateToRooms}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              isDarkTheme
                ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Room Plan Grid</span>
          </button>

          <button
            onClick={onNavigateToRestaurant}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              isDarkTheme
                ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <span>Lazzati Kitchen</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
                isDarkTheme ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">{card.title}</span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold tracking-tight">{card.value}</div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
                <span className="text-slate-400">{card.sub}</span>
                <span className="font-semibold text-sky-400">{card.badge}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Split: In-House Guests Table & Restaurant Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Currently In-House Guests */}
        <div className={`lg:col-span-2 p-5 rounded-2xl border ${
          isDarkTheme ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase text-slate-300">
                Current In-House Guests
              </h2>
              <p className="text-xs text-slate-400">
                Active registered guests staying at Pakistan Club Inn
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {bookings.filter(b => b.status === 'Checked-In').length} Active Rooms
            </span>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Room &amp; Guest</th>
                  <th className="pb-3 font-semibold">CNIC / City</th>
                  <th className="pb-3 font-semibold">Stay Duration</th>
                  <th className="pb-3 font-semibold">Advance / Balance</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bookings
                  .filter((b) => b.status === 'Checked-In')
                  .slice(0, 5)
                  .map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-md font-extrabold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                            {booking.roomNumber}
                          </span>
                          <div>
                            <div className="font-bold text-slate-200">{booking.guestName}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{booking.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="text-slate-300 font-mono text-[11px]">{booking.cnic}</div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{booking.city}</span>
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="text-slate-300">{booking.checkInDate} to {booking.checkOutDate}</div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {booking.nights} Night{booking.nights > 1 ? 's' : ''} ({booking.roomType})
                        </div>
                      </td>

                      <td className="py-3">
                        <div className="text-emerald-400 font-semibold">
                          Adv: {formatPKR(booking.advancePaid)}
                        </div>
                        <div className={`text-[11px] font-semibold ${
                          booking.remainingBalance > 0 ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          Due: {formatPKR(booking.remainingBalance)}
                        </div>
                      </td>

                      <td className="py-3 text-right">
                        <button
                          onClick={() => onOpenCheckOut(booking)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] transition cursor-pointer"
                        >
                          Check-Out
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Lazzati Restaurant & Kitchen Status */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
          isDarkTheme ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-300">
                  Lazzati Restaurant
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Kitchen Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Recent room service orders from in-house hotel guests
            </p>

            <div className="space-y-3">
              {restaurantOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-sky-400">{ord.tableOrRoom || `Room ${ord.roomNumber}`} &bull; {ord.guestName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{ord.time}</span>
                  </div>

                  <div className="space-y-0.5 text-slate-300 text-[11px] mb-2">
                    {ord.items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.qty}x {item.name}</span>
                        <span className="text-slate-400">Rs. {item.price * item.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                    <span className="font-bold text-amber-400">{formatPKR(ord.totalAmount)}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <button
              onClick={onNavigateToRestaurant}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center justify-center gap-1 mx-auto"
            >
              <span>View Kitchen Menu &amp; Add Order</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
