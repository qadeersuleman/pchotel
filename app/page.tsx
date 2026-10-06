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
import { dummyDb } from '../lib/dummyDb';
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
  RestaurantVoucher,
  VoucherType,
} from '../types/hotel';
import { CheckCircle2, Printer, X, Sparkles } from 'lucide-react';

export default function Home() {
  const [viewMode, setViewMode] = useState<'splash' | 'login' | 'app'>('splash');
  const [currentPortal, setCurrentPortal] = useState<'hotel' | 'restaurant'>('restaurant');
  const [currentView, setCurrentView] = useState<string>('restaurant');
  const [username, setUsername] = useState<string>('Chef Ghulam Rasool');
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
  const [restaurantVouchers, setRestaurantVouchers] = useState<RestaurantVoucher[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<AccountLedgerEntry[]>(initialLedgerEntries);
  const [employees, setEmployees] = useState<EmployeeSalary[]>(initialEmployees);

  // Load persistent dummy DB state on client mount
  useEffect(() => {
    const dbState = dummyDb.loadState();
    if (dbState.vouchers) setRestaurantVouchers(dbState.vouchers);
    if (dbState.orders) setRestaurantOrders(dbState.orders);
    if (dbState.inventoryItems) setInventoryItems(dbState.inventoryItems);
    if (dbState.menuItems) setMenuItems(dbState.menuItems);
  }, []);


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
      taxAmount: 0,
      roomCharges: newBookingData.totalAmount,
      restaurantCharges: 0,
      serviceCharges: 0,
      totalAmount: newBookingData.totalAmount,
      advancePaid: newBookingData.advancePaid,
      netPayable: newBookingData.remainingBalance,
      status: newBookingData.remainingBalance === 0 ? 'Paid' : newBookingData.advancePaid > 0 ? 'Partial' : 'Unpaid',
      dateGenerated: new Date().toISOString().replace('T', ' ').slice(0, 16),
      paymentMethod: newBookingData.paymentMethod,
    };

    // Update Room status to occupied
    setRooms((prev) =>
      prev.map((r) =>
        r.roomNumber === newBookingData.roomNumber
          ? {
              ...r,
              status: 'occupied' as const,
              currentGuest: {
                id: `guest-${Date.now()}`,
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

    // Record ledger advance entry
    if (newBookingData.advancePaid > 0) {
      const jvNumber = `JV-2026-${String(ledgerEntries.length + 1).padStart(3, '0')}`;
      const newLedger: AccountLedgerEntry = {
        id: `jv-${Date.now()}`,
        voucherNumber: jvNumber,
        date: new Date().toISOString().slice(0, 10),
        accountTitle: `Advance Deposit Room ${newBookingData.roomNumber}`,
        accountType: 'Cash in Hand',
        description: `Advance received from ${newBookingData.guestName} (${newBookingData.paymentMethod})`,
        debit: newBookingData.advancePaid,
        credit: 0,
      };
      setLedgerEntries((prev) => [newLedger, ...prev]);
    }

    setIsCheckInOpen(false);
    showToast(`Check-In Successful! Invoice ${invNumber} generated for Room ${newBookingData.roomNumber}.`);
  };

  // Check-Out handler
  const handleConfirmCheckOut = (bookingId: string, finalPayment: number) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    // Update room to available
    setRooms((prev) =>
      prev.map((r) =>
        r.roomNumber === booking.roomNumber
          ? { ...r, status: 'available', currentGuest: undefined }
          : r
      )
    );

    // Update booking status
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'Checked-Out', remainingBalance: 0 }
          : b
      )
    );

    // Update or mark invoice paid
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.bookingNumber === booking.bookingNumber
          ? {
              ...inv,
              status: 'Paid',
              advancePaid: inv.totalAmount,
              netPayable: 0,
            }
          : inv
      )
    );

    // Add final payment ledger entry
    if (finalPayment > 0) {
      const jvNumber = `JV-2026-${String(ledgerEntries.length + 1).padStart(3, '0')}`;
      const newLedger: AccountLedgerEntry = {
        id: `jv-${Date.now()}`,
        voucherNumber: jvNumber,
        date: new Date().toISOString().slice(0, 10),
        accountTitle: `Folio Settlement Room ${booking.roomNumber}`,
        accountType: 'Room Sales Revenue',
        description: `Final checkout bill settled by ${booking.guestName}`,
        debit: finalPayment,
        credit: 0,
      };
      setLedgerEntries((prev) => [newLedger, ...prev]);
    }

    setCheckOutBooking(null);
    showToast(`Room ${booking.roomNumber} checkout completed! Bill settled & room marked available.`);
  };

  // Restaurant Order Placement (Dummy DB Synced)
  const handlePlaceRestaurantOrder = (order: RestaurantOrder) => {
    dummyDb.addOrder(order);
    setRestaurantOrders((prev) => [order, ...prev]);

    // If order was billed to room folio, update corresponding invoice & booking
    if (order.roomNumber && order.paymentStatus === 'Billed to Room Folio') {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.roomNumber === order.roomNumber && inv.status !== 'Paid'
            ? {
                ...inv,
                restaurantCharges: inv.restaurantCharges + order.totalAmount,
                totalAmount: inv.totalAmount + order.totalAmount,
                netPayable: inv.netPayable + order.totalAmount,
              }
            : inv
        )
      );

      setBookings((prev) =>
        prev.map((b) =>
          b.roomNumber === order.roomNumber && b.status === 'Checked-In'
            ? {
                ...b,
                totalAmount: b.totalAmount + order.totalAmount,
                remainingBalance: b.remainingBalance + order.totalAmount,
              }
            : b
        )
      );
    }

    showToast(`Order ${order.orderNumber} saved to Dummy DB! (${order.tableOrRoom})`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: RestaurantOrder['status']) => {
    dummyDb.updateOrderStatus(orderId, status);
    setRestaurantOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order status updated to "${status}" & saved.`);
  };

  // Restaurant Voucher Handlers (Dummy DB Backed)
  const handleAddRestaurantVoucher = (
    voucherData: Omit<RestaurantVoucher, 'id' | 'voucherNumber'> & { customVoucherNumber?: string }
  ) => {
    const newV = dummyDb.addVoucher(voucherData);
    setRestaurantVouchers((prev) => [newV, ...prev]);
    showToast(`${newV.voucherType} #${newV.voucherNumber} created & saved to Dummy DB!`);
  };

  const handleDeleteRestaurantVoucher = (id: string) => {
    dummyDb.deleteVoucher(id);
    setRestaurantVouchers((prev) => prev.filter((v) => v.id !== id));
    showToast('Voucher removed from Dummy DB.');
  };

  const handleImportRestaurantVouchers = (
    incoming: Array<Partial<RestaurantVoucher> & { voucherType: VoucherType; amount: number; narration: string }>
  ) => {
    const { count, imported } = dummyDb.importVouchers(incoming);
    setRestaurantVouchers((prev) => [...imported, ...prev]);
    showToast(`Successfully imported ${count} vouchers into Dummy DB!`);
  };

  const handleAutoSyncRestaurantOrders = () => {
    const { newCrvCount, newJvCount } = dummyDb.autoSyncOrdersToVouchers(restaurantOrders);
    if (newCrvCount === 0 && newJvCount === 0) {
      showToast('All active POS orders are already recorded as vouchers in Dummy DB.');
    } else {
      setRestaurantVouchers(dummyDb.getVouchers());
      showToast(`Auto-Sync complete: ${newCrvCount} CRV (Cash) & ${newJvCount} JV (Room Folio) generated!`);
    }
  };

  const handleResetRestaurantDb = () => {
    const fresh = dummyDb.resetToDefault();
    setRestaurantVouchers(fresh.vouchers);
    setRestaurantOrders(fresh.orders);
    setInventoryItems(fresh.inventoryItems);
    showToast('Dummy DB reset to initial demo dataset!');
  };


  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B] font-sans antialiased selection:bg-[#FFF1F2] selection:text-[#E63946]">
      {/* Toast Notification with Luxury Red styling */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#18181B] text-[#FAFAFA] shadow-2xl border border-white/10 animate-fade-in-up text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#E63946]" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-zinc-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
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
        <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
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
            onOpenCheckIn={() => setIsCheckInOpen(true)}
          />

          <div className="flex-1 flex overflow-hidden">
            {/* Left Narrow Icon Sidebar matching Screenshot 1, 2, 3, 4, 5 */}
            <LeftIconSidebar
              currentView={currentView}
              onSelectView={(v: string) => {
                setCurrentView(v);
                if (v.startsWith('inv-') || v === 'inventory' || v === 'restaurant') {
                  setCurrentPortal('restaurant');
                } else {
                  setCurrentPortal('hotel');
                }
              }}
            />

            {/* Main Workspace Area */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAFAFA]">
              {/* Hotel Portal Active */}
              {currentPortal === 'hotel' && (
                <>
                  {/* View: Hub / Dashboard */}
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
                      onOpenCheckIn={() => setIsCheckInOpen(true)}
                    />
                  )}

                  {/* View: HMS (Invoices, Bookings, Rooms, Categories, BTC, Events) */}
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

                  {/* View: Accounts */}
                  {(currentView === 'accounts' || currentView.startsWith('acc-')) && (
                    <AccountsModuleView entries={ledgerEntries} />
                  )}

                  {/* View: Payroll */}
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
                  vouchers={restaurantVouchers}
                  onPlaceOrder={handlePlaceRestaurantOrder}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onAddVoucher={handleAddRestaurantVoucher}
                  onDeleteVoucher={handleDeleteRestaurantVoucher}
                  onImportVouchers={handleImportRestaurantVouchers}
                  onAutoSyncOrders={handleAutoSyncRestaurantOrders}
                  onResetDb={handleResetRestaurantDb}
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
        />
      )}

      {/* Check-Out Modal */}
      {checkOutBooking && (
        <CheckOutModal
          booking={checkOutBooking}
          restaurantOrders={restaurantOrders}
          onClose={() => setCheckOutBooking(null)}
          onConfirmCheckOut={handleConfirmCheckOut}
        />
      )}

      {/* Detailed Invoice View & Print Modal with #E63946 + #FFF1F2 + #18181B + #FAFAFA */}
      {inspectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200">
              <span className="font-black text-sm text-[#18181B]">
                HOTEL FOLIO #{inspectedInvoice.invoiceNumber}
              </span>
              <button
                onClick={() => setInspectedInvoice(null)}
                className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Letterhead */}
            <div className="text-center py-2 border-b border-zinc-100">
              <h2 className="text-base font-black uppercase text-[#18181B] tracking-wider">
                PAKISTAN CLUB INN HOTEL
              </h2>
              <p className="text-[11px] text-zinc-500">
                City Bypass Road, Sukkur &bull; Tel: 071-5806409 / +92 300 7555850
              </p>
              <div className="text-[10px] text-zinc-400 mt-1 font-mono">
                Date: {inspectedInvoice.dateGenerated} &bull; Booking Ref: {inspectedInvoice.bookingNumber}
              </div>
            </div>

            {/* Guest & Room Details */}
            <div className="grid grid-cols-2 gap-3 py-3 border-b border-zinc-100">
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Guest</span>
                <div className="font-black text-[#18181B] text-sm">{inspectedInvoice.guestName}</div>
                <div className="text-[11px] text-zinc-500 font-mono">{inspectedInvoice.cnic}</div>
                <div className="text-[11px] text-zinc-500">{inspectedInvoice.phone}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Room Allotment</span>
                <div className="font-black text-[#E63946] text-sm">Room {inspectedInvoice.roomNumber}</div>
                <div className="text-[11px] text-zinc-500">{inspectedInvoice.roomType}</div>
                <div className="text-[10px] text-zinc-400">
                  {inspectedInvoice.nights} Night(s) Stay
                </div>
              </div>
            </div>

            {/* Financial Line Items */}
            <div className="py-3 space-y-2 font-mono">
              <div className="flex justify-between text-zinc-600">
                <span>Room Charges:</span>
                <span>Rs. {inspectedInvoice.roomCharges.toLocaleString('en-PK')}</span>
              </div>
              {inspectedInvoice.restaurantCharges > 0 && (
                <div className="flex justify-between text-zinc-600">
                  <span>Lazzati Restaurant Food:</span>
                  <span>Rs. {inspectedInvoice.restaurantCharges.toLocaleString('en-PK')}</span>
                </div>
              )}
              {inspectedInvoice.serviceCharges > 0 && (
                <div className="flex justify-between text-zinc-600">
                  <span>Service / Laundry Charges:</span>
                  <span>Rs. {inspectedInvoice.serviceCharges.toLocaleString('en-PK')}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-[#18181B] pt-2 border-t border-zinc-100">
                <span>Total Gross Amount:</span>
                <span>Rs. {inspectedInvoice.totalAmount.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Advance Paid ({inspectedInvoice.paymentMethod}):</span>
                <span>- Rs. {inspectedInvoice.advancePaid.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between font-black text-[#E63946] text-sm pt-2 border-t border-zinc-200">
                <span>Net Balance Due:</span>
                <span>Rs. {inspectedInvoice.netPayable.toLocaleString('en-PK')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#E63946]" />
                <span>Print Official Receipt</span>
              </button>

              <button
                onClick={() => setInspectedInvoice(null)}
                className="px-4 py-2.5 rounded-2xl btn-luxury-red font-bold text-xs cursor-pointer"
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
