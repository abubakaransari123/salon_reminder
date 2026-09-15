import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { Zap, AlertTriangle, Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const RevenueAlertBanner = () => {
  const { openEmptySlots, kpis, business, setActiveTab, setRecoveryModalSlot } = useApp();

  const totalAtRisk = openEmptySlots.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  if (openEmptySlots.length === 0 && kpis.lostRevenue === 0) {
    return (
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(30, 41, 59, 0.6) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--emerald-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <CheckCircle2 size={24} color="#34d399" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '0.2rem' }}>
              All Slots Optimized & Filled Today
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              No active empty slots detected. Total recovered revenue to date: <strong style={{ color: '#34d399' }}>{formatCurrency(kpis.totalRecoveredRevenue, business.currency)}</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('recovery')}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.82rem' }}
        >
          View Waitlist ({kpis.totalRecoveredCount} Recovered)
        </button>
      </div>
    );
  }

  return (
    <div
      className="glass-card pulse-urgent"
      style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.15) 0%, rgba(245, 158, 11, 0.15) 50%, rgba(30, 41, 59, 0.8) 100%)',
        border: '1px solid rgba(244, 63, 94, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(244, 63, 94, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          flexShrink: 0
        }}>
          <Zap size={26} color="#fb7185" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
              ⚡ Revenue Recovery Alert
            </span>
            <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: '600' }}>
              {openEmptySlots.length} Empty Slot{openEmptySlots.length > 1 ? 's' : ''} Detected
            </span>
          </div>
          <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.2rem' }}>
            {formatCurrency(totalAtRisk, business.currency)} in Potential Revenue at Risk Today
          </h4>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
            Cancelled / No-show appointments have opened slots. Use our 1-Click Smart Match to fill them from your waiting clients!
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={() => {
            if (openEmptySlots.length > 0) {
              setRecoveryModalSlot(openEmptySlots[0]);
            } else {
              setActiveTab('recovery');
            }
          }}
          className="btn btn-emerald"
          style={{ fontSize: '0.88rem', padding: '0.65rem 1.25rem', fontWeight: '700' }}
        >
          <Zap size={16} />
          1-Click Recover Slot
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
