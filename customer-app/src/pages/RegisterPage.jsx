import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaLengkap: '',
    whatsapp: '',
    alamat: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage temp
    localStorage.setItem('registrationData', JSON.stringify(formData));

    // Redirect to WhatsApp
    const adminWhatsApp = '628123456789'; // Should get from settings
    const message = `Halo Admin, saya ingin mendaftar sebagai pelanggan GELIS DELIVERY:\n\nNama: ${formData.namaLengkap}\nWhatsApp: ${formData.whatsapp}\nAlamat: ${formData.alamat}`;
    window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');

    // Redirect to login
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-red-600">GELIS DELIVERY</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Daftar sebagai pelanggan baru
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="namaLengkap" className="block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                id="namaLengkap"
                name="namaLengkap"
                type="text"
                value={formData.namaLengkap}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                Nomor WhatsApp
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">+62</span>
                </div>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value.replace(/\D/g, '')})}
                  required
                  className="pl-12 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="alamat" className="block text-sm font-medium text-gray-700">
                Alamat Lengkap
              </label>
              <textarea
                id="alamat"
                name="alamat"
                rows={3}
                value={formData.alamat}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Daftar Sekarang
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-medium text-red-600 hover:text-red-500"
                >
                  Masuk
                </button>
              </p>
            </div>
          </form>

          <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Info:</strong> Setelah mendaftar, Anda akan diarahkan ke WhatsApp Admin untuk verifikasi akun.
              Pengguna yang belum diverifikasi memiliki batas transaksi Rp 50.000.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;