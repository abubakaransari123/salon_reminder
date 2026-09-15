import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatTime, formatDate } from '../../utils/formatters';
import {
  MessageSquare,
  X,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Smartphone,
  CheckCheck
} from 'lucide-react';

export const PhoneSimulatorModal = () => {
  const {
    simulatorOpen,
    setSimulatorOpen,
    selectedAppointmentForSimulator,
    respondToSimulatedReminder,
    business,
    appointments
  } = useApp();

  const [channel, setChannel] = useState('whatsapp'); // 'whatsapp', 'sms'
  const [activeAppId, setActiveAppId] = useState(
    selectedAppointmentForSimulator?.id || appointments[0]?.id
  );

  if (!simulatorOpen) return null;

  const currentApp = appointments.find(a => a.id === activeAppId) || selectedAppointmentForSimulator || appointments[0];

  const handleAction = (actionType) => {
    if (!currentApp) return;
    respondToSimulatedReminder(currentApp.id, actionType);
    setSimulatorOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setSimulatorOpen(false)}>
      <div
        className="modal-container modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px' }}
      >
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Smartphone size={20} color="#22c55e" />
            Interactive WhatsApp / SMS Reminder Simulator
          </h3>
          <button onClick={() => setSimulatorOpen(false)} className="btn btn-ghost btn-icon-only">✕</button>
        </div>

        {/* DEMO MODE notice */}
        <div style={{
          margin: '0 1.5rem',
          padding: '0.6rem 1rem',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.82rem',
          color: '#fbbf24',
          fontWeight: '600'
        }}>
          <Sparkles size={15} />
          DEMO MODE — No real messages are sent. This is a visual simulator only. Clicking buttons updates app state live.
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Controls & Info */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Select Appointment to Test</label>
              <select
                className="form-select"
                value={currentApp?.id}
                onChange={(e) => setActiveAppId(e.target.value)}
              >
                {appointments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.customerName} - {a.serviceName} ({formatDate(a.date)} {formatTime(a.time)})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Simulated Channel</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`btn btn-sm ${channel === 'whatsapp' ? 'btn-emerald' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                >
                  🟢 WhatsApp Business
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`btn btn-sm ${channel === 'sms' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                >
                  💬 Fast SMS
                </button>
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                How this demonstrates V1 Sales Value:
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Click the interactive buttons on the phone screen to simulate a real customer confirming or cancelling. Watch the dashboard update live without paying for expensive SMS/WhatsApp APIs!
              </p>
            </div>

            {currentApp && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <div>Client: <strong style={{ color: '#fff' }}>{currentApp.customerName}</strong></div>
                <div>Phone: <strong style={{ color: '#fff' }}>{currentApp.customerPhone}</strong></div>
                <div>Current Status: <strong style={{ color: '#34d399' }}>{currentApp.status.toUpperCase()}</strong></div>
              </div>
            )}
          </div>

          {/* Right: Phone Simulator Screen */}
          <div
            style={{
              background: channel === 'whatsapp' ? '#0b141a' : '#1e293b',
              borderRadius: '28px',
              border: '6px solid #334155',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '460px'
            }}
          >
            {/* Phone Top Notch Bar */}
            <div style={{ background: '#075e54', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#075e54', fontWeight: '800', fontSize: '0.85rem' }}>
                  LG
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>{business.name}</div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.85 }}>Verified Business Account</div>
                </div>
              </div>
              <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.2)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)' }}>
                {channel.toUpperCase()}
              </span>
            </div>

            {/* Chat Canvas */}
            <div style={{ flex: 1, padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: channel === 'whatsapp' ? 'radial-gradient(circle at center, #111b21 0%, #0b141a 100%)' : '#0f172a' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', background: 'rgba(0, 0, 0, 0.4)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                  Today, {formatTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}
                </span>
              </div>

              {/* Incoming Reminder Message Bubble */}
              {currentApp && (
                <div
                  style={{
                    maxWidth: '92%',
                    background: channel === 'whatsapp' ? '#202c33' : '#334155',
                    color: '#e9edef',
                    padding: '0.9rem',
                    borderRadius: '12px',
                    borderTopLeftRadius: '2px',
                    fontSize: '0.85rem',
                    lineHeight: '1.4',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                    alignSelf: 'flex-start'
                  }}
                >
                  <p style={{ marginBottom: '0.5rem' }}>
                    Hi <strong>{currentApp.customerName}</strong>! 👋
                  </p>
                  <p style={{ marginBottom: '0.5rem' }}>
                    This is a reminder for your upcoming <strong>{currentApp.serviceName}</strong> appointment with <strong>{currentApp.staffName}</strong> at <strong>{business.name}</strong>.
                  </p>
                  <p style={{ marginBottom: '0.75rem', background: 'rgba(0, 0, 0, 0.25)', padding: '0.45rem 0.6rem', borderRadius: '6px' }}>
                    📅 <strong>{formatDate(currentApp.date)}</strong> at <strong>{formatTime(currentApp.time)}</strong>
                    <br />
                    📍 {business.address}
                    <br />
                    💰 Amount: <strong>{formatCurrency(currentApp.price, business.currency)}</strong>
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                    Please tap an option below to confirm or release your slot:
                  </p>

                  {/* Interactive Tap Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <button
                      onClick={() => handleAction('confirm')}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        background: '#00a884',
                        color: '#fff',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 2px 6px rgba(0, 168, 132, 0.4)'
                      }}
                    >
                      <CheckCircle2 size={15} />
                      1. Yes, I'm Coming (Confirm)
                    </button>

                    <button
                      onClick={() => handleAction('cancel')}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        borderRadius: '6px',
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <XCircle size={15} />
                      2. Cannot Make It (Cancel Slot)
                    </button>
                  </div>

                  <div style={{ textAlign: 'right', marginTop: '0.35rem', fontSize: '0.65rem', color: '#8696a0' }}>
                    Sent • Delivered <CheckCheck size={11} style={{ verticalAlign: 'middle', color: '#53bdeb' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={() => setSimulatorOpen(false)} className="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
};
