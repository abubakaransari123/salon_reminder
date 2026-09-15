import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Phone, Mail, FileText, Tag, Plus, Check } from 'lucide-react';

export const CustomerModal = ({ isOpen, onClose, editingCustomer }) => {
  const { addCustomer, updateCustomer } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    tags: 'Regular'
  });

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        name: editingCustomer.name || '',
        phone: editingCustomer.phone || '',
        email: editingCustomer.email || '',
        notes: editingCustomer.notes || '',
        tags: Array.isArray(editingCustomer.tags) ? editingCustomer.tags.join(', ') : (editingCustomer.tags || '')
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        notes: '',
        tags: 'Regular'
      });
    }
  }, [editingCustomer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const tagsArray = formData.tags
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : ['Regular'];

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      notes: formData.notes,
      tags: tagsArray
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, payload);
    } else {
      addCustomer(payload);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <User size={20} color="var(--primary)" />
            {editingCustomer ? 'Edit Customer Profile' : 'Add New Customer'}
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-icon-only">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Aaliyah Khan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98200 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="client@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="VIP, High Spender, Deposit Required"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Client Notes & Preferences</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="e.g. Prefers quiet appointments, allergic to certain fragrance oils, regular Hydra-Facial customer."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">
              {editingCustomer ? 'Save Profile' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
