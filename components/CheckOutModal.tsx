'use client';

import React, { useState } from 'react';
import { X, Receipt, Printer, CheckCircle2, Building2, Phone, CreditCard, Sparkles, UtensilsCrossed } from 'lucide-react';
import { Booking, RestaurantOrder } from '../types/hotel';

interface CheckOutModalProps {
  booking: Booking;
  restaurantOrders: RestaurantOrder[];
  onClose: () => void;
  onConfirmCheckOut: (bookingId: string, finalPayment: number) => void;
  isDarkTheme?: boolean;
}

export default function CheckOutModal({
  booking,
  restaurantOrders,
  onClose,
  onConfirmCheckOut,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white text-[#18181B] shadow-2xl overflow-hidden relative">
        {/* Header: Luxury #18181B with Red Shimmer */}
        <div className="shimmer-header text-white p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E63946] flex items-center justify-center text-white shadow-md shadow-[#E63946]/30">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black uppercase tracking-tight">Folio Check-Out &amp; Invoice</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF1F2] text-[#E63946] font-extrabold">
                  SETTLEMENT
                </span>
              </div>
              <p className="text-xs text-zinc-300">Room {booking.roomNumber} &bull; {booking.guestName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Invoice Area */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs" id="printable-invoice">
          {/* Hotel Letterhead */}
          <div className="text-center pb-4 border-b border-zinc-200">
            <h3 className="text-base font-black tracking-wider uppercase text-[#18181B]">
              PAKISTAN CLUB INN HOTEL
            </h3>
            <p className="text-[11px] text-zinc-500">
              City Bypass Road, Near NICVD, Sukkur, Sindh &bull; Tel: 071-5806409 / +92 300 7555850
            </p>
            <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/20 text-[10px] font-mono font-bold">
              Invoice #{booking.bookingNumber} &bull; Date: {new Date().toLocaleDateString('en-PK')}
            </div>
          </div>

          {/* Guest Information Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Guest Details</span>
              <div className="font-black text-[#18181B] text-sm mt-0.5">{booking.guestName}</div>
              <div className="text-zinc-600 font-mono text-[11px]">{booking.cnic}</div>
              <div className="text-zinc-500 text-[11px]">{booking.phone} ({booking.city})</div>
            </div>

            <div className="text-right">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Stay Information</span>
              <div className="font-black text-[#E63946] text-sm mt-0.5">
                Room {booking.roomNumber} ({booking.roomType})
              </div>
              <div className="text-zinc-600 text-[11px]">
                In: {booking.checkInDate} &bull; Out: {booking.checkOutDate}
              </div>
              <div className="text-zinc-500 text-[11px]">
                {booking.nights} Night(s) @ Rs. {booking.ratePerNight.toLocaleString('en-PK')}/nt
              </div>
            </div>
          </div>

          {/* Charges Breakdown */}
          <div className="border border-zinc-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-zinc-100 text-zinc-600 font-bold uppercase text-[10px] border-b border-zinc-200">
                <tr>
                  <th className="p-3">Charge Description</th>
                  <th className="p-3">Reference</th>
                  <th className="p-3 text-right">Amount (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3 font-semibold text-[#18181B]">
                    Room Tariff ({booking.nights} Nights x Rs. {booking.ratePerNight})
                  </td>
                  <td className="p-3 text-zinc-500">Room {booking.roomNumber}</td>
                  <td className="p-3 text-right font-mono font-bold">
                    Rs. {roomCharges.toLocaleString('en-PK')}
                  </td>
                </tr>

                {roomFoodOrders.map((ord, idx) => (
                  <tr key={idx} className="bg-[#FFF1F2]/20">
                    <td className="p-3 font-semibold text-zinc-800">
                      Lazzati Restaurant: {ord.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                    </td>
                    <td className="p-3 text-zinc-500 font-mono">{ord.orderNumber}</td>
                    <td className="p-3 text-right font-mono font-bold text-[#E63946]">
                      Rs. {ord.totalAmount.toLocaleString('en-PK')}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td className="p-3 font-semibold text-[#18181B]">Guest Laundry &amp; Ironing</td>
                  <td className="p-3 text-zinc-500">Housekeeping</td>
                  <td className="p-3 text-right font-mono font-bold">
                    Rs. {laundryCharge.toLocaleString('en-PK')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Accounting Calculations Box */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-2 font-mono">
            <div className="flex justify-between text-zinc-600">
              <span>Gross Total Subtotal:</span>
              <span className="font-bold">Rs. {subtotal.toLocaleString('en-PK')}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Advance Deposit Deducted:</span>
              <span>- Rs. {advanceDeducted.toLocaleString('en-PK')}</span>
            </div>
            <div className="pt-2 border-t border-zinc-200 flex justify-between text-base font-black text-[#18181B]">
              <span>NET PAYABLE BALANCE:</span>
              <span className="text-[#E63946]">Rs. {netPayable.toLocaleString('en-PK')}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-3 rounded-2xl bg-zinc-100 flex items-center justify-between">
            <span className="font-bold text-zinc-600 text-[11px]">Settlement Tender:</span>
            <div className="flex items-center gap-2">
              {(['Cash', 'Credit Card', 'BTC Company'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer ${
                    paymentMethod === method
                      ? 'bg-[#18181B] text-white shadow-xs'
                      : 'bg-white text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-5 border-t border-zinc-200 bg-white flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-2xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <Printer className="w-4 h-4 text-[#E63946]" />
            <span>Print Official Guest Folio</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-zinc-500 hover:bg-zinc-100 font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSettle}
              className="px-5 py-2.5 rounded-2xl btn-luxury-red font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
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
