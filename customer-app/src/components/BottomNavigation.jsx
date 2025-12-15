import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import {
  HomeIcon,
  ShoppingBagIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getItemCount } = useCart();

  const itemCount = getItemCount();
  const currentPath = location.pathname;

  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: (active) => active ? HomeIconSolid : HomeIcon
    },
    {
      name: 'Pesanan',
      href: '/orders',
      icon: (active) => active ? ShoppingBagIconSolid : ShoppingBagIconSolid
    },
    {
      name: 'Profil',
      href: '/profile',
      icon: (active) => active ? UserIconSolid : UserIcon
    }
  ];

  // Only show on mobile
  if (window.innerWidth >= 768) {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon(isActive);

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`flex flex-col items-center py-2 px-3 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="relative">
                  <Icon className="h-6 w-6" />
                  {item.name === 'Pesanan' && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </span>
                <span className="mt-1">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;