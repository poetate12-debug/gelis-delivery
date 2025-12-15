import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  BanknotesIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PowerIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, driver, signOut, updateDriverStatus, goOffline } = useAuth();
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
      icon: ClipboardDocumentListIcon,
      current: location.pathname === '/orders'
    },
    {
      name: 'Peta',
      href: '/map',
      icon: MapPinIcon,
      current: location.pathname === '/map'
    },
    {
      name: 'Pendapatan',
      href: '/earnings',
      icon: BanknotesIcon,
      current: location.pathname === '/earnings'
    },
    {
      name: 'Profil',
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

  const handleStatusToggle = () => {
    if (driver?.status === 'available') {
      goOffline();
    } else {
      updateDriverStatus('available');
    }
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-600">
        <h1 className="text-white text-xl font-bold">GELIS Driver</h1>
      </div>

      {/* Driver Status */}
      {driver && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">{user?.displayName || 'Driver'}</h3>
            <button
              onClick={handleStatusToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                driver.status === 'available' ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  driver.status === 'available' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Status: <span className={driver.status === 'available' ? 'text-green-600' : 'text-gray-600'}>
              {driver.status === 'available' ? 'Tersedia' : 'Tidak Tersedia'}
            </span>
          </p>
          {driver.rating && (
            <p className="text-xs text-gray-500 mt-1">
              Rating: ⭐ {driver.rating.toFixed(1)}
            </p>
          )}
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
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left`}
            >
              <Icon
                className={`${
                  item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 flex-shrink-0 h-6 w-6`}
              />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
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
          <h1 className="text-lg font-semibold text-blue-600">GELIS Driver</h1>
          {driver?.status === 'available' && (
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-xs text-green-600">Online</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;