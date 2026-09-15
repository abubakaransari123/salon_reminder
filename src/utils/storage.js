// LocalStorage persistence and JSON Backup/Restore manager

const STORAGE_KEYS = {
  APPOINTMENTS: 'nsk_v1_appointments',
  CUSTOMERS: 'nsk_v1_customers',
  WAITLIST: 'nsk_v1_waitlist',
  STAFF: 'nsk_v1_staff',
  SERVICES: 'nsk_v1_services',
  BUSINESS: 'nsk_v1_business',
  NOTIFICATIONS: 'nsk_v1_notifications',
  AUTH_USER: 'nsk_v1_auth_user',
  THEME: 'nsk_v1_theme'
};

export const loadFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage key "${key}":`, err);
  }
};

export const exportBackupJSON = (fullState) => {
  const dataToExport = {
    appName: 'SalonReminder V1',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    business: fullState.business,
    staff: fullState.staff,
    services: fullState.services,
    customers: fullState.customers,
    appointments: fullState.appointments,
    waitlist: fullState.waitlist,
    notifications: fullState.notifications
  };

  const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonStr);
  const dateSlug = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('download', `salon-reminder-backup-${dateSlug}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const importBackupJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.appointments || !parsed.customers || !parsed.business) {
      throw new Error('Invalid Salon Reminder backup format');
    }
    return { success: true, data: parsed };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const clearAllStorage = () => {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
};

export { STORAGE_KEYS };
