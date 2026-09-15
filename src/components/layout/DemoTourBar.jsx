import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, CheckCircle, X, Zap, AlertTriangle, TrendingUp } from 'lucide-react';

export const DemoTourBar = () => {
  const { demoTourStep, nextDemoStep, endDemoTour, setActiveTab } = useApp();

  if (demoTourStep === 0) return null;

  const STEPS_DATA = {
    1: {
      title: 'Step 1: Salon Setup & Executive Overview',
      desc: 'You are viewing Luxe Glow Salon. Notice the live KPIs: Realized, Projected, and Recovered revenue.',
      actionText: 'Next: Simulate a No-Show ➜',
      targetTab: 'dashboard'
    },
    2: {
      title: 'Step 2: Simulate a Client No-Show',
      desc: 'Find Vikram Singh (2:30 PM booking). Click the "Mark No-Show" button on his card to simulate what happens when a client ghosts.',
      actionText: 'Next: View Lost Revenue Impact ➜',
      targetTab: 'dashboard'
    },
    3: {
      title: 'Step 3: Revenue Loss Tracking & Score Penalty',
      desc: 'Notice how the Lost Revenue KPI updated and Vikram’s reliability score dropped. An empty slot alert was also created!',
      actionText: 'Next: Open Recovery Hub ➜',
      targetTab: 'recovery'
    },
    4: {
      title: 'Step 4: Smart Waitlist Slot Matching',
      desc: 'In the Revenue Recovery Hub, review open empty slots. The AI engine automatically found high-priority waitlisted clients ready to fill the gap!',
      actionText: 'Next: 1-Click Recover Slot ➜',
      targetTab: 'recovery'
    },
    5: {
      title: 'Step 5: 1-Click Revenue Recovery',
      desc: 'Click "⚡ Recover Slot with Waitlist" on any matching candidate to convert an empty slot into cash in seconds!',
      actionText: 'Next: View ROI in Analytics ➜',
      targetTab: 'analytics'
    },
    6: {
      title: 'Step 6: Proven ROI & Financial Breakdown',
      desc: 'Review the Analytics tab to demonstrate the exact ROI to prospective salon buyers: recovered revenue vs lost revenue!',
      actionText: 'Finish Sales Demo 🎉',
      targetTab: 'analytics'
    }
  };

  const current = STEPS_DATA[demoTourStep] || STEPS_DATA[1];

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #1e1b4b 0%, #311042 50%, #064e3b 100%)',
        borderBottom: '2px solid #8b5cf6',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#ffffff',
        position: 'sticky',
        top: '70px',
        zIndex: 35,
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.35)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#8b5cf6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '800',
          fontSize: '0.9rem',
          boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)',
          flexShrink: 0
        }}>
          {demoTourStep}/6
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontWeight: '800', fontSize: '0.95rem', letterSpacing: '-0.01em', color: '#f3e8ff' }}>
              {current.title}
            </span>
            <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
              Interactive Sales Script
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#e2e8f0', margin: 0, lineHeight: 1.3 }}>
            {current.desc}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        <button
          onClick={nextDemoStep}
          className="btn btn-emerald btn-sm"
          style={{ fontWeight: '700', padding: '0.45rem 1rem', fontSize: '0.84rem' }}
        >
          {current.actionText}
        </button>

        <button
          onClick={endDemoTour}
          className="btn btn-ghost btn-sm"
          style={{ color: '#cbd5e1', padding: '0.4rem' }}
          title="Exit Demo Tour"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
