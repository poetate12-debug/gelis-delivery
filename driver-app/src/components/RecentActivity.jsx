import React from 'react';
import { useNavigate } from 'react-router-dom';
import { currencyFormat, timeFormat } from '../utils/format';
import { orderStatus } from '../../../shared/config.js';

const RecentActivity = ({ orders, loading }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case orderStatus.PREPARING:
        return 'bg-blue-100 text-blue-800';
      case orderStatus.READY:
        return 'bg-purple-100 text-purple-800';
      case orderStatus.PICKED_UP:
        return 'bg-orange-100 text-orange-800';
      case orderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      [orderStatus.PREPARING]: 'Disiapkan',
      [orderStatus.READY]: 'Siap Diambil',
      [orderStatus.PICKED_UP]: 'Dalam Pengantaran',
      [orderStatus.DELIVERED]: 'Selesai'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="bg-gray-200 rounded-lg h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
              </div>
              <div className="bg-gray-200 h-8 w-20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada aktivitas</h3>
        <p className="mt-1 text-sm text-gray-500">Pesanan baru akan muncul di sini</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => navigate(`/orders/${order.id}`)}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    #{order.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.warungName} • {timeFormat(order.createdAt?.toDate())}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {currencyFormat(order.deliveryFee || 0)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;