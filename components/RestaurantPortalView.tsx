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
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Flame,
  ChefHat,
  DoorOpen,
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

  const deleteFromCart = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in-up">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold shadow-xs">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-[#18181B] tracking-tight">
                  Lazzati Restaurant &amp; Room Service POS
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold uppercase">
                  Dining &amp; Kitchen
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Pakistan Club Inn Hotel Sukkur &bull; Table Orders, Room Service &amp; KOT Printer
              </p>
            </div>
          </div>
        </div>

        {/* Quick Sales Snapshot */}
        <div className="flex items-center gap-4 bg-zinc-50 border border-zinc-200/90 px-4 py-2.5 rounded-2xl text-xs">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-bold">Today's Restaurant Sales</div>
            <div className="text-sm font-black text-[#18181B] font-mono">
              Rs. {todayRestaurantSales.toLocaleString('en-PK')}
            </div>
          </div>
          <div className="pl-4 border-l border-zinc-200">
            <div className="text-[10px] text-zinc-400 uppercase font-bold">Kitchen Orders</div>
            <div className="text-sm font-black text-[#E63946]">{orders.length} Active</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 select-none overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('pos')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'pos'
              ? 'bg-[#18181B] text-white shadow-md'
              : 'bg-white text-zinc-600 border border-zinc-200/90 hover:bg-zinc-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Point of Sale (POS Terminal)</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#18181B] text-white shadow-md'
              : 'bg-white text-zinc-600 border border-zinc-200/90 hover:bg-zinc-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Kitchen Tickets (KOT)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FFF1F2] text-[#E63946] font-extrabold">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-[#18181B] text-white shadow-md'
              : 'bg-white text-zinc-600 border border-zinc-200/90 hover:bg-zinc-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Kitchen Raw Stock Inventory</span>
        </button>
      </div>

      {/* VIEW 1: POS TERMINAL */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Menu Items (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search & Categories */}
            <div className="bg-white rounded-3xl p-5 border border-zinc-200/90 shadow-sm space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes (Karahi, Biryani, BBQ Tikka, Naan)..."
                  className="w-full px-4 py-2.5 pl-10 rounded-2xl text-xs border border-zinc-300 bg-white text-zinc-900 outline-none focus:border-amber-500"
                />
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === c
                        ? 'bg-[#18181B] text-white shadow-sm'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  onClick={() => addToCart(item.id)}
                  className="bg-white p-4 rounded-3xl border border-zinc-200/90 shadow-sm hover:border-amber-400 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                        item.category.includes('Karahi') || item.category.includes('BBQ')
                          ? 'bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/20'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {item.category}
                      </span>
                      {(item.category.includes('Karahi') || item.category.includes('BBQ')) && (
                        <Flame className="w-3.5 h-3.5 text-[#E63946]" />
                      )}
                    </div>
                    <div className="font-extrabold text-xs text-[#18181B] mt-1.5 leading-snug">
                      {item.name}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
                    <span className="font-black text-[#18181B] font-mono text-sm">
                      Rs. {item.price}
                    </span>
                    <button className="w-7 h-7 rounded-xl bg-zinc-100 group-hover:bg-amber-600 group-hover:text-white text-zinc-700 font-black flex items-center justify-center text-xs transition">
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Billing Sidebar (1 col) */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-[#E63946]" />
                  <h3 className="font-black text-sm text-[#18181B]">Active Food Order</h3>
                </div>
                <span className="text-[11px] font-bold text-zinc-400">
                  {Object.keys(cart).length} item(s)
                </span>
              </div>

              {/* Order Type Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-2xl mb-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setOrderType('Dine-In Table')}
                  className={`py-2 px-2.5 rounded-xl transition cursor-pointer text-center ${
                    orderType === 'Dine-In Table'
                      ? 'bg-white text-[#18181B] shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  Dine-In Table
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('Room Service Delivery')}
                  className={`py-2 px-2.5 rounded-xl transition cursor-pointer text-center ${
                    orderType === 'Room Service Delivery'
                      ? 'bg-[#E63946] text-white shadow-xs font-black'
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  Room Delivery
                </button>
              </div>

              {/* Table or Room Selection */}
              {orderType === 'Dine-In Table' ? (
                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                    Select Dining Table
                  </label>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-300 bg-white font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <option key={num} value={`Table #${num}`}>Table #{num}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="mb-4 p-3 rounded-2xl bg-[#FFF1F2] border border-[#E63946]/20">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#E63946] uppercase mb-1">
                    <DoorOpen className="w-3.5 h-3.5" />
                    <span>Deliver to In-House Hotel Room:</span>
                  </div>
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-[#E63946]/30 bg-white font-bold text-[#18181B]"
                  >
                    {inHouseRooms.filter(r => r.status === 'occupied').map((r) => (
                      <option key={r.id} value={r.roomNumber}>
                        Room {r.roomNumber} - {r.currentGuest?.name || 'Occupied Guest'}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-zinc-500 block mt-1">
                    Charges will automatically link to Guest Room Folio!
                  </span>
                </div>
              )}

              {/* Cart Items List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {Object.keys(cart).length === 0 ? (
                  <div className="py-8 text-center text-zinc-400 text-xs">
                    Cart is empty. Click any dish to add.
                  </div>
                ) : (
                  Object.entries(cart).map(([itemId, qty]) => {
                    const item = menuItems.find((m) => m.id === itemId);
                    if (!item) return null;
                    return (
                      <div
                        key={itemId}
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs"
                      >
                        <div className="flex-1 mr-2">
                          <div className="font-bold text-[#18181B] truncate">{item.name}</div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            Rs. {item.price} each
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-zinc-300 rounded-xl bg-white overflow-hidden">
                            <button
                              onClick={() => removeFromCart(itemId)}
                              className="px-2 py-1 text-zinc-600 hover:bg-zinc-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-black">{qty}</span>
                            <button
                              onClick={() => addToCart(itemId)}
                              className="px-2 py-1 text-zinc-600 hover:bg-zinc-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => deleteFromCart(itemId)}
                            className="p-1 text-zinc-400 hover:text-[#E63946] transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Total and Order Action */}
            <div className="pt-4 border-t border-zinc-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Subtotal Food Items:</span>
                <span className="font-mono font-bold">Rs. {cartTotal.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-[#18181B]">
                <span>Total Amount Payable:</span>
                <span className="font-mono text-base text-[#E63946]">
                  Rs. {cartTotal.toLocaleString('en-PK')}
                </span>
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={Object.keys(cart).length === 0}
                className="w-full py-3.5 rounded-2xl btn-luxury-red font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-40"
              >
                <span>SEND KOT ORDER TO KITCHEN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: KITCHEN TICKETS (KOT) */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white p-5 rounded-3xl border border-zinc-200/90 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <div>
                    <span className="font-black text-sm text-[#18181B] font-mono">{ord.orderNumber}</span>
                    <span className="text-[10px] text-zinc-400 block font-medium">{ord.time}</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'Billed'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/20'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                <div className="text-xs">
                  <div className="font-extrabold text-[#18181B]">{ord.tableOrRoom}</div>
                  <div className="text-[11px] text-zinc-400">{ord.guestName}</div>
                </div>

                {/* Items */}
                <div className="bg-zinc-50 p-3 rounded-2xl space-y-1.5 text-xs">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-zinc-700">
                      <span>{it.qty}x {it.name}</span>
                      <span className="font-mono font-bold">Rs. {it.price * it.qty}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-zinc-200/80 flex justify-between font-black text-[#18181B]">
                    <span>Total Bill:</span>
                    <span className="font-mono text-[#E63946]">Rs. {ord.totalAmount.toLocaleString('en-PK')}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {ord.status === 'Preparing' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Delivered')}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Mark as Delivered to Table/Room
                    </button>
                  )}
                  {ord.status === 'Delivered' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Billed')}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Mark as Billed &amp; Settled
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-[#18181B]">
                Restaurant Kitchen Raw Stock &amp; Inventory
              </h2>
              <p className="text-xs text-zinc-400">
                Track ingredients, spices, poultry, and store inventory for daily food prep
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Item Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5 font-mono">Current Stock</th>
                  <th className="p-3.5 font-mono">Reorder Level</th>
                  <th className="p-3.5 font-mono">Cost / Unit</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {inventoryItems.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-50 transition">
                    <td className="p-3.5 font-black text-[#18181B]">{inv.name}</td>
                    <td className="p-3.5 text-zinc-600">{inv.category}</td>
                    <td className="p-3.5 font-mono font-bold text-[#18181B]">
                      {inv.currentStock} {inv.unit}
                    </td>
                    <td className="p-3.5 font-mono text-zinc-400">
                      {inv.reorderLevel} {inv.unit}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-zinc-800">
                      Rs. {inv.unitPrice}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          inv.currentStock <= inv.reorderLevel
                            ? 'bg-[#FFF1F2] text-[#E63946] border border-[#E63946]/25'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {inv.currentStock <= inv.reorderLevel ? 'Reorder Needed' : 'Adequate'}
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
