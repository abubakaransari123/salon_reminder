import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from './Avatar';
import {
  LayoutDashboard,
  Calendar,
  Zap,
  Users,
  Scissors,
  MessageSquare,
  BarChart3,
  Settings,
  Flame,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Package,
  X
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    openEmptySlots,
    resetToDefaultData,
    mobileSidebarOpen,
    setMobileSidebarOpen
  } = useApp();
  const { currentUser, isOwner, logout } = useAuth();

  const handleReset = () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: This will permanently delete ALL salon data and reset to demo defaults.\n\nAre you absolutely sure? This cannot be undone!'
    );
    if (confirmed) {
      resetToDefaultData();
      setMobileSidebarOpen(false);
    }
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'appointments',
      label: 'Appointments & Calendar',
      icon: Calendar,
      badge: null
    },
    {
      id: 'recovery',
      label: 'Revenue Recovery Hub',
      icon: Zap,
      badge: openEmptySlots.length > 0 ? `${openEmptySlots.length} Open` : null,
      badgeVariant: 'pulse'
    },
    {
      id: 'customers',
      label: 'Customer Directory & Risk',
      icon: Users,
      badge: null
    },
    {
      id: 'staff',
      label: 'Staff & Services',
      icon: Scissors,
      badge: null
    },
    {
      id: 'inventory',
      label: 'Inventory & Supplies',
      icon: Package,
      badge: null
    },
    {
      id: 'simulator',
      label: 'Interactive SMS/WhatsApp',
      icon: MessageSquare,
      badge: 'Simulated'
    },
    {
      id: 'analytics',
      label: 'Analytics & Lost Revenue',
      icon: BarChart3,
      badge: null,
      ownerOnly: true
    },
    {
      id: 'settings',
      label: 'Salon Settings & Backup',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside className={`app-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header" style={{
          padding: '1.25rem 1.25rem',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)',
              flexShrink: 0
            }}>
              <Flame size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#fff' }}>
                  Salon
                </span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.05rem', color: '#ec4899' }}>
                  Reminder
                </span>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Smart Salon Management
              </span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            className="sidebar-close-btn"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ padding: '0.25rem 0.65rem 0.5rem', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Main Operations
          </div>

          {navItems.map(item => {
            if (item.ownerOnly && !isOwner) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} color={isActive ? '#818cf8' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`badge ${item.badgeVariant === 'pulse' ? 'badge-amber pulse-urgent' : 'badge-purple'}`}
                    style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Profile & Reset Seed Data */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--border-glass)',
          background: 'rgba(15, 23, 42, 0.5)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)'
          }}>
            <Avatar src={currentUser.avatar} name={currentUser.name} size={36} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: isOwner ? '#34d399' : '#818cf8', fontWeight: '600' }}>
                {currentUser.roleLabel}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={handleReset}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.72rem', padding: '0.35rem 0.4rem', color: 'var(--text-muted)' }}
              title="Reset database to initial demo state"
            >
              <RefreshCw size={12} />
              Reset Data
            </button>
            <button
              onClick={() => {
                setMobileSidebarOpen(false);
                logout();
              }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.72rem', padding: '0.35rem 0.5rem', color: '#fb7185' }}
              title="Sign out of salon account"
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
