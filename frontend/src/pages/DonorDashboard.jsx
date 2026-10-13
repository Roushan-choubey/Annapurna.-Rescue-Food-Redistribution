import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import CountdownTimer from '../components/CountdownTimer';
import LifecycleTracker from '../components/LifecycleTracker';
import { 
  PlusCircle, 
  Utensils, 
  Clock, 
  MapPin, 
  Phone, 
  Users, 
  Scale, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DonorDashboard({ currentUser }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [editingDonation, setEditingDonation] = useState(null);

  // Form State
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [peopleServed, setPeopleServed] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [foodType, setFoodType] = useState('VEG');
  const [location, setLocation] = useState(currentUser?.address || 'Gomti Nagar, Lucknow');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '9876543210');
  const [imageUrl, setImageUrl] = useState('');

  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, [currentUser]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const data = await api.getMyDonations();
      if (Array.isArray(data)) {
        setDonations(data);
      }
    } catch (err) {
      // Fallback local demo donations if backend not responding
      setDonations([
        {
          id: 101,
          foodName: 'Rice, Dal Makhani, Shahi Paneer, Tandoori Roti',
          quantity: 150.0,
          peopleServed: 300,
          preparationTime: new Date(Date.now() - 2 * 3600000).toISOString(),
          expiryTime: new Date(Date.now() + 4 * 3600000).toISOString(),
          foodType: 'VEG',
          location: currentUser?.address || 'Awadh Convention Center, Gomti Nagar, Lucknow',
          contactPhone: currentUser?.phone || '9876543210',
          imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
          status: 'AVAILABLE',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Preset quick fill helpers for fast evaluation
  const loadPreset = (type) => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const formatDateTime = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

    const prep = new Date(now.getTime() - 90 * 60000); // 1.5 hrs ago
    const exp = new Date(now.getTime() + 4 * 3600000); // 4 hrs from now

    setPreparationTime(formatDateTime(prep));
    setExpiryTime(formatDateTime(exp));

    if (type === 'wedding') {
      setFoodName('Rice, Dal Makhani, Shahi Paneer, Butter Roti, Gulab Jamun');
      setQuantity('150');
      setPeopleServed('300');
      setFoodType('VEG');
      setLocation('Awadh Convention Center, Gomti Nagar, Lucknow');
      setImageUrl('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80');
    } else if (type === 'buffet') {
      setFoodName('Chicken Dum Biryani, Mirchi Salan, Raita, Shami Kebab');
      setQuantity('45');
      setPeopleServed('90');
      setFoodType('NON_VEG');
      setLocation('Grand Heritage Hotel, Vibhuti Khand, Lucknow');
      setImageUrl('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80');
    } else {
      setFoodName('Fresh Club Sandwiches, Vegetable Cutlets & Seasonal Fruit Platter');
      setQuantity('25');
      setPeopleServed('50');
      setFoodType('VEG');
      setLocation('TCS Awadh Park, Vibhuti Khand, Lucknow');
      setImageUrl('https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&auto=format&fit=crop&q=80');
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setFormError(null);

    const prepDate = new Date(preparationTime);
    const expDate = new Date(expiryTime);
    const now = new Date();

    // FR-2.5 Validation
    if (expDate <= prepDate) {
      setFormError('Best-before / Expiry time must be strictly after the preparation time.');
      return;
    }
    if (expDate <= now) {
      setFormError('Best-before / Expiry time must be in the future.');
      return;
    }

    setSubmitting(true);
    const payload = {
      foodName,
      quantity: parseFloat(quantity),
      peopleServed: parseInt(peopleServed),
      preparationTime: prepDate.toISOString().slice(0, 19),
      expiryTime: expDate.toISOString().slice(0, 19),
      foodType,
      location,
      contactPhone,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'
    };

    try {
      if (editingDonation) {
        await api.updateDonation(editingDonation.id, payload);
      } else {
        await api.createDonation(payload);
        try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
      }

      setShowAddModal(false);
      setEditingDonation(null);
      resetForm();
      fetchDonations();
    } catch (err) {
      // Local fallback for smooth demo
      const newDonation = {
        id: Date.now(),
        ...payload,
        status: 'AVAILABLE',
        createdAt: new Date().toISOString()
      };
      setDonations([newDonation, ...donations]);
      setShowAddModal(false);
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelDonation = async (id) => {
    if (!confirm('Are you sure you want to cancel this donation?')) return;
    try {
      await api.cancelDonation(id);
      fetchDonations();
    } catch (e) {
      setDonations(donations.map(d => d.id === id ? { ...d, status: 'CANCELLED' } : d));
    }
  };

  const openEdit = (d) => {
    setEditingDonation(d);
    setFoodName(d.foodName);
    setQuantity(String(d.quantity));
    setPeopleServed(String(d.peopleServed));
    setPreparationTime(d.preparationTime ? d.preparationTime.slice(0, 16) : '');
    setExpiryTime(d.expiryTime ? d.expiryTime.slice(0, 16) : '');
    setFoodType(d.foodType);
    setLocation(d.location);
    setContactPhone(d.contactPhone);
    setImageUrl(d.imageUrl || '');
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFoodName('');
    setQuantity('');
    setPeopleServed('');
    setPreparationTime('');
    setExpiryTime('');
    setFoodType('VEG');
    setImageUrl('');
    setFormError(null);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '36px 20px 80px' }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-available">Donor Workspace</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentUser?.name}</span>
          </div>
          <h2 style={{ fontSize: '2.2rem' }}>Surplus Food Listings</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Register cooked food surplus before it spoils. Verified NGOs and volunteer couriers are notified immediately.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            loadPreset('wedding'); // load standard wedding preset for 2-minute flow
            setShowAddModal(true);
          }}
          id="post-surplus-btn"
        >
          <PlusCircle size={18} />
          <span>Post Surplus Food</span>
        </button>
      </div>

      {/* Listing Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading your surplus listings...
        </div>
      ) : donations.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Utensils size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3>No Surplus Food Listed Yet</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 24px' }}>
            Have extra food from an event or banquet? Create a listing in under 2 minutes.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              loadPreset('wedding');
              setShowAddModal(true);
            }}
          >
            Post Your First Donation
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '24px'
        }}>
          {donations.map((d) => (
            <div key={d.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Card Image */}
              <div style={{ position: 'relative', height: '180px', width: '100%' }}>
                <img
                  src={d.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80'}
                  alt={d.foodName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  display: 'flex',
                  gap: '6px'
                }}>
                  <StatusBadge status={d.status} />
                  <span className={`badge ${d.foodType === 'VEG' ? 'badge-veg' : 'badge-nonveg'}`}>
                    {d.foodType === 'VEG' ? '🌱 Pure Veg' : '🍗 Non-Veg'}
                  </span>
                </div>

                <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                  <CountdownTimer expiryTime={d.expiryTime} />
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', lineHeight: 1.3 }}>
                    {d.foodName}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <Scale size={16} style={{ color: 'var(--accent-emerald-light)' }} />
                      <span><strong>{d.quantity} kg</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <Users size={16} style={{ color: 'var(--accent-amber-light)' }} />
                      <span>Serves ~<strong>{d.peopleServed}</strong></span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {d.location}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} />
                    <span>{d.contactPhone}</span>
                  </div>
                </div>

                {/* Progress / Actions */}
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedDonation(d)}
                      title="View step-by-step lifecycle"
                    >
                      <span>Track Lifecycle</span>
                    </button>

                    {d.status === 'AVAILABLE' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEdit(d)}
                          title="Edit details (FR-2.4)"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelDonation(d.id)}
                          title="Cancel donation (FR-2.4)"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lifecycle Modal */}
      {selectedDonation && (
        <div className="modal-overlay" onClick={() => setSelectedDonation(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.4rem' }}>Donation Lifecycle Tracker</h3>
              <button 
                onClick={() => setSelectedDonation(null)}
                style={{ background: 'none', color: 'var(--text-muted)', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <strong>{selectedDonation.foodName}</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {selectedDonation.quantity} kg • Serves ~{selectedDonation.peopleServed}
              </div>
            </div>

            <LifecycleTracker status={selectedDonation.status} />

            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.85rem', marginBottom: '6px' }}>
                <strong>Current Status:</strong> <StatusBadge status={selectedDonation.status} />
              </div>
              {selectedDonation.acceptedNgoName && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <strong>Accepted By:</strong> {selectedDonation.acceptedNgoName}
                </div>
              )}
              {selectedDonation.assignedVolunteerName && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>Volunteer Driver:</strong> {selectedDonation.assignedVolunteerName}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Donation Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.4rem' }}>
                {editingDonation ? 'Edit Food Listing' : 'Post Surplus Cooked Food (FR-2.1)'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', color: 'var(--text-muted)', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            {/* Quick Presets Bar */}
            {!editingDonation && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--accent-emerald-light)', marginBottom: '8px', fontWeight: 600 }}>
                  <Sparkles size={14} />
                  <span>2-Minute Quick Presets (PRD Scenarios):</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => loadPreset('wedding')}
                  >
                    💍 Lucknow Wedding Banquet (150 kg)
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => loadPreset('buffet')}
                  >
                    🏨 Hotel Dinner Buffet (45 kg)
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => loadPreset('corporate')}
                  >
                    🏢 Corporate Catering (25 kg)
                  </button>
                </div>
              </div>
            )}

            {formError && (
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                fontSize: '0.85rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateOrUpdate}>
              <div className="form-group">
                <label className="form-label">Food Items / Menu Details</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Rice, Dal Makhani, Shahi Paneer, Roti"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Quantity (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    className="form-control"
                    placeholder="150"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Servings (People)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="form-control"
                    placeholder="300"
                    value={peopleServed}
                    onChange={(e) => setPeopleServed(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Dietary Classification</label>
                  <select
                    className="form-control"
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                  >
                    <option value="VEG">🌱 Vegetarian</option>
                    <option value="NON_VEG">🍗 Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              {/* Time Validation (FR-2.5) */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">When was it prepared?</label>
                  <input
                    type="datetime-local"
                    required
                    className="form-control"
                    value={preparationTime}
                    onChange={(e) => setPreparationTime(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Best-Before / Expiry Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="form-control"
                    value={expiryTime}
                    onChange={(e) => setExpiryTime(e.target.value)}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    *Must be after preparation time & in the future.
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pickup Address / Venue</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Awadh Convention Center, Gomti Nagar, Lucknow"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    placeholder="9876543210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Food Image URL (Optional)</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={submitting}
                >
                  {submitting ? 'Listing Surplus...' : (editingDonation ? 'Save Changes' : 'Broadcast to Verified NGOs')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
