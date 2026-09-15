import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import { Avatar } from '../layout/Avatar';
import {
  Scissors,
  Users,
  Plus,
  Star,
  Clock,
  Edit2,
  Trash2,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';

export const StaffServicesView = () => {
  const {
    staff,
    addStaffMember,
    updateStaffMember,
    services,
    addServiceItem,
    updateServiceItem,
    business,
    appointments
  } = useApp();

  const { isOwner } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('staff'); // 'staff', 'services'
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Staff form state
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    phone: '',
    specialties: ''
  });

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Hair',
    duration: 60,
    price: 2500,
    deposit: 500,
    description: ''
  });

  const handleStaffSubmit = (e) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.role) return;

    const specs = staffForm.specialties
      ? staffForm.specialties.split(',').map(s => s.trim()).filter(Boolean)
      : ['Salon Specialist'];

    const payload = {
      name: staffForm.name,
      role: staffForm.role,
      avatar: staffForm.avatar,
      phone: staffForm.phone,
      specialties: specs
    };

    if (editingStaff) {
      updateStaffMember(editingStaff.id, payload);
    } else {
      addStaffMember(payload);
    }

    setShowStaffModal(false);
    setEditingStaff(null);
  };

  const handleServiceSubmit = (e) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.price) return;

    const payload = {
      name: serviceForm.name,
      category: serviceForm.category,
      duration: Number(serviceForm.duration),
      price: Number(serviceForm.price),
      deposit: Number(serviceForm.deposit),
      description: serviceForm.description
    };

    if (editingService) {
      updateServiceItem(editingService.id, payload);
    } else {
      addServiceItem(payload);
    }

    setShowServiceModal(false);
    setEditingService(null);
  };

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
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
            }}>
              <Scissors size={22} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '1.75rem', color: '#fff' }}>Staff & Service Menu</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Configure stylists, therapists, treatment menus, pricing, duration and deposit requirements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {activeSubTab === 'staff' ? (
            <button
              onClick={() => {
                setEditingStaff(null);
                setStaffForm({
                  name: '',
                  role: '',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
                  phone: '',
                  specialties: ''
                });
                setShowStaffModal(true);
              }}
              className="btn btn-primary"
              style={{ fontWeight: '700' }}
            >
              <Plus size={18} />
              Add Staff Member
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingService(null);
                setServiceForm({
                  name: '',
                  category: 'Hair',
                  duration: 60,
                  price: 2500,
                  deposit: 500,
                  description: ''
                });
                setShowServiceModal(true);
              }}
              className="btn btn-primary"
              style={{ fontWeight: '700' }}
            >
              <Plus size={18} />
              Add New Service
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setActiveSubTab('staff')}
          className={`btn ${activeSubTab === 'staff' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '0.5rem 1.25rem' }}
        >
          <Users size={16} /> Specialists & Stylists ({staff.length})
        </button>
        <button
          onClick={() => setActiveSubTab('services')}
          className={`btn ${activeSubTab === 'services' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ padding: '0.5rem 1.25rem' }}
        >
          <Scissors size={16} /> Service Catalog & Pricing ({services.length})
        </button>
      </div>

      {/* SUBTAB 1: STAFF ROSTER */}
      {activeSubTab === 'staff' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {staff.map(st => {
            const staffAppointments = appointments.filter(a => a.staffId === st.id || a.staffName === st.name);
            const completedCount = staffAppointments.filter(a => a.status === 'completed').length;
            const noShowCount = staffAppointments.filter(a => a.status === 'no-show').length;
            const staffNoShowRate = staffAppointments.length > 0 ? Math.round((noShowCount / staffAppointments.length) * 100) : 0;

            return (
              <div key={st.id} className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <Avatar src={st.avatar} name={st.name} size={56} style={{ border: '2px solid rgba(99, 102, 241, 0.4)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.2rem' }}>{st.name}</h3>
                    <div style={{ fontSize: '0.82rem', color: '#818cf8', fontWeight: '600' }}>{st.role}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
                      <Star size={13} color="#fbbf24" fill="#fbbf24" />
                      <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: '700' }}>{st.rating || 4.9}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>rating</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {st.specialties?.map((spec, i) => (
                    <span key={i} className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Performance stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Completed Bookings</div>
                    <strong style={{ fontSize: '1rem', color: '#34d399' }}>{completedCount + (st.totalBookings || 0)}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Staff No-Show Rate</div>
                    <strong style={{ fontSize: '1rem', color: staffNoShowRate > 10 ? '#fb7185' : '#818cf8' }}>
                      {staffNoShowRate}%
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{st.phone || '+91 98200 00000'}</span>
                  {isOwner && (
                    <button
                      onClick={() => {
                        setEditingStaff(st);
                        setStaffForm({
                          name: st.name,
                          role: st.role,
                          avatar: st.avatar,
                          phone: st.phone || '',
                          specialties: st.specialties?.join(', ') || ''
                        });
                        setShowStaffModal(true);
                      }}
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#818cf8' }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 2: SERVICES CATALOG */}
      {activeSubTab === 'services' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {services.map(srv => (
            <div key={srv.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-blue">{srv.category}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                      {formatCurrency(srv.price, business.currency)}
                    </div>
                    {srv.deposit > 0 && (
                      <div style={{ fontSize: '0.72rem', color: '#fbbf24' }}>
                        Deposit: {formatCurrency(srv.deposit, business.currency)}
                      </div>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.5rem' }}>{srv.name}</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
                  {srv.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <Clock size={14} />
                  <span>Duration: <strong>{formatDuration(srv.duration)}</strong></span>
                </div>

                {isOwner && (
                  <button
                    onClick={() => {
                      setEditingService(srv);
                      setServiceForm({
                        name: srv.name,
                        category: srv.category,
                        duration: srv.duration,
                        price: srv.price,
                        deposit: srv.deposit || 0,
                        description: srv.description || ''
                      });
                      setShowServiceModal(true);
                    }}
                    className="btn btn-ghost btn-sm"
                    style={{ color: '#818cf8' }}
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Staff Modal */}
      {showStaffModal && (
        <div className="modal-overlay" onClick={() => setShowStaffModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Users size={20} color="var(--primary)" />
                {editingStaff ? 'Edit Staff Member' : 'Add New Specialist'}
              </h3>
              <button onClick={() => setShowStaffModal(false)} className="btn btn-ghost btn-icon-only">✕</button>
            </div>
            <form onSubmit={handleStaffSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Elena Rostova"
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Role / Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Master Hair Stylist"
                      value={staffForm.role}
                      onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 98200 00000"
                      value={staffForm.phone}
                      onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Specialties (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Balayage, Keratin, Blowout"
                    value={staffForm.specialties}
                    onChange={(e) => setStaffForm({ ...staffForm, specialties: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Avatar Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={staffForm.avatar}
                    onChange={(e) => setStaffForm({ ...staffForm, avatar: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowStaffModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingStaff ? 'Save' : 'Add Staff'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {showServiceModal && (
        <div className="modal-overlay" onClick={() => setShowServiceModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Scissors size={20} color="var(--primary)" />
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setShowServiceModal(false)} className="btn btn-ghost btn-icon-only">✕</button>
            </div>
            <form onSubmit={handleServiceSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Service Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Signature Hydra-Glow Facial"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    >
                      <option value="Hair">Hair</option>
                      <option value="Skin">Skin</option>
                      <option value="Grooming">Grooming</option>
                      <option value="Nails">Nails</option>
                      <option value="Spa">Spa</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration (mins)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={serviceForm.duration}
                      onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price ({business.currency})</label>
                    <input
                      type="number"
                      className="form-input"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Deposit Required for Risky Clients ({business.currency})</label>
                  <input
                    type="number"
                    className="form-input"
                    value={serviceForm.deposit}
                    onChange={(e) => setServiceForm({ ...serviceForm, deposit: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowServiceModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editingService ? 'Save Service' : 'Add Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
