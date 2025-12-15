import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, BuildingOfficeIcon, TruckIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signInWithPhone, verifyOTP, loading, error, clearError } = useAuth();
  const [activeTab, setActiveTab] = useState('customer');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const tabs = [
    {
      id: 'customer',
      name: 'Pelanggan',
      icon: UserIcon,
      description: 'Masuk untuk pesan makanan'
    },
    {
      id: 'partner',
      name: 'Mitra',
      icon: BuildingOfficeIcon,
      description: 'Masuk sebagai pemilik warung'
    },
    {
      id: 'driver',
      name: 'Driver',
      icon: TruckIcon,
      description: 'Masuk sebagai pengantar'
    }
  ];

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      alert('Silakan masukkan nomor telepon');
      return;
    }

    try {
      clearError();
      const result = await signInWithPhone(`+62${phoneNumber.replace(/^0/, '')}`);
      setConfirmationResult(result);
      setShowOTP(true);
    } catch (err) {
      console.error('Error sending OTP:', err);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      alert('Silakan masukkan kode OTP');
      return;
    }

    try {
      clearError();
      await verifyOTP(confirmationResult, otpCode);

      // Redirect based on role
      switch (activeTab) {
        case 'partner':
          window.location.href = '/partner-app';
          break;
        case 'driver':
          window.location.href = '/driver-app';
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
    }
  };

  const handleBackToPhone = () => {
    setShowOTP(false);
    setOtpCode('');
    setConfirmationResult(null);
    clearError();
  };

  const formatPhoneNumber = (value) => {
    // Only allow numbers and remove non-digit characters
    return value.replace(/\D/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-red-600">GELIS DELIVERY</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Masuk ke akun Anda untuk melanjutkan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowOTP(false);
                        clearError();
                      }}
                      className={`${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm`}
                    >
                      <Icon
                        className={`${
                          activeTab === tab.id ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'
                        } -ml-0.5 mr-2 h-5 w-5`}
                      />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Description */}
            <p className="mt-4 text-sm text-gray-600 text-center">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Phone Number Form */}
          {!showOTP ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Nomor Telepon
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">+62</span>
                  </div>
                  <input
                    id="phone"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    placeholder="812-3456-7890"
                    className="pl-12 block w-full border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    maxLength={13}
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Nomor WhatsApp aktif Anda akan digunakan untuk verifikasi
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !phoneNumber}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
                </button>
              </div>

              {/* Register Link for Customer */}
              {activeTab === 'customer' && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className="font-medium text-red-600 hover:text-red-500"
                    >
                      Daftar sekarang
                    </button>
                  </p>
                </div>
              )}

              {/* Partner Registration Info */}
              {activeTab === 'partner' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Ingin menjadi mitra?</strong> Hubungi admin untuk pendaftaran warung Anda.
                  </p>
                </div>
              )}
            </form>
          ) : (
            /* OTP Verification Form */
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Kode OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Masukkan 6 digit kode"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Masukkan kode OTP yang dikirim ke +62{phoneNumber}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBackToPhone}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Memverifikasi...' : 'Verifikasi'}
                </button>
              </div>

              <button
                type="button"
                className="w-full text-sm text-gray-600 hover:text-red-600"
                onClick={handleSendOTP}
              >
                Tidak menerima kode? Kirim ulang
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;