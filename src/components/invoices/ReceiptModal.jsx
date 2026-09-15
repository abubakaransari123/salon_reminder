import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { Printer, Download, X, Sparkles, CheckCircle2, Scissors } from 'lucide-react';

export const ReceiptModal = ({ appointment, isOpen, onClose }) => {
  const { business } = useApp();

  if (!isOpen || !appointment) return null;

  const receiptNo = `INV-${appointment.id.replace('app_', '').toUpperCase().slice(0, 8)}`;
  const dateStr = formatDate(appointment.date);
  const timeStr = formatTime(appointment.time);
  const priceNum = Number(appointment.price) || 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', background: '#0f172a' }}
      >
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Printer size={18} color="var(--primary)" />
            Customer Receipt & Invoice
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-icon-only">✕</button>
        </div>

        <div className="modal-body" style={{ padding: '1.25rem' }}>
          {/* Printable Receipt Paper Container */}
          <div
            id="printable-receipt"
            style={{
              background: '#ffffff',
              color: '#0f172a',
              padding: '1.75rem 1.5rem',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              lineHeight: '1.4'
            }}
          >
            {/* Salon Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: '800', fontFamily: 'var(--font-heading)', margin: '0 0 0.25rem' }}>
                {business.name}
              </h2>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{business.tagline}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{business.address}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Tel: {business.phone}</div>
            </div>

            {/* Invoice Meta */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.78rem' }}>
              <div>
                <div><strong>Receipt #:</strong> {receiptNo}</div>
                <div><strong>Date:</strong> {dateStr} at {timeStr}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div><strong>Client:</strong> {appointment.customerName}</div>
                <div><strong>Specialist:</strong> {appointment.staffName}</div>
              </div>
            </div>

            {/* Items Table */}
            <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 0', margin: '0.75rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                <span>Description</span>
                <span>Amount</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{appointment.serviceName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Duration: {appointment.duration} mins</div>
                </div>
                <strong>{formatCurrency(priceNum, business.currency)}</strong>
              </div>
            </div>

            {/* Total & Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1.25rem', textAlign: 'right' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(priceNum, business.currency)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span>Tax / GST:</span>
                <span>{formatCurrency(0, business.currency)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', borderTop: '2px solid #0f172a', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                <span>TOTAL PAID:</span>
                <span>{formatCurrency(priceNum, business.currency)}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '700', marginTop: '0.2rem' }}>
                ● Paid via Cash / Counter (Status: Completed)
              </div>
            </div>

            {/* Next Visit Coupon Footer */}
            <div style={{ textAlign: 'center', borderTop: '2px dashed #cbd5e1', paddingTop: '0.85rem', fontSize: '0.75rem', color: '#475569' }}>
              <div style={{ fontWeight: '700', color: '#4f46e5', marginBottom: '0.2rem' }}>
                ✨ THANK YOU FOR YOUR VISIT! ✨
              </div>
              <div>Show this receipt on your next visit within 30 days to get <strong>10% OFF</strong>!</div>
              <div style={{ marginTop: '0.4rem', fontSize: '0.68rem', color: '#94a3b8' }}>
                Powered by Salon Reminder
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">Close</button>
          <button onClick={handlePrint} className="btn btn-primary" style={{ fontWeight: '700' }}>
            <Printer size={16} />
            Print Receipt / Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
