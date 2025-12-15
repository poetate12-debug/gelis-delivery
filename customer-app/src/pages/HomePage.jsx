import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import WarungList from '../components/WarungList';
import MenuPopuler from '../components/MenuPopuler';
import LocationModal from '../components/LocationModal';
import { firestoreService } from '../firebaseServices.js';

const HomePage = () => {
  const [warungs, setWarungs] = useState([]);
  const [menuPopuler, setMenuPopuler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWilayah, setSelectedWilayah] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial data
  useEffect(() => {
    loadData();
  }, [selectedWilayah]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load warungs
      const warungConditions = selectedWilayah
        ? [['wilayah', '==', selectedWilayah], ['isActive', '==', true]]
        : [['isActive', '==', true]];

      const warungData = await firestoreService.queryDocuments(
        'warungs',
        warungConditions,
        null,
        20
      );
      setWarungs(warungData);

      // Load popular menus
      const menuConditions = selectedWilayah
        ? [['wilayah', '==', selectedWilayah], ['isAvailable', '==', true]]
        : [['isAvailable', '==', true]];

      const menuData = await firestoreService.queryDocuments(
        'menus',
        menuConditions,
        'orderCount',
        10
      );
      setMenuPopuler(menuData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      loadData();
      return;
    }

    try {
      // Search warungs by name
      const warungResults = await firestoreService.queryDocuments(
        'warungs',
        [
          ['isActive', '==', true],
          ['namaWarung', '>=', query],
          ['namaWarung', '<=', query + '\uf8ff']
        ]
      );

      // Search menus by name
      const menuResults = await firestoreService.queryDocuments(
        'menus',
        [
          ['isAvailable', '==', true],
          ['namaMenu', '>=', query],
          ['namaMenu', '<=', query + '\uf8ff']
        ]
      );

      // Get unique warungs from menu results
      const warungIdsFromMenus = [...new Set(menuResults.map(menu => menu.warungId))];
      const warungsFromMenus = await Promise.all(
        warungIdsFromMenus.map(async (warungId) => {
          return await firestoreService.getDocument('warungs', warungId);
        })
      );

      // Combine results
      const allWarungs = [...warungResults, ...warungsFromMenus.filter(Boolean)];
      const uniqueWarungs = allWarungs.filter((warung, index, self) =>
        index === self.findIndex((w) => w.id === warung.id)
      );

      setWarungs(uniqueWarungs);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleLocationSelect = (wilayah) => {
    setSelectedWilayah(wilayah);
    setShowLocationModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} onLocationClick={() => setShowLocationModal(true)} />

      <main className="pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Location Display */}
          {selectedWilayah && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">
                <span className="font-medium">Lokasi:</span> {selectedWilayah}
              </p>
            </div>
          )}

          {/* Menu Populer Section */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Menu Populer Minggu Ini
              {selectedWilayah && <span className="text-sm text-gray-500 ml-2">({selectedWilayah})</span>}
            </h2>
            {menuPopuler.length > 0 ? (
              <MenuPopuler menus={menuPopuler} />
            ) : (
              <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
                Belum ada menu populer untuk wilayah ini
              </div>
            )}
          </section>

          {/* Warung List Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Warung Terdekat
              {searchQuery && <span className="text-sm text-gray-500 ml-2">("{searchQuery}")</span>}
            </h2>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                    <div className="flex space-x-4">
                      <div className="bg-gray-200 rounded-lg h-24 w-24"></div>
                      <div className="flex-1 space-y-2">
                        <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                        <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                        <div className="bg-gray-200 h-3 w-1/4 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : warungs.length > 0 ? (
              <WarungList warungs={warungs} />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada warung ditemukan</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery ? 'Coba kata kunci pencarian lain' : 'Pilih wilayah terdekat untuk melihat warung yang tersedia'}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <BottomNavigation />

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          onClose={() => setShowLocationModal(false)}
          onSelect={handleLocationSelect}
        />
      )}
    </div>
  );
};

export default HomePage;