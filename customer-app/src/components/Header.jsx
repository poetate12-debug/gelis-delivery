import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

const Header = ({ onSearch, onLocationClick }) => {
  const { user } = useAuth();
  const { getItemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const itemCount = getItemCount();

  return (
    <>
      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-red-600">GELIS DELIVERY</h1>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari warung atau menu..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-4">
              {/* Location Button - Visible on all screens */}
              <button
                onClick={onLocationClick}
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">Lokasi</span>
              </button>

              {/* Cart Button - Hidden on mobile, in bottom nav instead */}
              <button className="hidden md:flex relative items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors">
                <ShoppingCartIcon className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
                <span>Keranjang</span>
              </button>

              {/* User Profile/Login */}
              <div className="flex items-center space-x-1">
                {user ? (
                  <div className="flex items-center space-x-2">
                    {!user.isVerified && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Belum Verifikasi
                      </span>
                    )}
                    <UserIcon className="h-6 w-6 text-gray-700" />
                    <span className="hidden sm:block text-gray-700">{user.displayName || user.phoneNumber}</span>
                  </div>
                ) : (
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors">
                    <UserIcon className="h-6 w-6" />
                    <span className="hidden sm:inline">Masuk</span>
                  </button>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari warung atau menu..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-2 text-gray-700">
                    <UserIcon className="h-5 w-5" />
                    <span>{user.displayName || user.phoneNumber}</span>
                    {!user.isVerified && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Belum Verifikasi
                      </span>
                    )}
                  </div>
                  <button className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                    Pesanan Saya
                  </button>
                  <button className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                    Profil
                  </button>
                  <button className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                    Keluar
                  </button>
                </>
              ) : (
                <button className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  Masuk / Daftar
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;