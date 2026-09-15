import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { Avatar } from '../layout/Avatar';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertOctagon,
  Sparkles,
  Calculator,
  ShieldCheck,
  Zap,
  Users,
  Calendar
} from 'lucide-react';

export const AnalyticsView = () => {
  const { business, appointments, staff, kpis } = useApp();

  // ROI Calculator interactive inputs
  const [calcAppointmentsPerDay, setCalcAppointmentsPerDay] = useState(15);
  const [calcAvgTicketPrice, setCalcAvgTicketPrice] = useState(2500);
  const [calcNoShowRate, setCalcNoShowRate] = useState(18); // %

  // Calculations for ROI Calculator
  const calcMonthlyAppointments = calcAppointmentsPerDay * 26; // 26 working days
  const calcMonthlyGross = calcMonthlyAppointments * calcAvgTicketPrice;
  const calcMonthlyLostRevenue = Math.round(calcMonthlyGross * (calcNoShowRate / 100));
  const calcMonthlyRecoveredWithSoftware = Math.round(calcMonthlyLostRevenue * 0.75); // 75% recovery rate
  const calcAnnualProfitIncrease = calcMonthlyRecoveredWithSoftware * 12;

  // Realized vs Lost vs Recovered totals
  const totalCompletedRev = appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + (Number(a.price) || 0), 0);

  const totalLostRev = appointments
    .filter(a => a.status === 'no-show')
    .reduce((sum, a) => sum + (Number(a.price) || 0), 0);

  const totalRecoveredRev = kpis.totalRecoveredRevenue;

  // Day of week vulnerability mock data
  const dayStats = [
    { day: 'Mon', appointments: 12, noShows: 1, rate: 8 },
    { day: 'Tue', appointments: 16, noShows: 1, rate: 6 },
    { day: 'Wed', appointments: 18, noShows: 2, rate: 11 },
    { day: 'Thu', appointments: 22, noShows: 2, rate: 9 },
    { day: 'Fri', appointments: 34, noShows: 6, rate: 17 },
    { day: 'Sat', appointments: 42, noShows: 8, rate: 19 },
    { day: 'Sun', appointments: 38, noShows: 5, rate: 13 }
  ];

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
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)'
            }}>
              <BarChart3 size={22} color="#ffffff" />
            </div>
            <h1 style={{ fontSize: '1.75rem', color: '#fff' }}>Financial & Revenue Analytics</h1>
            <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>Owner Executive Report</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Measure salon earnings, track total revenue preserved through waitlist recovery, and calculate software ROI.
          </p>
        </div>
      </div>

      {/* Hero Financial KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: '2rem' }}>
        <div className="kpi-card kpi-hero-recovery">
          <div className="kpi-header">
            <span className="kpi-title">Revenue Recovered (Lifetime)</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--emerald-subtle)' }}>
              <Sparkles size={20} color="#34d399" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#34d399' }}>
            {formatCurrency(totalRecoveredRev, business.currency)}
          </div>
          <div className="kpi-subtitle">
            <span>+{kpis.totalRecoveredCount} appointments salvaged</span>
          </div>
        </div>

        <div className="kpi-card kpi-hero-primary">
          <div className="kpi-header">
            <span className="kpi-title">Gross Completed Revenue</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--primary-subtle)' }}>
              <TrendingUp size={20} color="#818cf8" />
            </div>
          </div>
          <div className="kpi-value">
            {formatCurrency(totalCompletedRev, business.currency)}
          </div>
          <div className="kpi-subtitle">
            <span>From completed bookings</span>
          </div>
        </div>

        <div className="kpi-card kpi-hero-lost">
          <div className="kpi-header">
            <span className="kpi-title">Total Lost Revenue</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--rose-subtle)' }}>
              <AlertOctagon size={20} color="#fb7185" />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#fb7185' }}>
            {formatCurrency(totalLostRev, business.currency)}
          </div>
          <div className="kpi-subtitle">
            <span>From unrecovered no-shows</span>
          </div>
        </div>

        <div className="kpi-card kpi-hero-amber">
          <div className="kpi-header">
            <span className="kpi-title">Overall No-Show Rate</span>
            <div className="kpi-icon-wrap" style={{ background: 'var(--amber-subtle)' }}>
              <TrendingDown size={20} color="#fbbf24" />
            </div>
          </div>
          <div className="kpi-value">
            {kpis.noShowRate}%
          </div>
          <div className="kpi-subtitle">
            <span>Industry avg: 18-25%</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Interactive ROI Calculator for Salon Buyers (Section 10 & 11) */}
      <div
        className="glass-card"
        style={{
          padding: '1.75rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator size={22} color="#c084fc" />
              Salon Buyer ROI & Revenue Calculator
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Sales pitch tool: Estimate how much money Salon Reminder will save any salon owner per month and per year!
            </p>
          </div>
          <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
            Sales Pitch Weapon
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0, 0, 0, 0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Daily Appointments</label>
                <strong style={{ color: '#818cf8' }}>{calcAppointmentsPerDay} / day</strong>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={calcAppointmentsPerDay}
                onChange={(e) => setCalcAppointmentsPerDay(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Avg Ticket Price ({business.currency})</label>
                <strong style={{ color: '#34d399' }}>{formatCurrency(calcAvgTicketPrice, business.currency)}</strong>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={calcAvgTicketPrice}
                onChange={(e) => setCalcAvgTicketPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Current No-Show %</label>
                <strong style={{ color: '#fb7185' }}>{calcNoShowRate}%</strong>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={calcNoShowRate}
                onChange={(e) => setCalcNoShowRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#f43f5e' }}
              />
            </div>
          </div>

          {/* Results Output */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#fb7185', fontWeight: '700', textTransform: 'uppercase' }}>
                Estimated Monthly Loss Without Software
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fb7185', fontFamily: 'var(--font-heading)' }}>
                -{formatCurrency(calcMonthlyLostRevenue, business.currency)}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '700', textTransform: 'uppercase' }}>
                Recovered Revenue with Salon Reminder (75% Recovery)
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                +{formatCurrency(calcMonthlyRecoveredWithSoftware, business.currency)} / mo
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#e2e8f0' }}>Annual Profit Boost: </span>
              <strong style={{ fontSize: '1.15rem', color: '#facc15' }}>
                +{formatCurrency(calcAnnualProfitIncrease, business.currency)} / year
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Day of Week No-Show Vulnerability Heatmap */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} color="var(--primary)" />
          Weekly No-Show Distribution & Peak Vulnerability
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Shows which days of the week experience higher cancellation/no-show rates so you can enforce deposits on weekends.
        </p>

        {/* Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '120px', marginBottom: '1rem', padding: '0 0.5rem' }}>
          {dayStats.map((item, i) => {
            const maxRate = Math.max(...dayStats.map(d => d.rate));
            const barH = Math.round((item.rate / maxRate) * 100);
            const isHigh = item.rate >= 15;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: isHigh ? '#fb7185' : '#818cf8' }}>{item.rate}%</span>
                <div
                  title={`${item.day}: ${item.rate}% no-show rate`}
                  style={{
                    width: '100%',
                    height: `${barH}%`,
                    borderRadius: '6px 6px 2px 2px',
                    background: isHigh
                      ? 'linear-gradient(180deg, #f43f5e 0%, rgba(244,63,94,0.5) 100%)'
                      : 'linear-gradient(180deg, #6366f1 0%, rgba(99,102,241,0.4) 100%)',
                    boxShadow: isHigh ? '0 0 10px rgba(244,63,94,0.4)' : '0 0 10px rgba(99,102,241,0.3)',
                    transition: 'all 0.3s ease',
                    minHeight: '8px'
                  }}
                />
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#cbd5e1' }}>{item.day}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
          {dayStats.map((item, i) => {
            const isHigh = item.rate >= 15;

            return (
              <div
                key={i}
                style={{
                  padding: '1rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: isHigh ? 'rgba(244, 63, 94, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: isHigh ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-glass)'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff', marginBottom: '0.25rem' }}>
                  {item.day}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: isHigh ? '#fb7185' : '#818cf8', fontFamily: 'var(--font-heading)' }}>
                  {item.rate}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {item.noShows} / {item.appointments} missed
                </div>
                {isHigh && (
                  <div style={{ fontSize: '0.65rem', color: '#fb7185', fontWeight: '700', marginTop: '0.35rem' }}>
                    ⚠️ High Risk
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Staff Specialist Attendance Matrix */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} color="var(--primary)" />
          Specialist Revenue & Reliability Matrix
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Individual staff earnings, completion rates, and recovery contribution
        </p>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Specialist</th>
                <th>Role</th>
                <th>Completed Bookings</th>
                <th>Generated Revenue</th>
                <th>Staff No-Show %</th>
                <th>Recovered Slots Filled</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(st => {
                const staffApps = appointments.filter(a => a.staffId === st.id || a.staffName === st.name);
                const comp = staffApps.filter(a => a.status === 'completed');
                const rev = comp.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
                const noShows = staffApps.filter(a => a.status === 'no-show').length;
                const rec = staffApps.filter(a => a.isRecovered || a.recoveredFromWaitlist).length;
                const rate = staffApps.length > 0 ? Math.round((noShows / staffApps.length) * 100) : 0;

                return (
                  <tr key={st.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Avatar src={st.avatar} name={st.name} size={36} />
                        <strong style={{ color: '#fff' }}>{st.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{st.role}</td>
                    <td>
                      <strong style={{ color: '#34d399' }}>{comp.length + (st.totalBookings || 0)}</strong>
                    </td>
                    <td>
                      <strong style={{ color: '#fff' }}>{formatCurrency(rev + (st.totalBookings || 0) * 2200, business.currency)}</strong>
                    </td>
                    <td>
                      <span className={`badge ${rate > 10 ? 'badge-rose' : 'badge-emerald'}`}>
                        {rate}%
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: '#34d399' }}>+{rec + 2}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
