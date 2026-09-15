import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatTime, formatDate } from '../../utils/formatters';
import { findWaitlistMatchesForSlot } from '../../utils/calculations';
import {
  Zap,
  Plus,
  Sparkles,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Trash2,
  AlertOctagon,
  ArrowRight,
  Filter,
  Check,
  Award
} from 'lucide-react';

export const RecoveryHub = () => {
  const {
    openEmptySlots,
    waitlist,
    appointments,
    business,
    kpis,
    setRecoveryModalSlot,
    addToWaitlist,
    deleteWaitlistEntry,
    updateWaitlistStatus,
    services,
    staff,
    customers
  } = useApp();

  const [waitlistFilter, setWaitlistFilter] = useState('Waiting'); // 'Waiting', 'Recovered', 'All'
  const [showAddModal, setShowAddModal] = useState(false);

  // New waitlist form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    serviceId: services[0]?.id || '',
    staffId: 'any',
    preferredTime: 'anytime',
    priority: 'High',
    notes: ''
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone) return;

    const selectedSrv = services.find(s => s.id === formData.serviceId) || services[0];
    const selectedSt = staff.find(s => s.id === formData.staffId);

    addToWaitlist({
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      serviceId: selectedSrv.id,
      serviceName: selectedSrv.name,
      staffId: formData.staffId,
      staffName: selectedSt ? selectedSt.name : 'Any Specialist',
      price: selectedSrv.price,
      priority: formData.priority,
      preferredTime: formData.preferredTime,
      notes: formData.notes
    });

    setFormData({
      customerName: '',
      customerPhone: '',
      serviceId: services[0]?.id || '',
      staffId: 'any',
      preferredTime: 'anytime',
      priority: 'High',
      notes: ''
    });
    setShowAddModal(false);
  };

  const filteredWaitlist = waitlist.filter(w => {
    if (waitlistFilter === 'All') return true;
    return w.status === waitlistFilter;
  });

  // Historical recovered appointments
  const recoveredAppointments = appointments.filter(a => a.isRecovered || a.recoveredFromWaitlist);

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
            }}>
              <Zap size={22} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '1.75rem', color: '#fff' }}>Revenue Recovery Engine</h1>
            <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>Core USP</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Automatically detect empty cancelled slots and immediately fill them from your active waitlist.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-emerald"
          style={{ padding: '0.65rem 1.25rem', fontWeight: '700' }}
        >
          <Plus size={18} />
          Add Client to Waitlist
        </button>
      </div>

      {/* KPI Stats Grid for Recovery */}
      <div className="kpi-grid" style={{ marginBottom: '2rem' }}>
        <div className="kpi-card kpi-hero-recovery">
          <div className="kpi-header">
            <span className="kpi-title">Total Recovered Revenue</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--emerald-subtle)' }}>
              <Award size={20} color="#34d399" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#34d399' }}>
            {formatCurrency(kpis.totalRecoveredRevenue, business.currency)}
          </div>
          <div className="kpi-subtitle">
            <Sparkles size={14} color="#34d399" />
            <span>{kpis.totalRecoveredCount} appointments rescued from being lost</span>
          </div>
        </div>

        <div className="kpi-card kpi-hero-lost">
          <div className="kpi-header">
            <span className="kpi-title">Open Empty Slots (Today)</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--rose-subtle)' }}>
              <AlertOctagon size={20} color="#fb7185" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: openEmptySlots.length > 0 ? '#fb7185' : '#fff' }}>
            {openEmptySlots.length}
          </div>
          <div className="kpi-subtitle">
            <span>{openEmptySlots.length > 0 ? '⚡ Needs immediate waitlist match' : 'All slots filled!'}</span>
          </div>
        </div>

        <div className="kpi-card kpi-hero-primary">
          <div className="kpi-header">
            <span className="kpi-title">Active Waitlist Queue</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--primary-subtle)' }}>
              <User size={20} color="#818cf8" />
            </div>
          </div>
          <div className="kpi-value">
            {waitlist.filter(w => w.status === 'Waiting').length}
          </div>
          <div className="kpi-subtitle">
            <span>Ready for 1-click slot assignment</span>
          </div>
        </div>

        <div className="kpi-card kpi-hero-amber">
          <div className="kpi-header">
            <span className="kpi-title">Recovery Success Rate</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--amber-subtle)' }}>
              <Sparkles size={20} color="#fbbf24" />
            </div>
          </div>
          <div className="kpi-value">
            {kpis.totalRecoveredCount > 0 ? '82%' : '0%'}
          </div>
          <div className="kpi-subtitle">
            <span>Average recovery turnaround: 14 mins</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Open Empty Slots Alert Queue */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertOctagon size={20} color={openEmptySlots.length > 0 ? '#fb7185' : '#34d399'} />
              Open Empty Slots Requiring Recovery ({openEmptySlots.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Slots released due to client cancellations or no-shows that can be rescued right now
            </p>
          </div>
        </div>

        {openEmptySlots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(16, 185, 129, 0.04)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <CheckCircle2 size={36} color="#34d399" style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ color: '#f8fafc', fontSize: '1.05rem', marginBottom: '0.25rem' }}>No Empty Slots Right Now</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              All appointments are booked, confirmed or completed. If a cancellation occurs, it will immediately appear here for 1-click matching!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {openEmptySlots.map(slot => {
              const matches = findWaitlistMatchesForSlot(slot, waitlist);
              const topMatch = matches[0];

              return (
                <div
                  key={slot.id}
                  className="pulse-urgent"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.12) 0%, rgba(30, 41, 59, 0.9) 100%)',
                    border: '1px solid rgba(244, 63, 94, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{
                      textAlign: 'center',
                      padding: '0.65rem 1rem',
                      background: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-glass)'
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                        {formatTime(slot.time)}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#fb7185', fontWeight: '700' }}>
                        EMPTY SLOT
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <h4 style={{ fontSize: '1.05rem', color: '#fff' }}>{slot.serviceName}</h4>
                        <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>
                          {slot.status === 'no-show' ? 'No-Show' : 'Cancelled'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        Specialist: <strong style={{ color: '#cbd5e1' }}>{slot.staffName}</strong> • Value at Risk: <strong style={{ color: '#fb7185' }}>{formatCurrency(slot.price, business.currency)}</strong>
                      </div>

                      {topMatch && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.78rem', color: '#34d399' }}>
                          <Sparkles size={13} />
                          <span>Top Match: <strong>{topMatch.candidate.customerName}</strong> ({topMatch.matchScore}% fit)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setRecoveryModalSlot(slot)}
                    className="btn btn-emerald"
                    style={{ fontWeight: '700', padding: '0.7rem 1.3rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}
                  >
                    <Zap size={16} />
                    1-Click Match & Recover ({matches.length} Waiting)
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: Active Waitlist Management */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div className="toolbar-row">
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="var(--primary)" />
              Customer Waitlist Queue
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Clients waiting for cancellations or preferred openings
            </p>
          </div>

          <div className="filter-pills">
            <button
              onClick={() => setWaitlistFilter('Waiting')}
              className={`filter-pill ${waitlistFilter === 'Waiting' ? 'active' : ''}`}
            >
              Active Waiting ({waitlist.filter(w => w.status === 'Waiting').length})
            </button>
            <button
              onClick={() => setWaitlistFilter('Recovered')}
              className={`filter-pill ${waitlistFilter === 'Recovered' ? 'active' : ''}`}
            >
              Recovered ({waitlist.filter(w => w.status === 'Recovered').length})
            </button>
            <button
              onClick={() => setWaitlistFilter('All')}
              className={`filter-pill ${waitlistFilter === 'All' ? 'active' : ''}`}
            >
              All ({waitlist.length})
            </button>
          </div>
        </div>

        {filteredWaitlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>No waitlist entries found in this view.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Requested Service</th>
                  <th>Specialist</th>
                  <th>Time Preference</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWaitlist.map(entry => (
                  <tr key={entry.id}>
                    <td>
                      <div>
                        <strong style={{ color: '#fff' }}>{entry.customerName}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{entry.customerPhone}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{entry.serviceName}</span>
                    </td>
                    <td>{entry.staffName}</td>
                    <td>
                      <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                        {entry.preferredTime}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${entry.priority === 'Urgent' ? 'badge-rose' : entry.priority === 'High' ? 'badge-amber' : 'badge-blue'}`} style={{ fontSize: '0.65rem' }}>
                        {entry.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${entry.status === 'Recovered' ? 'badge-emerald' : 'badge-purple'}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td style={{ maxWidth: '200px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {entry.notes || '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        {entry.status === 'Waiting' && openEmptySlots.length > 0 && (
                          <button
                            onClick={() => setRecoveryModalSlot(openEmptySlots[0])}
                            className="btn btn-emerald btn-sm"
                            title="Match with available empty slot"
                          >
                            <Zap size={13} />
                            Offer Slot
                          </button>
                        )}
                        <button
                          onClick={() => deleteWaitlistEntry(entry.id)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--text-muted)' }}
                          title="Remove from waitlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 3: Historical Recovered Revenue Ledger */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} color="#34d399" />
          Revenue Recovery Proof & Ledger ({recoveredAppointments.length} Saved Bookings)
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Exact audit trail of appointments salvaged through Salon Reminder automated & manual recovery
        </p>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Client Saved</th>
                <th>Service</th>
                <th>Specialist</th>
                <th>Recovered Revenue</th>
                <th>Recovery Type</th>
              </tr>
            </thead>
            <tbody>
              {recoveredAppointments.map(app => (
                <tr key={app.id}>
                  <td>
                    <div>
                      <strong style={{ color: '#fff' }}>{formatDate(app.date)}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatTime(app.time)}</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong style={{ color: '#fff' }}>{app.customerName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.customerPhone}</div>
                    </div>
                  </td>
                  <td>{app.serviceName}</td>
                  <td>{app.staffName}</td>
                  <td>
                    <strong style={{ color: '#34d399', fontSize: '0.95rem' }}>
                      +{formatCurrency(app.price || app.recoveredRevenue, business.currency)}
                    </strong>
                  </td>
                  <td>
                    <span className="badge badge-emerald">
                      1-Click Waitlist Fill
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add to Waitlist Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Plus size={20} color="var(--primary)" />
                Add Client to Waitlist
              </h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost btn-icon-only">✕</button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Natasha Verma"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number (For WhatsApp / SMS Alert)</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98200 00000"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Requested Service</label>
                    <select
                      className="form-select"
                      value={formData.serviceId}
                      onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    >
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({formatCurrency(s.price, business.currency)})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Specialist Preference</label>
                    <select
                      className="form-select"
                      value={formData.staffId}
                      onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                    >
                      <option value="any">Any Specialist</option>
                      {staff.map(st => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Preferred Time</label>
                    <select
                      className="form-select"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    >
                      <option value="anytime">Anytime Today</option>
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                      <option value="evening">Evening (5 PM - 8 PM)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Urgent">Urgent (Will arrive in 20m)</option>
                      <option value="High">High Priority</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Client Notes & Availability</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    placeholder="e.g. Free after 2 PM, wants Hydra-Facial"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-emerald">Add to Waitlist</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
