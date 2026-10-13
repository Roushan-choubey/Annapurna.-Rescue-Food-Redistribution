import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, 
  Bell, 
  LogOut, 
  User, 
  ShieldCheck, 
  HeartHandshake, 
  Truck, 
  Shield, 
  Menu, 
  X,
  Check
} from 'lucide-react';
import { api, setAuthToken, setCurrentUser } from '../api/client';

export default function Navbar({ currentUser, onUserChange, activeTab, onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (res && res.notifications) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      // Ignore background notification fetch errors
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      // local update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    onUserChange(null);
    onNavigate('landing');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN': return <Shield size={14} />;
      case 'NGO': return <HeartHandshake size={14} />;
      case 'VOLUNTEER': return <Truck size={14} />;
      default: return <UtensilsCrossed size={14} />;
    }
  };

  return (
    <header className="glass-panel" style={{
      borderRadius: '0',
      borderLeft: 'none',
      borderRight: 'none',
      borderTop: 'none',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Logo */}
        <div 
          onClick={() => onNavigate(currentUser ? currentUser.role.toLowerCase() : 'landing')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px var(--accent-emerald-glow)'
          }}>
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Annapurna<span style={{ color: 'var(--accent-emerald-light)' }}>.Rescue</span>
            </span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              Food Rescue & Redistribution
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="desktop-nav">
          {!currentUser ? (
            <>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('landing')}
              >
                Home & How It Works
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('login')}
              >
                Sign In
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('register')}
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              {/* Role specific primary links */}
              {currentUser.role === 'DONOR' && (
                <button
                  className={`btn btn-sm ${activeTab === 'donor' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => onNavigate('donor')}
                >
                  Donor Portal
                </button>
              )}
              {currentUser.role === 'NGO' && (
                <button
                  className={`btn btn-sm ${activeTab === 'ngo' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => onNavigate('ngo')}
                >
                  NGO Portal
                </button>
              )}
              {currentUser.role === 'VOLUNTEER' && (
                <button
                  className={`btn btn-sm ${activeTab === 'volunteer' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => onNavigate('volunteer')}
                >
                  Volunteer Fleet
                </button>
              )}
              {currentUser.role === 'ADMIN' && (
                <button
                  className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => onNavigate('admin')}
                >
                  Admin Central
                </button>
              )}

              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)',
                    position: 'relative'
                  }}
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      background: 'var(--accent-rose)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 8px rgba(244, 63, 94, 0.6)'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="glass-panel" style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '340px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '16px',
                    zIndex: 200,
                    background: 'var(--bg-secondary)',
                    boxShadow: 'var(--shadow-lg)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <strong style={{ fontSize: '0.9rem' }}>Activity Alerts</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{unreadCount} unread</span>
                    </div>

                    {notifications.length === 0 ? (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                        No notifications yet. You'll receive real-time alerts as donations progress!
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{
                          padding: '10px',
                          borderRadius: '8px',
                          background: n.isRead ? 'rgba(255, 255, 255, 0.02)' : 'rgba(16, 185, 129, 0.08)',
                          borderLeft: n.isRead ? '2px solid transparent' : '2px solid var(--accent-emerald)',
                          marginBottom: '8px',
                          fontSize: '0.82rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <strong style={{ color: 'var(--text-main)' }}>{n.title}</strong>
                            {!n.isRead && (
                              <button 
                                onClick={() => handleMarkAsRead(n.id)}
                                style={{ background: 'none', color: 'var(--accent-emerald)', fontSize: '0.75rem' }}
                                title="Mark read"
                              >
                                <Check size={14} />
                              </button>
                            )}
                          </div>
                          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{n.message}</p>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User Pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--accent-emerald-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-emerald-light)'
                }}>
                  {getRoleIcon(currentUser.role)}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.2 }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{currentUser.role}</span>
                    {currentUser.role === 'NGO' && (
                      currentUser.verified ? (
                        <span style={{ color: 'var(--accent-emerald-light)' }}>• Verified</span>
                      ) : (
                        <span style={{ color: 'var(--accent-amber-light)' }}>• Unverified</span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
