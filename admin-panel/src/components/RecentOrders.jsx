import React from 'react';
import { useNavigate } from 'react-router-dom';
import { currencyFormat, dateTimeFormat, getStatusColor } from '../utils/format';
import { EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const RecentOrders = ({ orders, loading }) => {
  const navigate = useNavigate();

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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada pesanan</h3>
        <p className="mt-1 text-sm text-gray-500">Pesanan baru akan muncul di sini</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium text-gray-900">5 Pesanan Terbaru</h3>
        <button
          onClick={() => navigate('/orders')}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Lihat Semua
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Pesanan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pelanggan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Warung
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="font-medium text-gray-900">
                    #{order.id.slice(-6).toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {dateTimeFormat(order.createdAt?.toDate())}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="font-medium text-gray-900">
                    {order.customerName || order.customerPhone}
                  </div>
                  {order.items && (
                    <div className="text-xs text-gray-500">
                      {order.items.length} item
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {order.warungName || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status?.replace('_', ' ').toUpperCase() || '-'}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {currencyFormat(order.totalAmount || 0)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="text-primary-600 hover:text-primary-900 flex items-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Menampilkan <span className="font-medium">{orders.length}</span> pesanan terbaru
          </p>
          <button className="flex items-center text-sm text-primary-600 hover:text-primary-700">
            <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
            Cari Pesanan
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;