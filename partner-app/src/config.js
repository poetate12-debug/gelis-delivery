// Konfigurasi bersama untuk GELIS DELIVERY
export const firebaseConfig = {
  apiKey: "AIzaSyBtFhSm-94AJioYgKuX1rAZFR-ZZNDCK38",
  authDomain: "gelis-delivery-563c0.firebaseapp.com",
  projectId: "gelis-delivery-563c0",
  storageBucket: "gelis-delivery-563c0.firebasestorage.app",
  messagingSenderId: "983429410102",
  appId: "1:983429410102:web:96ecff97afa3a644399797",
  measurementId: "G-29Q0ZPGMB3"
};

// Konfigurasi koleksi Firestore
export const collections = {
  users: 'users',
  warungs: 'warungs',
  menus: 'menus',
  orders: 'orders',
  drivers: 'drivers',
  transactions: 'transactions',
  settings: 'settings'
};

// Konfigurasi role pengguna
export const userRoles = {
  CUSTOMER: 'customer',
  PARTNER: 'partner',
  DRIVER: 'driver',
  ADMIN: 'admin'
};

// Konfigurasi status pesanan
export const orderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  PICKED_UP: 'picked_up',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Konfigurasi status driver
export const driverStatus = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  OFFLINE: 'offline'
};

// Batas maksimum transaksi untuk pengguna belum verifikasi
export const unverifiedUserLimit = 50000;

// Konfigurasi biaya layanan
export const serviceConfig = {
  feePercentage: 0.1, // 10% dari total transaksi
  minimumFee: 5000 // Minimum biaya layanan
};