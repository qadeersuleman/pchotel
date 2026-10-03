'use client';

import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  Receipt,
  ShoppingBag,
  Search,
  Boxes,
} from 'lucide-react';
import { RestaurantOrder, RestaurantItem, Room, InventoryItem } from '../types/hotel';

interface RestaurantPortalViewProps {
  orders: RestaurantOrder[];
  menuItems: RestaurantItem[];
  inventoryItems: InventoryItem[];
  inHouseRooms: Room[];
  onPlaceOrder: (order: RestaurantOrder) => void;
  onUpdateOrderStatus: (orderId: string, status: RestaurantOrder['status']) => void;
}

export default function RestaurantPortalView({
  orders,
  menuItems,
  inventoryItems,
  inHouseRooms,
  onPlaceOrder,
  onUpdateOrderStatus,
}: RestaurantPortalViewProps) {
  const [activeTab, setActiveTab] = useState<'pos' | 'orders' | 'inventory'>('pos');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // POS State
  const [orderType, setOrderType] = useState<RestaurantOrder['orderType']>('Dine-In Table');
  const [selectedTable, setSelectedTable] = useState('Table #1');
  const [selectedRoom, setSelectedRoom] = useState(inHouseRooms[0]?.roomNumber || '101');
  const [guestName, setGuestName] = useState('Walk-in Guest');
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [paymentChoice, setPaymentChoice] = useState<'Cash Settled' | 'Billed to Room Folio' | 'Card Settled'>('Cash Settled');

  const categories = ['All', 'Karahi & Handi', 'BBQ', 'Rice & Biryani', 'Fast Food', 'Tandoor', 'Beverages'];

  const filteredMenu = menuItems.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id]--;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuItems.find((m) => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleCreateOrder = () => {
    if (Object.keys(cart).length === 0) return;

    const items = Object.entries(cart).map(([id, qty]) => {
      const item = menuItems.find((m) => m.id === id)!;
      return { name: item.name, qty, price: item.price };
    });

    const destination = orderType === 'Room Service Delivery' ? `Room ${selectedRoom}` : selectedTable;
    const targetGuest = orderType === 'Room Service Delivery'
      ? inHouseRooms.find(r => r.roomNumber === selectedRoom)?.currentGuest?.name || 'In-House Guest'
      : guestName;

    const newOrder: RestaurantOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `LAZ-${Math.floor(880 + Math.random() * 119)}`,
      orderType,
      tableOrRoom: destination,
      roomNumber: orderType === 'Room Service Delivery' ? selectedRoom : undefined,
      guestName: targetGuest,
      items,
      totalAmount: cartTotal,
      status: 'Preparing',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      paymentStatus: orderType === 'Room Service Delivery' ? 'Billed to Room Folio' : paymentChoice,
    };

    onPlaceOrder(newOrder);
    setCart({});
  };

  const todayRestaurantSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-10">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800">
              Lazzati Restaurant &amp; Room Service POS
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">
              Pakistan Club Inn
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Table Dining, Takeaway, Room Service Orders &amp; Kitchen Inventory
          </p>
        </div>

        {/* Quick Sales Snapshot */}
        <div className="flex items-center gap-3 bg-amber-50/60 border border-amber-200/80 px-4 py-2 rounded-xl text-xs">
          <div>
            <div className="text-[10px] text-amber-600 uppercase font-bold">Today's Restaurant Sales</div>
            <div className="text-sm font-extrabold text-slate-900 font-mono">
              Rs. {todayRestaurantSales.toLocaleString('en-PK')}
            </div>
          </div>
          <div className="pl-3 border-l border-amber-200">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Active Orders</div>
            <div className="text-sm font-bold text-amber-700">{orders.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 select-none">
        <button
          onClick={() => setActiveTab('pos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'pos'
              ? 'bg-[#1e2229] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Point of Sale (POS Terminal)</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-[#1e2229] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Kitchen Tickets (KOT) ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'inventory'
              ? 'bg-[#1e2229] text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Kitchen Raw Stock Inventory</span>
        </button>
      </div>

      {/* VIEW 1: POS TERMINAL */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Menu Items (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search & Categories */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search food dish (e.g. Karahi, Biryani, Naan)..."
                  className="w-full px-3.5 py-2 pl-9 rounded-xl text-xs border border-slate-300 outline-none"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === c
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  onClick={() => addToCart(item.id)}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      item.category.includes('Karahi') || item.category.includes('BBQ')
                        ? 'bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/20'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {item.category}
                    </span>
                    <div className="font-bold text-xs text-slate-800 mt-1.5">{item.name}</div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <span className="font-extrabold text-slate-900 font-mono text-xs">
                      Rs. {item.price}
                    </span>
                    <button className="w-6 h-6 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold flex items-center justify-center text-xs">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Billing Sidebar (1 col) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  New Order Invoice
                </h3>
                <span className="text-[11px] text-slate-400">Pakistan Club Inn</span>
              </div>

              {/* Order Type Toggle */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl my-3 text-[11px] font-semibold text-center">
                {(['Dine-In Table', 'Room Service Delivery', 'Takeaway'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setOrderType(t)}
                    className={`py-1.5 rounded-lg transition cursor-pointer ${
                      orderType === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    {t === 'Dine-In Table' ? 'Table' : t === 'Room Service Delivery' ? 'Room' : 'Parcel'}
                  </button>
                ))}
              </div>

              {/* Destination selector */}
              {orderType === 'Dine-In Table' && (
                <div className="mb-3">
                  <label className="block text-[11px] text-slate-500 font-medium mb-1">Select Table #</label>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs outline-none"
                  >
                    <option value="Table #1">Table #1 (Main Hall)</option>
                    <option value="Table #2">Table #2 (Main Hall)</option>
                    <option value="Table #3">Table #3 (Family Corner)</option>
                    <option value="Table #4">Table #4 (Garden Lawn)</option>
                    <option value="Table #5 (VIP)">Table #5 (VIP Lounge)</option>
                  </select>
                </div>
              )}

              {orderType === 'Room Service Delivery' && (
                <div className="mb-3">
                  <label className="block text-[11px] text-slate-500 font-medium mb-1">
                    Select In-House Room (Auto Bill)
                  </label>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs outline-none font-bold text-sky-700"
                  >
                    {inHouseRooms.map((r) => (
                      <option key={r.id} value={r.roomNumber}>
                        Room {r.roomNumber} - {r.currentGuest?.name || 'In-House'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Cart Items List */}
              <div className="space-y-2 max-h-56 overflow-y-auto py-2 divide-y divide-slate-100 text-xs">
                {Object.keys(cart).length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <span>Click food dishes to add to order</span>
                  </div>
                ) : (
                  Object.entries(cart).map(([id, qty]) => {
                    const item = menuItems.find((m) => m.id === id)!;
                    return (
                      <div key={id} className="pt-2 flex items-center justify-between">
                        <div className="w-36 truncate">
                          <div className="font-semibold text-slate-800 truncate">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Rs. {item.price} each</div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => removeFromCart(id)}
                            className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs"
                          >
                            -
                          </button>
                          <span className="font-bold text-slate-800 font-mono w-4 text-center">{qty}</span>
                          <button
                            onClick={() => addToCart(id)}
                            className="w-5 h-5 rounded bg-amber-600 text-white font-bold flex items-center justify-center text-xs"
                          >
                            +
                          </button>
                        </div>

                        <div className="font-bold font-mono text-slate-900">
                          Rs. {item.price * qty}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Total & Checkout */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-600">Total Net Amount:</span>
                <span className="text-lg font-black text-amber-700 font-mono">
                  Rs. {cartTotal.toLocaleString('en-PK')}
                </span>
              </div>

              {orderType !== 'Room Service Delivery' && (
                <div className="flex gap-2 text-[11px]">
                  <button
                    onClick={() => setPaymentChoice('Cash Settled')}
                    className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                      paymentChoice === 'Cash Settled'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Cash Paid
                  </button>
                  <button
                    onClick={() => setPaymentChoice('Card Settled')}
                    className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                      paymentChoice === 'Card Settled'
                        ? 'border-sky-600 bg-sky-50 text-sky-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Card POS
                  </button>
                </div>
              )}

              <button
                onClick={handleCreateOrder}
                disabled={cartTotal === 0}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Print KOT &amp; Place Order</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: KITCHEN ORDER TICKETS (KOT) */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-amber-700 text-sm">{ord.orderNumber}</span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{ord.time}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 font-bold text-slate-800 text-xs mb-1">
                  <span>{ord.tableOrRoom}</span>
                  <span className="text-slate-400">&bull;</span>
                  <span>{ord.guestName}</span>
                </div>

                <div className="text-[10px] text-sky-700 font-semibold mb-3">
                  {ord.paymentStatus}
                </div>

                <div className="space-y-1 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  {ord.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-slate-700">
                      <span>{it.qty}x {it.name}</span>
                      <span className="font-mono text-slate-500">Rs. {it.price * it.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold font-mono text-slate-900 text-sm">
                  Rs. {ord.totalAmount.toLocaleString('en-PK')}
                </span>

                {ord.status === 'Preparing' ? (
                  <button
                    onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                    className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Mark Ready &amp; Deliver
                  </button>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    Delivered
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              Kitchen &amp; Raw Stock Inventory
            </h2>
            <button className="px-3 py-1.5 rounded-lg bg-sky-600 text-white font-bold text-xs cursor-pointer">
              + Add Stock Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Item Code</th>
                  <th className="p-3">Item Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Current Stock</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryItems.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-sky-700">{inv.code}</td>
                    <td className="p-3 font-bold text-slate-800">{inv.name}</td>
                    <td className="p-3 text-slate-500">{inv.category}</td>
                    <td className="p-3 font-mono font-bold">
                      {inv.currentStock} {inv.unit}
                    </td>
                    <td className="p-3 font-mono text-slate-700">Rs. {inv.unitPrice}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'In Stock'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
