// Zero-cost WhatsApp launcher using standard wa.me direct links (No Paid API required)
import { formatDate, formatTime, formatCurrency } from './formatters';

export const generateWhatsAppReminderUrl = (appointment, business, type = '2hour') => {
  if (!appointment) return '';

  // Clean phone number (remove spaces, dashes, parentheses)
  let cleanPhone = (appointment.customerPhone || '').replace(/[^0-9+]/g, '');
  // If starts with +, remove + for wa.me
  if (cleanPhone.startsWith('+')) {
    cleanPhone = cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('0')) {
    // If local number like 0300, convert to international prefix if possible (e.g. 92300)
    cleanPhone = '92' + cleanPhone.substring(1);
  }

  const salonName = business?.name || 'Our Salon';
  const salonAddress = business?.address || '';
  const currency = business?.currency || 'PKR';
  const priceFormatted = formatCurrency(appointment.price, currency);
  const timeFormatted = formatTime(appointment.time);
  const dateFormatted = formatDate(appointment.date);

  let message = '';

  if (type === '2hour') {
    message = `Hi *${appointment.customerName}*! 👋\n\nThis is a quick reminder from *${salonName}* for your *${appointment.serviceName}* with *${appointment.staffName}* today at *${timeFormatted}*.\n\n📍 *Address:* ${salonAddress}\n💰 *Amount:* ${priceFormatted}\n\nPlease reply *1* to Confirm or *2* if you need to reschedule. Thank you! ✨`;
  } else {
    message = `Hello *${appointment.customerName}*! 🌸\n\nFriendly reminder of your appointment tomorrow (*${dateFormatted}*) at *${timeFormatted}* for *${appointment.serviceName}* at *${salonName}*.\n\nLooking forward to seeing you!`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const generateDormantClientWhatsAppUrl = (customer, business, discountPercent = 20) => {
  if (!customer) return '';
  let cleanPhone = (customer.phone || '').replace(/[^0-9+]/g, '');
  if (cleanPhone.startsWith('+')) cleanPhone = cleanPhone.substring(1);
  else if (cleanPhone.startsWith('0')) cleanPhone = '92' + cleanPhone.substring(1);

  const salonName = business?.name || 'Our Salon';
  const message = `Hi *${customer.name}*! 💖\n\nWe noticed it's been a while since your last visit to *${salonName}*. We miss you!\n\nHere is a special *${discountPercent}% VIP Discount* on your next booking with us this week. Use code *WELCOMEBACK20*.\n\nBook your slot today: ${business?.phone || ''}`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
