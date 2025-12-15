import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  BuildingOfficeIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: HomeIcon,
      current: location.pathname === '/',
      description: 'Ringkasan sistem'
    },
    {
      name: 'Kelola Pelanggan',
      href: '/customers',
      icon: UserGroupIcon,
      current: location.pathname === '/customers',
      description: 'Daftar semua pelanggan'
    },
    {
      name: 'Kelola Mitra',
      href: '/partners',
      icon: BuildingOfficeIcon,
      current: location.pathname === '/partners',
      description: 'Daftar semua mitra warung'
    },
    {
      name: 'Kelola Driver',
      href: '/drivers',
      icon: TruckIcon,
      current: location.pathname === '/drivers',
      description: 'Daftar semua driver'
    },
    {
      name: 'Semua Pesanan',
      href: '/orders',
      icon: ClipboardDocumentListIcon,
      current: location.pathname === '/orders',
      description: 'Daftar semua pesanan'
    },
    {
      name: 'Laporan',
      href: '/reports',
      icon: ChartBarIcon,
      current: location.pathname === '/reports',
      description: 'Laporan transaksi',
      children: [
        { name: 'Penjualan', href: '/reports/sales' },
        { name: 'Mitra', href: '/reports/partners' },
        { name: 'Driver', href: '/reports/drivers' }
      ]
    },
    {
      name: 'Setoran Driver',
      href: '/settlements',
      icon: BanknotesIcon,
      current: location.pathname.startsWith('/settlements'),
      description: 'Kelola setoran driver'
    },
    {
      name: 'Menu',
      href: '/menus',
      icon: DocumentIcon,
      current: location.pathname === '/menus',
      description: 'Lihat semua menu'
    },
    {
      name: 'Pengaturan',
      href: '/settings',
      icon: Cog6ToothIcon,
      current: location.pathname === '/settings',
      description: 'Pengaturan sistem'
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
        <h1 className="text-white text-xl font-bold">GELIS Admin</h1>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-300 rounded-full h-10 w-10 flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user?.displayName || 'Admin'}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.name}>
              <button
                onClick={() => !hasChildren && navigate(item.href)}
                className={`${
                  item.current
                    ? 'bg-gray-100 text-gray-900 border-r-2 border-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors`}
              >
                <Icon
                  className={`${
                    item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 flex-shrink-0 h-5 w-5`}
                />
                <span className="flex-1">{item.name}</span>
                {hasChildren && (
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {/* Submenu */}
              {hasChildren && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <button
                      key={child.name}
                      onClick={() => navigate(child.href)}
                      className={`${
                        location.pathname === child.href
                          ? 'bg-gray-100 text-gray-900 text-xs'
                          : 'text-gray-500 hover:text-gray-700 text-xs'
                      } group flex items-center px-3 py-2 rounded-md w-full text-left transition-colors`}
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
          Keluar
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white shadow-lg border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <SidebarContent />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-2 right-2 p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          <div className="w-10" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;