import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TruckIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const { signInWithPhone, verifyOTP, loading, error, clearError } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

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
      // Redirect to dashboard will happen in AuthContext
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
    return value.replace(/\D/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-3 rounded-full">
            <TruckIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">GELIS Driver</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Login untuk mengakses dashboard driver
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
                    className="pl-12 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    maxLength={13}
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Masukkan nomor WhatsApp yang terdaftar
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !phoneNumber}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
                </button>
              </div>

              {/* Contact Admin Info */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Belum punya akun driver?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const adminWhatsApp = '628123456789';
                    window.open(`https://wa.me/${adminWhatsApp}?text=Halo Admin, saya ingin mendaftar sebagai driver GELIS DELIVERY`, '_blank');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                >
                  Hubungi Admin
                </button>
              </div>
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center text-2xl tracking-widest"
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
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Memverifikasi...' : 'Verifikasi'}
                </button>
              </div>

              <button
                type="button"
                className="w-full text-sm text-gray-600 hover:text-blue-600"
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