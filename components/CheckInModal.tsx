'use client';

import React, { useState } from 'react';
import { X, UserPlus, BedDouble, Calendar, CreditCard, MapPin, Phone, Hash, DollarSign, CheckCircle2 } from 'lucide-react';
import { Room, Booking } from '../types/hotel';

interface CheckInModalProps {
  rooms: Room[];
  preSelectedRoom?: string;
  onClose: () => void;
  onConfirmCheckIn: (bookingData: Omit<Booking, 'id' | 'createdAt'>) => void;
  isDarkTheme?: boolean;
}

export default function CheckInModal({
  rooms,
  preSelectedRoom,
  onClose,
  onConfirmCheckIn,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white text-[#18181B] shadow-2xl overflow-hidden relative">
        {/* Header: Dark Luxury #18181B with Red Shimmer */}
        <div className="shimmer-header text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E63946] flex items-center justify-center text-white shadow-md shadow-[#E63946]/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black uppercase tracking-tight">Front Desk Check-In</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF1F2] text-[#E63946] font-bold">
                  NEW GUEST
                </span>
              </div>
              <p className="text-xs text-zinc-300">Pakistan Club Inn Hotel Sukkur &bull; Room Allotment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-[#FFF1F2] border border-[#E63946]/30 text-[#E63946] font-bold">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Guest Name */}
            <div>
              <label className="block text-zinc-600 font-bold mb-1">Guest Full Name *</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Asadullah Mahar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 outline-none focus:border-[#E63946] text-zinc-900"
                required
              />
            </div>

            {/* CNIC Number */}
            <div>
              <label className="block text-zinc-600 font-bold mb-1">CNIC / ID Card # *</label>
              <input
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                placeholder="45201-1234567-1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 outline-none font-mono focus:border-[#E63946] text-zinc-900"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-zinc-600 font-bold mb-1">Mobile / WhatsApp #</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 outline-none focus:border-[#E63946] text-zinc-900"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-zinc-600 font-bold mb-1">City of Origin</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 outline-none text-zinc-900 font-bold"
              >
                <option value="Sukkur">Sukkur</option>
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Larkana">Larkana</option>
                <option value="Khairpur">Khairpur</option>
                <option value="Multan">Multan</option>
                <option value="Quetta">Quetta</option>
                <option value="Peshawar">Peshawar</option>
              </select>
            </div>
          </div>

          {/* Room Allocation */}
          <div className="p-4 rounded-2xl bg-[#FFF1F2]/60 border border-[#E63946]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-[#E63946] uppercase tracking-wider text-[11px]">
                Room Allocation &amp; Nightly Tariff
              </span>
              <span className="text-[#18181B] font-black font-mono">
                Rs. {ratePerNight.toLocaleString('en-PK')} / night
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-600 font-bold mb-1">Select Available Room</label>
                <select
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 bg-white outline-none font-bold text-zinc-900"
                >
                  {availableRooms.map((r) => (
                    <option key={r.id} value={r.roomNumber}>
                      Room {r.roomNumber} - {r.type} (Floor {r.floor})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 font-bold mb-1">Room Category Type</label>
                <input
                  type="text"
                  value={selectedRoomObj.type}
                  disabled
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 bg-zinc-100 text-zinc-600 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Dates & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-zinc-600 font-bold mb-1">Check-In Date</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 bg-zinc-50"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-600 font-bold mb-1">Expected Check-Out Date</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 bg-zinc-50"
                required
              />
            </div>

            <div>
              <label className="block text-zinc-600 font-bold mb-1">Advance Payment Received (PKR)</label>
              <input
                type="number"
                value={advancePaid}
                onChange={(e) => setAdvancePaid(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 bg-zinc-50 font-mono font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block text-zinc-600 font-bold mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 bg-zinc-50 font-bold text-zinc-900"
              >
                <option value="Cash">Cash at Counter</option>
                <option value="Credit Card">Credit/Debit Card (POS)</option>
                <option value="Bank Transfer">Bank Transfer (HBL / Meezan)</option>
                <option value="BTC Company">BTC (Bill to Corporate Company)</option>
              </select>
            </div>
          </div>

          {/* Live Bill Summary */}
          <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-200/90 flex items-center justify-between font-mono">
            <div>
              <div className="text-zinc-500 text-[11px] font-sans">
                {diffDays} Night(s) &bull; Rs. {ratePerNight.toLocaleString('en-PK')}/nt
              </div>
              <div className="text-[#18181B] font-black text-sm">
                Total Room Rent: Rs. {totalAmount.toLocaleString('en-PK')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-700 text-[11px] font-bold">
                Advance Paid: Rs. {advancePaid.toLocaleString('en-PK')}
              </div>
              <div className="text-[#E63946] font-black text-sm">
                Due at Checkout: Rs. {remainingBalance.toLocaleString('en-PK')}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-zinc-600 hover:bg-zinc-100 font-bold transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-black text-white btn-luxury-red flex items-center gap-2 cursor-pointer shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm &amp; Check-In Guest</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
