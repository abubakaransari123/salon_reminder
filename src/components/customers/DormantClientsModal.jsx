import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { generateDormantClientWhatsAppUrl } from '../../utils/whatsapp';
import { Users, UserX, MessageSquare, Sparkles, Phone, Award, ArrowUpRight } from 'lucide-react';

export const DormantClientsModal = ({ isOpen, onClose }) => {
  const { customers, business } = useApp();

  if (!isOpen) return null;

  // Filter customers whose last visit was > 30 days ago or have dormant tag
  const dormantClients = customers.filter(c => {
    if (c.tags && c.tags.includes('Dormant Client')) return true;
    if (c.lastVisitDate) {
      const daysSince = Math.floor((new Date() - new Date(c.lastVisitDate)) / (1000 * 60 * 60 * 24));
      return daysSince >= 30;
    }
    return false;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ border: '1px solid rgba(245, 158, 11, 0.4)' }}
      >
        <div className="modal-header" style={{ background: 'linear-gradient(90deg, #3b1803 0%, #111827 100%)' }}>
          <h3 style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserX size={20} color="#fbbf24" />
            Dormant Client Re-Engagement Engine
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-icon-only">✕</button>
        </div>

        <div className="modal-body">
          <div style={{ padding: '1rem 1.25rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: '700', color: '#fbbf24', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              💡 Bring Back Past Customers (Zero Marketing Cost)
            </div>
            <p style={{ fontSize: '0.82rem', color: '#e2e8f0', margin: 0, lineHeight: '1.4' }}>
              These clients haven't booked in the last 30+ days. Click the WhatsApp button to send a pre-formatted <strong>20% VIP Return Voucher</strong> directly to their phone!
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {dormantClients.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No dormant clients found. All customers have visited recently!
              </p>
            ) : (
              dormantClients.map(client => {
                const waUrl = generateDormantClientWhatsAppUrl(client, business, 20);

                return (
                  <div
                    key={client.id}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <strong style={{ fontSize: '1rem', color: '#fff' }}>{client.name}</strong>
                        <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                          Inactive 40+ Days
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        Phone: <strong style={{ color: '#cbd5e1' }}>{client.phone}</strong> • Total Lifetime Spend: <strong style={{ color: '#34d399' }}>{formatCurrency(client.totalSpend, business.currency)}</strong>
                      </div>
                      {client.loyaltyPoints > 0 && (
                        <div style={{ fontSize: '0.75rem', color: '#818cf8', marginTop: '0.2rem' }}>
                          🎁 Has {client.loyaltyPoints} unused loyalty points
                        </div>
                      )}
                    </div>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-emerald"
                      style={{ fontWeight: '700', padding: '0.55rem 1.1rem', fontSize: '0.84rem' }}
                    >
                      <MessageSquare size={15} />
                      Send 20% Offer on WhatsApp
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
};
