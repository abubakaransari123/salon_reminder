// Rich seed data for Luxe Glow Salon & Spa

const getRelativeDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_BUSINESS = {
  name: 'Luxe Glow Aesthetics & Salon',
  owner: 'Sarah Jenkins',
  tagline: 'Luxury Hair, Skin, Nails & Aesthetic Spa',
  email: 'contact@luxeglow.com',
  phone: '+92 300 8899000',
  address: 'Level 2, Royal Heights Mall, Main Boulevard, Lahore / Karachi',
  currency: 'PKR', // PKR, INR, USD, EUR, GBP, AED
  workingHours: {
    start: '09:00',
    end: '20:00'
  },
  cancellationNoticeHours: 2,
  depositRequiredForRiskyClients: true,
  autoRemindersEnabled: true,
  reminderScheduleHours: [24, 2],
  loyaltyPointsRatio: 10, // 1 point per Rs. 100 spent
  theme: 'dark'
};

export const INITIAL_STAFF = [
  {
    id: 'st_1',
    name: 'Elena Rostova',
    role: 'Master Hair Stylist & Colorist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    phone: '+92 300 1100111',
    specialties: ['Balayage', 'Keratin Therapy', 'Luxury Blowouts'],
    rating: 4.9,
    commissionRate: 35, // 35% commission
    baseSalary: 35000,
    totalBookings: 84,
    noShowCount: 2,
    active: true
  },
  {
    id: 'st_2',
    name: 'Marcus Vance',
    role: 'Senior Barber & Grooming Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    phone: '+92 300 2200222',
    specialties: ['Executive Haircut', 'Beard Sculpting', 'Scalp Therapy'],
    rating: 4.8,
    commissionRate: 40,
    baseSalary: 30000,
    totalBookings: 62,
    noShowCount: 1,
    active: true
  },
  {
    id: 'st_3',
    name: 'Priya Sharma',
    role: 'Skin & Hydra-Facial Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    phone: '+92 300 3300333',
    specialties: ['Hydra-Glow Facial', 'Chemical Peels', 'Microdermabrasion'],
    rating: 4.95,
    commissionRate: 30,
    baseSalary: 40000,
    totalBookings: 91,
    noShowCount: 3,
    active: true
  },
  {
    id: 'st_4',
    name: 'David Kim',
    role: 'Nail Artist & Spa Therapist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    phone: '+92 300 4400444',
    specialties: ['Russian Manicure', 'Gel Extensions', 'Aroma Massage'],
    rating: 4.75,
    commissionRate: 35,
    baseSalary: 28000,
    totalBookings: 53,
    noShowCount: 1,
    active: true
  }
];

