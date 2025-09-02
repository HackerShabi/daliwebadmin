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
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

interface Quote {
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

interface DemoBooking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  paymentStatus: string;
  paymentAmount: number;
  bookingStatus: string;
  createdAt: string;
}

interface DashboardStats {
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
  revenue: {
    totalRevenue: number;
    averageBookingValue: number;
  };
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [demoBookings, setDemoBookings] = useState<DemoBooking[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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
              revenue: {
                totalRevenue: dashboardData.data.revenue.total || 0,
                averageBookingValue: dashboardData.data.revenue.average || 0
              }
            };
            setStats(realStats);
            console.log('Dashboard stats set:', realStats);
          } else {
            console.error('Dashboard API returned success: false', dashboardData);
            setStats({
              quotes: { total: 0, pending: 0, inProgress: 0, completed: 0, today: 0, thisWeek: 0, thisMonth: 0 },
              demos: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, paymentPending: 0, paymentCompleted: 0, today: 0, thisWeek: 0, thisMonth: 0 },
              revenue: { totalRevenue: 0, averageBookingValue: 0 }
            });
          }
        } else {
          console.error('Dashboard API response not ok:', dashboardResponse.status, dashboardResponse.statusText);
          setStats({
            quotes: { total: 0, pending: 0, inProgress: 0, completed: 0, today: 0, thisWeek: 0, thisMonth: 0 },
            demos: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, paymentPending: 0, paymentCompleted: 0, today: 0, thisWeek: 0, thisMonth: 0 },
            revenue: { totalRevenue: 0, averageBookingValue: 0 }
          });
        }
      } catch (dashboardError) {
        console.error('Dashboard API error:', dashboardError);
        setStats({
          quotes: { total: 0, pending: 0, inProgress: 0, completed: 0, today: 0, thisWeek: 0, thisMonth: 0 },
          demos: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, paymentPending: 0, paymentCompleted: 0, today: 0, thisWeek: 0, thisMonth: 0 },
          revenue: { totalRevenue: 0, averageBookingValue: 0 }
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
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default empty state on error
      setStats({
        quotes: { total: 0, pending: 0, inProgress: 0, completed: 0, today: 0, thisWeek: 0, thisMonth: 0 },
        demos: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, paymentPending: 0, paymentCompleted: 0, today: 0, thisWeek: 0, thisMonth: 0 },
        revenue: { totalRevenue: 0, averageBookingValue: 0 }
      });
      setQuotes([]);
      setDemoBookings([]);
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
              { id: 'demos', name: 'Demo Bookings', icon: Calendar }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Quotes</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.quotes.total}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+{stats.quotes.today}</span>
                    <span className="ml-1">today</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Demo Bookings</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.demos.total}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="text-green-600 font-medium">+{stats.demos.today}</span>
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
                      ${(stats.revenue?.totalRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="text-blue-600 font-medium">
                      ${(stats.revenue?.averageBookingValue || 0).toFixed(0)}
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
                      {stats.quotes.total > 0 ? ((stats.demos.total / stats.quotes.total) * 100).toFixed(1) : 0}%
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
                            {format(new Date(quote.createdAt), 'MMM dd, yyyy')}
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
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              <div className="overflow-x-auto">
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
                            {format(new Date(quote.createdAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(quote.createdAt), 'HH:mm')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="h-4 w-4" />
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
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              <div className="overflow-x-auto">
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
                            {format(new Date(demo.preferredDate), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {demo.preferredTime}
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
                            {format(new Date(demo.createdAt), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(demo.createdAt), 'HH:mm')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="h-4 w-4" />
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
      </div>
    </div>
  );
};

export default AdminDashboard;