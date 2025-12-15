# 🛵 GELIS DELIVERY - Platform Layanan Pesan Antar Makanan

Platform terpadu untuk layanan pesan antar makanan dengan 4 aplikasi terintegrasi: Customer App, Partner App, Driver App, dan Admin Panel.

## ✨ Fitur Utama

### 📱 Customer App (PWA)
- Aplikasi mobile untuk pelanggan memesan makanan
- Login via WhatsApp dengan OTP verification
- Keranjang belanja dan tracking pesanan real-time
- Progressive Web App (PWA) - installable di mobile
- Mobile-first responsive design

### 🏪 Partner App (PWA)
- Dashboard untuk pemilik warung/restoran
- Manajemen menu dan pesanan
- Statistik penjualan dan laporan
- Status pesanan real-time
- PWA responsive untuk mobile & desktop

### 🚚 Driver App (PWA)
- Aplikasi untuk driver pengiriman
- Toggle status online/offline
- Notifikasi pesanan real-time dengan timer 30 detik
- Tracking pengiriman dan earnings dashboard
- PWA mobile-optimized

### 👨‍💼 Admin Panel (Web)
- Dashboard administrasi lengkap
- Manajemen users (customers, partners, drivers)
- Monitoring sistem dan analytics
- Laporan dan export data
- Web desktop application

## 🛠️ Teknologi

- **Frontend**: React 18 + Vite
- **Backend**: Firebase (Firestore, Authentication, Storage, Cloud Messaging)
- **Styling**: Tailwind CSS dengan custom themes
- **PWA**: Service Workers dan Web App Manifests
- **Real-time**: Firebase Cloud Messaging
- **Authentication**: Phone verification via WhatsApp
- **Deployment**: Hostinger dengan auto-build GitHub Actions

## 📁 Struktur Project

```
gelis-delivery/
├── customer-app/          # Customer PWA Application
├── partner-app/           # Partner Dashboard PWA
├── driver-app/            # Driver PWA Application
├── admin-panel/           # Admin Panel Web App
├── shared/                # Shared Firebase Services
├── dist/                  # Production Build Output
├── .github/workflows/     # GitHub Actions CI/CD
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn
- Firebase project setup

### Installation

1. **Clone repository**
```bash
git clone https://github.com/poetate12-debug/gelis-delivery.git
cd gelis-delivery
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install dependencies untuk setiap app
npm run install:all
```

3. **Firebase Configuration**
- Buat project di [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication, Firestore, Storage, dan Cloud Messaging
- Copy konfigurasi ke `shared/config.js`

4. **Jalankan aplikasi**
```bash
# Customer App
cd customer-app && npm run dev

# Partner App
cd partner-app && npm run dev

# Driver App
cd driver-app && npm run dev

# Admin Panel
cd admin-panel && npm run dev
```

## 🔥 Firebase Setup

### 1. Authentication
- Enable **Phone** authentication
- Configure reCAPTCHA (untuk web testing)

### 2. Firestore Database
- Create collections:
  - `users` - Customer, partner, driver data
  - `warungs` - Restaurant/partner information
  - `menus` - Menu items
  - `orders` - Order data
  - `drivers` - Driver status

### 3. Storage
- Enable Cloud Storage
- Create folders: `menus/`, `profiles/`, `warungs/`

### 4. Cloud Messaging
- Enable FCM untuk notifikasi real-time
- Setup service worker untuk PWA notifications

## 🏗️ Build untuk Production

### Local Build
```bash
# Build semua aplikasi
npm run build:production

# Build individual apps
cd customer-app && npm run build
cd partner-app && npm run build
cd driver-app && npm run build
cd admin-panel && npm run build
```

### Deployment Structure
Build akan menghasilkan struktur:
```
dist/
├── index.html              # Landing page utama
├── .htaccess              # Konfigurasi Hostinger
├── customer/              # Customer App build
├── partner/               # Partner App build
├── driver/                # Driver App build
└── admin/                 # Admin Panel build
```

## 🌐 Deployment ke Hostinger

### 1. Manual Upload
1. Run `npm run build:production`
2. Upload folder `dist/` ke Hostinger public_html
3. Aplikasi akan tersedia di:
   - Main: https://gelis-delivery.cloud/
   - Customer: https://gelis-delivery.cloud/customer/
   - Partner: https://gelis-delivery.cloud/partner/
   - Driver: https://gelis-delivery.cloud/driver/
   - Admin: https://gelis-delivery.cloud/admin/

### 2. GitHub Actions (Auto-Build)
Push ke branch `main` akan trigger auto-build:
```bash
git add .
git commit -m "Update aplikasi"
git push origin main
```

Download build artifacts dari GitHub Actions dan upload ke hosting.

## 📱 URL Aplikasi

Setelah deployment:

- **Landing Page**: https://gelis-delivery.cloud/
- **Customer App**: https://gelis-delivery.cloud/customer/
- **Partner Dashboard**: https://gelis-delivery.cloud/partner/
- **Driver App**: https://gelis-delivery.cloud/driver/
- **Admin Panel**: https://gelis-delivery.cloud/admin/

## 🔐 Konfigurasi

### Firebase Config
Edit `shared/config.js`:
```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Environment Variables
Set environment variables untuk production:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_PROJECT_ID`
- etc.

## 🎯 User Roles & Flow

### Customer Flow
1. Login dengan nomor HP → WhatsApp OTP
2. Browse warungs & menu
3. Add ke cart & checkout
4. Track pengiriman real-time

### Partner Flow
1. Register sebagai warung partner
2. Setup menu & profil
3. Terima & manage pesanan
4. View analytics & laporan

### Driver Flow
1. Register sebagai driver
2. Toggle online/offline status
3. Terma pesanan (30s timer)
4. Update status pengiriman

### Admin Flow
1. Login dengan admin credentials
2. Monitor semua aktivitas sistem
3. Manage users & settings
4. Generate laporan

## 🔧 Scripts

```bash
# Development
npm run dev                    # Jalankan semua apps
npm run install:all           # Install semua dependencies

# Production
npm run build:production     # Build semua apps
npm run clean                 # Clean build folders

# Individual app commands
cd customer-app && npm run dev
cd partner-app && npm run build
```

## 🐛 Troubleshooting

### Common Issues

**Build Error: "border-border" unknown utility**
- Fixed dengan mengganti `@apply border-border` ke `@apply border-gray-200`

**JSX Error in .js files**
- Fixed dengan mengubah ekstensi `.js` ke `.jsx` untuk React components

**Firebase import errors**
- Copy shared files ke app src folders
- Update import paths ke relative paths

**PostCSS plugin errors**
- Install `@tailwindcss/postcss` dan update config

### PWA Issues
- Service worker registration perlu HTTPS
- Manifest file perlu valid icons
- Cache strategy untuk offline functionality

## 📝 API Endpoints

Firebase Services yang digunakan:
- `authService` - Authentication & user management
- `firestoreService` - Database operations
- `storageService` - File upload & management
- `messagingService` - Push notifications

## 🎨 Design System

### Color Schemes
- **Customer**: Blue (#3B82F6)
- **Partner**: Green (#10B981)
- **Driver**: Yellow (#F59E0B)
- **Admin**: Purple (#8B5CF6)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase untuk backend services
- React & Vite untuk frontend framework
- Tailwind CSS untuk styling
- Heroicons untuk icons
- Hostinger untuk hosting

---

**🚀 GELIS DELIVERY** - *Platform Layanan Pesan Antar Makanan Terpadu*

Built with ❤️ using React & Firebase