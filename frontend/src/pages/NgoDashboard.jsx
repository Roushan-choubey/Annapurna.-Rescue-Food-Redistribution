import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import CountdownTimer from '../components/CountdownTimer';
import LifecycleTracker from '../components/LifecycleTracker';
import { 
  HeartHandshake, 
  MapPin, 
  Phone, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  Truck, 
  Navigation, 
  Users, 
  Scale, 
  Clock, 
  Award,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NgoDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'my-pickups'
  const [availableDonations, setAvailableDonations] = useState([]);
  const [myPickups, setMyPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [maxRadius, setMaxRadius] = useState(25); // km
  const [filterType, setFilterType] = useState('ALL'); // ALL, VEG, NON_VEG
  const [minQuantity, setMinQuantity] = useState(0);

  // Modals
  const [acceptingDonation, setAcceptingDonation] = useState(null);
  const [collectionMethod, setCollectionMethod] = useState('VOLUNTEER_REQUEST'); // or 'NGO_TRANSPORT'
  const [completingPickup, setCompletingPickup] = useState(null);
  const [actualServed, setActualServed] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // Polling for live coordination
    return () => clearInterval(interval);
  }, [currentUser, activeTab, maxRadius, filterType, minQuantity]);

  const loadData = async () => {
    try {
      if (activeTab === 'feed') {
        const params = {
          lat: currentUser?.latitude || 26.8530,
          lng: currentUser?.longitude || 80.9460,
          radius: maxRadius > 0 ? maxRadius : null,
          type: filterType !== 'ALL' ? filterType : null,
          minQty: minQuantity > 0 ? minQuantity : null
        };
        const data = await api.getAvailableDonations(params);
        if (Array.isArray(data)) setAvailableDonations(data);
      } else {
        const pickups = await api.getMyPickups();
        if (Array.isArray(pickups)) setMyPickups(pickups);
      }
    } catch (err) {
      // Fallback demo state
      if (activeTab === 'feed') {
        setAvailableDonations([
          {
            id: 101,
            foodName: 'Rice, Dal Makhani, Shahi Paneer, Tandoori Roti',
            quantity: 150.0,
            peopleServed: 300,
            preparationTime: new Date(Date.now() - 2 * 3600000).toISOString(),
            expiryTime: new Date(Date.now() + 4 * 3600000).toISOString(),
            foodType: 'VEG',
            location: 'Awadh Convention Center, Gomti Nagar, Lucknow',
            contactPhone: '9876543210',
            donorName: 'Rohit Verma (Wedding Organizer)',
            distanceKm: 5.2,
            imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
            status: 'AVAILABLE',
            createdAt: new Date().toISOString()
          },
          {
            id: 102,
            foodName: 'Chicken Dum Biryani, Shami Kebabs, Gulab Jamun',
            quantity: 45.0,
            peopleServed: 90,
            preparationTime: new Date(Date.now() - 1 * 3600000).toISOString(),
            expiryTime: new Date(Date.now() + 3 * 3600000).toISOString(),
            foodType: 'NON_VEG',
            location: 'Grand Heritage Hotel, Vibhuti Khand, Lucknow',
            contactPhone: '9811223344',
            donorName: 'Grand Heritage Banquets',
            distanceKm: 6.8,
            imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
            status: 'AVAILABLE',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAccept = async () => {
    if (!acceptingDonation) return;
    setErrorMsg(null);
    setActionLoading(true);

    try {
      await api.acceptDonation(acceptingDonation.id, collectionMethod);
      setAcceptingDonation(null);
      setActiveTab('my-pickups');
      loadData();
    } catch (err) {
      setErrorMsg(err.message || 'Could not accept donation. It may have already been claimed or requires verification.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmComplete = async () => {
    if (!completingPickup || !actualServed) return;
    setActionLoading(true);

    try {
      await api.completePickup(completingPickup.id, parseInt(actualServed));
      try { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
      setCompletingPickup(null);
      setActualServed('');
      loadData();
    } catch (err) {
      alert(err.message || 'Error completing pickup');
    } finally {
      setActionLoading(false);
    }
  };

  const isVerified = currentUser?.verified === true;

  return (
    <div className="container animate-fade-in" style={{ padding: '36px 20px 80px' }}>
      {/* NGO Verification Warning if unverified */}
      {!isVerified && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <ShieldAlert size={32} style={{ color: 'var(--accent-amber-light)', flexShrink: 0 }} />
          <div>
            <h4 style={{ color: 'var(--accent-amber-light)', fontSize: '1.1rem', marginBottom: '4px' }}>
              Pending Admin Verification (FR-1.5)
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Your NGO profile is currently under review by platform managers. You can view available food listings, but you cannot reserve/accept donations until an administrator validates your registration number.
            </p>
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Tip: Switch to the <strong>Admin</strong> or <strong>Verified NGO</strong> account in the top switcher bar to test instant acceptance.
            </div>
          </div>
        </div>
      )}

      {/* Header & Tabs */}
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
            <span className="badge badge-accepted">NGO Distribution Portal</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentUser?.name}</span>
          </div>
          <h2 style={{ fontSize: '2.2rem' }}>Surplus Food Coordination</h2>
        </div>

        {/* Tab switchers */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: 'var(--radius-md)'
        }}>
          <button
            className={`btn btn-sm ${activeTab === 'feed' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('feed')}
            id="tab-available-food"
          >
            Available Food Feed
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'my-pickups' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('my-pickups')}
            id="tab-my-pickups"
          >
            My Rescues & Pickups
          </button>
        </div>
      </div>

      {/* FEED TAB */}
      {activeTab === 'feed' && (
        <div>
          {/* Filters Bar */}
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontSize: '0.9rem', fontWeight: 600 }}>
              <Filter size={16} style={{ color: 'var(--accent-emerald-light)' }} />
              <span>Filter Nearby Surplus Food:</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <label className="form-label">Search Radius: {maxRadius} km</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={maxRadius}
                  onChange={(e) => setMaxRadius(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-emerald)' }}
                />
              </div>

              <div>
                <label className="form-label">Food Type</label>
                <select
                  className="form-control"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="ALL">All Food Types</option>
                  <option value="VEG">🌱 Vegetarian Only</option>
                  <option value="NON_VEG">🍗 Non-Vegetarian Only</option>
                </select>
              </div>

              <div>
                <label className="form-label">Min Quantity (kg)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  placeholder="e.g. 20"
                  className="form-control"
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Available Food Cards */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Scanning local radius for available donations...
            </div>
          ) : availableDonations.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <HeartHandshake size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3>No Surplus Food Currently in Radius</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '8px 0 20px' }}>
                Try expanding your search radius slider or check back shortly when dinner functions end.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '24px'
            }}>
              {availableDonations.map((d) => (
                <div key={d.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: '180px', width: '100%' }}>
                    <img
                      src={d.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'}
                      alt={d.foodName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                      <span className={`badge ${d.foodType === 'VEG' ? 'badge-veg' : 'badge-nonveg'}`}>
                        {d.foodType === 'VEG' ? '🌱 Pure Veg' : '🍗 Non-Veg'}
                      </span>
                      {d.distanceKm && (
                        <span className="badge badge-accepted" style={{ background: 'rgba(15, 23, 42, 0.85)' }}>
                          <MapPin size={11} />
                          {d.distanceKm} km away
                        </span>
                      )}
                    </div>

                    <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                      <CountdownTimer expiryTime={d.expiryTime} />
                    </div>
                  </div>

                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                        {d.foodName}
                      </h3>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          <Scale size={16} style={{ color: 'var(--accent-emerald-light)' }} />
                          <span><strong>{d.quantity} kg</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          <Users size={16} style={{ color: 'var(--accent-amber-light)' }} />
                          <span>Serves ~<strong>{d.peopleServed}</strong></span>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={15} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {d.location}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        Donor: <strong>{d.donorName}</strong>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={!isVerified}
                        onClick={() => {
                          setAcceptingDonation(d);
                          setCollectionMethod('VOLUNTEER_REQUEST');
                          setErrorMsg(null);
                        }}
                        title={!isVerified ? 'Verification required to accept' : 'Accept surplus food'}
                        id={`accept-donation-${d.id}`}
                      >
                        <HeartHandshake size={18} />
                        <span>{isVerified ? 'Accept & Reserve Food' : 'Admin Verification Required'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MY PICKUPS TAB */}
      {activeTab === 'my-pickups' && (
        <div>
          {myPickups.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Truck size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3>No Active Pickups Yet</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '8px 0 20px' }}>
                Browse the Available Food Feed to claim surplus food for your distribution shelters.
              </p>
              <button className="btn btn-primary" onClick={() => setActiveTab('feed')}>
                Browse Available Food
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {myPickups.map((p) => {
                const don = p.donation;
                return (
                  <div key={p.id} className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <StatusBadge status={don ? don.status : p.status} />
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pickup #{p.id}</span>
                        </div>
                        <h3 style={{ fontSize: '1.4rem' }}>{don ? don.foodName : 'Surplus Food'}</h3>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {don ? `${don.quantity} kg • Estimated Servings: ${don.peopleServed}` : ''}
                        </div>
                      </div>

                      {/* Complete Rescue Button (FR-3.7) */}
                      {(p.status === 'DELIVERED' || p.status === 'ASSIGNED' || p.status === 'COLLECTED') && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setCompletingPickup(p);
                            setActualServed(don ? String(don.peopleServed) : '100');
                          }}
                          id={`complete-pickup-${p.id}`}
                        >
                          <Award size={16} />
                          <span>Confirm Receipt & Complete Rescue</span>
                        </button>
                      )}
                    </div>

                    {/* Step Tracker */}
                    <LifecycleTracker status={don ? don.status : p.status} />

                    {/* Contact & Navigation Details (FR-3.4) */}
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
                          Donor Pickup Location (FR-3.4)
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{don ? don.location : 'Venue'}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Contact: {don ? don.contactPhone : ''}
                        </div>
                        {p.pickupNavigationUrl && (
                          <a
                            href={p.pickupNavigationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', marginTop: '6px' }}
                          >
                            <Navigation size={13} />
                            <span>Open in Google Maps</span>
                          </a>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Transport Courier
                        </div>
                        {p.volunteerName ? (
                          <>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.volunteerName}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                              Phone: {p.volunteerPhone || 'N/A'}
                            </div>
                          </>
                        ) : (
                          <div style={{ fontSize: '0.85rem', color: 'var(--accent-amber-light)' }}>
                            Waiting for volunteer to accept pickup...
                          </div>
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

      {/* Accept Donation Modal (FR-3.3 & FR-3.5) */}
      {acceptingDonation && (
        <div className="modal-overlay" onClick={() => setAcceptingDonation(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>
              Accept & Reserve Surplus Food
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              You are about to claim <strong>{acceptingDonation.foodName}</strong> ({acceptingDonation.quantity} kg, ~{acceptingDonation.peopleServed} servings).
            </p>

            {errorMsg && (
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                fontSize: '0.85rem',
                marginBottom: '16px'
              }}>
                {errorMsg}
              </div>
            )}

            {/* FR-3.5 Collection Method Selector */}
            <div className="form-group">
              <label className="form-label">How will this food be collected? (FR-3.5)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  onClick={() => setCollectionMethod('VOLUNTEER_REQUEST')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: collectionMethod === 'VOLUNTEER_REQUEST' ? '2px solid var(--accent-emerald)' : '1px solid var(--border-medium)',
                    background: collectionMethod === 'VOLUNTEER_REQUEST' ? 'var(--accent-emerald-glow)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                    Request Volunteer
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Broadcast task to registered volunteer couriers.
                  </div>
                </div>

                <div
                  onClick={() => setCollectionMethod('NGO_TRANSPORT')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: collectionMethod === 'NGO_TRANSPORT' ? '2px solid var(--accent-emerald)' : '1px solid var(--border-medium)',
                    background: collectionMethod === 'NGO_TRANSPORT' ? 'var(--accent-emerald-glow)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                    NGO's Own Transport
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Our team will pick up using NGO van directly.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setAcceptingDonation(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmAccept}
                style={{ flex: 2 }}
                disabled={actionLoading}
                id="confirm-accept-btn"
              >
                {actionLoading ? 'Reserving...' : 'Confirm Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Pickup Modal (FR-3.7) */}
      {completingPickup && (
        <div className="modal-overlay" onClick={() => setCompletingPickup(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>
              Confirm Receipt & Complete Rescue (FR-3.7)
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Record the actual impact for this redistribution. The donor will be notified of people fed!
            </p>

            <div className="form-group">
              <label className="form-label">Actual People Served</label>
              <input
                type="number"
                min="1"
                required
                className="form-control"
                value={actualServed}
                onChange={(e) => setActualServed(e.target.value)}
                placeholder="e.g. 300"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCompletingPickup(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmComplete}
                style={{ flex: 2 }}
                disabled={actionLoading}
              >
                {actionLoading ? 'Recording...' : 'Mark Rescue Completed!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
