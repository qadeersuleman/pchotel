'use client';

import React, { useState } from 'react';
import {
  BedDouble,
  Users,
  CheckCircle2,
  Brush,
  Wrench,
  Search,
  Filter,
  Eye,
  UserPlus,
  Receipt,
  Sparkles,
  Wifi,
  Tv,
  Coffee,
  Check,
} from 'lucide-react';
import { Room, RoomStatus, Booking } from '../types/hotel';

interface RoomMatrixProps {
  rooms: Room[];
  onCheckInRoom: (roomNumber: string) => void;
  onCheckOutRoom: (roomNumber: string) => void;
  onUpdateRoomStatus: (roomId: string, status: RoomStatus) => void;
  isDarkTheme: boolean;
}

export default function RoomMatrix({
  rooms,
  onCheckInRoom,
  onCheckOutRoom,
  onUpdateRoomStatus,
  isDarkTheme,
}: RoomMatrixProps) {
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedRoom, setInspectedRoom] = useState<Room | null>(null);

  // Filtered rooms
  const filteredRooms = rooms.filter((room) => {
    const matchFloor = selectedFloor === 'all' || room.floor === selectedFloor;
    const matchStatus = selectedStatus === 'all' || room.status === selectedStatus;
    const matchSearch =
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.currentGuest && room.currentGuest.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchFloor && matchStatus && matchSearch;
  });

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          dot: 'bg-emerald-400',
          label: 'Available',
        };
      case 'occupied':
        return {
          bg: 'bg-[#FFF1F2] text-[#E63946] border-[#E63946]/30',
          dot: 'bg-[#E63946]',
          label: 'Occupied',
        };
      case 'cleaning':
        return {
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          dot: 'bg-purple-400',
          label: 'Housekeeping',
        };
      case 'maintenance':
        return {
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
          dot: 'bg-slate-400',
          label: 'Maintenance',
        };
      case 'reserved':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          dot: 'bg-amber-400',
          label: 'Reserved',
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
          dot: 'bg-slate-400',
          label: status,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className={`p-5 rounded-2xl border ${
        isDarkTheme ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Room Matrix &amp; Status Plan</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual floor status for Pakistan Club Inn Hotel &bull; 16 Rooms Displayed
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room # or guest..."
              className={`w-full px-3.5 py-2 pl-9 rounded-xl text-xs border outline-none ${
                isDarkTheme
                  ? 'bg-slate-950/70 border-slate-800 text-white placeholder-slate-500 focus:border-sky-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-600'
              }`}
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        {/* Floor & Status Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
          {/* Floor selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-500 text-[11px] font-semibold mr-1">Floor:</span>
            {['all', 1, 2, 3].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFloor(f as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  selectedFloor === f
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                {f === 'all' ? 'All Floors' : `Floor ${f}`}
              </button>
            ))}
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-500 text-[11px] font-semibold mr-1">Status:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'available', label: 'Available' },
              { id: 'occupied', label: 'Occupied' },
              { id: 'cleaning', label: 'Cleaning' },
              { id: 'maintenance', label: 'Maintenance' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  selectedStatus === st.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const badge = getStatusBadge(room.status);
          return (
            <div
              key={room.id}
              className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-lg relative overflow-hidden flex flex-col justify-between ${
                isDarkTheme ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
              } ${room.status === 'occupied' ? 'border-[#E63946]/35' : ''}`}
            >
              {/* Card Top: Room # & Status */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tight text-sky-400">
                      {room.roomNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Floor {room.floor}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${badge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    <span>{badge.label}</span>
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-200 mb-0.5">{room.type}</div>
                <div className="text-[11px] text-amber-400 font-semibold mb-3">
                  Rs. {room.pricePerNight.toLocaleString('en-PK')} / night
                </div>

                {/* Occupied Guest Details if any */}
                {room.status === 'occupied' && room.currentGuest ? (
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs mb-3 space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-200 truncate">{room.currentGuest.name}</span>
                      <span className="text-emerald-400 font-mono text-[11px]">In-House</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {room.currentGuest.phone}
                    </div>
                    <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-slate-700/50">
                      <span>Out: {room.currentGuest.checkOutDate}</span>
                      <span className="text-amber-400 font-semibold">Adv: Rs. {room.currentGuest.advancePaid}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 mb-3 flex items-center gap-2">
                    <span>{room.bedType}</span>
                    <span>&bull;</span>
                    <span>Max: {room.maxOccupancy} Guests</span>
                  </div>
                )}
              </div>

              {/* Action Buttons at bottom of card */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => setInspectedRoom(room)}
                  title="Inspect Room Info"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Info</span>
                </button>

                {room.status === 'available' && (
                  <button
                    onClick={() => onCheckInRoom(room.roomNumber)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-sm transition"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Check-In</span>
                  </button>
                )}

                {room.status === 'occupied' && (
                  <button
                    onClick={() => onCheckOutRoom(room.roomNumber)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-sm transition"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Check-Out</span>
                  </button>
                )}

                {room.status === 'cleaning' && (
                  <button
                    onClick={() => onUpdateRoomStatus(room.id, 'available')}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-sm transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Cleaned</span>
                  </button>
                )}

                {room.status === 'maintenance' && (
                  <button
                    onClick={() => onUpdateRoomStatus(room.id, 'available')}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-sm transition"
                  >
                    <span>Finish Repair</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Detail / Inspection Modal */}
      {inspectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl relative ${
            isDarkTheme ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-sky-400">
                  Room {inspectedRoom.roomNumber} Details
                </h3>
                <span className="text-xs text-slate-400">
                  Floor {inspectedRoom.floor} &bull; {inspectedRoom.type}
                </span>
              </div>
              <button
                onClick={() => setInspectedRoom(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Price Per Night</span>
                <span className="font-bold text-amber-400">
                  Rs. {inspectedRoom.pricePerNight.toLocaleString('en-PK')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Bedding &amp; Capacity</span>
                <span className="font-medium text-slate-200">
                  {inspectedRoom.bedType} (Max {inspectedRoom.maxOccupancy} persons)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Room Amenities</span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectedRoom.amenities.map((a, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Changer */}
              <div className="pt-3">
                <span className="text-slate-400 block mb-2 font-semibold">Change Room State:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      onUpdateRoomStatus(inspectedRoom.id, 'available');
                      setInspectedRoom(null);
                    }}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[11px] border border-emerald-500/20"
                  >
                    Available
                  </button>
                  <button
                    onClick={() => {
                      onUpdateRoomStatus(inspectedRoom.id, 'cleaning');
                      setInspectedRoom(null);
                    }}
                    className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold text-[11px] border border-purple-500/20"
                  >
                    Cleaning
                  </button>
                  <button
                    onClick={() => {
                      onUpdateRoomStatus(inspectedRoom.id, 'maintenance');
                      setInspectedRoom(null);
                    }}
                    className="p-2 rounded-xl bg-slate-700/40 hover:bg-slate-700 text-slate-300 font-bold text-[11px] border border-slate-600"
                  >
                    Maintenance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
