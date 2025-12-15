import React from 'react';
import { useNavigate } from 'react-router-dom';
import { currencyFormat, dateTimeFormat } from '../utils/format';
import { orderStatus } from '../../../shared/config.js';

const RecentOrders = ({ orders, loading }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case orderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case orderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800';
      case orderStatus.PREPARING:
        return 'bg-purple-100 text-purple-800';
      case orderStatus.READY:
        return 'bg-indigo-100 text-indigo-800';
      case orderStatus.PICKED_UP:
        return 'bg-orange-100 text-orange-800';
      case orderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case orderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      [orderStatus.PENDING]: 'Menunggu Konfirmasi',
      [orderStatus.CONFIRMED]: 'Dikonfirmasi',
      [orderStatus.PREPARING]: 'Disiapkan',
      [orderStatus.READY]: 'Siap Diambil',
      [orderStatus.PICKED_UP]: 'Dalam Pengantaran',
      [orderStatus.DELIVERED]: 'Selesai',
      [orderStatus.CANCELLED]: 'Dibatalkan'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="bg-gray-200 rounded-lg h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada pesanan</h3>
        <p className="mt-1 text-sm text-gray-500">Pesanan baru akan muncul di sini</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pesanan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pelanggan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      #{order.id.slice(-6).toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {dateTimeFormat(order.createdAt?.toDate())}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.customerName || order.customerPhone}
                  </div>
                  {order.items && (
                    <div className="text-sm text-gray-500">
                      {order.items.length} item
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">
                    {currencyFormat(order.totalAmount || 0)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;