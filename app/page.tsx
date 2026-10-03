'use client';

import React, { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen';
import LoginPortal from '../components/LoginPortal';
import TopNavbar from '../components/TopNavbar';
import LeftIconSidebar from '../components/LeftIconSidebar';
import MainHubDashboard from '../components/MainHubDashboard';
import HMSModuleView from '../components/HMSModuleView';
import RestaurantPortalView from '../components/RestaurantPortalView';
import AccountsModuleView from '../components/AccountsModuleView';
import PayrollModuleView from '../components/PayrollModuleView';
import CheckInModal from '../components/CheckInModal';
import CheckOutModal from '../components/CheckOutModal';

import {
  initialRooms,
  initialBookings,
  initialInvoices,
  initialBTCContracts,
  initialEventBookings,
  initialMenuItems,
  initialRestaurantOrders,
  initialInventoryItems,
  initialLedgerEntries,
  initialEmployees,
} from '../lib/mockData';
import {
  Room,
  Booking,
  HotelInvoice,
  BTCContract,
  EventBooking,
  RestaurantItem,
  RestaurantOrder,
  InventoryItem,
  AccountLedgerEntry,
  EmployeeSalary,
} from '../types/hotel';
import { CheckCircle2, Printer, X } from 'lucide-react';

export default function Home() {
  const [viewMode, setViewMode] = useState<'splash' | 'login' | 'app'>('splash');
  const [currentPortal, setCurrentPortal] = useState<'hotel' | 'restaurant'>('hotel');
  const [currentView, setCurrentView] = useState<string>('hub');
  const [username, setUsername] = useState<string>('rfjalbani');
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Core Data States
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [invoices, setInvoices] = useState<HotelInvoice[]>(initialInvoices);
  const [btcContracts, setBtcContracts] = useState<BTCContract[]>(initialBTCContracts);
  const [eventBookings, setEventBookings] = useState<EventBooking[]>(initialEventBookings);
  const [menuItems, setMenuItems] = useState<RestaurantItem[]>(initialMenuItems);
  const [restaurantOrders, setRestaurantOrders] = useState<RestaurantOrder[]>(initialRestaurantOrders);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [ledgerEntries, setLedgerEntries] = useState<AccountLedgerEntry[]>(initialLedgerEntries);
  const [employees, setEmployees] = useState<EmployeeSalary[]>(initialEmployees);

  // Modals
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [checkOutBooking, setCheckOutBooking] = useState<Booking | null>(null);
  const [inspectedInvoice, setInspectedInvoice] = useState<HotelInvoice | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLoginSuccess = (portal: 'hotel' | 'restaurant', user: string) => {
    setCurrentPortal(portal);
    setUsername(user);
    setCurrentView(portal === 'hotel' ? 'hub' : 'restaurant');
    setViewMode('app');
  };

  // Check-In handler
  const handleConfirmCheckIn = (newBookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const bookingId = `b-${Date.now()}`;
    const newBooking: Booking = {
      ...newBookingData,
      id: bookingId,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    // Auto generate Hotel Invoice with unique Invoice Number
    const invCount = invoices.length + 1;
    const invNumber = `PCI-INV-2026-${String(invCount).padStart(3, '0')}`;
    const newInvoice: HotelInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      bookingNumber: newBookingData.bookingNumber,
      guestName: newBookingData.guestName,
      cnic: newBookingData.cnic,
      phone: newBookingData.phone,
      roomNumber: newBookingData.roomNumber,
      roomType: newBookingData.roomType,
      checkInDate: newBookingData.checkInDate,
      checkOutDate: newBookingData.checkOutDate,
      nights: newBookingData.nights,
      roomCharges: newBookingData.totalAmount,
      restaurantCharges: 0,
      serviceCharges: 0,
      taxAmount: 0,
      totalAmount: newBookingData.totalAmount,
      advancePaid: newBookingData.advancePaid,
      netPayable: newBookingData.remainingBalance,
      status: newBookingData.remainingBalance === 0 ? 'Paid' : 'Partial',
      paymentMethod: newBookingData.paymentMethod,
      dateGenerated: newBookingData.checkInDate,
    };

    // Update rooms
    setRooms((prev) =>
      prev.map((r) =>
        r.roomNumber === newBookingData.roomNumber
          ? {
              ...r,
              status: 'occupied',
              currentGuest: {
                id: `g-${Date.now()}`,
                name: newBookingData.guestName,
                phone: newBookingData.phone,
                cnic: newBookingData.cnic,
                checkInDate: newBookingData.checkInDate,
                checkOutDate: newBookingData.checkOutDate,
                advancePaid: newBookingData.advancePaid,
                totalBill: newBookingData.totalAmount,
              },
            }
          : r
      )
    );

    setBookings((prev) => [newBooking, ...prev]);
    setInvoices((prev) => [newInvoice, ...prev]);
    setIsCheckInOpen(false);
    showToast(`Room ${newBookingData.roomNumber} checked in! Generated Invoice ${invNumber}`);
  };

  // Check-Out handler
  const handleConfirmCheckOut = (bookingId: string, finalPayment: number) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Checked-Out', remainingBalance: 0 } : b))
    );

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.bookingNumber === target.bookingNumber
          ? {
              ...inv,
              status: 'Paid',
              advancePaid: inv.advancePaid + finalPayment,
              netPayable: 0,
            }
          : inv
      )
    );

    setRooms((prev) =>
      prev.map((r) =>
        r.roomNumber === target.roomNumber
          ? { ...r, status: 'cleaning', currentGuest: undefined }
          : r
      )
    );

    setCheckOutBooking(null);
    showToast(`Room ${target.roomNumber} checked out and settled!`);
  };

  // Restaurant Order
  const handlePlaceRestaurantOrder = (order: RestaurantOrder) => {
    setRestaurantOrders((prev) => [order, ...prev]);

    // If order was billed to room folio, update corresponding invoice & booking
    if (order.orderType === 'Room Service Delivery') {
      const roomNum = order.tableOrRoom.replace('Room ', '').trim();
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.roomNumber === roomNum && inv.status !== 'Paid') {
            const updatedTotal = inv.totalAmount + order.totalAmount;
            return {
              ...inv,
              restaurantCharges: inv.restaurantCharges + order.totalAmount,
              totalAmount: updatedTotal,
              netPayable: updatedTotal - inv.advancePaid,
            };
          }
          return inv;
        })
      );
    }

    showToast(`Order #${order.orderNumber} placed (${order.paymentStatus})`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: RestaurantOrder['status']) => {
    setRestaurantOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order updated to ${status}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B] flex flex-col font-sans select-none">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white font-semibold text-xs shadow-2xl animate-bounce border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Splash Mode */}
      {viewMode === 'splash' && (
        <SplashScreen onComplete={() => setViewMode('login')} />
      )}

      {/* 2. Login Mode */}
      {viewMode === 'login' && (
        <LoginPortal
          onLoginSuccess={handleLoginSuccess}
          onReplaySplash={() => setViewMode('splash')}
          isDarkTheme={isDarkTheme}
          onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
        />
      )}

      {/* 3. Main Application Canvas */}
      {viewMode === 'app' && (
        <div className="min-h-screen flex flex-col">
          {/* Top Bar matching Screenshot 1 */}
          <TopNavbar
            currentPortal={currentPortal}
            onSwitchPortal={(portal: 'hotel' | 'restaurant') => {
              setCurrentPortal(portal);
              setCurrentView(portal === 'hotel' ? 'hub' : 'restaurant');
            }}
            onToggleSidebar={() => {}}
            onLogout={() => setViewMode('login')}
            username={username}
          />

          <div className="flex-1 flex overflow-hidden">
            {/* Left Narrow Icon Sidebar matching Screenshot 1, 2, 3, 4, 5 */}
            <LeftIconSidebar
              currentView={currentView}
              onSelectView={(v: string) => {
                setCurrentView(v);
                if (v.startsWith('inv-') || v === 'inventory') {
                  setCurrentPortal('restaurant');
                } else {
                  setCurrentPortal('hotel');
                }
              }}
            />

            {/* Main Workspace Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* Hotel Portal Active */}
              {currentPortal === 'hotel' && (
                <>
                  {/* View: Hub / Dashboard (Exact Screenshot 1 & 2) */}
                  {currentView === 'hub' && (
                    <MainHubDashboard
                      username={username}
                      onOpenModule={(mod: string) => {
                        if (mod === 'inventory') {
                          setCurrentPortal('restaurant');
                          setCurrentView('restaurant');
                        } else if (mod === 'accounts') {
                          setCurrentView('acc-dashboard');
                        } else if (mod === 'payroll') {
                          setCurrentView('pay-salaries');
                        } else {
                          setCurrentView('hms-invoice');
                        }
                      }}
                    />
                  )}

                  {/* View: HMS (Screenshots 4 - Invoices, Bookings, Rooms, BTC, Events) */}
                  {(currentView === 'hms' || currentView.startsWith('hms-')) && (
                    <HMSModuleView
                      initialSubTab={
                        currentView === 'hms-booking'
                          ? 'bookings'
                          : currentView === 'hms-rooms'
                          ? 'rooms'
                          : currentView === 'hms-room-category'
                          ? 'categories'
                          : currentView === 'hms-btc'
                          ? 'btc'
                          : currentView === 'hms-events'
                          ? 'events'
                          : 'invoices'
                      }
                      invoices={invoices}
                      bookings={bookings}
                      rooms={rooms}
                      btcContracts={btcContracts}
                      eventBookings={eventBookings}
                      onOpenCheckIn={() => setIsCheckInOpen(true)}
                      onOpenCheckOut={(b: Booking) => setCheckOutBooking(b)}
                      onViewInvoiceDetails={(inv: HotelInvoice) => setInspectedInvoice(inv)}
                    />
                  )}

                  {/* View: Accounts (Screenshot 3) */}
                  {(currentView === 'accounts' || currentView.startsWith('acc-')) && (
                    <AccountsModuleView entries={ledgerEntries} />
                  )}

                  {/* View: Payroll (Screenshot 5) */}
                  {(currentView === 'payroll' || currentView.startsWith('pay-')) && (
                    <PayrollModuleView employees={employees} />
                  )}
                </>
              )}

              {/* Restaurant Portal Active */}
              {currentPortal === 'restaurant' && (
                <RestaurantPortalView
                  orders={restaurantOrders}
                  menuItems={menuItems}
                  inventoryItems={inventoryItems}
                  inHouseRooms={rooms.filter((r) => r.status === 'occupied')}
                  onPlaceOrder={handlePlaceRestaurantOrder}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Check-In Modal */}
      {isCheckInOpen && (
        <CheckInModal
          rooms={rooms}
          onClose={() => setIsCheckInOpen(false)}
          onConfirmCheckIn={handleConfirmCheckIn}
          isDarkTheme={false}
        />
      )}

      {/* Check-Out Modal */}
      {checkOutBooking && (
        <CheckOutModal
          booking={checkOutBooking}
          restaurantOrders={restaurantOrders}
          onClose={() => setCheckOutBooking(null)}
          onConfirmCheckOut={handleConfirmCheckOut}
          isDarkTheme={false}
        />
      )}

      {/* Detailed Invoice View & Print Modal */}
      {inspectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <span className="font-extrabold text-sm text-sky-700">
                INVOICE #{inspectedInvoice.invoiceNumber}
              </span>
              <button
                onClick={() => setInspectedInvoice(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Letterhead */}
            <div className="text-center py-2 border-b border-slate-100">
              <h2 className="text-base font-extrabold uppercase text-slate-900 tracking-wider">
                PAKISTAN CLUB INN HOTEL
              </h2>
              <p className="text-[11px] text-slate-500">
                City Bypass Road, Sukkur &bull; Tel: 071-5806409 / +92 300 7555850
              </p>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Date: {inspectedInvoice.dateGenerated} &bull; Booking Ref: {inspectedInvoice.bookingNumber}
              </div>
            </div>

            {/* Guest & Room Details */}
            <div className="grid grid-cols-2 gap-3 py-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Guest</span>
                <div className="font-bold text-slate-800 text-sm">{inspectedInvoice.guestName}</div>
                <div className="text-[11px] text-slate-500 font-mono">{inspectedInvoice.cnic}</div>
                <div className="text-[11px] text-slate-500">{inspectedInvoice.phone}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Room Allotment</span>
                <div className="font-bold text-sky-700 text-sm">Room {inspectedInvoice.roomNumber}</div>
                <div className="text-[11px] text-slate-500">{inspectedInvoice.roomType}</div>
                <div className="text-[10px] text-slate-400">
                  {inspectedInvoice.nights} Night(s) Stay
                </div>
              </div>
            </div>

            {/* Financial Line Items */}
            <div className="py-3 space-y-2 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Room Charges:</span>
                <span>Rs. {inspectedInvoice.roomCharges.toLocaleString('en-PK')}</span>
              </div>
              {inspectedInvoice.restaurantCharges > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Lazzati Restaurant Food:</span>
                  <span>Rs. {inspectedInvoice.restaurantCharges.toLocaleString('en-PK')}</span>
                </div>
              )}
              {inspectedInvoice.serviceCharges > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Service / Laundry Charges:</span>
                  <span>Rs. {inspectedInvoice.serviceCharges.toLocaleString('en-PK')}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Gross Amount:</span>
                <span>Rs. {inspectedInvoice.totalAmount.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Advance Paid ({inspectedInvoice.paymentMethod}):</span>
                <span>- Rs. {inspectedInvoice.advancePaid.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between font-black text-amber-700 text-sm pt-2 border-t border-slate-200">
                <span>Net Balance Payable:</span>
                <span>Rs. {inspectedInvoice.netPayable.toLocaleString('en-PK')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-sky-600" />
                <span>Print Official Receipt</span>
              </button>

              <button
                onClick={() => setInspectedInvoice(null)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
