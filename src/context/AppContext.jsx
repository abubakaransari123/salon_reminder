import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_BUSINESS,
  INITIAL_STAFF,
  INITIAL_SERVICES,
  INITIAL_CUSTOMERS,
  INITIAL_WAITLIST,
  INITIAL_APPOINTMENTS,
  INITIAL_INVENTORY,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';
import {
  loadFromStorage,
  saveToStorage,
  exportBackupJSON,
  importBackupJSON,
  clearAllStorage,
  STORAGE_KEYS
} from '../utils/storage';
import { calculateReliabilityScore, calculateDashboardKPIs } from '../utils/calculations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- Persistent States ---
  const [business, setBusiness] = useState(() =>
    loadFromStorage(STORAGE_KEYS.BUSINESS, INITIAL_BUSINESS)
  );
  const [staff, setStaff] = useState(() =>
    loadFromStorage(STORAGE_KEYS.STAFF, INITIAL_STAFF)
  );
  const [services, setServices] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SERVICES, INITIAL_SERVICES)
  );
  const [customers, setCustomers] = useState(() =>
    loadFromStorage(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS)
  );
  const [appointments, setAppointments] = useState(() =>
    loadFromStorage(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS)
  );
  const [waitlist, setWaitlist] = useState(() =>
    loadFromStorage(STORAGE_KEYS.WAITLIST, INITIAL_WAITLIST)
  );
  const [inventory, setInventory] = useState(() =>
    loadFromStorage('nsk_v1_inventory', INITIAL_INVENTORY)
  );
  const [notifications, setNotifications] = useState(() =>
    loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );

  // --- UI / Interactive States ---
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'appointments', 'recovery', 'customers', 'staff', 'inventory', 'simulator', 'analytics', 'settings'
  const [selectedAppointmentForSimulator, setSelectedAppointmentForSimulator] = useState(null);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [recoveryModalSlot, setRecoveryModalSlot] = useState(null);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Zero-API Feature Modals
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptAppointment, setReceiptAppointment] = useState(null);
  const [dormantModalOpen, setDormantModalOpen] = useState(false);
  const [payrollModalOpen, setPayrollModalOpen] = useState(false);

  const [demoTourStep, setDemoTourStep] = useState(0); // 0 = inactive, 1..6 = active steps
  const [toastMessage, setToastMessage] = useState(null);

  // Sync with LocalStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BUSINESS, business);
  }, [business]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STAFF, staff);
  }, [staff]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SERVICES, services);
  }, [services]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
  }, [customers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
  }, [appointments]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WAITLIST, waitlist);
  }, [waitlist]);

  useEffect(() => {
    saveToStorage('nsk_v1_inventory', inventory);
  }, [inventory]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --- Confetti helper ---
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered', e);
    }
  };

  // --- Business Actions ---
  const updateBusiness = (updatedData) => {
    setBusiness(prev => ({ ...prev, ...updatedData }));
    showToast('Business settings updated successfully', 'success');
  };

  // --- Appointment Actions ---
  const addAppointment = (appData) => {
    const newApp = {
      id: `app_${Date.now()}`,
      ...appData,
      status: appData.status || 'booked',
      reminderSent: false,
      reminderStatus: 'Scheduled'
    };

    setAppointments(prev => [newApp, ...prev]);

    // Update customer total visits
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === appData.customerId) {
          return {
            ...c,
            totalVisits: (c.totalVisits || 0) + 1
          };
        }
        return c;
      })
    );

    showToast(`Appointment booked for ${appData.customerName}`, 'success');
    return newApp;
  };

  const updateAppointment = (id, updatedData) => {
    setAppointments(prev =>
      prev.map(app => (app.id === id ? { ...app, ...updatedData } : app))
    );
    showToast('Appointment updated', 'info');
  };

  const updateAppointmentStatus = (id, newStatus, notes = '') => {
    const targetApp = appointments.find(a => a.id === id);
    if (!targetApp) return;

    if (newStatus === 'no-show') {
      markNoShow(id);
      return;
    }

    if (newStatus === 'cancelled') {
      cancelAppointment(id, notes || 'Cancelled by staff');
      return;
    }

    setAppointments(prev =>
      prev.map(app => {
        if (app.id === id) {
          return {
            ...app,
            status: newStatus,
            notes: notes ? `${app.notes ? app.notes + ' | ' : ''}${notes}` : app.notes
          };
        }
        return app;
      })
    );

    if (newStatus === 'completed') {
      // Update customer completed count & total spend & loyalty points
      const pointsEarned = Math.round((Number(targetApp.price) || 0) / 100);

      setCustomers(prev =>
        prev.map(c => {
          if (c.id === targetApp.customerId) {
            return {
              ...c,
              completedVisits: (c.completedVisits || 0) + 1,
              totalSpend: (c.totalSpend || 0) + (Number(targetApp.price) || 0),
              loyaltyPoints: (c.loyaltyPoints || 0) + pointsEarned,
              lastVisitDate: new Date().toISOString().split('T')[0]
            };
          }
          return c;
        })
      );
      showToast(`Appointment with ${targetApp.customerName} Completed! +${pointsEarned} Loyalty Points added`, 'success');
    } else {
      showToast(`Status updated to ${newStatus}`, 'info');
    }
  };

  // --- CORE USP: Mark No-Show ---
  const markNoShow = (id) => {
    const targetApp = appointments.find(a => a.id === id);
    if (!targetApp) return;

    // Update appointment
    setAppointments(prev =>
      prev.map(app => {
        if (app.id === id) {
          return {
            ...app,
            status: 'no-show',
            lostRevenue: Number(app.price) || 0,
            emptySlotDetected: true,
            notes: `${app.notes || ''} [NO-SHOW at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]`
          };
        }
        return app;
      })
    );

    // Update customer reliability
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === targetApp.customerId) {
          const updatedNoShows = (c.noShows || 0) + 1;
          return {
            ...c,
            noShows: updatedNoShows
          };
        }
        return c;
      })
    );

    // Push alert notification
    const newNotif = {
      id: `notif_${Date.now()}`,
      type: 'no_show_alert',
      title: `🚨 No-Show Detected: ${targetApp.customerName}`,
      message: `Missed ${targetApp.serviceName} at ${targetApp.time}. Lost revenue: ${business.currency === 'INR' ? '₹' : business.currency === 'PKR' ? 'Rs. ' : '$'}${targetApp.price}. Slot opened for waitlist recovery!`,
      timestamp: new Date().toISOString(),
      read: false,
      actionType: 'open_recovery',
      targetSlotId: id
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Marked as NO-SHOW. Lost revenue logged!`, 'warning');
  };

  // --- Cancel Appointment & Detect Empty Slot ---
  const cancelAppointment = (id, reason = 'Client cancellation') => {
    const targetApp = appointments.find(a => a.id === id);
    if (!targetApp) return;

    setAppointments(prev =>
      prev.map(app => {
        if (app.id === id) {
          return {
            ...app,
            status: 'cancelled',
            emptySlotDetected: true,
            cancellationReason: reason,
            notes: `${app.notes || ''} [Cancelled: ${reason}]`
          };
        }
        return app;
      })
    );

    // Increment customer cancellations
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === targetApp.customerId) {
          return {
            ...c,
            cancellations: (c.cancellations || 0) + 1
          };
        }
        return c;
      })
    );

    // Push notification
    const newNotif = {
      id: `notif_${Date.now()}`,
      type: 'empty_slot',
      title: `⚡ Empty Slot Alert: ${targetApp.time} today`,
      message: `${targetApp.customerName} cancelled ${targetApp.serviceName}. Slot available for immediate waitlist recovery!`,
      timestamp: new Date().toISOString(),
      read: false,
      actionType: 'open_recovery',
      targetSlotId: id
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Appointment cancelled. Slot marked for recovery!`, 'info');
  };

  // --- CORE USP: 1-Click Waitlist Recovery ---
  const recoverEmptySlotWithWaitlist = (appointmentId, waitlistEntryId) => {
    const targetSlot = appointments.find(a => a.id === appointmentId);
    const waitlistEntry = waitlist.find(w => w.id === waitlistEntryId);

    if (!targetSlot || !waitlistEntry) {
      showToast('Could not find slot or waitlist entry', 'error');
      return;
    }

    const price = Number(targetSlot.price) || Number(waitlistEntry.price) || 2800;

    // 1. Update the appointment to be booked/recovered by the new customer
    setAppointments(prev =>
      prev.map(app => {
        if (app.id === appointmentId) {
          return {
            ...app,
            status: 'confirmed',
            customerId: waitlistEntry.customerId,
            customerName: waitlistEntry.customerName,
            customerPhone: waitlistEntry.customerPhone,
            serviceId: waitlistEntry.serviceId || app.serviceId,
            serviceName: waitlistEntry.serviceName || app.serviceName,
            emptySlotDetected: false,
            recoveredFromWaitlist: true,
            isRecovered: true,
            recoveredRevenue: price,
            notes: `[RECOVERED from Waitlist for ${waitlistEntry.customerName}] Original slot was open due to cancellation/no-show.`
          };
        }
        return app;
      })
    );

    // 2. Mark waitlist entry as Recovered
    setWaitlist(prev =>
      prev.map(w => {
        if (w.id === waitlistEntryId) {
          return {
            ...w,
            status: 'Recovered',
            recoveredAt: new Date().toISOString()
          };
        }
        return w;
      })
    );

    // 3. Add to notification log
    const newNotif = {
      id: `notif_${Date.now()}`,
      type: 'recovery_success',
      title: `🎉 Revenue Recovered!`,
      message: `Slot at ${targetSlot.time} filled with waitlisted client ${waitlistEntry.customerName}.`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // 4. Trigger celebration animation!
    triggerCelebration();

    showToast(`🎉 REVENUE RECOVERED! ${waitlistEntry.customerName} assigned to slot.`, 'success');
  };

  // --- Waitlist Management ---
  const addToWaitlist = (entry) => {
    const newEntry = {
      id: `wl_${Date.now()}`,
      ...entry,
      status: 'Waiting',
      createdAt: new Date().toISOString()
    };
    setWaitlist(prev => [newEntry, ...prev]);
    showToast(`Added ${entry.customerName} to waitlist`, 'success');
    return newEntry;
  };

  const updateWaitlistStatus = (id, newStatus) => {
    setWaitlist(prev =>
      prev.map(w => (w.id === id ? { ...w, status: newStatus } : w))
    );
    showToast(`Waitlist status updated to ${newStatus}`, 'info');
  };

  const deleteWaitlistEntry = (id) => {
    setWaitlist(prev => prev.filter(w => w.id !== id));
    showToast('Removed from waitlist', 'info');
  };

  // --- Customer Management ---
  const addCustomer = (customerData) => {
    const newCust = {
      id: `cust_${Date.now()}`,
      totalVisits: 0,
      completedVisits: 0,
      noShows: 0,
      cancellations: 0,
      totalSpend: 0,
      loyaltyPoints: 0,
      tags: ['New Client'],
      ...customerData
    };
    setCustomers(prev => [newCust, ...prev]);
    showToast(`Customer ${customerData.name} added`, 'success');
    return newCust;
  };

  const updateCustomer = (id, customerData) => {
    setCustomers(prev =>
      prev.map(c => (c.id === id ? { ...c, ...customerData } : c))
    );
    showToast('Customer profile updated', 'info');
  };

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    showToast('Customer deleted', 'info');
  };

  // --- Inventory Management (Zero-API Feature) ---
  const addInventoryItem = (itemData) => {
    const newItem = {
      id: `inv_${Date.now()}`,
      ...itemData
    };
    setInventory(prev => [newItem, ...prev]);
    showToast(`Added "${itemData.name}" to inventory`, 'success');
  };

  const updateInventoryItem = (id, itemData) => {
    setInventory(prev =>
      prev.map(i => (i.id === id ? { ...i, ...itemData } : i))
    );
    showToast('Inventory updated', 'info');
  };

  const deleteInventoryItem = (id) => {
    setInventory(prev => prev.filter(i => i.id !== id));
    showToast('Item removed from inventory', 'info');
  };

  const adjustStock = (id, delta) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          return { ...item, stock: newStock };
        }
        return item;
      })
    );
  };

  // --- Staff & Services ---
  const addStaffMember = (staffData) => {
    const newStaff = {
      id: `st_${Date.now()}`,
      rating: 5.0,
      totalBookings: 0,
      noShowCount: 0,
      commissionRate: 35,
      baseSalary: 30000,
      active: true,
      ...staffData
    };
    setStaff(prev => [...prev, newStaff]);
    showToast(`Staff member ${staffData.name} added`, 'success');
  };

  const updateStaffMember = (id, staffData) => {
    setStaff(prev =>
      prev.map(s => (s.id === id ? { ...s, ...staffData } : s))
    );
    showToast('Staff member updated', 'info');
  };

  const addServiceItem = (serviceData) => {
    const newService = {
      id: `srv_${Date.now()}`,
      ...serviceData
    };
    setServices(prev => [...prev, newService]);
    showToast(`Service "${serviceData.name}" added`, 'success');
  };

  const updateServiceItem = (id, serviceData) => {
    setServices(prev =>
      prev.map(s => (s.id === id ? { ...s, ...serviceData } : s))
    );
    showToast('Service updated', 'info');
  };

  // --- Simulated Reminders & Interactive Notifications ---
  const openSimulatorForAppointment = (app) => {
    setSelectedAppointmentForSimulator(app);
    setSimulatorOpen(true);
  };

  const respondToSimulatedReminder = (appointmentId, actionType) => {
    const targetApp = appointments.find(a => a.id === appointmentId);
    if (!targetApp) return;

    if (actionType === 'confirm') {
      setAppointments(prev =>
        prev.map(a => (a.id === appointmentId ? { ...a, status: 'confirmed', reminderStatus: 'Confirmed by Client' } : a))
      );
      showToast(`Client confirmed appointment at ${targetApp.time}!`, 'success');
    } else if (actionType === 'cancel') {
      cancelAppointment(appointmentId, 'Cancelled via WhatsApp Reminder');
    } else if (actionType === 'reschedule') {
      showToast(`Reschedule request received from ${targetApp.customerName}`, 'info');
    }
  };

  // --- Receipt / Invoice Trigger ---
  const openReceipt = (appointment) => {
    setReceiptAppointment(appointment);
    setReceiptModalOpen(true);
  };

  // --- Backup & Reset ---
  const resetToDefaultData = () => {
    clearAllStorage();
    setBusiness(INITIAL_BUSINESS);
    setStaff(INITIAL_STAFF);
    setServices(INITIAL_SERVICES);
    setCustomers(INITIAL_CUSTOMERS);
    setAppointments(INITIAL_APPOINTMENTS);
    setWaitlist(INITIAL_WAITLIST);
    setInventory(INITIAL_INVENTORY);
    setNotifications(INITIAL_NOTIFICATIONS);
    setDemoTourStep(0);
    showToast('All salon data reset to fresh demo state!', 'success');
  };

  const exportBackup = () => {
    exportBackupJSON({
      business,
      staff,
      services,
      customers,
      appointments,
      waitlist,
      inventory,
      notifications
    });
    showToast('Backup JSON exported successfully', 'success');
  };

  const importBackup = (jsonStr) => {
    const res = importBackupJSON(jsonStr);
    if (res.success) {
      const { data } = res;
      if (data.business) setBusiness(data.business);
      if (data.staff) setStaff(data.staff);
      if (data.services) setServices(data.services);
      if (data.customers) setCustomers(data.customers);
      if (data.appointments) setAppointments(data.appointments);
      if (data.waitlist) setWaitlist(data.waitlist);
      if (data.inventory) setInventory(data.inventory);
      if (data.notifications) setNotifications(data.notifications);
      showToast('Backup restored successfully!', 'success');
      return true;
    } else {
      showToast(`Restore failed: ${res.error}`, 'error');
      return false;
    }
  };

  // --- Interactive Sales Demo Tour Orchestration ---
  const startDemoTour = () => {
    setDemoTourStep(1);
    setActiveTab('dashboard');
    showToast('🚀 Interactive Sales Demo started! Follow the top banner guide.', 'info');
  };

  const nextDemoStep = () => {
    const next = demoTourStep + 1;
    if (next > 6) {
      setDemoTourStep(0);
      showToast('🎉 Demo Walkthrough Completed!', 'success');
    } else {
      setDemoTourStep(next);
      if (next === 2) setActiveTab('dashboard');
      if (next === 3) setActiveTab('dashboard');
      if (next === 4) setActiveTab('recovery');
      if (next === 5) setActiveTab('recovery');
      if (next === 6) setActiveTab('analytics');
    }
  };

  const endDemoTour = () => {
    setDemoTourStep(0);
  };

  // KPIs memo/calculation
  const kpis = calculateDashboardKPIs(appointments);

  // Filtered empty slots for recovery
  const openEmptySlots = appointments.filter(
    a => (a.status === 'cancelled' || a.status === 'no-show') && a.emptySlotDetected
  );

  return (
    <AppContext.Provider
      value={{
        business,
        updateBusiness,
        staff,
        addStaffMember,
        updateStaffMember,
        services,
        addServiceItem,
        updateServiceItem,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        appointments,
        addAppointment,
        updateAppointment,
        updateAppointmentStatus,
        markNoShow,
        cancelAppointment,
        recoverEmptySlotWithWaitlist,
        waitlist,
        addToWaitlist,
        updateWaitlistStatus,
        deleteWaitlistEntry,
        inventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        adjustStock,
        notifications,
        setNotifications,
        kpis,
        openEmptySlots,
        activeTab,
        setActiveTab,
        simulatorOpen,
        setSimulatorOpen,
        selectedAppointmentForSimulator,
        openSimulatorForAppointment,
        respondToSimulatedReminder,
        recoveryModalSlot,
        setRecoveryModalSlot,
        appointmentModalOpen,
        setAppointmentModalOpen,
        editingAppointment,
        setEditingAppointment,
        receiptModalOpen,
        setReceiptModalOpen,
        receiptAppointment,
        openReceipt,
        dormantModalOpen,
        setDormantModalOpen,
        payrollModalOpen,
        setPayrollModalOpen,
        toastMessage,
        showToast,
        triggerCelebration,
        resetToDefaultData,
        exportBackup,
        importBackup,
        demoTourStep,
        startDemoTour,
        nextDemoStep,
        endDemoTour
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
