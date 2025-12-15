import React, { useState, useEffect } from 'react';
import {
  ServerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const SystemStatus = () => {
  const [services, setServices] = useState([
    {
      name: 'Firebase Authentication',
      status: 'healthy',
      responseTime: 45,
      lastCheck: new Date()
    },
    {
      name: 'Firestore Database',
      status: 'healthy',
      responseTime: 32,
      lastCheck: new Date()
    },
    {
      name: 'Firebase Storage',
      status: 'healthy',
      responseTime: 78,
      lastCheck: new Date()
    },
    {
      name: 'Cloud Messaging',
      status: 'healthy',
      responseTime: 23,
      lastCheck: new Date()
    },
    {
      name: 'Payment Gateway',
      status: 'warning',
      responseTime: 150,
      lastCheck: new Date()
    },
    {
      name: 'Email Service',
      status: 'healthy',
      responseTime: 120,
      lastCheck: new Date()
    }
  ]);

  const [isChecking, setIsChecking] = useState(false);

  const checkServiceHealth = async () => {
    setIsChecking(true);

    // Simulate service health check
    await new Promise(resolve => setTimeout(resolve, 2000));

    setServices(prevServices =>
      prevServices.map(service => ({
        ...service,
        status: Math.random() > 0.8 ? 'error' : Math.random() > 0.2 ? 'healthy' : 'warning',
        responseTime: Math.floor(Math.random() * 200) + 20,
        lastCheck: new Date()
      }))
    );

    setIsChecking(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkServiceHealth();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const overallStatus = services.every(s => s.status === 'healthy')
    ? 'healthy'
    : services.some(s => s.status === 'error')
    ? 'error'
    : 'warning';

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Status Sistem</h3>
          <button
            onClick={checkServiceHealth}
            disabled={isChecking}
            className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              overallStatus === 'healthy'
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : overallStatus === 'warning'
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            <ServerIcon className="h-4 w-4 mr-2" />
            {isChecking ? 'Memeriksa...' : 'Periksa Sekarang'}
          </button>
        </div>

        {/* Overall Status */}
        <div className={`p-4 rounded-lg mb-4 ${getStatusColor(overallStatus)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusIcon(overallStatus)}
              <div className="ml-3">
                <p className="font-medium">
                  Sistem {overallStatus === 'healthy' ? 'Normal' : overallStatus === 'warning' ? 'Perlu Perhatian' : 'Bermasalah'}
                </p>
                <p className="text-sm opacity-75">
                  {overallStatus === 'healthy'
                    ? 'Semua service berjalan normal'
                    : overallStatus === 'warning'
                    ? 'Beberapa service lambat'
                    : 'Ada service yang bermasalah'}
                </p>
              </div>
            </div>
            <CogIcon className={`h-8 w-8 ${overallStatus === 'healthy' ? 'opacity-20' : 'animate-spin'}`} />
          </div>
        </div>

        {/* Service List */}
        <div className="space-y-3">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center flex-1">
                {getStatusIcon(service.status)}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{service.name}</p>
                  <p className="text-xs text-gray-500">
                    Response: {service.responseTime}ms
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-medium ${
                  service.status === 'healthy'
                    ? 'text-green-600'
                    : service.status === 'warning'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  {service.status === 'healthy' ? 'OK' : service.status === 'warning' ? 'SLOW' : 'ERROR'}
                </p>
                <p className="text-xs text-gray-500">
                  {service.lastCheck.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Last Updated */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Terakhir diperbarui: {new Date().toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;