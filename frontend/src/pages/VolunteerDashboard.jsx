import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import LifecycleTracker from '../components/LifecycleTracker';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Navigation, 
  Package, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Power,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VolunteerDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('open'); // 'open' | 'my-pickups'
  const [openRequests, setOpenRequests] = useState([]);
  const [myPickups, setMyPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true); // FR-4.6 Availability toggle
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [currentUser, activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'open') {
        const data = await api.getOpenPickups({
          lat: currentUser?.latitude || 26.8820,
          lng: currentUser?.longitude || 80.9910
        });
        if (Array.isArray(data)) setOpenRequests(data);
      } else {
        const myData = await api.getMyPickups();
        if (Array.isArray(myData)) setMyPickups(myData);
      }
    } catch (err) {
      // Fallback demo state
      if (activeTab === 'open') {
        setOpenRequests([
          {
            id: 201,
            status: 'PENDING',
            ngoName: 'Hope Foundation Lucknow',
            ngoAddress: 'Hazratganj Community Hall, Lucknow',
            donation: {
              foodName: 'Rice, Dal Makhani, Shahi Paneer, Tandoori Roti',
              quantity: 150.0,
              peopleServed: 300,
              location: 'Awadh Convention Center, Gomti Nagar, Lucknow',
              contactPhone: '9876543210',
              status: 'ACCEPTED'
            },
            pickupNavigationUrl: 'https://www.google.com/maps/dir/?api=1&destination=Awadh+Convention+Center+Gomti+Nagar+Lucknow',
            dropNavigationUrl: 'https://www.google.com/maps/dir/?api=1&destination=Hazratganj+Community+Hall+Lucknow'
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPickup = async (pickupId) => {
    setActionLoadingId(pickupId);
    try {
      await api.acceptPickup(pickupId);
      setActiveTab('my-pickups');
      loadData();
    } catch (err) {
      alert(err.message || 'Could not accept pickup request. It may have already been claimed.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkCollected = async (pickupId) => {
    setActionLoadingId(pickupId);
    try {
      await api.markCollected(pickupId);
      loadData();
    } catch (err) {
      alert(err.message || 'Error updating pickup status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkDelivered = async (pickupId) => {
    setActionLoadingId(pickupId);
    try {
      await api.markDelivered(pickupId);
      try { confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
      loadData();
    } catch (err) {
      alert(err.message || 'Error updating delivery status');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '36px 20px 80px' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-assigned">Volunteer Courier</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentUser?.name}</span>
          </div>
          <h2 style={{ fontSize: '2.2rem' }}>Pickup & Transport Fleet</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* FR-4.6 Availability Toggle */}
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: isAvailable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: isAvailable ? '1px solid var(--accent-emerald)' : '1px solid rgba(244, 63, 94, 0.4)',
              color: isAvailable ? 'var(--accent-emerald-light)' : '#fb7185',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
            title="Toggle courier availability"
            id="volunteer-availability-toggle"
          >
            <Power size={14} />
            <span>Status: {isAvailable ? 'Active & Available' : 'Off Duty'}</span>
          </button>

          {/* Tab buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: 'var(--radius-md)'
          }}>
            <button
              className={`btn btn-sm ${activeTab === 'open' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('open')}
              id="tab-open-requests"
            >
              Open Requests
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'my-pickups' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('my-pickups')}
              id="tab-my-assigned"
            >
              My Assigned Pickups
            </button>
          </div>
        </div>
      </div>

      {!isAvailable && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          marginBottom: '24px',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          You are currently marked <strong>Off Duty</strong>. Turn on your status above to accept new transport tasks.
        </div>
      )}

      {/* OPEN PICKUP REQUESTS FEED */}
      {activeTab === 'open' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Checking for pending NGO pickup requests...
            </div>
          ) : openRequests.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Truck size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3>All Surplus Pickups Are Covered!</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '8px 0 20px' }}>
                There are no unassigned food transport requests right now. New tasks will pop up here in real time.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '24px'
            }}>
              {openRequests.map((p) => {
                const don = p.donation;
                return (
                  <div key={p.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span className="badge badge-available">Open Courier Job</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Request #{p.id}</span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                        {don ? don.foodName : 'Surplus Food'}
                      </h3>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        <strong>{don ? `${don.quantity} kg` : ''}</strong> • Serves ~{don ? don.peopleServed : ''} people
                      </div>

                      {/* Route preview */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '10px',
                        padding: '12px',
                        marginBottom: '16px',
                        fontSize: '0.83rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ color: 'var(--accent-emerald-light)', fontWeight: 700 }}>A:</span>
                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>PICKUP FROM DONOR</div>
                            <div>{don ? don.location : 'Donor Location'}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ color: 'var(--accent-amber-light)', fontWeight: 700 }}>B:</span>
                          <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>DELIVER TO SHELTER</div>
                            <div>{p.ngoName} ({p.ngoAddress})</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={!isAvailable || actionLoadingId === p.id}
                        onClick={() => handleAcceptPickup(p.id)}
                        id={`accept-pickup-${p.id}`}
                      >
                        <Truck size={16} />
                        <span>{actionLoadingId === p.id ? 'Claiming Task...' : 'Accept This Pickup Task'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MY ASSIGNED PICKUPS */}
      {activeTab === 'my-pickups' && (
        <div>
          {myPickups.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Package size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3>No Assigned Deliveries</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '8px 0 20px' }}>
                Check the Open Requests tab to accept a pickup task.
              </p>
              <button className="btn btn-primary" onClick={() => setActiveTab('open')}>
                View Open Pickup Requests
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {myPickups.map((p) => {
                const don = p.donation;
                const isCollected = p.status === 'COLLECTED';
                const isDelivered = p.status === 'DELIVERED';
                const isCompleted = p.status === 'COMPLETED';

                return (
                  <div key={p.id} className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <StatusBadge status={p.status} />
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Task #{p.id}</span>
                        </div>
                        <h3 style={{ fontSize: '1.35rem' }}>{don ? don.foodName : 'Surplus Food'}</h3>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                          {don ? `${don.quantity} kg • ~${don.peopleServed} meals` : ''}
                        </div>
                      </div>

                      {/* Action buttons (FR-4.4 & FR-4.5) */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {p.status === 'ASSIGNED' && (
                          <button
                            className="btn btn-amber btn-sm"
                            disabled={actionLoadingId === p.id}
                            onClick={() => handleMarkCollected(p.id)}
                            id={`mark-collected-${p.id}`}
                          >
                            <Package size={16} />
                            <span>Mark as Collected (FR-4.4)</span>
                          </button>
                        )}

                        {p.status === 'COLLECTED' && (
                          <button
                            className="btn btn-primary btn-sm"
                            disabled={actionLoadingId === p.id}
                            onClick={() => handleMarkDelivered(p.id)}
                            id={`mark-delivered-${p.id}`}
                          >
                            <CheckCircle2 size={16} />
                            <span>Mark as Delivered (FR-4.5)</span>
                          </button>
                        )}

                        {isDelivered && (
                          <span className="badge badge-delivered" style={{ padding: '8px 14px' }}>
                            Delivered • Awaiting NGO Confirmation
                          </span>
                        )}

                        {isCompleted && (
                          <span className="badge badge-completed" style={{ padding: '8px 14px' }}>
                            ✓ Completed & Distributed!
                          </span>
                        )}
                      </div>
                    </div>

                    <LifecycleTracker status={p.status} />

                    {/* Navigation buttons (FR-4.3) */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '16px',
                      borderRadius: '12px',
                      marginTop: '16px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Step 1: Pickup Location
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{don ? don.location : 'Donor Venue'}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          Phone: {don ? don.contactPhone : ''}
                        </div>
                        {p.pickupNavigationUrl && (
                          <a
                            href={p.pickupNavigationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ marginTop: '8px', display: 'inline-flex' }}
                          >
                            <Navigation size={14} />
                            <span>Navigate to Pickup (Google Maps)</span>
                          </a>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Step 2: Drop Location (Shelter)
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.ngoName}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          Address: {p.ngoAddress}
                        </div>
                        {p.dropNavigationUrl && (
                          <a
                            href={p.dropNavigationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ marginTop: '8px', display: 'inline-flex' }}
                          >
                            <Navigation size={14} />
                            <span>Navigate to Dropoff (Google Maps)</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
