import React from 'react';
import { DEMO_ACCOUNTS, api, setAuthToken, setCurrentUser } from '../api/client';
import { Sparkles, Shield, HeartHandshake, Truck, UserCheck, Utensils } from 'lucide-react';

export default function DemoRoleSwitcher({ currentUser, onUserChange, onNavigate }) {
  const switchRole = async (accountKey) => {
    if (!accountKey) {
      // Logout / Guest
      setAuthToken(null);
      setCurrentUser(null);
      onUserChange(null);
      onNavigate('landing');
      return;
    }

    const account = DEMO_ACCOUNTS[accountKey];
    try {
      const res = await api.login(account.email, account.password);
      setAuthToken(res.token);
      setCurrentUser(res);
      onUserChange(res);

      if (res.role === 'ADMIN') onNavigate('admin');
      else if (res.role === 'DONOR') onNavigate('donor');
      else if (res.role === 'NGO') onNavigate('ngo');
      else if (res.role === 'VOLUNTEER') onNavigate('volunteer');
    } catch (err) {
      // Offline fallback: set user state directly
      const mockUser = {
        id: accountKey === 'ADMIN' ? 1 : accountKey === 'DONOR' ? 2 : accountKey === 'NGO_VERIFIED' ? 4 : accountKey === 'NGO_UNVERIFIED' ? 5 : 6,
        name: account.name,
        email: account.email,
        role: account.role,
        verified: account.verified,
        phone: account.phone,
        address: account.address,
        token: 'mock-jwt-token-' + accountKey
      };
      setAuthToken(mockUser.token);
      setCurrentUser(mockUser);
      onUserChange(mockUser);

      if (mockUser.role === 'ADMIN') onNavigate('admin');
      else if (mockUser.role === 'DONOR') onNavigate('donor');
      else if (mockUser.role === 'NGO') onNavigate('ngo');
      else if (mockUser.role === 'VOLUNTEER') onNavigate('volunteer');
    }
  };

  return (
    <aside className="demo-role-bar" aria-label="Demo role selector">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber-light)' }}>
        <Sparkles size={16} />
        <span style={{ fontWeight: 600 }}>Quick Role Switcher (Academic PRD Demo):</span>
      </div>

      <div className="role-chips">
        <button
          className={`role-chip ${!currentUser ? 'active' : ''}`}
          onClick={() => switchRole(null)}
          title="Browse as public visitor"
        >
          Public Visitor
        </button>

        <button
          className={`role-chip ${currentUser?.role === 'DONOR' ? 'active' : ''}`}
          onClick={() => switchRole('DONOR')}
          title="Food Donor"
        >
          <Utensils size={13} style={{ display: 'inline', marginRight: '4px' }} />
          Donor
        </button>

        <button
          className={`role-chip ${currentUser?.role === 'NGO' && currentUser?.verified ? 'active' : ''}`}
          onClick={() => switchRole('NGO_VERIFIED')}
          title="Verified NGO"
        >
          <HeartHandshake size={13} style={{ display: 'inline', marginRight: '4px' }} />
          NGO (Verified)
        </button>

        <button
          className={`role-chip ${currentUser?.role === 'NGO' && !currentUser?.verified ? 'active' : ''}`}
          onClick={() => switchRole('NGO_UNVERIFIED')}
          title="Pending Admin Verification"
        >
          <UserCheck size={13} style={{ display: 'inline', marginRight: '4px' }} />
          NGO (Unverified)
        </button>

        <button
          className={`role-chip ${currentUser?.role === 'VOLUNTEER' ? 'active' : ''}`}
          onClick={() => switchRole('VOLUNTEER')}
          title="Volunteer Courier"
        >
          <Truck size={13} style={{ display: 'inline', marginRight: '4px' }} />
          Volunteer
        </button>

        <button
          className={`role-chip ${currentUser?.role === 'ADMIN' ? 'active' : ''}`}
          onClick={() => switchRole('ADMIN')}
          title="Platform Manager (Admin)"
        >
          <Shield size={13} style={{ display: 'inline', marginRight: '4px' }} />
          Admin
        </button>
      </div>
    </aside>
  );
}
