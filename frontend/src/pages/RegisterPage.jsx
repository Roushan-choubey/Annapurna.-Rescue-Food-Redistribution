import React, { useState } from 'react';
import { api, setAuthToken, setCurrentUser } from '../api/client';
import { UserPlus, ArrowLeft, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function RegisterPage({ onUserChange, onNavigate }) {
  const [role, setRole] = useState('DONOR');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [ngoName, setNgoName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const payload = {
      name,
      email,
      password,
      phone,
      role,
      address,
      latitude: 26.8467,
      longitude: 80.9462,
      ...(role === 'NGO' ? { ngoName: ngoName || name, registrationNumber } : {})
    };

    try {
      const res = await api.register(payload);
      setAuthToken(res.token);
      setCurrentUser(res);
      onUserChange(res);

      if (role === 'NGO') {
        setSuccessMsg("Account created! Because you registered as an NGO, an Admin must verify your registration number before you can accept donations.");
        setTimeout(() => onNavigate('ngo'), 2000);
      } else if (role === 'DONOR') {
        onNavigate('donor');
      } else if (role === 'VOLUNTEER') {
        onNavigate('volunteer');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '560px', padding: '50px 20px' }}>
      <button
        onClick={() => onNavigate('landing')}
        style={{
          background: 'none',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="glass-panel" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'var(--accent-emerald-glow)',
            color: 'var(--accent-emerald-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <UserPlus size={24} />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Join the Rescue Network</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Register as a Food Donor, Shelter/NGO, or Transport Volunteer
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--accent-emerald)',
            color: 'var(--accent-emerald-light)',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role Selector Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            marginBottom: '22px',
            padding: '4px',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-md)'
          }}>
            <button
              type="button"
              className={`btn btn-sm ${role === 'DONOR' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setRole('DONOR')}
            >
              Food Donor
            </button>
            <button
              type="button"
              className={`btn btn-sm ${role === 'NGO' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setRole('NGO')}
            >
              NGO / Charity
            </button>
            <button
              type="button"
              className={`btn btn-sm ${role === 'VOLUNTEER' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setRole('VOLUNTEER')}
            >
              Volunteer
            </button>
          </div>

          {role === 'NGO' && (
            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--accent-amber-light)',
              fontSize: '0.82rem',
              marginBottom: '18px',
              display: 'flex',
              gap: '10px'
            }}>
              <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>NGO Verification Notice (FR-1.5):</strong>
                <div style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>
                  Per system security policy, newly registered NGOs must be verified by the Admin before they can accept food donations.
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Full Name / Primary Contact</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder={role === 'DONOR' ? 'e.g. Rohit Verma (Event Manager)' : 'Contact Person Name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {role === 'NGO' && (
            <>
              <div className="form-group">
                <label className="form-label">NGO / Shelter Organization Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Hope Foundation Lucknow"
                  value={ngoName}
                  onChange={(e) => setNgoName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Government / Charity Registration Number</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. NGO-UP-2024-XXXX"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                required
                className="form-control"
                placeholder="10-digit mobile"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="form-control"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Base Address / Location</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Gomti Nagar, Lucknow, Uttar Pradesh"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : `Register as ${role}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            style={{ background: 'none', color: 'var(--accent-emerald-light)', fontWeight: 600 }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
