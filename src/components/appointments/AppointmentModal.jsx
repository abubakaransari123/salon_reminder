import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateReliabilityScore } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { ReliabilityBadge } from '../customers/ReliabilityBadge';
import { Calendar, Clock, User, Scissors, Phone, Plus, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AppointmentModal = () => {
  const {
    appointmentModalOpen,
    setAppointmentModalOpen,
    editingAppointment,
    setEditingAppointment,
    addAppointment,
    updateAppointment,
    customers,
    services,
    staff,
    business
  } = useApp();

  const [customerId, setCustomerId] = useState('');
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');

  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [staffId, setStaffId] = useState(staff[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingAppointment) {
      setCustomerId(editingAppointment.customerId || '');
      setServiceId(editingAppointment.serviceId || services[0]?.id);
      setStaffId(editingAppointment.staffId || staff[0]?.id);
      setDate(editingAppointment.date || new Date().toISOString().split('T')[0]);
      setTime(editingAppointment.time || '11:00');
      setNotes(editingAppointment.notes || '');
      setIsNewCustomer(false);
    } else {
      if (customers.length > 0) {
        setCustomerId(customers[0].id);
      }
    }
  }, [editingAppointment, appointmentModalOpen]);

  if (!appointmentModalOpen) return null;

  const selectedCustomer = customers.find(c => c.id === customerId);
  const selectedService = services.find(s => s.id === serviceId) || services[0];
  const selectedStaff = staff.find(s => s.id === staffId) || staff[0];

  const reliabilityData = selectedCustomer ? calculateReliabilityScore(selectedCustomer) : null;
  const isHighRisk = reliabilityData && reliabilityData.score < 50;

  const handleSubmit = (e) => {
    e.preventDefault();

    let clientName = '';
    let clientPhone = '';
    let finalCustId = customerId;

    if (isNewCustomer) {
      if (!newCustomerName || !newCustomerPhone) return;
      clientName = newCustomerName;
      clientPhone = newCustomerPhone;
      finalCustId = `cust_${Date.now()}`;
    } else if (selectedCustomer) {
      clientName = selectedCustomer.name;
      clientPhone = selectedCustomer.phone;
    }

    const appData = {
      customerId: finalCustId,
      customerName: clientName,
      customerPhone: clientPhone,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      duration: selectedService.duration,
      price: selectedService.price,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      date,
      time,
      notes
    };

    if (editingAppointment) {
      updateAppointment(editingAppointment.id, appData);
    } else {
      addAppointment(appData);
    }

    setEditingAppointment(null);
    setAppointmentModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => { setAppointmentModalOpen(false); setEditingAppointment(null); }}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Calendar size={20} color="var(--primary)" />
            {editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
          </h3>
          <button
            onClick={() => { setAppointmentModalOpen(false); setEditingAppointment(null); }}
            className="btn btn-ghost btn-icon-only"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Customer Selection */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Client Selection</label>
                <button
                  type="button"
                  onClick={() => setIsNewCustomer(!isNewCustomer)}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.75rem', color: '#818cf8', padding: '0.1rem 0.4rem' }}
                >
                  {isNewCustomer ? '← Choose Existing Client' : '+ New Client'}
                </button>
              </div>

              {!isNewCustomer ? (
                <div>
                  <select
                    className="form-select"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone}) - {c.tags?.join(', ') || 'Client'}
                      </option>
                    ))}
                  </select>

                  {/* Customer Reliability Preview */}
                  {selectedCustomer && (
                    <div style={{
                      marginTop: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: isHighRisk ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                      border: isHighRisk ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-glass)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ReliabilityBadge customer={selectedCustomer} size="sm" />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {selectedCustomer.completedVisits} completed • {selectedCustomer.noShows} no-shows
                        </span>
                      </div>

                      {isHighRisk && (
                        <span style={{ fontSize: '0.72rem', color: '#fb7185', fontWeight: '700' }}>
                          ⚠️ Deposit Advised
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="form-input"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (e.g. +91 98200 00000)"
                    className="form-input"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {/* Service & Staff Grid */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Service</label>
                <select
                  className="form-select"
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.duration}m - {formatCurrency(s.price, business.currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Specialist Staff</label>
                <select
                  className="form-select"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                >
                  {staff.map(st => (
                    <option key={st.id} value={st.id}>{st.name} ({st.role})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <input
                  type="time"
                  className="form-input"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Appointment Notes / Special Requests</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="e.g. Needs allergen test, prefers warm water rinse"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={() => { setAppointmentModalOpen(false); setEditingAppointment(null); }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAppointment ? 'Save Changes' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
