import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV } from '../../utils/export';
import { Avatar } from '../layout/Avatar';
import { DollarSign, Download, X, Users, Award, CheckCircle2, TrendingUp } from 'lucide-react';

export const PayrollModal = ({ isOpen, onClose }) => {
  const { staff, appointments, business } = useApp();

  if (!isOpen) return null;

  const completedApps = appointments.filter(a => a.status === 'completed');

  const payrollData = staff.map(st => {
    const stCompleted = completedApps.filter(a => a.staffId === st.id || a.staffName === st.name);
    const revenueGen = stCompleted.reduce((sum, a) => sum + (Number(a.price) || 0), 0) + ((st.totalBookings || 0) * 2200);
    const commPercent = st.commissionRate || 35;
    const commEarned = Math.round(revenueGen * (commPercent / 100));
    const baseSal = st.baseSalary || 30000;
    const estTips = (stCompleted.length + 5) * 250;
    const totalPayout = baseSal + commEarned + estTips;

    return {
      id: st.id,
      name: st.name,
      role: st.role,
      avatar: st.avatar,
      completedCount: stCompleted.length + (st.totalBookings || 0),
      revenueGenerated: revenueGen,
      commissionRate: `${commPercent}%`,
      commissionEarned: commEarned,
      baseSalary: baseSal,
      tips: estTips,
      totalPayout
    };
  });

  const totalPayrollCost = payrollData.reduce((sum, p) => sum + p.totalPayout, 0);

  const handleExportCSV = () => {
    const rows = payrollData.map(p => ({
      Staff_Name: p.name,
      Role: p.role,
      Services_Completed: p.completedCount,
      Revenue_Generated: p.revenueGenerated,
      Commission_Rate: p.commissionRate,
      Commission_Earned: p.commissionEarned,
      Base_Salary: p.baseSalary,
      Estimated_Tips: p.tips,
      Total_Net_Payout: p.totalPayout
    }));
    exportToCSV('staff-payroll-report', rows);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '900px' }}
      >
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={20} color="var(--primary)" />
            Staff Commission & Monthly Payroll Calculator
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-icon-only">✕</button>
        </div>

        <div className="modal-body">
          {/* Summary Card */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Monthly Payroll Estimate
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                {formatCurrency(totalPayrollCost, business.currency)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Includes base salaries, treatment commissions, and tips for {staff.length} specialists.
              </div>
            </div>

            <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
              <Download size={15} />
              Export Payroll CSV
            </button>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Specialist</th>
                  <th>Completed</th>
                  <th>Generated Rev</th>
                  <th>Commission</th>
                  <th>Base Salary</th>
                  <th>Tips</th>
                  <th>Net Payout</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Avatar src={p.avatar} name={p.name} size={32} />
                        <div>
                          <strong style={{ color: '#fff' }}>{p.name}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.role}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color: '#818cf8' }}>{p.completedCount}</strong>
                    </td>
                    <td>{formatCurrency(p.revenueGenerated, business.currency)}</td>
                    <td>
                      <div style={{ color: '#34d399', fontWeight: '700' }}>
                        {formatCurrency(p.commissionEarned, business.currency)}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({p.commissionRate})</div>
                    </td>
                    <td>{formatCurrency(p.baseSalary, business.currency)}</td>
                    <td style={{ color: '#fbbf24' }}>+{formatCurrency(p.tips, business.currency)}</td>
                    <td>
                      <strong style={{ color: '#34d399', fontSize: '1.05rem' }}>
                        {formatCurrency(p.totalPayout, business.currency)}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
};
