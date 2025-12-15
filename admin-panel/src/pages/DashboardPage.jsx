import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardStats from '../components/DashboardStats';
import RecentOrders from '../components/RecentOrders';
import QuickActions from '../components/QuickActions';
import SystemStatus from '../components/SystemStatus';
import { useAuth } from '../contexts/AuthContext';
import { firestoreService } from '../../../shared/firebaseServices.js';
import { orderStatus } from '../../../shared/config.js';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [dateRange, setDateRange] = useState('today');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        case 'all':
          startDate = new Date(0);
          break;
      }

      // Load total counts
      const [customers, partners, drivers, orders] = await Promise.all([
        firestoreService.queryDocuments('users', [['role', '==', 'customer']]),
        firestoreService.queryDocuments('users', [['role', '==', 'partner']]),
        firestoreService.queryDocuments('users', [['role', '==', 'driver']]),
        firestoreService.queryDocuments('orders', [['createdAt', '>=', startDate]])
      ]);

      // Calculate revenue
      const totalRevenue = orders
        .filter(order => order.status === orderStatus.DELIVERED)
        .reduce((total, order) => total + (order.totalAmount || 0), 0);

      // Get today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayOrdersData = await firestoreService.queryDocuments(
        'orders',
        [['createdAt', '>=', today], ['createdAt', '<', tomorrow]],
        'createdAt',
        10
      );

      // Set stats
      setStats({
        totalCustomers: customers.length,
        totalPartners: partners.length,
        totalDrivers: drivers.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        todayOrders: todayOrdersData.length,
        // Calculate changes (mock data for now)
        customerChange: 12.5,
        partnerChange: 8.2,
        driverChange: 15.3,
        orderChange: 22.1,
        revenueChange: 18.7
      });

      // Set recent orders
      setRecentOrders(todayOrdersData.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="md:pl-64">
        <div className="md:pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600 mt-2">
                Selamat datang kembali, {user?.displayName || 'Admin'}! Ini adalah ringkasan keseluruhan sistem GELIS DELIVERY.
              </p>
            </div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Dashboard Stats */}
            <div className="mb-8">
              <DashboardStats
                stats={stats}
                loading={loading}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pesanan Terbaru</h2>
                <RecentOrders orders={recentOrders} loading={loading} />
              </div>

              {/* System Status */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Sistem</h2>
                <SystemStatus />
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Active Users Today */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Pengguna Aktif Hari Ini</h3>
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pelanggan</span>
                    <span className="font-medium">{Math.floor(Math.random() * 100) + 50}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mitra</span>
                    <span className="font-medium">{Math.floor(Math.random() * 50) + 20}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Driver</span>
                    <span className="font-medium">{Math.floor(Math.random() * 30) + 15}</span>
                  </div>
                </div>
              </div>

              {/* Pending Verifications */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Verifikasi Tertunda</h3>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                    {Math.floor(Math.random() * 10) + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Ada beberapa pelanggan yang menunggu verifikasi
                </p>
                <button
                  onClick={() => window.location.href = '/customers?status=pending'}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Lihat Detail →
                </button>
              </div>

              {/* System Notifications */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Notifikasi Sistem</h3>
                  <div className="relative">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-600">1 server membutuhkan perhatian</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                    <span className="text-gray-600">Semua service normal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;