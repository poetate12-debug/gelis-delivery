import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlusIcon,
  BuildingOfficeIcon,
  TruckIcon,
  DocumentPlusIcon,
  ChartBarIcon,
  BellIcon,
  CogIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      name: 'Tambah Pelanggan',
      description: 'Daftarkan pelanggan baru',
      icon: UserPlusIcon,
      action: () => navigate('/customers/add'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Tambah Mitra',
      description: 'Daftarkan mitra warung baru',
      icon: BuildingOfficeIcon,
      action: () => navigate('/partners/add'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Tambah Driver',
      description: 'Daftarkan driver baru',
      icon: TruckIcon,
      action: () => navigate('/drivers/add'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'Buat Pesanan Manual',
      description: 'Buat pesanan untuk pelanggan',
      icon: DocumentPlusIcon,
      action: () => navigate('/orders/create'),
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
      name: 'Lihat Laporan',
      description: 'Analitik dan laporan sistem',
      icon: ChartBarIcon,
      action: () => navigate('/reports'),
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      name: 'Notifikasi',
      description: 'Kirim notifikasi ke pengguna',
      icon: BellIcon,
      action: () => navigate('/notifications'),
      color: 'bg-pink-500 hover:bg-pink-600'
    },
    {
      name: 'Pengaturan',
      description: 'Konfigurasi sistem',
      icon: CogIcon,
      action: () => navigate('/settings'),
      color: 'bg-gray-500 hover:bg-gray-600'
    },
    {
      name: 'Export Data',
      description: 'Export data dalam berbagai format',
      icon: ArrowDownTrayIcon,
      action: () => navigate('/export'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} p-4 rounded-lg shadow hover:shadow-md transition-all duration-200 text-white text-left group`}
            >
              <Icon className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="font-medium text-white">{action.name}</h3>
              <p className="text-sm text-white/80 mt-1">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;