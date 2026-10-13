import React from 'react';
import { 
  Clock, 
  Building2, 
  Truck, 
  Package, 
  MapPin, 
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const STEPS = [
  { key: 'AVAILABLE', label: 'Listed', icon: Clock, desc: 'Surplus food published' },
  { key: 'ACCEPTED', label: 'Accepted', icon: Building2, desc: 'Reserved by NGO' },
  { key: 'ASSIGNED', label: 'Assigned', icon: Truck, desc: 'Transport arranged' },
  { key: 'COLLECTED', label: 'Collected', icon: Package, desc: 'Picked up from donor' },
  { key: 'DELIVERED', label: 'Delivered', icon: MapPin, desc: 'Arrived at shelter' },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2, desc: 'Meals served' }
];

export default function LifecycleTracker({ status, pickupDetails }) {
  if (status === 'CANCELLED') {
    return (
      <div style={{
        padding: '16px',
        background: 'rgba(244, 63, 94, 0.1)',
        border: '1px solid rgba(244, 63, 94, 0.3)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#fb7185'
      }}>
        <XCircle size={22} />
        <div>
          <strong>Donation Cancelled</strong>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            The donor cancelled this listing before it was accepted.
          </div>
        </div>
      </div>
    );
  }

  if (status === 'EXPIRED') {
    return (
      <div style={{
        padding: '16px',
        background: 'rgba(244, 63, 94, 0.1)',
        border: '1px solid rgba(244, 63, 94, 0.3)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#fb7185'
      }}>
        <AlertTriangle size={22} />
        <div>
          <strong>Donation Expired</strong>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            The best-before time elapsed before pickup could be completed.
          </div>
        </div>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex(s => s.key === status);

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        gap: '8px',
        overflowX: 'auto',
        padding: '10px 4px'
      }}>
        {/* Background track line */}
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          height: '3px',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 0
        }} />

        {/* Active track line */}
        <div style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          width: currentIdx >= 0 ? `${(currentIdx / (STEPS.length - 1)) * 92}%` : '0%',
          height: '3px',
          background: 'linear-gradient(90deg, #10b981, #34d399)',
          zIndex: 0,
          transition: 'width 0.4s ease'
        }} />

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isUpcoming = idx > currentIdx;

          let circleBg = 'rgba(255, 255, 255, 0.1)';
          let iconColor = 'var(--text-muted)';
          let borderColor = 'transparent';

          if (isDone) {
            circleBg = '#10b981';
            iconColor = '#ffffff';
          } else if (isCurrent) {
            circleBg = 'var(--bg-secondary)';
            iconColor = '#34d399';
            borderColor = '#10b981';
          }

          return (
            <div key={step.key} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 1,
              minWidth: '70px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: circleBg,
                border: borderColor !== 'transparent' ? `2px solid ${borderColor}` : 'none',
                boxShadow: isCurrent ? '0 0 14px var(--accent-emerald-glow)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: iconColor,
                transition: 'all 0.3s'
              }}>
                <Icon size={18} />
              </div>
              <span style={{
                marginTop: '8px',
                fontSize: '0.78rem',
                fontWeight: isCurrent ? '700' : '500',
                color: isCurrent ? 'var(--accent-emerald-light)' : (isDone ? 'var(--text-main)' : 'var(--text-muted)')
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
