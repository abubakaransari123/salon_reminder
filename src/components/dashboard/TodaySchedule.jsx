import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../appointments/StatusBadge';
import { ReliabilityBadge } from '../customers/ReliabilityBadge';
import { formatCurrency, formatTime } from '../../utils/formatters';
import { generateWhatsAppReminderUrl } from '../../utils/whatsapp';
import {
  Clock,
  User,
  Scissors,
  CheckCircle2,
  AlertOctagon,
  XCircle,
  MessageSquare,
  Zap,
  Phone,
  Sparkles,
  CalendarCheck,
  Printer
} from 'lucide-react';

export const TodaySchedule = () => {
  const {
    appointments,
    customers,
    business,
    updateAppointmentStatus,
    openSimulatorForAppointment,
    setRecoveryModalSlot,
    openReceipt
  } = useApp();

  const { isOwner, isStaff, currentUser } = useAuth();
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed', 'issues'

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter today's appointments
  let todayApps = appointments.filter(a => a.date === todayStr);

  // If logged in as staff, filter by staff unless owner
  if (isStaff && !isOwner) {
    todayApps = todayApps.filter(a => a.staffName === currentUser.name || a.staffId === currentUser.id);
  }

  // Sub-filter
  const filteredApps = todayApps.filter(app => {
    if (filter === 'active') return ['booked', 'confirmed', 'in-progress'].includes(app.status);
    if (filter === 'completed') return app.status === 'completed';
    if (filter === 'issues') return ['no-show', 'cancelled'].includes(app.status);
    return true;
  });

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      {/* Header & Filter Controls */}
      <div className="toolbar-row" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarCheck size={20} color="var(--primary)" />
            Today's Live Appointment Stream
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time status tracking, instant no-show detection, and simulated reminder actions
          </p>
        </div>

        <div className="filter-pills">
          <button
            onClick={() => setFilter('all')}
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
          >
            All Today ({todayApps.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`filter-pill ${filter === 'active' ? 'active' : ''}`}
          >
            Active / Upcoming ({todayApps.filter(a => ['booked', 'confirmed', 'in-progress'].includes(a.status)).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-pill ${filter === 'completed' ? 'active' : ''}`}
          >
            Completed ({todayApps.filter(a => a.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('issues')}
            className={`filter-pill ${filter === 'issues' ? 'active' : ''}`}
            style={{ color: filter === 'issues' ? '#fb7185' : undefined }}
          >
            No-Shows & Cancelled ({todayApps.filter(a => ['no-show', 'cancelled'].includes(a.status)).length})
          </button>
        </div>
      </div>

      {/* Appointment Cards */}
      {filteredApps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <Clock size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
          <p style={{ fontSize: '0.95rem' }}>No appointments match the selected filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredApps.map(app => {
            const customerObj = customers.find(c => c.id === app.customerId || c.name === app.customerName);
            const isNoShow = app.status === 'no-show';
            const isCancelled = app.status === 'cancelled';
            const isCompleted = app.status === 'completed';
            const isOpenEmptySlot = (isNoShow || isCancelled) && app.emptySlotDetected;

            return (
              <div
                key={app.id}
                style={{
                  background: isNoShow ? 'rgba(244, 63, 94, 0.08)' : isCancelled ? 'rgba(245, 158, 11, 0.08)' : isCompleted ? 'rgba(16, 185, 129, 0.05)' : 'rgba(30, 41, 59, 0.5)',
                  border: isNoShow ? '1px solid rgba(244, 63, 94, 0.35)' : isCancelled ? '1px solid rgba(245, 158, 11, 0.35)' : isCompleted ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {/* Time & Service Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '240px' }}>
                  <div style={{
                    textAlign: 'center',
                    padding: '0.6rem 0.9rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-glass)'
                  }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                      {formatTime(app.time)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {app.duration} mins
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '1rem', color: '#fff' }}>{app.serviceName}</h4>
                      <StatusBadge status={app.status} isRecovered={app.isRecovered} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <span>Specialist: <strong style={{ color: '#cbd5e1' }}>{app.staffName}</strong></span>
                      <span>•</span>
                      <span style={{ fontWeight: '700', color: isNoShow ? '#fb7185' : '#34d399' }}>
                        {formatCurrency(app.price, business.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Details & Reliability Score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '220px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}>
                    {app.customerName ? app.customerName.charAt(0) : 'C'}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <strong style={{ fontSize: '0.92rem', color: '#fff' }}>{app.customerName}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <ReliabilityBadge customer={customerObj} size="sm" />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {app.customerPhone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Recovery Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* If slot is empty / cancelled / no-show -> Show 1-Click Recovery button */}
                  {isOpenEmptySlot && (
                    <button
                      onClick={() => setRecoveryModalSlot(app)}
                      className="btn btn-emerald btn-sm pulse-recovery"
                      style={{ fontWeight: '700' }}
                    >
                      <Zap size={14} />
                      1-Click Recover from Waitlist
                    </button>
                  )}

                  {/* 1-Click Free WhatsApp Web Launcher */}
                  {!isCompleted && !isNoShow && (
                    <a
                      href={generateWhatsAppReminderUrl(app, business, '2hour')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.4)', textDecoration: 'none' }}
                      title="Open WhatsApp Web with pre-filled free reminder"
                    >
                      <MessageSquare size={14} />
                      WhatsApp
                    </a>
                  )}

                  {/* Simulator Trigger */}
                  {!isCompleted && !isNoShow && (
                    <button
                      onClick={() => openSimulatorForAppointment(app)}
                      className="btn btn-secondary btn-sm"
                      title="Send or test interactive WhatsApp / SMS reminder"
                      style={{ color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.3)' }}
                    >
                      Test
                    </button>
                  )}

                  {/* Print Receipt Button if Completed */}
                  {isCompleted && (
                    <button
                      onClick={() => openReceipt(app)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                      title="Print Customer Receipt / Invoice"
                    >
                      <Printer size={14} />
                      Receipt
                    </button>
                  )}

                  {/* Mark Completed */}
                  {['booked', 'confirmed', 'in-progress'].includes(app.status) && (
                    <button
                      onClick={() => updateAppointmentStatus(app.id, 'completed')}
                      className="btn btn-emerald btn-sm"
                      title="Mark appointment completed & collect revenue"
                    >
                      <CheckCircle2 size={14} />
                      Complete
                    </button>
                  )}

                  {/* Core USP Action: Mark No-Show */}
                  {['booked', 'confirmed'].includes(app.status) && (
                    <button
                      onClick={() => updateAppointmentStatus(app.id, 'no-show')}
                      className="btn btn-rose btn-sm"
                      title="Client missed appointment -> Log lost revenue & penalize score"
                    >
                      <AlertOctagon size={14} />
                      Mark No-Show
                    </button>
                  )}

                  {/* Cancel / Free Slot */}
                  {['booked', 'confirmed'].includes(app.status) && (
                    <button
                      onClick={() => updateAppointmentStatus(app.id, 'cancelled')}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--text-muted)' }}
                      title="Cancel appointment & open slot for waitlist"
                    >
                      <XCircle size={14} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