export const INITIAL_SERVICES = [
  {
    id: 'srv_1',
    name: 'Balayage & Luxury Blowout',
    category: 'Hair',
    duration: 120, // mins
    price: 4500,
    deposit: 1000,
    description: 'Full dimensional balayage coloring with nourishing gloss and blowout.'
  },
  {
    id: 'srv_2',
    name: 'Signature Hydra-Glow Facial',
    category: 'Skin',
    duration: 60,
    price: 2800,
    deposit: 500,
    description: 'Vortex deep pore extraction, lactic acid peel, peptide serum infusion.'
  },
  {
    id: 'srv_3',
    name: 'Executive Haircut & Beard Sculpt',
    category: 'Grooming',
    duration: 45,
    price: 1200,
    deposit: 0,
    description: 'Precision scissor cut, hot towel straight-razor shave, and charcoal mist.'
  },
  {
    id: 'srv_4',
    name: 'Russian Gel Manicure & Nail Art',
    category: 'Nails',
    duration: 75,
    price: 1800,
    deposit: 500,
    description: 'Flawless dry cuticle prep with apex gel sculpting and custom chrome art.'
  },
  {
    id: 'srv_5',
    name: 'Aromatherapy Deep Tissue Massage',
    category: 'Spa',
    duration: 90,
    price: 3500,
    deposit: 1000,
    description: 'Therapeutic muscle relaxation using lavender oils and heated volcanic basalt.'
  },
  {
    id: 'srv_6',
    name: 'Keratin Smoothing & Repair',
    category: 'Hair',
    duration: 150,
    price: 5500,
    deposit: 1500,
    description: 'Nano-protein Brazilian keratin therapy for ultimate frizz elimination.'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust_1',
    name: 'Aaliyah Khan',
    phone: '+92 301 5544332',
    email: 'aaliyah.k@gmail.com',
    totalVisits: 14,
    completedVisits: 14,
    noShows: 0,
    cancellations: 0,
    totalSpend: 42500,
    loyaltyPoints: 425,
    lastVisitDate: getRelativeDate(-2),
    notes: 'VIP customer. Loves green tea & Elena’s balayage styling.',
    tags: ['VIP', 'High Spender']
  },
  {
    id: 'cust_2',
    name: 'Rohan Mehra',
    phone: '+92 321 9876543',
    email: 'rohan.m@outlook.com',
    totalVisits: 9,
    completedVisits: 8,
    noShows: 0,
    cancellations: 1,
    totalSpend: 13200,
    loyaltyPoints: 132,
    lastVisitDate: getRelativeDate(-5),
    notes: 'Very punctual on weekends. Executive grooming regular.',
    tags: ['Regular']
  },
  {
    id: 'cust_3',
    name: 'Kavita Patel',
    phone: '+92 333 4567890',
    email: 'kavita.p@gmail.com',
    totalVisits: 7,
    completedVisits: 4,
    noShows: 2,
    cancellations: 1,
    totalSpend: 10600,
    loyaltyPoints: 90,
    lastVisitDate: getRelativeDate(-12),
    notes: 'Often cancels on short notice during weekday afternoons.',
    tags: ['Risk Alert', 'Deposit Required']
  },
  {
    id: 'cust_4',
    name: 'Vikram Singh',
    phone: '+92 345 1122334',
    email: 'vikram.s@yahoo.com',
    totalVisits: 6,
    completedVisits: 2,
    noShows: 3,
    cancellations: 1,
    totalSpend: 3400,
    loyaltyPoints: 30,
    lastVisitDate: getRelativeDate(-48), // Dormant client!
    notes: 'Chronic no-show. Always send 2-hour WhatsApp reminder before booking!',
    tags: ['High No-Show Risk', 'Dormant Client']
  },
  {
    id: 'cust_5',
    name: 'Natasha Verma',
    phone: '+92 312 6677889',
    email: 'natasha.v@gmail.com',
    totalVisits: 12,
    completedVisits: 11,
    noShows: 0,
    cancellations: 1,
    totalSpend: 34800,
    loyaltyPoints: 348,
    lastVisitDate: getRelativeDate(-1),
    notes: 'Regular Hydra-Facial client. Fast responder to open slot alerts.',
    tags: ['VIP', 'Waitlist Quick-Accept']
  },
  {
    id: 'cust_6',
    name: 'Siddharth Roy',
    phone: '+92 300 9988776',
    email: 'sid.roy@gmail.com',
    totalVisits: 4,
    completedVisits: 4,
    noShows: 0,
    cancellations: 0,
    totalSpend: 6600,
    loyaltyPoints: 66,
    lastVisitDate: getRelativeDate(-8),
    notes: 'Loyal grooming client. Works nearby in corporate tower.',
    tags: ['Loyal']
  },
  {
    id: 'cust_7',
    name: 'Ananya Deshmukh',
    phone: '+92 308 3344556',
    email: 'ananya.d@gmail.com',
    totalVisits: 8,
    completedVisits: 7,
    noShows: 1,
    cancellations: 0,
    totalSpend: 21400,
    loyaltyPoints: 214,
    lastVisitDate: getRelativeDate(-52), // Dormant client!
    notes: 'Prefers nail art & spa appointments. Has not visited in 50+ days.',
    tags: ['Regular', 'Dormant Client']
  }
];

