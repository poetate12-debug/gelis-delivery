import React from 'react';
import { useNavigate } from 'react-router-dom';

const MenuPopuler = ({ menus }) => {
  const navigate = useNavigate();

  const handleMenuClick = (warungId, menuId) => {
    navigate(`/warung/${warungId}#menu-${menuId}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {menus.map((menu) => (
        <div
          key={menu.id}
          onClick={() => handleMenuClick(menu.warungId, menu.id)}
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
        >
          <div className="aspect-square relative">
            {menu.fotoUrl ? (
              <img
                src={menu.fotoUrl}
                alt={menu.namaMenu}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            )}

            {/* Discount Badge */}
            {menu.diskon && menu.diskon > 0 && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                {menu.diskon}% OFF
              </div>
            )}

            {/* Popular Badge */}
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              ⭐ Populer
            </div>
          </div>

          <div className="p-3">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{menu.namaMenu}</h3>
            <p className="text-xs text-gray-500 mt-1">{menu.namaWarung}</p>

            <div className="mt-2 flex items-center justify-between">
              <div>
                {menu.diskon && menu.diskon > 0 ? (
                  <div>
                    <p className="text-xs text-gray-400 line-through">
                      Rp {menu.hargaAsli?.toLocaleString('id-ID') || menu.harga.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm font-bold text-red-600">
                      Rp {Math.round(menu.harga * (1 - menu.diskon / 100)).toLocaleString('id-ID')}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-gray-900">
                    Rp {menu.harga.toLocaleString('id-ID')}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-2 flex items-center text-xs text-gray-500">
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {menu.estimatedTime || '15-30'} min
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuPopuler;