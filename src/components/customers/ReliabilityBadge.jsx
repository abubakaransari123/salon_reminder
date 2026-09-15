import React from 'react';
import { calculateReliabilityScore } from '../../utils/calculations';
import { ShieldCheck, ShieldAlert, Shield, AlertCircle, Award } from 'lucide-react';

export const ReliabilityBadge = ({ customer, scoreOverride, showScore = true, size = 'normal' }) => {
  let scoreData;
  if (scoreOverride !== undefined) {
    const raw = scoreOverride;
    if (raw >= 90) scoreData = { score: raw, tier: 'elite', label: 'Elite Client', color: 'emerald', badgeClass: 'badge-emerald' };
    else if (raw >= 75) scoreData = { score: raw, tier: 'reliable', label: 'Reliable', color: 'blue', badgeClass: 'badge-blue' };
    else if (raw >= 50) scoreData = { score: raw, tier: 'moderate', label: 'Moderate Risk', color: 'amber', badgeClass: 'badge-amber' };
    else scoreData = { score: raw, tier: 'high-risk', label: 'High No-Show Risk', color: 'rose', badgeClass: 'badge-rose' };
  } else {
    scoreData = calculateReliabilityScore(customer);
  }

  const { score, tier, label, badgeClass } = scoreData;

  const getIcon = () => {
    switch (tier) {
      case 'elite': return <Award size={13} />;
      case 'reliable': return <ShieldCheck size={13} />;
      case 'moderate': return <Shield size={13} />;
      case 'high-risk': return <ShieldAlert size={13} />;
      default: return <ShieldCheck size={13} />;
    }
  };

  return (
    <span
      className={`badge ${badgeClass}`}
      style={{
        fontSize: size === 'sm' ? '0.68rem' : '0.75rem',
        padding: size === 'sm' ? '0.15rem 0.45rem' : '0.25rem 0.6rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem'
      }}
      title={`Reliability Score: ${score}%. Calculated from completed vs no-show history.`}
    >
      {getIcon()}
      <span>{label}</span>
      {showScore && (
        <strong style={{ marginLeft: '2px', opacity: 0.9 }}>
          ({score}%)
        </strong>
      )}
    </span>
  );
};
