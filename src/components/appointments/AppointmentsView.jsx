import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from './StatusBadge';
import { ReliabilityBadge } from '../customers/ReliabilityBadge';
import { Avatar } from '../layout/Avatar';
import { formatCurrency, formatTime, formatDate } from '../../utils/formatters';
import { generateWhatsAppReminderUrl } from '../../utils/whatsapp';
import { exportToCSV } from '../../utils/export';
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  Scissors,
  Edit2,
  CheckCircle2,
  AlertOctagon,
  XCircle,
  MessageSquare,
  Zap,
  ChevronLeft,
  ChevronRight,
  Columns,
  List,
  Download,
  Printer
} from 'lucide-react';

export const AppointmentsView = () => {
  const {
    appointments,
    customers,
    staff,
    services,
    business,
    setAppointmentModalOpen,
    setEditingAppointment,
    updateAppointmentStatus,
    openSimulatorForAppointment,
    setRecoveryModalSlot,
    openReceipt
  } = useApp();

  const { isOwner, isStaff, currentUser } = useAuth();

  const [viewMode, setViewMode] = useState('list'); // 'list', 'day-columns'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [staffFilter, setStaffFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Navigate date
  const shiftDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter(app => {
    // Search match
    const matchesSearch =
      app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.staffName.toLowerCase().includes(searchTerm.toLowerCase());

    // Staff match
    const matchesStaff = staffFilter === 'all' || app.staffId === staffFilter || app.staffName === staffFilter;

    // Status match
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    // Date match (for list view if date filter applied, or all)
    return matchesSearch && matchesStaff && matchesStatus;
  });

  // Day columns appointments
  const dayAppointments = appointments.filter(a => a.date === selectedDate);

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
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
            }}>
              <CalendarIcon size={22} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '1.75rem', color: '#fff' }}>Appointments & Schedule</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage client bookings, calendar schedules, track attendance statuses and simulate notifications.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: '#1e293b', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <button
              onClick={() => setViewMode('list')}
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
            >
              <List size={14} /> List View
            </button>
            <button
              onClick={() => setViewMode('day-columns')}
              className={`btn btn-sm ${viewMode === 'day-columns' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
            >
              <Columns size={14} /> Specialist Grid
            </button>
          </div>

          <button
            onClick={() => { setEditingAppointment(null); setAppointmentModalOpen(true); }}
            className="btn btn-primary"
            style={{ fontWeight: '700' }}
          >
            <Plus size={18} />
            New Appointment
          </button>
        </div>
      </div>

      {/* Date Navigation & Search Controls */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.75rem' }}>
        <div className="toolbar-row" style={{ margin: 0 }}>
          {/* Date Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => shiftDate(-1)} className="btn btn-secondary btn-icon-only">
              <ChevronLeft size={16} />
            </button>
            <input
              type="date"
              className="form-input"
              style={{ width: 'auto', padding: '0.45rem 0.85rem' }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button onClick={() => shiftDate(1)} className="btn btn-secondary btn-icon-only">
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="btn btn-ghost btn-sm"
              style={{ color: '#818cf8', fontWeight: '600' }}
            >
              Today
            </button>
          </div>

          {/* Search Box */}
          <div className="search-input-wrap">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by client, service or specialist..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Selects */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.85rem' }}
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
            >
              <option value="all">All Specialists</option>
              {staff.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.45rem 0.85rem' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="booked">Booked</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="no-show">No-Show</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: DAY COLUMNS (Specialist Grid) */}
      {viewMode === 'day-columns' ? (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${staff.length}, minmax(260px, 1fr))`, gap: '1.25rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {staff.map(st => {
            const staffDayApps = dayAppointments.filter(a => a.staffId === st.id || a.staffName === st.name);

            return (
              <div key={st.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)', marginBottom: '1rem' }}>
                  <Avatar src={st.avatar} name={st.name} size={32} />
                  <div>
                    <h4 style={{ fontSize: '0.98rem', color: '#fff' }}>{st.name}</h4>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{st.role}</span>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {staffDayApps.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      No bookings for this date.
                    </div>
                  ) : (
                    staffDayApps.map(app => (
                      <div
                        key={app.id}
                        style={{
                          background: app.status === 'no-show' ? 'rgba(244, 63, 94, 0.12)' : app.status === 'cancelled' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.8)',
                          border: app.status === 'no-show' ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-glass)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.85rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#fff' }}>{formatTime(app.time)}</span>
                          <StatusBadge status={app.status} isRecovered={app.isRecovered} />
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '0.2rem' }}>
                          {app.serviceName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                          👤 {app.customerName}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                          <span style={{ color: '#34d399', fontWeight: '700' }}>{formatCurrency(app.price, business.currency)}</span>
                          <button
                            onClick={() => openSimulatorForAppointment(app)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '0.15rem 0.35rem', color: '#818cf8', fontSize: '0.72rem' }}
                          >
                            Reminder ➜
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW 2: COMPREHENSIVE TABLE & LIST */
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Client</th>
                  <th>Risk Rating</th>
                  <th>Service</th>
                  <th>Specialist</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      No appointments found matching your search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map(app => {
                    const customerObj = customers.find(c => c.id === app.customerId || c.name === app.customerName);
                    const isOpenEmpty = (app.status === 'cancelled' || app.status === 'no-show') && app.emptySlotDetected;

                    return (
                      <tr key={app.id}>
                        <td>
                          <div>
                            <strong style={{ color: '#fff' }}>{formatDate(app.date)}</strong>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatTime(app.time)} ({app.duration}m)</div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong style={{ color: '#fff' }}>{app.customerName}</strong>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.customerPhone}</div>
                          </div>
                        </td>
                        <td>
                          <ReliabilityBadge customer={customerObj} size="sm" />
                        </td>
                        <td>
                          <span style={{ fontWeight: '600' }}>{app.serviceName}</span>
                        </td>
                        <td>{app.staffName}</td>
                        <td>
                          <strong style={{ color: app.status === 'no-show' ? '#fb7185' : '#34d399' }}>
                            {formatCurrency(app.price, business.currency)}
                          </strong>
                        </td>
                        <td>
                          <StatusBadge status={app.status} isRecovered={app.isRecovered} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            {/* Recovery Trigger if empty */}
                            {isOpenEmpty && (
                              <button
                                onClick={() => setRecoveryModalSlot(app)}
                                className="btn btn-emerald btn-sm"
                                title="1-Click Fill from Waitlist"
                              >
                                <Zap size={13} /> Recover
                              </button>
                            )}

                            {/* Simulator trigger */}
                            {app.status !== 'completed' && app.status !== 'no-show' && (
                              <button
                                onClick={() => openSimulatorForAppointment(app)}
                                className="btn btn-secondary btn-sm"
                                style={{ color: '#818cf8' }}
                                title="Send / Test Interactive Reminder"
                              >
                                <MessageSquare size={13} />
                              </button>
                            )}

                            {/* Mark Complete */}
                            {['booked', 'confirmed', 'in-progress'].includes(app.status) && (
                              <button
                                onClick={() => updateAppointmentStatus(app.id, 'completed')}
                                className="btn btn-emerald btn-sm"
                                title="Mark Completed"
                              >
                                <CheckCircle2 size={13} />
                              </button>
                            )}

                            {/* Mark No Show */}
                            {['booked', 'confirmed'].includes(app.status) && (
                              <button
                                onClick={() => updateAppointmentStatus(app.id, 'no-show')}
                                className="btn btn-rose btn-sm"
                                title="Mark No-Show (Calculates Lost Revenue)"
                              >
                                <AlertOctagon size={13} />
                              </button>
                            )}

                            {/* Edit */}
                            <button
                              onClick={() => { setEditingAppointment(app); setAppointmentModalOpen(true); }}
                              className="btn btn-ghost btn-sm"
                              title="Edit Details"
                            >
                              <Edit2 size={13} />
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
      )}
    </div>
  );
};
