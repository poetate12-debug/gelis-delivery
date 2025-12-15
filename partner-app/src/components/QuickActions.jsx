import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  PlusCircleIcon,
  EyeIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const QuickActions = () => {
  const navigate = useNavigate();
  const { warung } = useAuth();

  const actions = [
    {
      name: 'Tambah Menu',
      description: 'Tambah menu baru ke warung',
      icon: PlusCircleIcon,
      action: () => navigate('/menu/add'),
      color: 'bg-green-500'
    },
    {
      name: 'Lihat Menu',
      description: 'Kelola menu yang ada',
      icon: EyeIcon,
      action: () => navigate('/menu'),
      color: 'bg-blue-500'
    },
    {
      name: 'Lihat Laporan',
      description: 'Lihat laporan penjualan',
      icon: DocumentTextIcon,
      action: () => navigate('/reports'),
      color: 'bg-purple-500'
    },
    {
      name: 'Notifikasi',
      description: 'Lihat notifikasi pesanan',
      icon: BellIcon,
      action: () => navigate('/notifications'),
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-left"
            >
              <div className={`${action.color} p-3 rounded-lg inline-flex mb-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-900">{action.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;