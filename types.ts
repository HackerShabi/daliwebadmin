// Local types for admin panel - no Firebase dependency needed

export interface UserProviderData {
  providerId: string;
  uid: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  disabled: boolean;
  creationTime: string;
  lastSignInTime?: string;
  providerData: UserProviderData[];
}

export interface Quote {
  _id: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  message: string;
  source: string;
  status: string;
  priority: string;
  createdAt: string;
}

export interface DemoBooking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  selectedCategory?: string;
  categoryInfo?: {
    category: string;
    subcategory?: string;
  };
  paymentStatus: string;
  paymentAmount: number;
  bookingStatus: string;
  createdAt: string;
}

export interface PackageOrder {
  _id: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  selectedCategory?: string;
  categoryInfo?: {
    category: string;
    subcategory?: string;
  };
  packageType: string;
  packagePrice: number;
  paymentStatus: string;
  orderStatus: string;
  message?: string;
  createdAt: string;
}

export interface DashboardStats {
  quotes: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  demos: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    paymentPending: number;
    paymentCompleted: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  packages: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    paymentPending: number;
    paymentCompleted: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  auth: {
    totalUsers: number;
    emailUsers: number;
    googleUsers: number;
    verifiedUsers: number;
    activeUsers: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  revenue: {
    totalRevenue: number;
    averageBookingValue: number;
    packageRevenue: number;
  };
}