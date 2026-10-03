'use client';

import React, { useState } from 'react';
import { X, UserPlus, BedDouble, Calendar, CreditCard, MapPin, Phone, Hash, DollarSign, CheckCircle2 } from 'lucide-react';
import { Room, Booking } from '../types/hotel';

interface CheckInModalProps {
  rooms: Room[];
  preSelectedRoom?: string;
  onClose: () => void;
  onConfirmCheckIn: (bookingData: Omit<Booking, 'id' | 'createdAt'>) => void;
  isDarkTheme: boolean;
}

export default function CheckInModal({
  rooms,
  preSelectedRoom,
  onClose,
  onConfirmCheckIn,
  isDarkTheme,
}: CheckInModalProps) {
  // Available rooms for selection
  const availableRooms = rooms.filter((r) => r.status === 'available' || r.roomNumber === preSelectedRoom);

  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('+92 ');
  const [cnic, setCnic] = useState('');
  const [city, setCity] = useState('Karachi');
  const [roomNumber, setRoomNumber] = useState(preSelectedRoom || (availableRooms[0]?.roomNumber || '102'));
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [advancePaid, setAdvancePaid] = useState<number>(5000);
  const [paymentMethod, setPaymentMethod] = useState<Booking['paymentMethod']>('Cash');
  const [errorMessage, setErrorMessage] = useState('');

  // Selected room calculation
  const selectedRoomObj = rooms.find((r) => r.roomNumber === roomNumber) || rooms[0];
  const ratePerNight = selectedRoomObj ? selectedRoomObj.pricePerNight : 5500;

  // Nights calculation
  const date1 = new Date(checkInDate);
  const date2 = new Date(checkOutDate);
  const diffDays = Math.max(1, Math.round((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)));
  const totalAmount = ratePerNight * diffDays;
  const remainingBalance = Math.max(0, totalAmount - advancePaid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMessage('Please enter guest full name');
      return;
    }
    if (!cnic.trim()) {
      setErrorMessage('Please provide Pakistani CNIC number');
      return;
    }

    const bookingNumber = `PCI-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    onConfirmCheckIn({
      bookingNumber,
      guestName,
      phone,
      cnic,
      city,
      roomNumber,
      roomType: selectedRoomObj.type,
      checkInDate,
      checkOutDate,
      nights: diffDays,
      ratePerNight,
      totalAmount,
      advancePaid,
      remainingBalance,
      status: 'Checked-In',
      paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden relative ${
        isDarkTheme ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="shimmer-header text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider">New Guest Registration</h2>
              <p className="text-xs text-sky-100">Pakistan Club Inn Hotel &bull; Front Desk Allotment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 flex items-center justify-center text-white cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 font-medium">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Guest Name */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Guest Full Name *</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Muhammad Aslam"
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                  isDarkTheme ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                }`}
                required
              />
            </div>

            {/* CNIC Number */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">CNIC / Passport # *</label>
              <input
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                placeholder="42101-1234567-1"
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none font-mono ${
                  isDarkTheme ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                }`}
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Mobile / WhatsApp #</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                  isDarkTheme ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">City of Residence</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                  isDarkTheme ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              >
                <option value="Sukkur">Sukkur</option>
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Larkana">Larkana</option>
                <option value="Multan">Multan</option>
                <option value="Quetta">Quetta</option>
                <option value="Peshawar">Peshawar</option>
              </select>
            </div>
          </div>

          {/* Room Allocation */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">
                Room Allocation &amp; Rate
              </span>
              <span className="text-amber-400 font-bold">
                Rs. {ratePerNight.toLocaleString('en-PK')} / night
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Select Available Room</label>
                <select
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl border outline-none font-bold ${
                    isDarkTheme ? 'bg-slate-950 border-slate-700 text-sky-400' : 'bg-white border-slate-300 text-sky-600'
                  }`}
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.roomNumber} disabled={r.status === 'occupied' && r.roomNumber !== preSelectedRoom}>
                      Room {r.roomNumber} - {r.type} ({r.status}) - Rs. {r.pricePerNight}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className={`w-full px-3.5 py-2 rounded-xl border outline-none ${
                    isDarkTheme ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300'
                  }`}
                >
                  <option value="Cash">Cash in Hand</option>
                  <option value="JazzCash / EasyPaisa">JazzCash / EasyPaisa</option>
                  <option value="Bank Transfer">Bank Transfer (HBL / Meezan)</option>
                  <option value="Credit Card">Credit / Debit Card (POS)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stay Dates & Advance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Check-In Date</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border outline-none ${
                  isDarkTheme ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Check-Out Date</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border outline-none ${
                  isDarkTheme ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Advance Received (PKR)</label>
              <input
                type="number"
                value={advancePaid}
                onChange={(e) => setAdvancePaid(Number(e.target.value))}
                className={`w-full px-3.5 py-2 rounded-xl border outline-none font-bold text-emerald-400 ${
                  isDarkTheme ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>

          {/* Billing Snapshot */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between font-mono">
            <div>
              <div className="text-slate-400 text-[11px]">{diffDays} Night(s) &bull; Rs. {ratePerNight}/nt</div>
              <div className="text-slate-200 font-bold">Total: Rs. {totalAmount.toLocaleString('en-PK')}</div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 text-[11px]">Paid: Rs. {advancePaid.toLocaleString('en-PK')}</div>
              <div className="text-amber-400 font-bold">Due: Rs. {remainingBalance.toLocaleString('en-PK')}</div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-semibold transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 shadow-md shadow-sky-500/20 flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Confirm &amp; Check-In Guest</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
