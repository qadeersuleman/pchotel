export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';
export type RoomType = 'Standard Single' | 'Deluxe Double' | 'Executive Suite' | 'Presidential Suite' | 'Family Suite';

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  type: RoomType;
  pricePerNight: number; // PKR
  status: RoomStatus;
  bedType: string;
  maxOccupancy: number;
  currentGuest?: {
    id: string;
    name: string;
    phone: string;
    cnic: string;
    checkInDate: string;
    checkOutDate: string;
    advancePaid: number;
    totalBill: number;
  };
  amenities: string[];
}

export interface Booking {
  id: string;
  bookingNumber: string;
  guestName: string;
  phone: string;
  cnic: string;
  city: string;
  roomNumber: string;
  roomType: RoomType;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  ratePerNight: number;
  totalAmount: number;
  advancePaid: number;
  remainingBalance: number;
  status: 'Confirmed' | 'Checked-In' | 'Checked-Out' | 'Cancelled';
  paymentMethod: 'Cash' | 'Credit Card' | 'Bank Transfer' | 'JazzCash / EasyPaisa';
  createdAt: string;
}

export interface HotelInvoice {
  id: string;
  invoiceNumber: string; // e.g. "PCI-INV-2026-001"
  bookingNumber: string;
  guestName: string;
  cnic: string;
  phone: string;
  roomNumber: string;
  roomType: RoomType;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  roomCharges: number;
  restaurantCharges: number;
  serviceCharges: number;
  taxAmount: number;
  totalAmount: number;
  advancePaid: number;
  netPayable: number;
  status: 'Paid' | 'Unpaid' | 'Partial';
  paymentMethod: string;
  dateGenerated: string;
}

export interface BTCContract {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  ntn: string;
  discountRate: number; // percentage
  creditLimit: number;
  currentOutstanding: number;
  status: 'Active' | 'Pending' | 'Suspended';
}

export interface EventBooking {
  id: string;
  eventName: string; // "Wedding Ceremony", "Corporate Seminar", etc.
  venue: 'Main Royal Marriage Hall' | 'Lush Green Lawn' | 'Executive Conference Room';
  clientName: string;
  phone: string;
  date: string;
  shift: 'Lunch (12PM - 4PM)' | 'Dinner (7PM - 11PM)';
  guestsCount: number;
  perHeadRate: number;
  totalAmount: number;
  advancePaid: number;
  status: 'Confirmed' | 'Tentative' | 'Completed';
}

export interface RestaurantItem {
  id: string;
  name: string;
  category: 'Karahi & Handi' | 'BBQ' | 'Rice & Biryani' | 'Fast Food' | 'Tandoor' | 'Beverages' | 'Desserts';
  price: number;
  available: boolean;
}

export interface RestaurantOrder {
  id: string;
  orderNumber: string;
  orderType: 'Dine-In Table' | 'Room Service Delivery' | 'Takeaway';
  tableOrRoom: string; // e.g. "Table #4" or "Room 105"
  roomNumber?: string;
  guestName: string;
  items: { name: string; qty: number; price: number }[];
  totalAmount: number;
  status: 'Preparing' | 'Delivered' | 'Billed';
  time: string;
  paymentStatus: 'Cash Settled' | 'Billed to Room Folio' | 'Card Settled';
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'Kitchen Ingredients' | 'Housekeeping & Toiletries' | 'Beverages & Soft Drinks' | 'Linen & Bedding';
  currentStock: number;
  unit: string;
  reorderLevel: number;
  unitPrice: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface AccountLedgerEntry {
  id: string;
  voucherNumber: string;
  date: string;
  accountTitle: string;
  accountType: 'Cash in Hand' | 'Bank Meezan' | 'Bank HBL' | 'Accounts Receivable' | 'Room Sales Revenue' | 'Restaurant Food Revenue';
  debit: number;
  credit: number;
  description: string;
}

export interface EmployeeSalary {
  id: string;
  empId: string;
  name: string;
  department: 'Front Desk' | 'Housekeeping' | 'Kitchen & Restaurant' | 'Security & Maintenance' | 'Accounts';
  designation: string;
  shift: 'Morning' | 'Evening' | 'Night';
  basicSalary: number;
  allowance: number;
  deductions: number;
  netSalary: number;
  status: 'Paid' | 'Pending';
}

export interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  cleaningRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  todayRevenue: number;
  cashInHand: number;
  pendingBalance: number;
}
