import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'primary', // 'primary', 'recovery', 'lost', 'amber', 'cyan'
  highlight = false
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'recovery': return 'kpi-hero-recovery';
      case 'lost': return 'kpi-hero-lost';
      case 'amber': return 'kpi-hero-amber';
      default: return 'kpi-hero-primary';
    }
  };

  const getIconColors = () => {
    switch (variant) {
      case 'recovery': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399' };
      case 'lost': return { bg: 'rgba(244, 63, 94, 0.15)', color: '#fb7185' };
      case 'amber': return { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' };
      default: return { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' };
    }
  };

  const iconColors = getIconColors();

  return (
    <div className={`kpi-card ${getVariantClass()}`}>
      <div className="kpi-header">
        <span className="kpi-title">{title}</span>
        {Icon && (
          <div className="kpi-icon-wrap" style={{ background: iconColors.bg }}>
            <Icon size={20} color={iconColors.color} />
          </div>
        )}
      </div>

      <div className="kpi-value" style={{ color: variant === 'recovery' ? '#34d399' : variant === 'lost' ? '#fb7185' : 'var(--text-primary)' }}>
        {value}
      </div>

      {subtitle && (
        <div className="kpi-subtitle">
          {subtitle}
        </div>
      )}
    </div>
  );
};
