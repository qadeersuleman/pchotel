'use client';

import React, { useState } from 'react';
import { UtensilsCrossed, Plus, Clock, CheckCircle2, ShoppingBag, AlertCircle } from 'lucide-react';
import { RestaurantOrder, Room } from '../types/hotel';

interface RestaurantOrdersProps {
  orders: RestaurantOrder[];
  rooms: Room[];
  onAddOrder: (newOrder: RestaurantOrder) => void;
  onUpdateOrderStatus: (orderId: string, status: RestaurantOrder['status']) => void;
  isDarkTheme: boolean;
}

export default function RestaurantOrders({
  orders,
  rooms,
  onAddOrder,
  onUpdateOrderStatus,
  isDarkTheme,
}: RestaurantOrdersProps) {
  // Occupied rooms that can order food
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied');

  const menuItems = [
    { id: 'm1', name: 'Special Chicken Karahi (Full)', price: 2200, category: 'Main Course' },
    { id: 'm2', name: 'Mutton Champ Masala (Plate)', price: 2800, category: 'Main Course' },
    { id: 'm3', name: 'Special Chicken Biryani', price: 650, category: 'Rice' },
    { id: 'm4', name: 'Chicken Seekh Kabab (4 Pcs)', price: 1100, category: 'BBQ' },
    { id: 'm5', name: 'Roghni Naan', price: 80, category: 'Tandoor' },
    { id: 'm6', name: 'Garlic Naan', price: 120, category: 'Tandoor' },
    { id: 'm7', name: 'Fresh Salad & Raita', price: 180, category: 'Sides' },
    { id: 'm8', name: 'Kashmiri Chai (Special)', price: 250, category: 'Beverages' },
    { id: 'm9', name: 'Mineral Water (Large 1.5L)', price: 150, category: 'Beverages' },
    { id: 'm10', name: 'Cold Drink Can', price: 120, category: 'Beverages' },
  ];

  const [selectedRoomNumber, setSelectedRoomNumber] = useState(occupiedRooms[0]?.roomNumber || '101');
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [showOrderModal, setShowOrderModal] = useState(false);

  const targetRoom = rooms.find((r) => r.roomNumber === selectedRoomNumber);
  const guestName = targetRoom?.currentGuest?.name || 'In-House Guest';

  const addToCart = (itemId: string) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[itemId] > 1) {
        next[itemId]--;
      } else {
        delete next[itemId];
      }
      return next;
    });
  };

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find((m) => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handlePlaceOrder = () => {
    if (Object.keys(cart).length === 0) return;

    const items = Object.entries(cart).map(([id, qty]) => {
      const item = menuItems.find((m) => m.id === id)!;
      return { name: item.name, qty, price: item.price };
    });

    const newOrder: RestaurantOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `LAZ-${Math.floor(800 + Math.random() * 199)}`,
      orderType: 'Room Service Delivery',
      tableOrRoom: `Room ${selectedRoomNumber}`,
      roomNumber: selectedRoomNumber,
      guestName,
      items,
      totalAmount: cartTotal,
      status: 'Preparing',
      time: new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
      paymentStatus: 'Billed to Room Folio',
    };

    onAddOrder(newOrder);
    setCart({});
    setShowOrderModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDarkTheme ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Lazzati Restaurant &amp; Room Service</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Kitchen Desk
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pakistan Club Inn Hotel &bull; Direct Food Billing to Guest Room Folio
          </p>
        </div>

        <button
          onClick={() => setShowOrderModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Room Service Order</span>
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className={`p-4 rounded-2xl border flex flex-col justify-between ${
              isDarkTheme ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm text-sky-400">
                  Room {ord.roomNumber}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{ord.time}</span>
                </span>
              </div>

              <div className="text-xs font-bold text-slate-200 mb-2">
                {ord.guestName} &bull; <span className="font-mono text-amber-400">#{ord.orderNumber}</span>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs mb-3">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300">
                    <span>{item.qty}x {item.name}</span>
                    <span className="text-slate-400 font-mono">Rs. {item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Bill</div>
                <div className="text-sm font-extrabold text-amber-400 font-mono">
                  Rs. {ord.totalAmount.toLocaleString('en-PK')}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {ord.status === 'Preparing' ? (
                  <button
                    onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-[11px] transition cursor-pointer"
                  >
                    Mark Delivered
                  </button>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Delivered</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto ${
            isDarkTheme ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold">New Food &amp; Beverage Order</h3>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            {/* Room Selector */}
            <div className="mb-4">
              <label className="block text-xs text-slate-400 font-semibold mb-1">
                Select In-House Room to Bill
              </label>
              <select
                value={selectedRoomNumber}
                onChange={(e) => setSelectedRoomNumber(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none font-bold ${
                  isDarkTheme ? 'bg-slate-950 border-slate-800 text-sky-400' : 'bg-slate-50 border-slate-300'
                }`}
              >
                {occupiedRooms.map((r) => (
                  <option key={r.id} value={r.roomNumber}>
                    Room {r.roomNumber} - {r.currentGuest?.name} ({r.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Menu Item Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              {menuItems.map((item) => {
                const count = cart[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{item.name}</div>
                      <div className="text-amber-400 font-mono text-[11px]">Rs. {item.price}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {count > 0 && (
                        <>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-6 h-6 rounded bg-slate-700 text-white font-bold flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="font-bold text-sky-400 font-mono">{count}</span>
                        </>
                      )}
                      <button
                        onClick={() => addToCart(item.id)}
                        className="w-6 h-6 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs font-mono mb-4">
              <span className="text-slate-400">Order Subtotal:</span>
              <span className="text-base font-bold text-amber-400">Rs. {cartTotal.toLocaleString('en-PK')}</span>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={cartTotal === 0}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 transition cursor-pointer"
              >
                Send to Kitchen &amp; Bill Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
