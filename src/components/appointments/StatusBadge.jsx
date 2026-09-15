import React from 'react';
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  CheckCheck,
  XCircle,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

export const StatusBadge = ({ status, isRecovered = false }) => {
  if (isRecovered) {
    return (
      <span className="badge badge-emerald pulse-recovery" style={{ gap: '0.35rem' }}>
        <Sparkles size={12} />
        Recovered Slot
      </span>
    );
  }

  switch (status?.toLowerCase()) {
    case 'completed':
      return (
        <span className="badge badge-emerald">
          <CheckCheck size={12} />
          Completed
        </span>
      );
    case 'confirmed':
      return (
        <span className="badge badge-blue">
          <CheckCircle2 size={12} />
          Confirmed
        </span>
      );
    case 'in-progress':
      return (
        <span className="badge badge-cyan">
          <Clock size={12} />
          In Service
        </span>
      );
    case 'booked':
      return (
        <span className="badge badge-purple">
          <CalendarClock size={12} />
          Booked
        </span>
      );
    case 'no-show':
      return (
        <span className="badge badge-rose pulse-urgent">
          <AlertOctagon size={12} />
          No-Show
        </span>
      );
    case 'cancelled':
      return (
        <span className="badge badge-amber">
          <XCircle size={12} />
          Cancelled (Empty)
        </span>
      );
    default:
      return (
        <span className="badge badge-secondary">
          {status || 'Unknown'}
        </span>
      );
  }
};
