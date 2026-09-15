import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReliabilityBadge } from './ReliabilityBadge';
import { CustomerModal } from './CustomerModal';
import { calculateReliabilityScore } from '../../utils/calculations';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Edit2,
  Trash2,
  Calendar,
  History,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export const CustomersView = () => {
  const {
    customers,
    deleteCustomer,
    appointments,
    business,
    setAppointmentModalOpen
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all'); // 'all', 'elite', 'reliable', 'moderate', 'high-risk'
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedHistoryCustomer, setSelectedHistoryCustomer] = useState(null);

  // Filtered customers
  const filteredCustomers = customers.filter(c => {
    const scoreData = calculateReliabilityScore(c);
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesTier = tierFilter === 'all' || scoreData.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  // Calculate tier counts
  const eliteCount = customers.filter(c => calculateReliabilityScore(c).tier === 'elite').length;
  const reliableCount = customers.filter(c => calculateReliabilityScore(c).tier === 'reliable').length;
  const highRiskCount = customers.filter(c => calculateReliabilityScore(c).tier === 'high-risk').length;

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
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
            }}>
              <Users size={22} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '1.75rem', color: '#fff' }}>Customer Intelligence & Reliability</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Track attendance loyalty, calculate no-show risk scores, and prevent empty chair revenue leaks.
          </p>
        </div>

        <button
          onClick={() => { setEditingCustomer(null); setModalOpen(true); }}
          className="btn btn-primary"
          style={{ fontWeight: '700' }}
        >
          <Plus size={18} />
          Add New Customer
        </button>
      </div>

      {/* KPI Cards for Customer Risk Breakdown */}
      <div className="kpi-grid" style={{ marginBottom: '1.75rem' }}>
        <div className="kpi-card kpi-hero-primary">
          <div className="kpi-header">
            <span className="kpi-title">Total Registered Clients</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--primary-subtle)' }}>
              <Users size={20} color="#818cf8" />
            </div>
          </div>
          <div className="kpi-value">{customers.length}</div>
          <div className="kpi-subtitle">Full database with lifetime analytics</div>
        </div>

        <div className="kpi-card kpi-hero-recovery">
          <div className="kpi-header">
            <span className="kpi-title">Elite & Reliable (90%+)</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--emerald-subtle)' }}>
              <ShieldCheck size={20} color="#34d399" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#34d399' }}>{eliteCount + reliableCount}</div>
          <div className="kpi-subtitle">Punctual & repeat revenue drivers</div>
        </div>

        <div className="kpi-card kpi-hero-lost">
          <div className="kpi-header">
            <span className="kpi-title">High No-Show Risk (Under 50%)</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--rose-subtle)' }}>
              <ShieldAlert size={20} color="#fb7185" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: highRiskCount > 0 ? '#fb7185' : '#fff' }}>{highRiskCount}</div>
          <div className="kpi-subtitle">Auto-flagged for deposits & 2h reminders</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div className="toolbar-row" style={{ margin: 0 }}>
          <div className="search-input-wrap">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by client name, phone, tags..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            <button
              onClick={() => setTierFilter('all')}
              className={`filter-pill ${tierFilter === 'all' ? 'active' : ''}`}
            >
              All Clients ({customers.length})
            </button>
            <button
              onClick={() => setTierFilter('elite')}
              className={`filter-pill ${tierFilter === 'elite' ? 'active' : ''}`}
            >
              🟢 Elite (90%+)
            </button>
            <button
              onClick={() => setTierFilter('reliable')}
              className={`filter-pill ${tierFilter === 'reliable' ? 'active' : ''}`}
            >
              🔵 Reliable (75-89%)
            </button>
            <button
              onClick={() => setTierFilter('high-risk')}
              className={`filter-pill ${tierFilter === 'high-risk' ? 'active' : ''}`}
              style={{ color: tierFilter === 'high-risk' ? '#fb7185' : undefined }}
            >
              🔴 High Risk (&lt;50%)
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Reliability Score</th>
                <th>Completed Visits</th>
                <th>No-Shows</th>
                <th>Cancellations</th>
                <th>Total Spend</th>
                <th>Tags & Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No customers match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(c => {
                  const scoreData = calculateReliabilityScore(c);
                  const isHighRisk = scoreData.tier === 'high-risk';

                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: isHighRisk ? 'linear-gradient(135deg, #f43f5e, #be123c)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            color: '#fff',
                            fontSize: '0.9rem'
                          }}>
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{c.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <ReliabilityBadge customer={c} />
                      </td>
                      <td>
                        <strong style={{ color: '#34d399' }}>{c.completedVisits || 0}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> visits</span>
                      </td>
                      <td>
                        <strong style={{ color: (c.noShows || 0) > 0 ? '#fb7185' : 'var(--text-muted)' }}>
                          {c.noShows || 0}
                        </strong>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-secondary)' }}>{c.cancellations || 0}</span>
                      </td>
                      <td>
                        <strong style={{ color: '#f8fafc' }}>
                          {formatCurrency(c.totalSpend || 0, business.currency)}
                        </strong>
                      </td>
                      <td style={{ maxWidth: '220px' }}>
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                          {c.tags?.map((t, idx) => (
                            <span key={idx} className="badge badge-purple" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                        {c.notes && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.notes}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => setSelectedHistoryCustomer(c)}
                            className="btn btn-secondary btn-sm"
                            title="View past booking history"
                          >
                            <History size={13} /> History
                          </button>
                          <button
                            onClick={() => { setEditingCustomer(c); setModalOpen(true); }}
                            className="btn btn-ghost btn-sm"
                            title="Edit Profile"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => deleteCustomer(c.id)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--text-muted)' }}
                            title="Delete Customer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Booking History Modal */}
      {selectedHistoryCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedHistoryCustomer(null)}>
          <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <History size={20} color="var(--primary)" />
                Appointment History: {selectedHistoryCustomer.name}
              </h3>
              <button onClick={() => setSelectedHistoryCustomer(null)} className="btn btn-ghost btn-icon-only">✕</button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Reliability Classification</div>
                  <ReliabilityBadge customer={selectedHistoryCustomer} />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Total Spent</div>
                  <strong style={{ fontSize: '1.2rem', color: '#34d399' }}>{formatCurrency(selectedHistoryCustomer.totalSpend, business.currency)}</strong>
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Attendance Record</div>
                  <span style={{ fontSize: '0.9rem', color: '#fff' }}>
                    {selectedHistoryCustomer.completedVisits} Done / {selectedHistoryCustomer.noShows} No-Shows
                  </span>
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.75rem' }}>Past Bookings</h4>
              {appointments.filter(a => a.customerId === selectedHistoryCustomer.id || a.customerName === selectedHistoryCustomer.name).length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No individual appointment logs found for this customer.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {appointments
                    .filter(a => a.customerId === selectedHistoryCustomer.id || a.customerName === selectedHistoryCustomer.name)
                    .map(app => (
                      <div
                        key={app.id}
                        style={{
                          padding: '0.85rem 1rem',
                          background: 'rgba(30, 41, 59, 0.6)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-glass)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '700', color: '#fff' }}>{app.serviceName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            {formatDate(app.date)} at {formatTime(app.time)} • Specialist: {app.staffName}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '700', color: '#34d399' }}>{formatCurrency(app.price, business.currency)}</div>
                          <span className={`badge ${app.status === 'completed' ? 'badge-emerald' : app.status === 'no-show' ? 'badge-rose' : 'badge-purple'}`} style={{ fontSize: '0.65rem' }}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedHistoryCustomer(null)} className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Add/Edit Modal */}
      <CustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingCustomer={editingCustomer}
      />
    </div>
  );
};
