import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Heart, 
  Phone, 
  Mail, 
  MessageSquare, 
  Bot, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export default function Footer({ onNavigate }) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const phone = '9336206973';
  const email = 'roushanchoubey@gmail.com';

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleOpenAiBot = () => {
    window.dispatchEvent(new CustomEvent('open-ai-bot', {
      detail: { initialPrompt: 'Hello! I need help or have questions about Annapurna food rescue.' }
    }));
  };

  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(10, 15, 24, 0.98)',
      padding: '50px 0 30px',
      marginTop: 'auto',
      position: 'relative'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '36px'
      }}>
        {/* Main 4-column Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px'
        }}>
          {/* Col 1: Platform Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <UtensilsCrossed size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Annapurna<span style={{ color: 'var(--accent-emerald-light)' }}>.Rescue</span>
              </span>
            </div>
            <p style={{
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '16px'
            }}>
              Zero Food Waste • Zero Hunger Network. Turning banquet, wedding, and restaurant surplus into nourishing meals in minutes.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-emerald-glow)',
              border: '1px solid var(--accent-emerald)',
              color: 'var(--accent-emerald-light)',
              fontSize: '0.78rem',
              fontWeight: 700
            }}>
              <Sparkles size={13} />
              <span>24/7 Real-Time Emergency Matching</span>
            </div>
          </div>

          {/* Col 2: Official Contact Information */}
          <div id="footer-contact-info">
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Phone size={16} color="var(--accent-emerald-light)" />
              <span>Contact & Helpline</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Phone */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '10px 14px'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                  24/7 Helpline & WhatsApp:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <a 
                    href={`tel:+91${phone}`} 
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--accent-emerald-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Phone size={14} />
                    +91 {phone}
                  </a>
                  <button
                    onClick={handleCopyPhone}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Copy Phone Number"
                  >
                    {copiedPhone ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span>{copiedPhone ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '10px 14px'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                  Official Email:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <a 
                    href={`mailto:${email}`} 
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--accent-amber-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      wordBreak: 'break-all'
                    }}
                  >
                    <Mail size={14} />
                    {email}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Copy Email Address"
                  >
                    {copiedEmail ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Coordinator: <strong style={{ color: 'var(--text-secondary)' }}>Roushan Choubey</strong>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation & Portals */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '16px'
            }}>
              Quick Navigation
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)'
            }}>
              <li>
                <span 
                  style={{ cursor: 'pointer', transition: 'color 0.2s ease' }} 
                  onClick={() => onNavigate('landing')}
                  className="hover-link"
                >
                  → Home Page
                </span>
              </li>
              <li>
                <span 
                  style={{ cursor: 'pointer', transition: 'color 0.2s ease' }} 
                  onClick={() => onNavigate('register')}
                  className="hover-link"
                >
                  → Register NGO or Donor
                </span>
              </li>
              <li>
                <span 
                  style={{ cursor: 'pointer', transition: 'color 0.2s ease' }} 
                  onClick={() => onNavigate('login')}
                  className="hover-link"
                >
                  → Sign In to Portal
                </span>
              </li>
              <li>
                <span 
                  style={{ cursor: 'pointer', transition: 'color 0.2s ease' }} 
                  onClick={() => onNavigate('donor')}
                  className="hover-link"
                >
                  → Food Donor Dashboard
                </span>
              </li>
              <li>
                <span 
                  style={{ cursor: 'pointer', transition: 'color 0.2s ease' }} 
                  onClick={() => onNavigate('ngo')}
                  className="hover-link"
                >
                  → NGO Claim Hub
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: AI Bot Widget CTA */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Bot size={16} color="var(--accent-emerald-light)" />
              <span>Annapurna AI Support</span>
            </h4>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginBottom: '16px'
            }}>
              Have questions about food safety rules, pickup times, or how our system works? Chat with our AI bot 24/7.
            </p>
            <button
              onClick={handleOpenAiBot}
              className="btn btn-primary btn-sm"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px'
              }}
              id="footer-open-ai-bot"
            >
              <Bot size={16} />
              <span>Talk to AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Sub-footer Copyright Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '24px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © 2026 Annapurna Food Rescue & Redistribution System • Academic PRD Specification v1.0
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Direct Hotline: <strong style={{ color: 'var(--accent-emerald-light)' }}>+91 9336206973</strong> • Built with <Heart size={13} style={{ color: 'var(--accent-rose)', fill: 'var(--accent-rose)' }} /> for Zero Hunger
          </div>
        </div>
      </div>
    </footer>
  );
}
