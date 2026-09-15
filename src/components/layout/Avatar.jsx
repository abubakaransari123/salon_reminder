import React, { useState } from 'react';

/**
 * Avatar component with automatic fallback to colored initials
 * when the image URL fails to load (e.g., no internet connection).
 */
export const Avatar = ({ src, name = '?', size = 36, style = {} }) => {
  const [imgError, setImgError] = useState(false);

  // Generate a consistent color from the name string
  const getColor = (str) => {
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#10b981',
      '#f59e0b', '#06b6d4', '#ef4444', '#3b82f6'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0] || '')
    .join('')
    .toUpperCase();

  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
    ...style
  };

  if (!src || imgError) {
    return (
      <div
        style={{
          ...baseStyle,
          background: `linear-gradient(135deg, ${getColor(name)}, ${getColor(name + '1')})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: '700',
          fontSize: `${Math.round(size * 0.38)}px`,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.02em',
          userSelect: 'none'
        }}
        title={name}
      >
        {initials || '?'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      style={baseStyle}
      onError={() => setImgError(true)}
      title={name}
    />
  );
};
