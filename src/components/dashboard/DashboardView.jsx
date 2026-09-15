import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../layout/Avatar';
import { StatCard } from './StatCard';
import { RevenueAlertBanner } from './RevenueAlertBanner';
import { TodaySchedule } from './TodaySchedule';
import { formatCurrency } from '../../utils/formatters';
import {
  TrendingUp,
  AlertOctagon,
  Sparkles,
  CalendarCheck,
  Zap,
  UserPlus,
  Plus,
  MessageSquare,
  Users,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const DashboardView = () => {
  const {
    business,
    kpis,
    openEmptySlots,
    setAppointmentModalOpen,
    setActiveTab,
    startDemoTour,
    openSimulatorForAppointment,
    appointments,
    staff
  } = useApp();

  const { isOwner } = useAuth();

  return (
    <div className="page-wrapper">
      {/* Executive Welcome & Quick Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: '#fff' }}>
              Executive Overview
            </h1>
            <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
              ● Live Operations
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Welcome, <strong>{business.owner}</strong>. Here is today's revenue protection and salon schedule performance.
          </p>
        </div>

        {/* Action quick bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setAppointmentModalOpen(true)}
            className="btn btn-primary"
            style={{ fontWeight: '700' }}
          >
            <Plus size={16} />
            Book Client
          </button>

          <button
            onClick={() => setActiveTab('recovery')}
            className="btn btn-emerald"
            style={{ fontWeight: '700' }}
          >
            <Zap size={16} />
            Recovery Hub ({openEmptySlots.length})
          </button>
        </div>
      </div>

      {/* Hero Revenue Alert Banner */}
      <RevenueAlertBanner />

      {/* KPI Metric Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-hero-recovery">
          <div className="kpi-header">
            <span className="kpi-title">Recovered Revenue</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--emerald-subtle)' }}>
              <Sparkles size={20} color="#34d399" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#34d399' }}>
            {formatCurrency(kpis.totalRecoveredRevenue, business.currency)}
          </div>
          <div className="kpi-subtitle">
            <span style={{ color: '#34d399', fontWeight: '700' }}>+{kpis.totalRecoveredCount}</span>
            <span>slots filled from waitlist</span>
          </div>
        </div>

        <div className="kpi-card kpi-hero-primary">
          <div className="kpi-header">
            <span className="kpi-title">Today's Realized Revenue</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--primary-subtle)' }}>
              <CheckCircle2 size={20} color="#818cf8" />
            </div>
          </div>
          <div className="kpi-value">
            {formatCurrency(kpis.realizedRevenue, business.currency)}
          </div>
          <div className="kpi-subtitle">
            <span>{kpis.completedCount} completed bookings</span>
          </div>
        </div>

        <div className="kpi-card kpi-hero-lost">
          <div className="kpi-header">
            <span className="kpi-title">Today's Lost Revenue</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--rose-subtle)' }}>
              <AlertOctagon size={20} color="#fb7185" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: kpis.lostRevenue > 0 ? '#fb7185' : '#fff' }}>
            {formatCurrency(kpis.lostRevenue, business.currency)}
          </div>
          <div className="kpi-subtitle">
            <span style={{ color: kpis.noShowCount > 0 ? '#fb7185' : 'var(--text-muted)' }}>
              {kpis.noShowCount} client no-show{kpis.noShowCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-hero-amber">
          <div className="kpi-header">
            <span className="kpi-title">Pipeline / Projected</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--amber-subtle)' }}>
              <TrendingUp size={20} color="#fbbf24" />
            </div>
          </div>
          <div className="kpi-value">
            {formatCurrency(kpis.projectedRevenue, business.currency)}
          </div>
          <div className="kpi-subtitle">
            <span>{kpis.confirmedCount + kpis.bookedCount + kpis.inProgressCount} bookings remaining</span>
          </div>
        </div>
      </div>

      {/* Today's Schedule Timeline & Status Stream */}
      <TodaySchedule />

      {/* Staff on Duty & Quick Navigation Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Specialists on Duty */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--primary)" />
              Specialists on Duty Today
            </h3>
            <button onClick={() => setActiveTab('staff')} className="btn btn-ghost btn-sm" style={{ color: '#818cf8', fontSize: '0.75rem' }}>
              Manage Staff ➜
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {staff.map(st => {
              const staffToday = appointments.filter(a => a.date === new Date().toISOString().split('T')[0] && (a.staffId === st.id || a.staffName === st.name));

              return (
                <div key={st.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Avatar src={st.avatar} name={st.name} size={32} />
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: '#fff' }}>{st.name}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{st.role}</div>
                    </div>
                  </div>
                  <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                    {staffToday.length} bookings today
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Pitch & Demo Overview Card */}
        <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={18} color="#c084fc" />
            <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>V1 Sales Pitch Strategy</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
            "Salon Reminder doesn't just manage appointments — it actively recovers lost revenue from cancellations and missed slots in real time."
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={startDemoTour}
              className="btn btn-emerald btn-sm"
              style={{ justifyContent: 'center', fontWeight: '700' }}
            >
              🚀 Launch 1-Click Interactive Demo Tour
            </button>
            <button
              onClick={() => {
                if (appointments.length > 0) openSimulatorForAppointment(appointments[0]);
              }}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'center' }}
            >
              <MessageSquare size={14} /> Test Simulated WhatsApp Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
