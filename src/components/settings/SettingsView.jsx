import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  DollarSign,
  Clock,
  ShieldAlert,
  Building,
  Save,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const SettingsView = () => {
  const {
    business,
    updateBusiness,
    exportBackup,
    importBackup,
    resetToDefaultData
  } = useApp();

  const { isOwner } = useAuth();

  const [form, setForm] = useState({
    name: business.name || '',
    owner: business.owner || '',
    tagline: business.tagline || '',
    phone: business.phone || '',
    address: business.address || '',
    currency: business.currency || 'INR',
    cancellationNoticeHours: business.cancellationNoticeHours || 2,
    depositRequiredForRiskyClients: business.depositRequiredForRiskyClients ?? true,
    autoRemindersEnabled: business.autoRemindersEnabled ?? true
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateBusiness(form);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        importBackup(content);
      }
    };
    reader.readAsText(file);
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
              background: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(100, 116, 139, 0.4)'
            }}>
              <Settings size={22} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '1.75rem', color: '#fff' }}>Salon Settings & Data Management</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Configure business profiles, currency, cancellation policy, automated backups and disaster recovery.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* SECTION 1: Business Profile & Currency Settings */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={20} color="var(--primary)" />
            Business Profile & Policy
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            General salon information displayed on reminders and booking slips
          </p>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Salon / Business Name</label>
              <input
                type="text"
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Owner / Director Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Currency</label>
                <select
                  className="form-select"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                >
                  <option value="PKR">PKR (Rs. - Pakistani Rupee)</option>
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="AED">AED (AED - UAE Dirham)</option>
                  <option value="SAR">SAR (SAR - Saudi Riyal)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="CAD">CAD (CA$ - Canadian Dollar)</option>
                  <option value="AUD">AUD (AU$ - Australian Dollar)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone / WhatsApp Number</label>
              <input
                type="tel"
                className="form-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Physical Salon Address</label>
              <textarea
                className="form-textarea"
                rows="2"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.85rem' }}>No-Show & Cancellation Protection</h4>

              <div className="form-group">
                <label className="form-label">Minimum Cancellation Notice Window (Hours)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="48"
                  value={form.cancellationNoticeHours}
                  onChange={(e) => setForm({ ...form, cancellationNoticeHours: Number(e.target.value) })}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Cancellations within this window trigger immediate empty slot replacement alerts.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#fff', fontSize: '0.88rem' }}>Enforce Risky Client Deposit Alert</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Show deposit warning for customers with reliability &lt; 50%</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.depositRequiredForRiskyClients}
                  onChange={(e) => setForm({ ...form, depositRequiredForRiskyClients: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button type="submit" className="btn btn-primary" style={{ fontWeight: '700' }}>
                <Save size={16} />
                Save Business Settings
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 2: Data Backup, Recovery & Reset (Section 8 of PDF) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={20} color="var(--primary)" />
              Backup & Data Export
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              Export all salon data (appointments, customers, reliability scores, waitlist, pricing, and revenue records) to a portable JSON backup file.
            </p>

            <button
              onClick={exportBackup}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontWeight: '700' }}
            >
              <Download size={16} />
              Export Full Salon Backup (JSON)
            </button>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Upload size={20} color="#34d399" />
              Restore Salon Data
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              Restore from a previously exported backup file to synchronize across machines or recover data.
            </p>

            <label className="btn btn-emerald" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>
              <Upload size={16} />
              Choose Backup JSON File to Restore
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#fb7185', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={20} color="#fb7185" />
              Reset to Demo State
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              Wipes custom changes and restores the preloaded Luxe Glow Salon & Spa demo dataset with dynamic today schedules.
            </p>

            <button
              onClick={resetToDefaultData}
              className="btn btn-rose"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontWeight: '700' }}
            >
              <RefreshCw size={16} />
              Reset All Data to Fresh Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
