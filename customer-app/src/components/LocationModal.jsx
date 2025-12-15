import React, { useState, useEffect } from 'react';
import { XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline';

const LocationModal = ({ onClose, onSelect }) => {
  const [wilayahList, setWilayahList] = useState([]);
  const [selectedWilayah, setSelectedWilayah] = useState('');
  const [loading, setLoading] = useState(false);

  // Daftar wilayah contoh - bisa diambil dari database atau API
  const availableWilayah = [
    'Jakarta Pusat',
    'Jakarta Utara',
    'Jakarta Selatan',
    'Jakarta Timur',
    'Jakarta Barat',
    'Bogor',
    'Depok',
    'Tangerang',
    'Bekasi',
    'Bandung',
    'Surabaya',
    'Yogyakarta',
    'Semarang',
    'Malang'
  ];

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Here you could use reverse geocoding to get the actual wilayah name
          // For now, we'll just set a default or let user choose
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    }
  }, []);

  const handleSelect = (wilayah) => {
    setSelectedWilayah(wilayah);
    onSelect(wilayah);
  };

  const handleCurrentLocation = () => {
    // Implement getting current location and converting to wilayah
    // For now, just select first available wilayah
    handleSelect(availableWilayah[0]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Pilih Wilayah</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Current Location Button */}
          <button
            onClick={handleCurrentLocation}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MapPinIcon className="h-5 w-5" />
            <span>{loading ? 'Mendapatkan lokasi...' : 'Gunakan Lokasi Saat Ini'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">atau pilih wilayah</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Wilayah List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableWilayah.map((wilayah) => (
              <button
                key={wilayah}
                onClick={() => handleSelect(wilayah)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedWilayah === wilayah
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{wilayah}</p>
                    <p className="text-sm text-gray-500">Lihat warung dan menu di {wilayah}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Wilayah Display */}
          {selectedWilayah && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Wilayah dipilih:</span> {selectedWilayah}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={() => selectedWilayah && onSelect(selectedWilayah)}
            disabled={!selectedWilayah}
            className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;