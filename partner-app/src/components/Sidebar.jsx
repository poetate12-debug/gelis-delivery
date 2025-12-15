import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, warung, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: HomeIcon,
      current: location.pathname === '/'
    },
    {
      name: 'Pesanan',
      href: '/orders',
      icon: ShoppingCartIcon,
      current: location.pathname === '/orders'
    },
    {
      name: 'Menu',
      href: '/menu',
      icon: PlusCircleIcon,
      current: location.pathname === '/menu'
    },
    {
      name: 'Laporan',
      href: '/reports',
      icon: ChartBarIcon,
      current: location.pathname === '/reports'
    },
    {
      name: 'Profil Warung',
      href: '/profile',
      icon: UserCircleIcon,
      current: location.pathname === '/profile'
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
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-green-600">
        <h1 className="text-white text-xl font-bold">GELIS Mitra</h1>
      </div>

      {/* Warung Info */}
      {warung && (
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-900">{warung.namaWarung}</h2>
          <p className="text-xs text-gray-500">{warung.alamat}</p>
          <div className="mt-2 flex items-center">
            {warung.isOpen ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Buka
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Tutup
              </span>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.href)}
              className={`${
                item.current
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left`}
            >
              <Icon
                className={`${
                  item.current ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 flex-shrink-0 h-6 w-6`}
              />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Settings & Logout */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-3"
        >
          <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
          Pengaturan
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center text-sm font-medium text-gray-600 hover:text-red-600"
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
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white shadow-lg">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <SidebarContent />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-2 right-2 p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-green-600">GELIS Mitra</h1>
          <div className="w-10" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;