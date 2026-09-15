import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { AuthPage } from './components/auth/AuthPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DemoTourBar } from './components/layout/DemoTourBar';

import { DashboardView } from './components/dashboard/DashboardView';
import { AppointmentsView } from './components/appointments/AppointmentsView';
import { RecoveryHub } from './components/recovery/RecoveryHub';
import { CustomersView } from './components/customers/CustomersView';
import { StaffServicesView } from './components/staff/StaffServicesView';
import { InventoryView } from './components/inventory/InventoryView';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';

import { WaitlistMatchModal } from './components/recovery/WaitlistMatchModal';
import { AppointmentModal } from './components/appointments/AppointmentModal';
import { PhoneSimulatorModal } from './components/notifications/PhoneSimulatorModal';
import { ReceiptModal } from './components/invoices/ReceiptModal';
import { DormantClientsModal } from './components/customers/DormantClientsModal';
import { PayrollModal } from './components/staff/PayrollModal';

import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const MainApp = () => {
  const {
    activeTab,
    toastMessage,
    receiptModalOpen,
    setReceiptModalOpen,
    receiptAppointment,
    dormantModalOpen,
    setDormantModalOpen,
    payrollModalOpen,
    setPayrollModalOpen
  } = useApp();

  const { isOwner, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'appointments':
        return <AppointmentsView />;
      case 'recovery':
        return <RecoveryHub />;
      case 'customers':
        return <CustomersView />;
      case 'staff':
        return <StaffServicesView />;
      case 'inventory':
        return <InventoryView />;
      case 'simulator':
        return <NotificationCenter />;
      case 'analytics':
        return isOwner ? <AnalyticsView /> : <DashboardView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="main-content">
        <Navbar />
        <DemoTourBar />

        {/* Tab View */}
        {renderActiveView()}

        {/* Global Modals */}
        <WaitlistMatchModal />
        <AppointmentModal />
        <PhoneSimulatorModal />
        <ReceiptModal
          appointment={receiptAppointment}
          isOpen={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
        />
        <DormantClientsModal
          isOpen={dormantModalOpen}
          onClose={() => setDormantModalOpen(false)}
        />
        <PayrollModal
          isOpen={payrollModalOpen}
          onClose={() => setPayrollModalOpen(false)}
        />

        {/* Toast Alert Popups */}
        {toastMessage && (
          <div className="toast-container">
            <div className={`toast-item ${toastMessage.type}`}>
              {toastMessage.type === 'success' && <CheckCircle2 size={18} color="var(--emerald)" />}
              {toastMessage.type === 'warning' && <AlertTriangle size={18} color="var(--amber)" />}
              {toastMessage.type === 'error' && <AlertCircle size={18} color="var(--rose)" />}
              {toastMessage.type === 'info' && <Info size={18} color="var(--primary)" />}
              <span>{toastMessage.message}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </AuthProvider>
  );
}
