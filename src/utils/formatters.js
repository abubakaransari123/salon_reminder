// Utility functions for formatting dates, times, currencies, and numbers

export const CURRENCY_SYMBOLS = {
  PKR: 'Rs. ',
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
  SAR: 'SAR ',
  CAD: 'CA$',
  AUD: 'AU$'
};

export const formatCurrency = (amount, currencyCode = 'PKR') => {
  const numericAmount = Number(amount) || 0;
  const symbol = CURRENCY_SYMBOLS[currencyCode] || 'Rs. ';
  
  if (currencyCode === 'PKR' || currencyCode === 'INR') {
    return `${symbol}${numericAmount.toLocaleString('en-IN')}`;
  }
  return `${symbol}${numericAmount.toLocaleString('en-US')}`;
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  // If timeStr is already in HH:mm format
  if (timeStr.includes(':')) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHours}:${displayMinutes} ${period}`;
  }
  return timeStr;
};

export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return dateInput;

  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return 'Today';
  if (isTomorrow) return 'Tomorrow';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDuration = (minutes) => {
  const mins = Number(minutes) || 0;
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hrs}h ${remainingMins}m` : `${hrs}h`;
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  return phone;
};
