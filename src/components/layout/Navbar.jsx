import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { Avatar } from './Avatar';
import {
  Bell,
  Sparkles,
  Plus,
  UserCheck,
  Shield,
  HelpCircle,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  LogOut
} from 'lucide-react';

export const Navbar = () => {
  const {
    business,
    notifications,
    openEmptySlots,
    demoTourStep,
    startDemoTour,
    setAppointmentModalOpen,
    setActiveTab,
    setRecoveryModalSlot
  } = useApp();

  const { currentUser, switchRole, isOwner, logout } = useAuth();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  return (
    <header style={{
      height: '70px',
      borderBottom: '1px solid var(--border-glass)',
      background: 'rgba(17, 24, 39, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Left: Salon Profile & Live Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {business.name}
            </h2>
            <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
              ● Live System
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {business.address} • Currency: <strong style={{ color: 'var(--text-primary)' }}>{business.currency} ({formatCurrency(0, business.currency).replace(/[0-9,\s]/g, '') || business.currency})</strong>
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Guided Sales Demo Launch Button */}
        {demoTourStep === 0 ? (
          <button
            onClick={startDemoTour}
            className="btn btn-secondary"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
              borderColor: 'rgba(168, 85, 247, 0.4)',
              color: '#c084fc',
              fontSize: '0.82rem',
              padding: '0.45rem 0.9rem'
            }}
            title="Launch guided sales demo walkthrough"
          >
            <Sparkles size={16} />
            <strong>Interactive Sales Demo</strong>
          </button>
        ) : null}

        {/* Quick New Appointment Button */}
        <button
          onClick={() => setAppointmentModalOpen(true)}
          className="btn btn-primary"
          style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
        >
          <Plus size={16} />
          New Booking
        </button>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="btn btn-secondary btn-icon-only"
            style={{ position: 'relative' }}
            title="Notifications & Alerts"
          >
            <Bell size={18} />
            {unreadNotifs.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                background: 'var(--rose)',
                color: '#fff',
                borderRadius: '50%',
                fontSize: '0.65rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px rgba(244, 63, 94, 0.6)'
              }}>
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div
              className="glass-card"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 10px)',
                width: '360px',
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 100,
                padding: '1rem',
                maxHeight: '400px',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-glass)' }}>
                <h4 style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Bell size={15} color="var(--primary)" /> System Alerts & Activity
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {notifications.length} alerts
                </span>
              </div>

              {notifications.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No recent alerts.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        background: notif.type === 'no_show_alert' ? 'rgba(244, 63, 94, 0.1)' : notif.type === 'empty_slot' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${notif.type === 'no_show_alert' ? 'rgba(244, 63, 94, 0.3)' : notif.type === 'empty_slot' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                        cursor: notif.actionType ? 'pointer' : 'default'
                      }}
                      onClick={() => {
                        if (notif.actionType === 'open_recovery') {
                          setActiveTab('recovery');
                          setNotifDropdownOpen(false);
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <strong style={{ fontSize: '0.82rem', color: notif.type === 'no_show_alert' ? '#fb7185' : notif.type === 'empty_slot' ? '#fbbf24' : 'var(--text-primary)' }}>
                          {notif.title}
                        </strong>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                        {notif.message}
                      </p>
                      {notif.actionType === 'open_recovery' && (
                        <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: '#818cf8', fontWeight: '600' }}>
                          ➜ Click to open Recovery Hub
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Role Switcher Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#1e293b',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-full)',
            padding: '3px 4px',
            gap: '2px'
          }}
        >
          <button
            onClick={() => switchRole('owner')}
            style={{
              background: isOwner ? 'var(--primary)' : 'transparent',
              color: isOwner ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.15s'
            }}
          >
            <Shield size={13} />
            Owner Mode
          </button>
          <button
            onClick={() => switchRole('staff')}
            style={{
              background: !isOwner ? 'var(--primary)' : 'transparent',
              color: !isOwner ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.15s'
            }}
          >
            <UserCheck size={13} />
            Staff Mode
          </button>
        </div>

        {/* Current User Avatar & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Avatar src={currentUser.avatar} name={currentUser.name} size={34} />
          <button
            onClick={logout}
            className="btn btn-ghost btn-icon-only"
            style={{ color: '#fb7185', padding: '0.4rem' }}
            title="Sign Out / Switch Account"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
