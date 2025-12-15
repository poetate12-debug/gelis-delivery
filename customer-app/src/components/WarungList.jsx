import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

const WarungList = ({ warungs }) => {
  const navigate = useNavigate();

  const handleWarungClick = (warungId) => {
    navigate(`/warung/${warungId}`);
  };

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} className="h-4 w-4 text-yellow-400" />
        ))}
        {halfStars === 1 && (
          <StarIcon key="half" className="h-4 w-4 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIconOutline key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {warungs.map((warung) => (
        <div
          key={warung.id}
          onClick={() => handleWarungClick(warung.id)}
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Warung Image */}
            <div className="sm:w-48 sm:h-36 h-48">
              {warung.fotoUrl ? (
                <img
                  src={warung.fotoUrl}
                  alt={warung.namaWarung}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
            </div>

            {/* Warung Info */}
            <div className="flex-1 p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{warung.namaWarung}</h3>
                  <p className="text-sm text-gray-600 mt-1">{warung.alamat}</p>
                  <p className="text-sm text-gray-500 mt-1">Wilayah: {warung.wilayah}</p>
                </div>
                <div className="mt-2 sm:mt-0 sm:ml-4">
                  {warung.isOpen ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Buka
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Tutup
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {warung.rating && renderRating(warung.rating)}
                  <span>•</span>
                  <span>{warung.jumlahPesanan || 0} pesanan</span>
                  <span>•</span>
                  <span>{warung.jarak || '0.5'} km</span>
                </div>
                {warung.minOrder && (
                  <p className="text-sm text-gray-600 mt-2 sm:mt-0">
                    Min. order Rp {warung.minOrder.toLocaleString('id-ID')}
                  </p>
                )}
              </div>

              {/* Categories */}
              {warung.kategori && warung.kategori.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {warung.kategori.slice(0, 3).map((kategori, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {kategori}
                    </span>
                  ))}
                  {warung.kategori.length > 3 && (
                    <span className="text-xs text-gray-500">+{warung.kategori.length - 3} lainnya</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WarungList;