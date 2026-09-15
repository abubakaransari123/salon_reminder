import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext();

const DEFAULT_USERS = {
  owner: {
    id: 'usr_owner',
    name: 'Sarah Jenkins',
    email: 'sarah@luxeglow.com',
    role: 'owner',
    roleLabel: 'Salon Owner & Director',
    salonName: 'Luxe Glow Aesthetics & Salon',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
  },
  staff: {
    id: 'st_1',
    name: 'Elena Rostova',
    email: 'elena@luxeglow.com',
    role: 'staff',
    roleLabel: 'Master Hair Stylist',
    salonName: 'Luxe Glow Aesthetics & Salon',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return loadFromStorage(STORAGE_KEYS.AUTH_USER, DEFAULT_USERS.owner);
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('nsk_v1_is_authenticated');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.AUTH_USER, currentUser);
    localStorage.setItem('nsk_v1_is_authenticated', JSON.stringify(isAuthenticated));
  }, [currentUser, isAuthenticated]);

  const login = (email, password, role = 'owner') => {
    if (role === 'staff' || email.includes('elena') || email.includes('staff')) {
      setCurrentUser(DEFAULT_USERS.staff);
    } else {
      setCurrentUser({
        ...DEFAULT_USERS.owner,
        email: email || DEFAULT_USERS.owner.email
      });
    }
    setIsAuthenticated(true);
    return { success: true };
  };

  const register = (salonData) => {
    const newOwner = {
      id: `usr_${Date.now()}`,
      name: salonData.ownerName || 'Business Owner',
      email: salonData.email,
      role: 'owner',
      roleLabel: 'Salon Owner & Director',
      salonName: salonData.salonName || 'My Beauty Salon',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    };
    setCurrentUser(newOwner);
    setIsAuthenticated(true);
    return { success: true, user: newOwner };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchRole = (roleType) => {
    if (roleType === 'owner') {
      setCurrentUser(DEFAULT_USERS.owner);
    } else {
      setCurrentUser(DEFAULT_USERS.staff);
    }
  };

  const isOwner = currentUser?.role === 'owner';
  const isStaff = currentUser?.role === 'staff';

  const permissions = {
    canViewFinancials: isOwner,
    canEditSettings: isOwner,
    canManageStaff: isOwner,
    canManageServices: isOwner,
    canExportData: isOwner,
    canResetData: isOwner,
    canManageAllAppointments: isOwner,
    canManageRecovery: true,
    canCheckInClients: true
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        register,
        logout,
        switchRole,
        isOwner,
        isStaff,
        permissions,
        DEFAULT_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
