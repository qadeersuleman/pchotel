'use client';

import React, { useState } from 'react';
import { X, Receipt, Printer, CheckCircle2, Building2, Phone, CreditCard, Sparkles } from 'lucide-react';
import { Booking, RestaurantOrder } from '../types/hotel';

interface CheckOutModalProps {
  booking: Booking;
  restaurantOrders: RestaurantOrder[];
  onClose: () => void;
  onConfirmCheckOut: (bookingId: string, finalPayment: number) => void;
  isDarkTheme: boolean;
}

export default function CheckOutModal({
  booking,
  restaurantOrders,
  onClose,
  onConfirmCheckOut,
  isDarkTheme,
}: CheckOutModalProps) {
  const roomFoodOrders = restaurantOrders.filter(
    (o) => o.roomNumber === booking.roomNumber || o.tableOrRoom?.includes(booking.roomNumber)
  );
  const totalFoodCharges = roomFoodOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const [discount, setDiscount] = useState<number>(0);
  const [laundryCharge, setLaundryCharge] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Calculations
  const roomCharges = booking.totalAmount;
  const subtotal = roomCharges + totalFoodCharges + laundryCharge;
  const advanceDeducted = booking.advancePaid;
  const netPayable = Math.max(0, subtotal - advanceDeducted - discount);

  const handlePrint = () => {
    window.print();
  };

  const handleSettle = () => {
    onConfirmCheckOut(booking.id, netPayable);
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
              <Receipt className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider">Folio Check-Out &amp; Invoice</h2>
              <p className="text-xs text-sky-100">Room {booking.roomNumber} &bull; {booking.guestName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 flex items-center justify-center text-white cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Invoice Area */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs" id="printable-invoice">
          {/* Hotel Letterhead */}
          <div className="text-center pb-4 border-b border-slate-800/80">
            <h3 className="text-base font-extrabold tracking-widest uppercase text-sky-400">
              PAKISTAN CLUB INN HOTEL
            </h3>
            <p className="text-[11px] text-slate-400">
              City Bypass Road, Near NICVD, Sukkur, Sindh &bull; Tel: 071-5806409 / +92 300 7555850
            </p>
            <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-semibold">
              Invoice #{booking.bookingNumber} &bull; Date: {new Date().toLocaleDateString('en-PK')}
            </div>
          </div>

          {/* Guest Information Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Guest Details</span>
              <div className="font-bold text-slate-200">{booking.guestName}</div>
              <div className="text-slate-400 font-mono text-[11px]">{booking.cnic}</div>
              <div className="text-slate-400 text-[11px]">{booking.phone} ({booking.city})</div>
            </div>

            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Stay Information</span>
              <div className="font-bold text-sky-400">Room {booking.roomNumber} ({booking.roomType})</div>
              <div className="text-slate-400 text-[11px]">In: {booking.checkInDate} &bull; Out: {booking.checkOutDate}</div>
              <div className="text-slate-400 text-[11px]">{booking.nights} Night(s) @ Rs. {booking.ratePerNight}/nt</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2.5 font-semibold">Description</th>
                  <th className="p-2.5 font-semibold text-center">Qty / Days</th>
                  <th className="p-2.5 font-semibold text-right">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-2.5 text-slate-300">Room Rent ({booking.roomType})</td>
                  <td className="p-2.5 text-center text-slate-400">{booking.nights}</td>
                  <td className="p-2.5 text-right font-mono">Rs. {roomCharges.toLocaleString('en-PK')}</td>
                </tr>

                {totalFoodCharges > 0 && (
                  <tr>
                    <td className="p-2.5 text-slate-300">Lazzati Restaurant (Room Service Food)</td>
                    <td className="p-2.5 text-center text-slate-400">{roomFoodOrders.length} order(s)</td>
                    <td className="p-2.5 text-right font-mono">Rs. {totalFoodCharges.toLocaleString('en-PK')}</td>
                  </tr>
                )}

                <tr>
                  <td className="p-2.5 text-slate-300">Laundry &amp; Miscellaneous Services</td>
                  <td className="p-2.5 text-center text-slate-400">1</td>
                  <td className="p-2.5 text-right font-mono">Rs. {laundryCharge.toLocaleString('en-PK')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Calculations Summary */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Gross Folio Subtotal:</span>
              <span>Rs. {subtotal.toLocaleString('en-PK')}</span>
            </div>

            <div className="flex justify-between text-emerald-400">
              <span>Advance Paid at Check-In:</span>
              <span>- Rs. {advanceDeducted.toLocaleString('en-PK')}</span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Front Desk Discount / Concession:</span>
              <div className="flex items-center gap-1 font-sans">
                <span>Rs.</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-right text-xs"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-base font-bold text-amber-400">
              <span>Net Balance Payable:</span>
              <span>Rs. {netPayable.toLocaleString('en-PK')}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <span className="font-semibold text-slate-300">Settlement Method:</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={`px-3 py-1.5 rounded-lg border text-xs outline-none ${
                isDarkTheme ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300'
              }`}
            >
              <option value="Cash">Cash in Hand</option>
              <option value="Credit Card">Credit Card (POS Terminal)</option>
              <option value="Bank Transfer">Online Bank Transfer</option>
              <option value="JazzCash / EasyPaisa">JazzCash / EasyPaisa</option>
            </select>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>Print Folio Receipt</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSettle}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Settle Bill &amp; Check-Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
