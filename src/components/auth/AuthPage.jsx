import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  Building,
  User,
  Phone,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const AuthPage = () => {
  const { login, register } = useAuth();
  const { updateBusiness } = useApp();

  const [mode, setMode] = useState('login'); // 'login', 'signup'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('sarah@luxeglow.com');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [loginRole, setLoginRole] = useState('owner');

  // Sign up form state
  const [signupForm, setSignupForm] = useState({
    ownerName: '',
    salonName: '',
    email: '',
    password: '',
    phone: '',
    currency: 'PKR',
    businessType: 'Hair & Beauty Salon'
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(loginEmail, loginPassword, loginRole);
  };

  const handleQuickLogin = (roleType) => {
    if (roleType === 'owner') {
      login('sarah@luxeglow.com', 'password123', 'owner');
    } else {
      login('elena@luxeglow.com', 'password123', 'staff');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupForm.ownerName || !signupForm.salonName || !signupForm.email) return;

    register({
      ownerName: signupForm.ownerName,
      salonName: signupForm.salonName,
      email: signupForm.email
    });

    updateBusiness({
      name: signupForm.salonName,
      owner: signupForm.ownerName,
      email: signupForm.email,
      phone: signupForm.phone || '+92 300 1234567',
      currency: signupForm.currency
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.12) 0%, transparent 50%), #0b0f19',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}
    >
      <div
        className="glass-card auth-card-container"
        style={{
          width: '100%',
          maxWidth: '960px',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.85)'
        }}
      >
        {/* Left Side: Brand Value Proposition & Features */}
        <div
          className="auth-side-panel"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #0d131f 100%)',
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid var(--border-glass)'
          }}
        >
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)'
                }}
              >
                <Flame size={26} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#fff' }}>
                    Salon
                  </span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.25rem', color: '#ec4899' }}>
                    Reminder
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Smart Salon Management
                </span>
              </div>
            </div>

            <h2 style={{ fontSize: '1.6rem', color: '#fff', lineHeight: '1.25', marginBottom: '1rem' }}>
              Stop losing revenue to missed salon appointments.
            </h2>

            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '1.75rem' }}>
              Track no-shows, calculate estimated lost earnings, and instantly fill empty cancelled slots from your waitlist.
            </p>

            {/* Feature Bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={14} color="#34d399" />
                </div>
                <span style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>1-Click Smart Waitlist Revenue Recovery</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={14} color="#818cf8" />
                </div>
                <span style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>Automated Customer Reliability Risk Scoring</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={14} color="#fb7185" />
                </div>
                <span style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>Interactive WhatsApp / SMS Reminders Simulator</span>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '2rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Built for Salons, Spas, Barbers & Service Businesses • Multi-Currency (PKR, INR, USD, AED)
            </span>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div style={{ padding: '2.5rem 2.25rem', background: '#111827', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Mode Switch Tabs */}
          <div style={{ display: 'flex', background: '#1e293b', padding: '4px', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
            <button
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: mode === 'login' ? 'var(--primary)' : 'transparent',
                color: mode === 'login' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Sign In to Salon
            </button>
            <button
              onClick={() => setMode('signup')}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: mode === 'signup' ? 'var(--primary)' : 'transparent',
                color: mode === 'signup' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Register New Business
            </button>
          </div>

          {/* SIGN IN FORM */}
          {mode === 'login' ? (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '0.3rem' }}>Welcome Back</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Sign in to manage appointments, track no-shows and recover revenue.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="form-input"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="owner@salon.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem', fontWeight: '700', fontSize: '0.95rem', marginBottom: '1.25rem' }}
                >
                  Sign In
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* 1-Click Demo Login Presets */}
              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
                  — Or 1-Click Instant Demo Login —
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('owner')}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', padding: '0.6rem 0.85rem', borderColor: 'rgba(99, 102, 241, 0.4)' }}
                  >
                    <ShieldCheck size={16} color="#818cf8" />
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <strong style={{ color: '#fff', fontSize: '0.84rem' }}>Login as Salon Owner (Sarah Jenkins)</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Full access to revenue, pricing, staff & settings</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('staff')}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', padding: '0.6rem 0.85rem' }}
                  >
                    <UserCheck size={16} color="#34d399" />
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <strong style={{ color: '#fff', fontSize: '0.84rem' }}>Login as Staff Specialist (Elena Rostova)</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Stylist view for personal schedules & check-in</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* SIGN UP / REGISTER FORM */
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '0.3rem' }}>Register Salon Business</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Set up your salon profile and start protecting appointment revenue.
                </p>
              </div>

              <form onSubmit={handleSignupSubmit}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Salon / Business Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Royal Glow Lounge"
                      value={signupForm.salonName}
                      onChange={(e) => setSignupForm({ ...signupForm, salonName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Owner Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Asad Malik"
                      value={signupForm.ownerName}
                      onChange={(e) => setSignupForm({ ...signupForm, ownerName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Work Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="owner@salon.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+92 300 0000000"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Primary Currency</label>
                    <select
                      className="form-select"
                      value={signupForm.currency}
                      onChange={(e) => setSignupForm({ ...signupForm, currency: e.target.value })}
                    >
                      <option value="PKR">PKR (Rs. - Pakistani Rupee)</option>
                      <option value="INR">INR (₹ - Indian Rupee)</option>
                      <option value="USD">USD ($ - US Dollar)</option>
                      <option value="AED">AED (AED - UAE Dirham)</option>
                      <option value="SAR">SAR (SAR - Saudi Riyal)</option>
                      <option value="GBP">GBP (£ - British Pound)</option>
                      <option value="EUR">EUR (€ - Euro)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Business Category</label>
                    <select
                      className="form-select"
                      value={signupForm.businessType}
                      onChange={(e) => setSignupForm({ ...signupForm, businessType: e.target.value })}
                    >
                      <option value="Hair & Beauty Salon">Hair & Beauty Salon</option>
                      <option value="Spa & Aesthetics">Spa & Aesthetics</option>
                      <option value="Men Grooming / Barber">Men Grooming / Barber</option>
                      <option value="Nail Studio">Nail Studio</option>
                      <option value="Clinic & Dental">Clinic & Dental</option>
                      <option value="Fitness Studio">Fitness Studio</option>
                      <option value="Car Workshop">Car Workshop</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-emerald"
                  style={{ width: '100%', padding: '0.75rem', fontWeight: '700', fontSize: '0.95rem', marginTop: '0.5rem' }}
                >
                  Create Business & Launch Dashboard ➜
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
