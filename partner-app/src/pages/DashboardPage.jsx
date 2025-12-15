import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardStats from '../components/DashboardStats';
import RecentOrders from '../components/RecentOrders';
import QuickActions from '../components/QuickActions';
import { useAuth } from '../contexts/AuthContext';
import { firestoreService } from '../../../shared/firebaseServices.js';
import { orderStatus } from '../../../shared/config.js';

const DashboardPage = () => {
  const { user, warung } = useAuth();
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (warung) {
      loadDashboardData();
    }
  }, [warung]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load today's orders
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayOrders = await firestoreService.queryDocuments(
        'orders',
        [
          ['warungId', '==', warung.id],
          ['createdAt', '>=', today],
          ['createdAt', '<', tomorrow]
        ],
        'createdAt',
        50
      );

      // Calculate stats
      const todayRevenue = todayOrders
        .filter(order => order.status === orderStatus.DELIVERED)
        .reduce((total, order) => total + (order.totalAmount || 0), 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const yesterdayOrders = await firestoreService.queryDocuments(
        'orders',
        [
          ['warungId', '==', warung.id],
          ['createdAt', '>=', yesterday],
          ['createdAt', '<', today]
        ],
        'createdAt',
        50
      );

      const yesterdayRevenue = yesterdayOrders
        .filter(order => order.status === orderStatus.DELIVERED)
        .reduce((total, order) => total + (order.totalAmount || 0), 0);

      // Load total menus
      const menus = await firestoreService.queryDocuments(
        'menus',
        [['warungId', '==', warung.id]],
        null,
        100
      );

      // Set stats
      setStats({
        todayOrders: todayOrders.length,
        orderChange: yesterdayOrders.length > 0
          ? Math.round(((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length) * 100)
          : 0,
        todayRevenue: todayRevenue,
        revenueChange: yesterdayRevenue > 0
          ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
          : 0,
        totalMenus: menus.length,
        rating: warung.rating || 0,
        ratingChange: 0 // TODO: Calculate rating change
      });

      // Set recent orders (last 10)
      setRecentOrders(todayOrders.slice(0, 10));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !warung) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!warung) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Warung Tidak Ditemukan</h1>
          <p className="text-gray-600">Hubungi admin untuk setup warung Anda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="md:pl-64">
        <div className="md:pt-16 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Selamat datang kembali! Ini adalah ringkasan aktivitas warung Anda.</p>
            </div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Dashboard Stats */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistik Hari Ini</h2>
              <DashboardStats stats={stats} loading={loading} />
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Pesanan Terbaru</h2>
                <button
                  onClick={() => window.location.href = '/orders'}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Lihat Semua →
                </button>
              </div>
              <RecentOrders orders={recentOrders} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;