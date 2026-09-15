import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import {
  MessageSquare,
  Smartphone,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Bell,
  CheckCheck,
  AlertTriangle,
  Zap
} from 'lucide-react';

export const NotificationCenter = () => {
  const {
    business,
    notifications,
    appointments,
    openSimulatorForAppointment,
    setSimulatorOpen
  } = useApp();

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)'
            }}>
              <MessageSquare size={22} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '1.75rem', color: '#fff' }}>Simulated Reminders & Messaging</h1>
            <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>Zero Paid APIs</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Test realistic 24h & 2h WhatsApp reminders with 1-click confirmation / cancellation triggers.
          </p>
        </div>

        <button
          onClick={() => {
            if (appointments.length > 0) openSimulatorForAppointment(appointments[0]);
            else setSimulatorOpen(true);
          }}
          className="btn btn-emerald"
          style={{ fontWeight: '700', padding: '0.65rem 1.25rem' }}
        >
          <Smartphone size={18} />
          Open Interactive Phone Simulator
        </button>
      </div>

      {/* Rules & Automation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #22c55e' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-emerald">Active Rule</span>
              <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>2-Hour WhatsApp Flash Reminder</h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Auto-Scheduled</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
            Sent 2 hours before scheduled booking with interactive "Confirm" and "Cancel" buttons. If cancelled, immediately triggers empty slot recovery.
          </p>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: '#cbd5e1', fontStyle: 'italic' }}>
            "Hi [Customer Name]! Reminder: Balayage with Elena at 11:00 AM today at Luxe Glow Salon. Tap below to confirm or cancel."
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-blue">Active Rule</span>
              <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>24-Hour SMS Advance Notice</h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Auto-Scheduled</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
            Sent the day prior to ensure clients have salon address and can reschedule early to prevent late cancellations.
          </p>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: '#cbd5e1', fontStyle: 'italic' }}>
            "Hello [Customer Name]! Your appointment tomorrow at Luxe Glow Salon is scheduled for 10:30 AM. Reply to reschedule."
          </div>
        </div>
      </div>

      {/* Real-Time Reminder & Notification Log */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={20} color="var(--primary)" />
          Notification Activity & Delivery Logs ({notifications.length})
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Real-time log of automated reminders, empty slot alerts, and customer confirmations
        </p>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Alert Type</th>
                <th>Subject</th>
                <th>Message Content</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(n => (
                <tr key={n.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '0.82rem', color: '#fff' }}>
                      {formatDate(n.timestamp)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${n.type === 'no_show_alert' ? 'badge-rose' : n.type === 'empty_slot' ? 'badge-amber' : n.type === 'recovery_success' ? 'badge-emerald' : 'badge-blue'}`}>
                      {n.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#fff' }}>{n.title}</strong>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                    {n.message}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCheck size={14} /> Delivered
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
