import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { findWaitlistMatchesForSlot } from '../../utils/calculations';
import { formatCurrency, formatTime } from '../../utils/formatters';
import {
  Zap,
  X,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Phone,
  ArrowRight,
  Plus
} from 'lucide-react';

export const WaitlistMatchModal = () => {
  const {
    recoveryModalSlot,
    setRecoveryModalSlot,
    waitlist,
    business,
    recoverEmptySlotWithWaitlist,
    addToWaitlist,
    customers
  } = useApp();

  const [showAddQuickWaitlist, setShowAddQuickWaitlist] = useState(false);
  const [quickCustName, setQuickCustName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');

  if (!recoveryModalSlot) return null;

  const matches = findWaitlistMatchesForSlot(recoveryModalSlot, waitlist);
  const slotPrice = Number(recoveryModalSlot.price) || 2800;

  const handleRecover = (waitlistId) => {
    recoverEmptySlotWithWaitlist(recoveryModalSlot.id, waitlistId);
    setRecoveryModalSlot(null);
  };

  const handleAddAndRecover = (e) => {
    e.preventDefault();
    if (!quickCustName || !quickPhone) return;

    const newWl = addToWaitlist({
      customerName: quickCustName,
      customerPhone: quickPhone,
      serviceId: recoveryModalSlot.serviceId,
      serviceName: recoveryModalSlot.serviceName,
      staffId: recoveryModalSlot.staffId,
      staffName: recoveryModalSlot.staffName,
      price: slotPrice,
      priority: 'Urgent',
      preferredTime: 'anytime',
      notes: 'Quick manual replacement via recovery hub'
    });

    handleRecover(newWl.id);
  };

  return (
    <div className="modal-overlay" onClick={() => setRecoveryModalSlot(null)}>
      <div
        className="modal-container modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9)' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(90deg, #064e3b 0%, #111827 100%)' }}>
          <h3 style={{ color: '#34d399' }}>
            <Zap size={22} color="#34d399" />
            1-Click Revenue Recovery Engine
          </h3>
          <button
            onClick={() => setRecoveryModalSlot(null)}
            className="btn btn-ghost btn-icon-only"
            style={{ color: '#cbd5e1' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Slot summary alert */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fb7185', textTransform: 'uppercase' }}>
                Open Slot Details
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>
                {recoveryModalSlot.serviceName} at {formatTime(recoveryModalSlot.time)} ({recoveryModalSlot.duration} mins)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Specialist: <strong style={{ color: '#cbd5e1' }}>{recoveryModalSlot.staffName}</strong> • Original status: <strong style={{ color: '#fb7185' }}>{recoveryModalSlot.status.toUpperCase()}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Revenue to Recover</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                +{formatCurrency(slotPrice, business.currency)}
              </div>
            </div>
          </div>

          {/* Smart Matches section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <h4 style={{ fontSize: '0.98rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={17} color="#34d399" />
                Smart AI Waitlist Matches ({matches.length} Candidates)
              </h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Ranked by Service fit, Specialist preference & Urgency
              </span>
            </div>

            {matches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-glass)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>No active waitlist clients currently match this exact slot.</p>
                <button
                  onClick={() => setShowAddQuickWaitlist(true)}
                  className="btn btn-secondary btn-sm"
                >
                  <Plus size={14} /> Add Quick Replacement Client
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {matches.map(({ candidate, matchScore, reasons }, idx) => (
                  <div
                    key={candidate.id}
                    style={{
                      padding: '1.1rem 1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      background: idx === 0 ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.14) 0%, rgba(30, 41, 59, 0.8) 100%)' : 'rgba(30, 41, 59, 0.5)',
                      border: idx === 0 ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid var(--border-glass)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                        <strong style={{ fontSize: '1.02rem', color: '#fff' }}>{candidate.customerName}</strong>
                        {idx === 0 && (
                          <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                            ★ #1 Best Match ({matchScore}% Match)
                          </span>
                        )}
                        <span className={`badge ${candidate.priority === 'Urgent' ? 'badge-rose' : candidate.priority === 'High' ? 'badge-amber' : 'badge-blue'}`} style={{ fontSize: '0.65rem' }}>
                          {candidate.priority} Priority
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                        <span><Phone size={13} style={{ verticalAlign: 'middle' }} /> {candidate.customerPhone}</span>
                        <span>•</span>
                        <span>Requested: <strong>{candidate.serviceName}</strong></span>
                      </div>

                      {/* Match reasons chips */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {reasons.map((r, i) => (
                          <span key={i} style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.06)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-xs)', color: '#94a3b8' }}>
                            ✓ {r}
                          </span>
                        ))}
                      </div>

                      {candidate.notes && (
                        <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.35rem', fontStyle: 'italic' }}>
                          Note: "{candidate.notes}"
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleRecover(candidate.id)}
                      className="btn btn-emerald"
                      style={{ fontWeight: '700', padding: '0.65rem 1.2rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}
                    >
                      <Zap size={16} />
                      Assign & Recover +{formatCurrency(slotPrice, business.currency)}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Manual Replacement Form if needed */}
          {showAddQuickWaitlist ? (
            <form onSubmit={handleAddAndRecover} style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <h5 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.75rem' }}>Add Quick Replacement Customer</h5>
              <div className="form-grid-2" style={{ marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Customer Full Name"
                  className="form-input"
                  value={quickCustName}
                  onChange={(e) => setQuickCustName(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Customer Phone Number"
                  className="form-input"
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddQuickWaitlist(false)} className="btn btn-ghost btn-sm">Cancel</button>
                <button type="submit" className="btn btn-emerald btn-sm">Assign & Fill Slot</button>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowAddQuickWaitlist(true)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}
              >
                + Or book a walk-in / new customer for this slot
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            onClick={() => setRecoveryModalSlot(null)}
            className="btn btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