export const INITIAL_INVENTORY = [
  {
    id: 'inv_1',
    name: 'Brazilian Keratin Complex (1000ml)',
    category: 'Hair Care',
    sku: 'KER-1000',
    stock: 3,
    minThreshold: 4, // Low stock!
    unit: 'Bottles',
    costPrice: 4800,
    retailPrice: 8500,
    supplier: 'Olaplex Professional'
  },
  {
    id: 'inv_2',
    name: 'Hydra-Facial Peptide Serum Cartridges',
    category: 'Skin Care',
    sku: 'SER-HYD-50',
    stock: 14,
    minThreshold: 5,
    unit: 'Units',
    costPrice: 1200,
    retailPrice: 2200,
    supplier: 'GlowDerm Supply'
  },
  {
    id: 'inv_3',
    name: 'Moroccan Argan Hair Treatment Oil (250ml)',
    category: 'Retail Product',
    sku: 'ARG-250',
    stock: 2,
    minThreshold: 5, // Low stock!
    unit: 'Bottles',
    costPrice: 1500,
    retailPrice: 3200,
    supplier: 'MoroccanOil Direct'
  },
  {
    id: 'inv_4',
    name: 'Organic Lavender Essential Massage Oil',
    category: 'Spa & Wellness',
    sku: 'OIL-LAV-500',
    stock: 9,
    minThreshold: 3,
    unit: 'Bottles',
    costPrice: 1800,
    retailPrice: 3500,
    supplier: 'AromaPure Organic'
  },
  {
    id: 'inv_5',
    name: 'Professional Russian Gel Apex Base & Top',
    category: 'Nail Supplies',
    sku: 'GEL-RUS-SET',
    stock: 18,
    minThreshold: 6,
    unit: 'Sets',
    costPrice: 900,
    retailPrice: 1800,
    supplier: 'NailTech Pro'
  }
];

