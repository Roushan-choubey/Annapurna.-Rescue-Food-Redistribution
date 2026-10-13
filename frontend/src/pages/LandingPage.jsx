import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, 
  HeartHandshake, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Users, 
  Scale, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MessageSquare,
  Bot,
  Copy,
  Check,
  Send,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { api } from '../api/client';

export default function LandingPage({ onNavigate, onDemoLogin }) {
  const [stats, setStats] = useState({
    totalDonations: 148,
    totalFoodRescuedKg: 3820,
    totalPeopleServed: 7640,
    activeDonors: 42,
    activeNgos: 28,
    activeVolunteers: 65
  });

  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    contact: '',
    role: 'DONOR',
    message: ''
  });

  const phone = '9336206973';
  const email = 'roushanchoubey@gmail.com';
  const coordinatorName = 'Roushan Choubey';

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

  const handleOpenAiBot = (initialPrompt) => {
    window.dispatchEvent(new CustomEvent('open-ai-bot', {
      detail: { initialPrompt: initialPrompt || 'Hello! I need help with Annapurna Food Rescue.' }
    }));
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryData.message.trim()) return;
    setInquirySent(true);
    setTimeout(() => {
      setInquiryData({ name: '', contact: '', role: 'DONOR', message: '' });
    }, 4000);
  };

  useEffect(() => {
    // Try to load real backend stats
    api.getAdminStats()
      .then(res => {
        if (res && res.totalDonations > 0) {
          setStats(res);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        padding: '80px 0 60px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-emerald-glow)',
            border: '1px solid var(--accent-emerald)',
            color: 'var(--accent-emerald-light)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '24px'
          }}>
            <Sparkles size={16} />
            <span>Zero Food Waste • Zero Hunger Network</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '20px'
          }}>
            Turn Perishable Surplus into <span className="gradient-text-emerald">Nourishing Meals</span> in Minutes.
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            maxWidth: '740px',
            margin: '0 auto 36px',
            lineHeight: 1.6
          }}>
            Every evening, hundreds of kilograms of freshly cooked food from weddings, banquets, and hotels are thrown away. Annapurna connects donors with verified shelters and volunteer delivery fleets in real time.
          </p>

          {/* Action CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('register')}
              id="cta-join-network"
            >
              <span>Join as Donor or NGO</span>
              <ArrowRight size={18} />
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('login')}
              id="cta-sign-in"
            >
              <span>Sign In to Portal</span>
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={() => handleOpenAiBot('Hello! I want to understand how Annapurna Food Rescue works.')}
              id="cta-talk-to-ai"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderColor: 'var(--accent-emerald)',
                background: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--accent-emerald-light)'
              }}
            >
              <Bot size={18} />
              <span>Talk to AI Bot</span>
            </button>
          </div>

          {/* Quick Helpline Pill */}
          <div style={{
            marginTop: '22px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.86rem',
            color: 'var(--text-secondary)',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '6px 18px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)'
          }}>
            <Phone size={14} color="var(--accent-emerald-light)" />
            <span>24/7 Surplus Helpline:</span>
            <a 
              href={`tel:+91${phone}`} 
              style={{ fontWeight: 700, color: 'var(--accent-emerald-light)' }}
            >
              +91 {phone}
            </a>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <a 
              href={`mailto:${email}`} 
              style={{ color: 'var(--accent-amber-light)' }}
            >
              {email}
            </a>
          </div>
        </div>
      </section>

      {/* Live Impact Counter Cards */}
      <section style={{ padding: '20px 0 60px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--accent-emerald-glow)',
                color: 'var(--accent-emerald-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Scale size={24} />
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-emerald-light)' }}>
                {stats.totalFoodRescuedKg.toLocaleString()} <span style={{ fontSize: '1.1rem' }}>kg</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Surplus Food Rescued
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--accent-amber-glow)',
                color: 'var(--accent-amber-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Users size={24} />
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-amber-light)' }}>
                {stats.totalPeopleServed.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                People Fed & Nourished
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <HeartHandshake size={24} />
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#818cf8' }}>
                {stats.activeNgos || 28}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Verified Partner NGOs
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(14, 165, 233, 0.2)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Truck size={24} />
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#38bdf8' }}>
                {stats.activeVolunteers || 65}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Active Volunteer Couriers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lucknow Wedding Persona & Worked Example Showcase (PRD Section 2 & 5) */}
      <section style={{ padding: '40px 0 70px' }}>
        <div className="container">
          <div className="glass-panel" style={{
            padding: '36px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'linear-gradient(135deg, rgba(22, 34, 52, 0.9) 0%, rgba(16, 28, 43, 0.95) 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span className="badge badge-available">PRD Section 5 Worked Example</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lucknow, Uttar Pradesh</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '14px' }}>
                  Rohit's Wedding Banquet: 150 kg Surplus Saved in 45 Minutes
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                  "At 11:30 PM, after a banquet function in Gomti Nagar, Rohit listed 150 kg of untouched Rice, Dal Makhani, Shahi Paneer, and Roti. In less than 15 minutes, Hope Foundation accepted the food, and volunteer Amit delivered it directly to Hazratganj shelter before midnight."
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 16px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quantity</div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-emerald-light)' }}>150 kg</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 16px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Servings</div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-amber-light)' }}>300 People</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 16px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time to Claim</div>
                    <div style={{ fontWeight: 700, color: '#38bdf8' }}>12 Minutes</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    className="btn btn-amber btn-sm"
                    onClick={() => onDemoLogin('DONOR')}
                  >
                    Act as Donor
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onDemoLogin('NGO_VERIFIED')}
                  >
                    Act as NGO
                  </button>
                </div>
              </div>

              <div>
                <img
                  src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
                  alt="Wedding banquet surplus food"
                  style={{
                    width: '100%',
                    height: '280px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-medium)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Role Pillars */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '12px' }}>
              Four Tailored Roles for Seamless Coordination
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Designed around the exact operational needs of perishable food redistribution.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {/* Donor */}
            <div className="glass-panel glass-panel-hover" style={{ padding: '28px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'var(--accent-emerald-glow)',
                color: 'var(--accent-emerald-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <UtensilsCrossed size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Food Donors</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '18px' }}>
                Hotels, restaurants, weddings, and caterers list surplus in under two minutes with expiry countdown and prep time details.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onDemoLogin('DONOR')}
                style={{ width: '100%' }}
              >
                Try Donor Workflow →
              </button>
            </div>

            {/* NGO */}
            <div className="glass-panel glass-panel-hover" style={{ padding: '28px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'var(--accent-amber-glow)',
                color: 'var(--accent-amber-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <HeartHandshake size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Verified NGOs</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '18px' }}>
                Filter donations by radius, dietary type, and quantity. 1-click reservation prevents duplicate pickups and feeds community shelters.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onDemoLogin('NGO_VERIFIED')}
                style={{ width: '100%' }}
              >
                Try NGO Workflow →
              </button>
            </div>

            {/* Volunteer */}
            <div className="glass-panel glass-panel-hover" style={{ padding: '28px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(14, 165, 233, 0.2)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <Truck size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Volunteers</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '18px' }}>
                Pick up open delivery tasks with direct Google Maps navigation links and progress timestamps (Collected & Delivered).
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onDemoLogin('VOLUNTEER')}
                style={{ width: '100%' }}
              >
                Try Volunteer Workflow →
              </button>
            </div>

            {/* Admin */}
            <div className="glass-panel glass-panel-hover" style={{ padding: '28px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Platform Admin</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '18px' }}>
                Verify NGO legal registrations, monitor live state transitions, manage users, and export CSV audit reports.
              </p>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onDemoLogin('ADMIN')}
                style={{ width: '100%' }}
              >
                Try Admin Workflow →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info & 24/7 AI Assistant Section */}
      <section 
        id="contact-info-section" 
        style={{
          padding: '60px 0 80px',
          background: 'linear-gradient(180deg, rgba(10, 15, 24, 0) 0%, rgba(17, 26, 40, 0.6) 100%)',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        <div className="container">
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-emerald-glow)',
              border: '1px solid var(--accent-emerald)',
              color: 'var(--accent-emerald-light)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '16px'
            }}>
              <Phone size={15} />
              <span>Direct Support • 24/7 Helpline</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.9rem)', marginBottom: '14px' }}>
              Have Questions or Immediate Food Surplus? <span className="gradient-text-emerald">Get in Touch</span>
            </h2>

            <p style={{
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto',
              fontSize: '1.08rem',
              lineHeight: 1.6
            }}>
              Whether you have banquet food needing urgent pickup tonight, need NGO onboarding help, or want to partner with us — our coordinator Roushan Choubey and our interactive AI Assistant are available 24/7.
            </p>
          </div>

          {/* 3 Contact Info Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '44px'
          }}>
            {/* 1. Phone & WhatsApp Helpline Card */}
            <div className="glass-panel" style={{
              padding: '30px',
              borderRadius: '20px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'var(--accent-emerald-glow)',
                color: 'var(--accent-emerald-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Phone size={26} />
              </div>

              <div style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--accent-emerald-light)',
                fontWeight: 700,
                marginBottom: '6px'
              }}>
                Direct Helpline & WhatsApp
              </div>

              <h3 style={{ fontSize: '1.75rem', marginBottom: '8px', letterSpacing: '-0.02em' }}>
                <a 
                  href={`tel:+91${phone}`} 
                  style={{ color: '#fff', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--accent-emerald-light)'}
                  onMouseLeave={(e) => e.target.style.color = '#fff'}
                >
                  +91 {phone}
                </a>
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '22px', lineHeight: 1.5 }}>
                Lead: <strong>{coordinatorName}</strong>. Available 24/7 for urgent night pickups, banquet logistics, and immediate rescue dispatch.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <a
                  href={`tel:+91${phone}`}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Phone size={14} />
                  <span>Call Now</span>
                </a>

                <a
                  href={`https://wa.me/91${phone}?text=Hi%20Roushan%2C%20I%20have%20an%20inquiry%20regarding%20Annapurna%20Food%20Rescue`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderColor: 'var(--accent-emerald)',
                    color: 'var(--accent-emerald-light)'
                  }}
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={handleCopyPhone}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {copiedPhone ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copiedPhone ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* 2. Email Address Card */}
            <div className="glass-panel" style={{
              padding: '30px',
              borderRadius: '20px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'var(--accent-amber-glow)',
                color: 'var(--accent-amber-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Mail size={26} />
              </div>

              <div style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--accent-amber-light)',
                fontWeight: 700,
                marginBottom: '6px'
              }}>
                Official Email Address
              </div>

              <h3 style={{ fontSize: '1.45rem', marginBottom: '8px', wordBreak: 'break-all' }}>
                <a 
                  href={`mailto:${email}`} 
                  style={{ color: '#fff', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--accent-amber-light)'}
                  onMouseLeave={(e) => e.target.style.color = '#fff'}
                >
                  {email}
                </a>
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '22px', lineHeight: 1.5 }}>
                Send inquiries regarding NGO legal verification, institutional donor onboarding, corporate sponsorships, and technical feedback.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <a
                  href={`mailto:${email}?subject=Inquiry%20-%20Annapurna%20Food%20Rescue`}
                  className="btn btn-amber btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Mail size={14} />
                  <span>Send Email</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {copiedEmail ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* 3. AI Assistant Bot Card */}
            <div className="glass-panel" style={{
              padding: '30px',
              borderRadius: '20px',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Bot size={26} />
              </div>

              <div style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#818cf8',
                fontWeight: 700,
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>24/7 AI Chatbot</span>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981'
                }} />
              </div>

              <h3 style={{ fontSize: '1.75rem', marginBottom: '8px', color: '#fff' }}>
                Annapurna AI
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '22px', lineHeight: 1.5 }}>
                Ask anything about food donation criteria, safe consumption windows, NGO claim radius, or volunteer courier tasks. Zero waiting.
              </p>

              <button
                onClick={() => handleOpenAiBot('Hello! What are the steps to donate excess food?')}
                className="btn btn-primary btn-sm"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px'
                }}
                id="btn-open-ai-from-contact"
              >
                <Bot size={16} />
                <span>Chat with AI Bot Now</span>
              </button>
            </div>
          </div>

          {/* Quick Inquiry / Direct Reach Form */}
          <div className="glass-panel" style={{
            padding: '36px',
            borderRadius: '24px',
            border: '1px solid var(--border-medium)',
            background: 'linear-gradient(135deg, rgba(22, 34, 52, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              alignItems: 'center'
            }}>
              <div>
                <span className="badge badge-available" style={{ marginBottom: '12px' }}>
                  Quick Inquiry Form
                </span>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>
                  Send a Direct Message
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                  Need customized assistance or planning a large wedding event in Lucknow? Drop your details and we will coordinate immediately.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} color="var(--accent-emerald-light)" />
                    <span>Instant priority callback for perishable food over 50 kg</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} color="var(--accent-emerald-light)" />
                    <span>Free onboarding support for Lucknow shelters & NGOs</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} color="var(--accent-emerald-light)" />
                    <span>Direct coordination by {coordinatorName}</span>
                  </div>
                </div>
              </div>

              <div>
                {inquirySent ? (
                  <div style={{
                    padding: '28px',
                    borderRadius: '16px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid var(--accent-emerald)',
                    textAlign: 'center'
                  }}>
                    <CheckCircle2 size={42} color="var(--accent-emerald-light)" style={{ margin: '0 auto 12px' }} />
                    <h4 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
                      Inquiry Received!
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                      Thank you! {coordinatorName} has received your inquiry and will reach out to you directly.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <a href={`tel:+91${phone}`} className="btn btn-primary btn-sm">
                        Call {phone}
                      </a>
                      <button 
                        onClick={() => setInquirySent(false)} 
                        className="btn btn-secondary btn-sm"
                      >
                        Send Another
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit}>
                    <div className="form-row" style={{ marginBottom: '14px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Your Name</label>
                        <input
                          type="text"
                          required
                          value={inquiryData.name}
                          onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                          placeholder="e.g. Your Name"
                          className="input-field form-control"
                          id="inquiry-name"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Phone or Email</label>
                        <input
                          type="text"
                          required
                          value={inquiryData.contact}
                          onChange={(e) => setInquiryData({ ...inquiryData, contact: e.target.value })}
                          placeholder="e.g. 9876543210 or email"
                          className="input-field form-control"
                          id="inquiry-contact"
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label className="form-label">You are reaching out as:</label>
                      <select
                        value={inquiryData.role}
                        onChange={(e) => setInquiryData({ ...inquiryData, role: e.target.value })}
                        className="input-field form-control"
                        id="inquiry-role"
                      >
                        <option value="DONOR">Food Donor (Hotel / Banquet / Wedding Host)</option>
                        <option value="NGO">NGO / Shelter Representative</option>
                        <option value="VOLUNTEER">Volunteer Courier</option>
                        <option value="OTHER">General Partnership / Press / Other</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '18px' }}>
                      <label className="form-label">Your Message or Surplus Details</label>
                      <textarea
                        required
                        rows={3}
                        value={inquiryData.message}
                        onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                        placeholder="e.g., We have 100 kg surplus dinner food at our banquet hall in Gomti Nagar ready for pickup tonight..."
                        className="input-field form-control"
                        style={{ resize: 'vertical' }}
                        id="inquiry-message"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      id="btn-submit-inquiry"
                    >
                      <Send size={16} />
                      <span>Send Message to {coordinatorName}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

