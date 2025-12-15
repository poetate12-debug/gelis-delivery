import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardStats from '../components/DashboardStats';
import OrderNotifications from '../components/OrderNotifications';
import RecentActivity from '../components/RecentActivity';
import { useAuth } from '../contexts/AuthContext';
import { firestoreService } from '../../../shared/firebaseServices.js';
import { orderStatus } from '../../../shared/config.js';

const DashboardPage = () => {
  const { user, driver } = useAuth();
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [newOrderNotification, setNewOrderNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (driver) {
      loadDashboardData();
      listenForNewOrders();
    }
  }, [driver]);

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
          ['driverId', '==', driver.id],
          ['createdAt', '>=', today],
          ['createdAt', '<', tomorrow]
        ],
        'createdAt',
        50
      );

      // Calculate stats
      const todayEarnings = todayOrders
        .filter(order => order.status === orderStatus.DELIVERED)
        .reduce((total, order) => total + (order.deliveryFee || 0), 0);

      const totalDeliveries = await firestoreService.queryDocuments(
        'orders',
        [
          ['driverId', '==', driver.id],
          ['status', '==', orderStatus.DELIVERED]
        ],
        'createdAt',
        1000
      );

      // Set stats
      setStats({
        todayOrders: todayOrders.length,
        todayEarnings: todayEarnings,
        totalDeliveries: totalDeliveries.length,
        rating: driver.rating || 0
      });

      // Set recent orders (last 5)
      setRecentOrders(todayOrders.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const listenForNewOrders = () => {
    // Listen for new orders assigned to this driver
    // This would typically use Firestore real-time listeners
    // For now, we'll simulate with a simple polling mechanism

    const checkInterval = setInterval(async () => {
      if (driver?.status === 'available') {
        try {
          const pendingOrders = await firestoreService.queryDocuments(
            'orders',
            [
              ['driverId', '==', driver.id],
              ['status', '==', orderStatus.CONFIRMED]
            ],
            'createdAt',
            10
          );

          if (pendingOrders.length > 0 && !newOrderNotification) {
            const order = pendingOrders[0];
            setNewOrderNotification(order);

            // Show browser notification if permitted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Pesanan Baru!', {
                body: `Pesanan dari ${order.warungName} menunggu konfirmasi`,
                icon: '/icon-192x192.png'
              });
            }
          }
        } catch (error) {
          console.error('Error checking for new orders:', error);
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  };

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (loading && !driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profil Driver Tidak Ditemukan</h1>
          <p className="text-gray-600">Hubungi admin untuk setup akun driver Anda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* New Order Notification */}
      {newOrderNotification && (
        <OrderNotifications
          order={newOrderNotification}
          onAccept={() => {
            // Navigate to order detail
            window.location.href = `/orders/${newOrderNotification.id}`;
          }}
          onReject={() => {
            setNewOrderNotification(null);
          }}
        />
      )}

      {/* Main Content */}
      <div className="md:pl-64">
        <div className="md:pt-16 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                {driver.status === 'available'
                  ? 'Anda sedang online dan siap menerima pesanan'
                  : 'Anda sedang offline. Nyalakan status untuk menerima pesanan.'
                }
              </p>
            </div>

            {/* Dashboard Stats */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistik Hari Ini</h2>
              <DashboardStats stats={stats} loading={loading} />
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
                <button
                  onClick={() => window.location.href = '/orders'}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Lihat Semua →
                </button>
              </div>
              <RecentActivity orders={recentOrders} loading={loading} />
            </div>

            {/* Tips for drivers */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Tips:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Pastikan aplikasi GPS aktif untuk lokasi yang akurat</li>
                <li>• Segera konfirmasi pesanan yang masuk</li>
                <li>• Komunikasikan dengan pelanggan jika ada keterlambatan</li>
                <li>• Jaga rating Anda dengan layanan terbaik</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;