export const INITIAL_WAITLIST = [
  {
    id: 'wl_1',
    customerId: 'cust_5',
    customerName: 'Natasha Verma',
    customerPhone: '+92 312 6677889',
    serviceId: 'srv_2',
    serviceName: 'Signature Hydra-Glow Facial',
    staffId: 'st_3',
    staffName: 'Priya Sharma',
    price: 2800,
    preferredDate: getRelativeDate(0),
    preferredTime: 'afternoon',
    priority: 'High',
    status: 'Waiting',
    notes: 'Waiting for any opening between 1:00 PM and 4:00 PM today!',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'wl_2',
    customerId: 'cust_1',
    customerName: 'Aaliyah Khan',
    customerPhone: '+92 301 5544332',
    serviceId: 'srv_1',
    serviceName: 'Balayage & Luxury Blowout',
    staffId: 'st_1',
    staffName: 'Elena Rostova',
    price: 4500,
    preferredDate: getRelativeDate(0),
    preferredTime: 'anytime',
    priority: 'Urgent',
    status: 'Waiting',
    notes: 'Has wedding tomorrow. Ready to arrive on 20 mins notice!',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'wl_3',
    customerId: 'cust_6',
    customerName: 'Siddharth Roy',
    customerPhone: '+92 300 9988776',
    serviceId: 'srv_3',
    serviceName: 'Executive Haircut & Beard Sculpt',
    staffId: 'st_2',
    staffName: 'Marcus Vance',
    price: 1200,
    preferredDate: getRelativeDate(0),
    preferredTime: 'evening',
    priority: 'Normal',
    status: 'Waiting',
    notes: 'Free after 5:30 PM if Marcus has a cancellation.',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

export const INITIAL_APPOINTMENTS = [
  // --- TODAY'S APPOINTMENTS ---
  {
    id: 'app_today_1',
    date: getRelativeDate(0),
    time: '09:30',
    duration: 90,
    customerId: 'cust_1',
    customerName: 'Aaliyah Khan',
    customerPhone: '+92 301 5544332',
    serviceId: 'srv_5',
    serviceName: 'Aromatherapy Deep Tissue Massage',
    staffId: 'st_4',
    staffName: 'David Kim',
    price: 3500,
    status: 'completed',
    notes: 'Morning spa session completed on time.',
    reminderSent: true,
    reminderStatus: 'Confirmed by Client'
  },
  {
    id: 'app_today_2',
    date: getRelativeDate(0),
    time: '11:00',
    duration: 120,
    customerId: 'cust_1',
    customerName: 'Aaliyah Khan',
    customerPhone: '+92 301 5544332',
    serviceId: 'srv_1',
    serviceName: 'Balayage & Luxury Blowout',
    staffId: 'st_1',
    staffName: 'Elena Rostova',
    price: 4500,
    status: 'in-progress',
    notes: 'In chair with Elena, foils developing.',
    reminderSent: true,
    reminderStatus: 'Confirmed by Client'
  },
  {
    id: 'app_today_3',
    date: getRelativeDate(0),
    time: '13:30',
    duration: 45,
    customerId: 'cust_2',
    customerName: 'Rohan Mehra',
    customerPhone: '+92 321 9876543',
    serviceId: 'srv_3',
    serviceName: 'Executive Haircut & Beard Sculpt',
    staffId: 'st_2',
    staffName: 'Marcus Vance',
    price: 1200,
    status: 'confirmed',
    notes: 'Confirmed via WhatsApp reminder.',
    reminderSent: true,
    reminderStatus: 'Confirmed by Client'
  },
  {
    id: 'app_today_4',
    date: getRelativeDate(0),
    time: '14:30',
    duration: 60,
    customerId: 'cust_4',
    customerName: 'Vikram Singh',
    customerPhone: '+92 345 1122334',
    serviceId: 'srv_2',
    serviceName: 'Signature Hydra-Glow Facial',
    staffId: 'st_3',
    staffName: 'Priya Sharma',
    price: 2800,
    status: 'booked',
    notes: 'High No-Show Risk profile. Ready for WhatsApp reminder test.',
    reminderSent: false,
    reminderStatus: 'Pending Reminder'
  },
  {
    id: 'app_today_5',
    date: getRelativeDate(0),
    time: '16:00',
    duration: 60,
    customerId: 'cust_3',
    customerName: 'Kavita Patel',
    customerPhone: '+92 333 4567890',
    serviceId: 'srv_2',
    serviceName: 'Signature Hydra-Glow Facial',
    staffId: 'st_3',
    staffName: 'Priya Sharma',
    price: 2800,
    status: 'cancelled',
    notes: 'Client cancelled 30 mins ago due to sudden meeting. SLOT OPEN FOR RECOVERY!',
    reminderSent: true,
    reminderStatus: 'Cancelled by Client',
    emptySlotDetected: true
  },
  {
    id: 'app_today_6',
    date: getRelativeDate(0),
    time: '17:30',
    duration: 75,
    customerId: 'cust_7',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+92 308 3344556',
    serviceId: 'srv_4',
    serviceName: 'Russian Gel Manicure & Nail Art',
    staffId: 'st_4',
    staffName: 'David Kim',
    price: 1800,
    status: 'booked',
    notes: 'Chrome finish requested.',
    reminderSent: true,
    reminderStatus: 'Sent'
  },
  // --- PAST APPOINTMENTS (Historical Recovery Proof) ---
  {
    id: 'app_past_1',
    date: getRelativeDate(-1),
    time: '10:00',
    duration: 120,
    customerId: 'cust_5',
    customerName: 'Natasha Verma',
    customerPhone: '+92 312 6677889',
    serviceId: 'srv_1',
    serviceName: 'Balayage & Luxury Blowout',
    staffId: 'st_1',
    staffName: 'Elena Rostova',
    price: 4500,
    status: 'completed',
    recoveredFromWaitlist: true,
    isRecovered: true,
    recoveredRevenue: 4500,
    notes: 'Successfully recovered from waitlist after another client cancelled!',
    reminderSent: true,
    reminderStatus: 'Confirmed'
  },
  {
    id: 'app_past_2',
    date: getRelativeDate(-1),
    time: '14:00',
    duration: 60,
    customerId: 'cust_4',
    customerName: 'Vikram Singh',
    customerPhone: '+92 345 1122334',
    serviceId: 'srv_2',
    serviceName: 'Signature Hydra-Glow Facial',
    staffId: 'st_3',
    staffName: 'Priya Sharma',
    price: 2800,
    status: 'no-show',
    lostRevenue: 2800,
    notes: 'Unresponsive to phone call. Marked as No-Show.',
    reminderSent: true,
    reminderStatus: 'No Response'
  },
  {
    id: 'app_past_3',
    date: getRelativeDate(-2),
    time: '11:30',
    duration: 90,
    customerId: 'cust_7',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+92 308 3344556',
    serviceId: 'srv_5',
    serviceName: 'Aromatherapy Deep Tissue Massage',
    staffId: 'st_4',
    staffName: 'David Kim',
    price: 3500,
    status: 'completed',
    recoveredFromWaitlist: true,
    isRecovered: true,
    recoveredRevenue: 3500,
    notes: 'Recovered slot filled from waitlist within 12 minutes.',
    reminderSent: true,
    reminderStatus: 'Confirmed'
  },
  {
    id: 'app_past_4',
    date: getRelativeDate(-2),
    time: '15:00',
    duration: 45,
    customerId: 'cust_2',
    customerName: 'Rohan Mehra',
    customerPhone: '+92 321 9876543',
    serviceId: 'srv_3',
    serviceName: 'Executive Haircut & Beard Sculpt',
    staffId: 'st_2',
    staffName: 'Marcus Vance',
    price: 1200,
    status: 'completed',
    reminderSent: true,
    reminderStatus: 'Confirmed'
  },
  {
    id: 'app_past_5',
    date: getRelativeDate(-3),
    time: '12:00',
    duration: 60,
    customerId: 'cust_3',
    customerName: 'Kavita Patel',
    customerPhone: '+92 333 4567890',
    serviceId: 'srv_2',
    serviceName: 'Signature Hydra-Glow Facial',
    staffId: 'st_3',
    staffName: 'Priya Sharma',
    price: 2800,
    status: 'no-show',
    lostRevenue: 2800,
    notes: 'Did not arrive for appointment.',
    reminderSent: true,
    reminderStatus: 'No Response'
  },
  // --- TOMORROW'S APPOINTMENTS ---
  {
    id: 'app_future_1',
    date: getRelativeDate(1),
    time: '10:30',
    duration: 150,
    customerId: 'cust_1',
    customerName: 'Aaliyah Khan',
    customerPhone: '+92 301 5544332',
    serviceId: 'srv_6',
    serviceName: 'Keratin Smoothing & Repair',
    staffId: 'st_1',
    staffName: 'Elena Rostova',
    price: 5500,
    status: 'booked',
    reminderSent: false,
    reminderStatus: 'Scheduled 24h Reminder'
  },
  {
    id: 'app_future_2',
    date: getRelativeDate(1),
    time: '14:00',
    duration: 45,
    customerId: 'cust_6',
    customerName: 'Siddharth Roy',
    customerPhone: '+92 300 9988776',
    serviceId: 'srv_3',
    serviceName: 'Executive Haircut & Beard Sculpt',
    staffId: 'st_2',
    staffName: 'Marcus Vance',
    price: 1200,
    status: 'confirmed',
    reminderSent: true,
    reminderStatus: 'Confirmed'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    type: 'empty_slot',
    title: 'Empty Slot Alert: Today at 4:00 PM',
    message: 'Kavita Patel cancelled Signature Hydra-Glow Facial with Priya Sharma (Rs. 2,800 at risk). 2 waitlist matches available!',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: false,
    actionType: 'open_recovery',
    targetSlotId: 'app_today_5'
  },
  {
    id: 'notif_2',
    type: 'confirmation',
    title: 'Appointment Confirmed',
    message: 'Rohan Mehra confirmed his 1:30 PM Executive Haircut via WhatsApp.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: false
  },
  {
    id: 'notif_3',
    type: 'risk_warning',
    title: 'High No-Show Risk Warning',
    message: 'Vikram Singh (20% Reliability Score) has an upcoming booking at 2:30 PM. We recommend sending a reminder now.',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    read: true,
    actionType: 'open_simulator',
    targetAppId: 'app_today_4'
  }
];
