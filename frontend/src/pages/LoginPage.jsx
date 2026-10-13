import React, { useState } from 'react';
import { api, setAuthToken, setCurrentUser, DEMO_ACCOUNTS } from '../api/client';
import { LogIn, Key, Mail, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

export default function LoginPage({ onUserChange, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.login(email, password);
      setAuthToken(res.token);
      setCurrentUser(res);
      onUserChange(res);

      if (res.role === 'ADMIN') onNavigate('admin');
      else if (res.role === 'DONOR') onNavigate('donor');
      else if (res.role === 'NGO') onNavigate('ngo');
      else if (res.role === 'VOLUNTEER') onNavigate('volunteer');
    } catch (err) {
      // Check if user entered a demo account and backend is booting
      const matched = Object.values(DEMO_ACCOUNTS).find(
        acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
      );

      if (matched) {
        // Fallback demo user
        const mockUser = {
          ...matched,
          id: matched.role === 'ADMIN' ? 1 : matched.role === 'DONOR' ? 2 : 4,
          token: 'demo-jwt-fallback-token'
        };
        setAuthToken(mockUser.token);
        setCurrentUser(mockUser);
        onUserChange(mockUser);

        if (mockUser.role === 'ADMIN') onNavigate('admin');
        else if (mockUser.role === 'DONOR') onNavigate('donor');
        else if (mockUser.role === 'NGO') onNavigate('ngo');
        else if (mockUser.role === 'VOLUNTEER') onNavigate('volunteer');
      } else {
        setError(err.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '480px', padding: '60px 20px' }}>
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
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
            <LogIn size={24} />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to access your coordination portal
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@organization.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="login-email-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="login-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
            id="login-submit-button"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Autofill */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px', textAlign: 'center' }}>
            ⚡ 1-Click Pre-filled Demo Accounts:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemo(DEMO_ACCOUNTS.DONOR)}
            >
              Donor
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemo(DEMO_ACCOUNTS.NGO_VERIFIED)}
            >
              NGO
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemo(DEMO_ACCOUNTS.VOLUNTEER)}
            >
              Volunteer
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemo(DEMO_ACCOUNTS.ADMIN)}
            >
              Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          New to the platform?{' '}
          <button
            onClick={() => onNavigate('register')}
            style={{ background: 'none', color: 'var(--accent-emerald-light)', fontWeight: 600 }}
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
