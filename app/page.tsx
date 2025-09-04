'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Mail,
  Phone,
  Building,
  Clock,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Package,
  X,
  Shield,
  UserCheck,
  UserX
} from 'lucide-react';
import { format } from 'date-fns';
import { AdminUser, Quote, DemoBooking, PackageOrder, DashboardStats } from '../types';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [demoBookings, setDemoBookings] = useState<DemoBooking[]>([]);
  const [packageOrders, setPackageOrders] = useState<PackageOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'quote' | 'demo' | 'package' | 'auth' | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Define API URL for all requests
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://daliwebagencybackend.onrender.com';
      
      // Fetch real dashboard statistics
      try {
        console.log('Fetching dashboard stats from:', `${apiUrl}/api/admin/dashboard`);
        const dashboardResponse = await fetch(`${apiUrl}/api/admin/dashboard`);
        console.log('Dashboard response status:', dashboardResponse.status);
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          console.log('Dashboard data received:', dashboardData);
          if (dashboardData.success) {
            const realStats: DashboardStats = {
              quotes: dashboardData.data.quotes,
              demos: dashboardData.data.demos,
              packages: dashboardData.data.packages || {
                total: 0, pending: 0, processing: 0, completed: 0, cancelled: 0,
                paymentPending: 0, paymentCompleted: 0, today: 0, thisWeek: 0, thisMonth: 0
              },
              auth: dashboardData.data.auth || {
                totalUsers: 0, emailUsers: 0, googleUsers: 0, verifiedUsers: 0, activeUsers: 0,
                today: 0, thisWeek: 0, thisMonth: 0
              },
              revenue: {
                totalRevenue: dashboardData.data.revenue.total || 0,
                averageBookingValue: dashboardData.data.revenue.average || 0,
                packageRevenue: dashboardData.data.revenue.packages || 0
              }
            };
            setStats(realStats);
            console.log('Dashboard stats set:', realStats);
          } else {
            console.error('Dashboard API returned success: false', dashboardData);
            setStats({
              quotes: { total: 0, pending: 0, inProgress: 0, completed: 0, today: 0, thisWeek: 0, thisMonth: 0 },
              demos: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, paymentPending: 0, paymentCompleted: 0, today: 0, thisWeek: 0, thisMonth: 0 },
              packages: { total: 0, pending: 0, processing: 0, completed: 0, cancelled: 0, paymentPending: 0, paymentCompleted: 0, today: 0, thisWeek: 0, thisMonth: 0 },
              auth: { totalUsers: 0, emailUsers: 0, googleUsers: 0, verifiedUsers: 0, activeUsers: 0, today: 0, thisWeek: 0, thisMonth: 0 },
              revenue: { totalRevenue: 0, averageBookingValue: 0, packageRevenue: 0 }
            });
          }
        } else {
          console.error('Dashboard API response not ok:', dashboardResponse.status, dashboardResponse.statusText);
          setStats({
            quotes: { total: 0, pending: 0, inProgress: 0, completed: 0, today: 0, thisWeek: 0, thisMonth: 0 },
            demos: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, paymentPending: 0, paymentCompleted: 0, today: 0, thisWeek: 0, thisMonth: 0 },
            packages: { total: 0, pending: 0, processing: 0, completed: 0, cancelled: 0, paymentPending: 0, paymentCompleted: 0, today: 0, thisWeek: 0, thisMonth: 0 },
            auth: { totalUsers: 0, emailUsers: 0, googleUsers: 0, verifiedUsers: 0, activeUsers: 0, today: 0, thisWeek: 0, thisMonth: 0 },
            revenue: { totalRevenue: 0, averageBookingValue: 0, packageRevenue: 0 }
          });
        }
      } catch (dashboardError) {
        console.error('Dashboard API error:', dashboardError);
        setStats({
          quotes: { total: 0, pending: 0, inProgress: 0, completed: 0, today: 0, thisWeek: 0, thisMonth: 0 },
          demos: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, paymentPending: 0, paymentCompleted: 0, today: 0, thisWeek: 0, thisMonth: 0 },
          packages: { total: 0, pending: 0, processing: 0, completed: 0, cancelled: 0, paymentPending: 0, paymentCompleted: 0, today: 0, thisWeek: 0, thisMonth: 0 },
          auth: { totalUsers: 0, emailUsers: 0, googleUsers: 0, verifiedUsers: 0, activeUsers: 0, today: 0, thisWeek: 0, thisMonth: 0 },
          revenue: { totalRevenue: 0, averageBookingValue: 0, packageRevenue: 0 }
        });
      }
      
      // Try to fetch real quotes
      try {
        console.log('Fetching quotes from:', `${apiUrl}/api/quotes`);
        const quotesResponse = await fetch(`${apiUrl}/api/quotes`);
        console.log('Quotes response status:', quotesResponse.status);
        if (quotesResponse.ok) {
          const quotesData = await quotesResponse.json();
          console.log('Quotes data received:', quotesData);
          if (quotesData.success) {
            setQuotes(quotesData.data || []);
            console.log('Quotes set:', quotesData.data?.length || 0, 'items');
          } else {
            console.error('Quotes API returned success: false', quotesData);
            setQuotes([]);
          }
        } else {
          console.error('Quotes API response not ok:', quotesResponse.status, quotesResponse.statusText);
          setQuotes([]);
        }
      } catch (quotesError) {
        console.error('Quotes API error:', quotesError);
        setQuotes([]);
      }

      // Try to fetch real demo bookings
      try {
        console.log('Fetching demos from:', `${apiUrl}/api/demos`);
        const demosResponse = await fetch(`${apiUrl}/api/demos`);
        console.log('Demos response status:', demosResponse.status);
        if (demosResponse.ok) {
          const demosData = await demosResponse.json();
          console.log('Demos data received:', demosData);
          if (demosData.success) {
            setDemoBookings(demosData.data || []);
            console.log('Demo bookings set:', demosData.data?.length || 0, 'items');
          } else {
            console.error('Demos API returned success: false', demosData);
            setDemoBookings([]);
          }
        } else {
          console.error('Demos API response not ok:', demosResponse.status, demosResponse.statusText);
          setDemoBookings([]);
        }
      } catch (demosError) {
        console.error('Demos API error:', demosError);
        setDemoBookings([]);
      }

      // Try to fetch real package orders
      try {
        console.log('Fetching packages from:', `${apiUrl}/api/packages/orders`);
        const packagesResponse = await fetch(`${apiUrl}/api/packages/orders`);
        console.log('Packages response status:', packagesResponse.status);
        if (packagesResponse.ok) {
          const packagesData = await packagesResponse.json();
          console.log('Packages data received:', packagesData);
          if (packagesData.success) {
            setPackageOrders(packagesData.data || []);
            console.log('Package orders set:', packagesData.data?.length || 0, 'items');
          } else {
            console.error('Packages API returned success: false', packagesData);
            setPackageOrders([]);
          }
        } else {
          console.error('Packages API response not ok:', packagesResponse.status, packagesResponse.statusText);
          setPackageOrders([]);
        }
      } catch (packagesError) {
        console.error('Packages API error:', packagesError);
        setPackageOrders([]);
      }

      // Try to fetch users from MongoDB
        try {
          console.log('Fetching users from:', `${apiUrl}/api/auth/users`);
        const authResponse = await fetch(`${apiUrl}/api/auth/users`);
        console.log('Auth response status:', authResponse.status);
        if (authResponse.ok) {
          const authData = await authResponse.json();
          console.log('Auth data received:', authData);
          if (authData.success) {
            setUsers(authData.data || []);
            console.log('Users set:', authData.data?.length || 0, 'users');
          } else {
            console.error('Auth API returned success: false', authData);
            setUsers([]);
          }
        } else {
          console.error('Auth API response not ok:', authResponse.status, authResponse.statusText);
          setUsers([]);
        }
      } catch (authError) {
        console.error('Auth API error:', authError);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default empty state on error
      setStats({
          quotes: { total: 0, pending: 0, inProgress: 0, completed: 0, today: 0, thisWeek: 0, thisMonth: 0 },
          demos: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, paymentPending: 0, paymentCompleted: 0, today: 0, thisWeek: 0, thisMonth: 0 },
          packages: { total: 0, pending: 0, processing: 0, completed: 0, cancelled: 0, paymentPending: 0, paymentCompleted: 0, today: 0, thisWeek: 0, thisMonth: 0 },
          auth: { totalUsers: 0, emailUsers: 0, googleUsers: 0, verifiedUsers: 0, activeUsers: 0, today: 0, thisWeek: 0, thisMonth: 0 },
          revenue: { totalRevenue: 0, averageBookingValue: 0, packageRevenue: 0 }
        });
        setQuotes([]);
        setDemoBookings([]);
        setPackageOrders([]);
        setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || quote.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredDemos = demoBookings.filter(demo => {
    const matchesSearch = demo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         demo.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || demo.bookingStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredPackages = packageOrders.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || pkg.orderStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPackagePlanName = (packageType: string, price: number) => {
    // Map package types to plan names based on price
    if (price === 99) return 'Starter Plan';
    if (price === 499) return 'Business Plan';
    if (price === 999) return 'Premium Plan';
    
    // Fallback to packageType if price doesn't match standard plans
    switch (packageType?.toLowerCase()) {
      case 'starter':
        return 'Starter Plan';
      case 'business':
        return 'Business Plan';
      case 'premium':
        return 'Premium Plan';
      default:
        return packageType || 'Unknown Plan';
    }
  };

  const openModal = (item: any, type: 'quote' | 'demo' | 'package') => {
    setSelectedItem(item);
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalType(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
          <span className="text-lg font-medium text-gray-700">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DaliWeb Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage quotes and demo bookings</p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: TrendingUp },
              { id: 'quotes', name: 'Quote Requests', icon: Users },
              { id: 'demos', name: 'Demo Bookings', icon: Calendar },
              { id: 'packages', name: 'Package Orders', icon: Package },
              { id: 'auth', name: 'Authentication', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div 
                onClick={() => setActiveTab('quotes')}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-blue-50"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Quotes</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.quotes?.total ?? 0}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+{stats?.quotes?.today ?? 0}</span>
                    <span className="ml-1">today</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('demos')}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-purple-50"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Demo Bookings</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.demos?.total ?? 0}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+{stats?.demos?.today ?? 0}</span>
                    <span className="ml-1">today</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('packages')}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-orange-50"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Package Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.packages?.total ?? 0}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+{stats?.packages?.today ?? 0}</span>
                    <span className="ml-1">today</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('auth')}
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-indigo-50"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.auth?.totalUsers ?? 0}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+{stats?.auth?.today ?? 0}</span>
                    <span className="ml-1">today</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ${(stats?.revenue?.totalRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="text-blue-600 font-medium">
                      ${(stats?.revenue?.averageBookingValue || 0).toFixed(0)}
                    </span>
                    <span className="ml-1">avg booking</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {(stats?.quotes?.total ?? 0) > 0 ? (((stats?.demos?.total ?? 0) / (stats?.quotes?.total ?? 1)) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="text-emerald-600 font-medium">Quote to Demo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Quote Requests</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {quotes.slice(0, 5).map((quote) => (
                      <div key={quote._id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{quote.name}</p>
                            <p className="text-sm text-gray-500">{quote.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                            {quote.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {quote.createdAt ? format(new Date(quote.createdAt), 'MMM dd, yyyy') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Demo Bookings</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {demoBookings.slice(0, 5).map((demo) => (
                      <div key={demo._id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{demo.name}</p>
                            <p className="text-sm text-gray-500">{demo.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(demo.bookingStatus)}`}>
                            {demo.bookingStatus}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            ${demo.paymentAmount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Authentication Tab */}
        {activeTab === 'auth' && (
          <div className="space-y-6">
            {/* Auth Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.auth?.totalUsers ?? 0}</p>
                    <p className="text-sm text-gray-500">+{stats?.auth?.today ?? 0} today</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.auth?.emailUsers ?? 0}</p>
                    <p className="text-sm text-gray-500">Email/Password</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Google Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.auth?.googleUsers ?? 0}</p>
                    <p className="text-sm text-gray-500">OAuth Sign-in</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <UserCheck className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Verified Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.auth?.verifiedUsers ?? 0}</p>
                    <p className="text-sm text-gray-500">Email Verified</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Users ({users.length})</h3>
              </div>
              <div className="overflow-x-auto max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Sign In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <Users className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.displayName || 'No Name'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.uid.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          {user.phoneNumber && (
                            <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                          )}

                {modalType === 'auth' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">User Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</span>
                        <p className="text-sm text-gray-900 mt-1 font-mono">{selectedItem.uid}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Display Name</span>
                        <p className="text-sm text-gray-900 mt-1">{selectedItem.displayName || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</span>
                        <p className="text-sm text-gray-900 mt-1">{selectedItem.email}</p>
                      </div>
                      {selectedItem.phoneNumber && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</span>
                          <p className="text-sm text-gray-900 mt-1">{selectedItem.phoneNumber}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Authentication Providers</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedItem.providerData.map((provider, index) => (
                            <span key={index} className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              provider.providerId === 'google.com' ? 'bg-red-100 text-red-800' :
                              provider.providerId === 'password' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {provider.providerId === 'google.com' ? 'Google' :
                               provider.providerId === 'password' ? 'Email/Password' :
                               provider.providerId}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Verified</span>
                          <div className="mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              selectedItem.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {selectedItem.emailVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Status</span>
                          <div className="mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              selectedItem.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {selectedItem.disabled ? 'Disabled' : 'Active'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Created</span>
                        <p className="text-sm text-gray-900 mt-1">
                          {format(new Date(selectedItem.creationTime), 'MMM dd, yyyy \\at HH:mm')}
                        </p>
                      </div>
                      {selectedItem.lastSignInTime && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sign In</span>
                          <p className="text-sm text-gray-900 mt-1">
                            {format(new Date(selectedItem.lastSignInTime), 'MMM dd, yyyy \\at HH:mm')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            {user.providerData.map((provider, index) => (
                              <span key={index} className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                provider.providerId === 'google.com' ? 'bg-red-100 text-red-800' :
                                provider.providerId === 'password' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {provider.providerId === 'google.com' ? 'Google' :
                                 provider.providerId === 'password' ? 'Email' :
                                 provider.providerId}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.emailVerified ? 'Verified' : 'Unverified'}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user.disabled ? 'Disabled' : 'Active'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(new Date(user.creationTime), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(user.creationTime), 'HH:mm')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.lastSignInTime ? (
                            <div>
                              <div className="text-sm text-gray-900">
                                {format(new Date(user.lastSignInTime), 'MMM dd, yyyy')}
                              </div>
                              <div className="text-sm text-gray-500">
                                {format(new Date(user.lastSignInTime), 'HH:mm')}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Never</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => openModal(user, 'auth')}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              className={`p-1 rounded ${
                                user.disabled 
                                  ? 'text-green-600 hover:text-green-900 hover:bg-green-50' 
                                  : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                              }`}
                              title={user.disabled ? 'Enable User' : 'Disable User'}
                            >
                              {user.disabled ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search quotes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quotes Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quote Requests ({filteredQuotes.length})</h3>
              </div>
              <div className="overflow-x-auto max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredQuotes.map((quote) => (
                      <tr key={quote._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{quote.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {quote.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {quote.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900 capitalize">{quote.businessType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                            {quote.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(quote.priority)}`}>
                            {quote.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {quote.source}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {quote.createdAt ? format(new Date(quote.createdAt), 'MMM dd, yyyy') : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {quote.createdAt ? format(new Date(quote.createdAt), 'HH:mm') : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => openModal(quote, 'quote')}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50" title="Edit">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Demo Bookings Tab */}
        {activeTab === 'demos' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search demo bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Demo Bookings Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Demo Bookings ({filteredDemos.length})</h3>
              </div>
              <div className="overflow-x-auto max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preferred Date/Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDemos.map((demo) => (
                      <tr key={demo._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{demo.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {demo.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {demo.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900 capitalize">{demo.businessType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {demo.preferredDate ? format(new Date(demo.preferredDate), 'MMM dd, yyyy') : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {demo.preferredTime || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${(demo.paymentAmount || 0).toLocaleString()}
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            demo.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                            demo.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {demo.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(demo.bookingStatus)}`}>
                            {demo.bookingStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {demo.createdAt ? format(new Date(demo.createdAt), 'MMM dd, yyyy') : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {demo.createdAt ? format(new Date(demo.createdAt), 'HH:mm') : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => openModal(demo, 'demo')}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50" title="Edit">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Package Orders Tab */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search package orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Package Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Package Orders ({filteredPackages.length})</h3>
              </div>
              <div className="overflow-x-auto max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Package
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPackages.map((pkg) => (
                      <tr key={pkg._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {pkg.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {pkg.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{pkg.businessType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{getPackagePlanName(pkg.packageType, pkg.packagePrice)}</div>
                          <div className="text-xs text-gray-500">{pkg.packageType}</div>
                          {pkg.message && (
                            <div className="text-sm text-gray-500 truncate max-w-xs mt-1">{pkg.message}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${pkg.packagePrice}</div>
                          <div className="text-xs text-gray-500">
                            {pkg.packagePrice === 99 && 'Starter'}
                            {pkg.packagePrice === 499 && 'Business'}
                            {pkg.packagePrice === 999 && 'Premium'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            pkg.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                            pkg.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {pkg.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pkg.orderStatus)}`}>
                            {pkg.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {pkg.createdAt ? format(new Date(pkg.createdAt), 'MMM dd, yyyy') : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {pkg.createdAt ? format(new Date(pkg.createdAt), 'HH:mm') : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => openModal(pkg, 'package')}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50" title="Edit">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalType === 'quote' && 'Quote Request Details'}
                  {modalType === 'demo' && 'Demo Booking Details'}
                  {modalType === 'package' && 'Package Order Details'}
                  {modalType === 'auth' && 'User Details'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{selectedItem.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedItem.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedItem.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 capitalize">{selectedItem.businessType}</span>
                    </div>
                  </div>
                </div>

                {/* Request Specific Information */}
                {modalType === 'quote' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Quote Details</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedItem.status)}`}>
                            {selectedItem.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</span>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedItem.priority)}`}>
                            {selectedItem.priority}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Source</span>
                        <p className="text-sm text-gray-900 mt-1 capitalize">{selectedItem.source}</p>
                      </div>
                      {selectedItem.message && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Message</span>
                          <p className="text-sm text-gray-900 mt-1">{selectedItem.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {modalType === 'demo' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Demo Booking Details</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Date & Time</span>
                        <div className="mt-1 flex items-center space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">
                              {selectedItem.preferredDate ? format(new Date(selectedItem.preferredDate), 'MMM dd, yyyy') : 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">{selectedItem.preferredTime || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Information</span>
                        <div className="mt-1 flex items-center space-x-4">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm font-medium text-gray-900">${(selectedItem.paymentAmount || 0).toLocaleString()}</span>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedItem.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                            selectedItem.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {selectedItem.paymentStatus}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Status</span>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedItem.bookingStatus)}`}>
                            {selectedItem.bookingStatus}
                          </span>
                        </div>
                      </div>
                      {selectedItem.message && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Additional Notes</span>
                          <p className="text-sm text-gray-900 mt-1">{selectedItem.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {modalType === 'package' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Package Order Details</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Package Information</span>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{getPackagePlanName(selectedItem.packageType, selectedItem.packagePrice)}</span>
                            <span className="text-lg font-bold text-gray-900">${selectedItem.packagePrice}</span>
                          </div>
                          <div className="text-xs text-gray-500">{selectedItem.packageType}</div>
                          <div className="text-xs text-gray-500">
                            {selectedItem.packagePrice === 99 && 'Starter Plan - Basic website package'}
                            {selectedItem.packagePrice === 499 && 'Business Plan - Professional website with advanced features'}
                            {selectedItem.packagePrice === 999 && 'Premium Plan - Enterprise-level website solution'}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</span>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedItem.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                            selectedItem.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {selectedItem.paymentStatus}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</span>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedItem.orderStatus)}`}>
                            {selectedItem.orderStatus}
                          </span>
                        </div>
                      </div>
                      {selectedItem.message && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Special Requirements</span>
                          <p className="text-sm text-gray-900 mt-1">{selectedItem.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {modalType === 'auth' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">User Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</span>
                        <div className="mt-1">
                          <span className="text-sm text-gray-900 font-mono">{selectedItem.uid}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Display Name</span>
                        <div className="mt-1">
                          <span className="text-sm text-gray-900">{selectedItem.displayName || 'Not provided'}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</span>
                        <div className="mt-1">
                          <span className="text-sm text-gray-900">{selectedItem.email}</span>
                        </div>
                      </div>
                      {selectedItem.phoneNumber && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</span>
                          <div className="mt-1">
                            <span className="text-sm text-gray-900">{selectedItem.phoneNumber}</span>
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Authentication Providers</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedItem.providerData?.map((provider, index) => (
                            <span key={index} className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              provider.providerId === 'google.com' ? 'bg-red-100 text-red-800' :
                              provider.providerId === 'password' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {provider.providerId === 'google.com' ? 'Google' :
                               provider.providerId === 'password' ? 'Email/Password' :
                               provider.providerId}
                            </span>
                          )) || (
                            <span className="text-sm text-gray-500">No providers found</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Verified</span>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedItem.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedItem.emailVerified ? 'Verified' : 'Not Verified'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Status</span>
                        <div className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedItem.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {selectedItem.disabled ? 'Disabled' : 'Active'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Account Created</span>
                        <div className="mt-1">
                          <span className="text-sm text-gray-900">
                            {selectedItem.creationTime ? format(new Date(selectedItem.creationTime), 'MMM dd, yyyy \\at HH:mm') : 'N/A'}
                          </span>
                        </div>
                      </div>
                      {selectedItem.lastSignInTime && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sign In</span>
                          <div className="mt-1">
                            <span className="text-sm text-gray-900">
                              {format(new Date(selectedItem.lastSignInTime), 'MMM dd, yyyy \\at HH:mm')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Timeline</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</span>
                        <div className="text-sm text-gray-900">
                          {selectedItem.createdAt ? format(new Date(selectedItem.createdAt), 'MMM dd, yyyy \\at HH:mm') : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Close
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Edit
                </button>
                {(modalType === 'quote' || modalType === 'demo') && (
                  <>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Accept
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;