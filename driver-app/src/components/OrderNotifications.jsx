import React, { useState, useEffect } from 'react';
import { currencyFormat, dateTimeFormat } from '../utils/format';
import { XMarkIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { firestoreService } from '../../../shared/firebaseServices.js';
import { orderStatus } from '../../../shared/config.js';

const OrderNotifications = ({ order, onAccept, onReject }) => {
  const [accepting, setAccepting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds to respond

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onReject();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onReject]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      // Update order status to preparing
      await firestoreService.updateDocument('orders', order.id, {
        status: orderStatus.PREPARING,
        driverAcceptedAt: new Date()
      });

      // Update driver status to busy
      await firestoreService.updateDocument('drivers', order.driverId, {
        status: 'busy'
      });

      onAccept();
    } catch (error) {
      console.error('Error accepting order:', error);
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    try {
      // Update driver reputation for rejecting
      await firestoreService.updateDocument('drivers', order.driverId, {
        reputation: (order.driverReputation || 5) - 1
      });

      // Set order driver to null so it can be reassigned
      await firestoreService.updateDocument('orders', order.id, {
        driverId: null,
        driverRejectedAt: new Date()
      });

      onReject();
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Pesanan Baru!</h3>
          <button
            onClick={onReject}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{timeLeft}</div>
            <div className="text-sm text-gray-500">detik tersisa</div>
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-6 space-y-3">
          <div>
            <p className="text-sm text-gray-600">Warung</p>
            <p className="font-medium">{order.warungName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Pelanggan</p>
            <p className="font-medium">{order.customerName || order.customerPhone}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Layanan</p>
            <p className="font-medium">Pengantaran</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Biaya Pengantaran</p>
            <p className="font-medium text-green-600">
              {currencyFormat(order.deliveryFee || 10000)}
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Alamat Pengantaran</p>
              <p className="text-sm">{order.deliveryAddress}</p>
            </div>
          </div>

          {order.estimatedTime && (
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Estimasi Waktu</p>
                <p className="text-sm">{order.estimatedTime} menit</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleReject}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={accepting}
          >
            Tolak
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={accepting || timeLeft === 0}
          >
            {accepting ? 'Menerima...' : 'Terima Pesanan'}
          </button>
        </div>

        {/* Warning */}
        <p className="text-xs text-gray-500 text-center mt-3">
          Menolak pesanan akan mengurangi reputasi Anda
        </p>
      </div>
    </div>
  );
};

export default OrderNotifications;