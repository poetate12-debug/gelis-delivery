import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import PartnersPage from './pages/PartnersPage';
import DriversPage from './pages/DriversPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ReportsPage from './pages/ReportsPage';
import SalesReportPage from './pages/SalesReportPage';
import PartnersReportPage from './pages/PartnersReportPage';
import DriversReportPage from './pages/DriversReportPage';
import SettlementsPage from './pages/SettlementsPage';
import MenusPage from './pages/MenusPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/add" element={<CustomersPage />} />
          <Route path="/customers/:id" element={<CustomersPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/partners/add" element={<PartnersPage />} />
          <Route path="/partners/:id" element={<PartnersPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/drivers/add" element={<DriversPage />} />
          <Route path="/drivers/:id" element={<DriversPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/create" element={<OrderDetailPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/sales" element={<SalesReportPage />} />
          <Route path="/reports/partners" element={<PartnersReportPage />} />
          <Route path="/reports/drivers" element={<DriversReportPage />} />
          <Route path="/settlements" element={<SettlementsPage />} />
          <Route path="/menus" element={<MenusPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
