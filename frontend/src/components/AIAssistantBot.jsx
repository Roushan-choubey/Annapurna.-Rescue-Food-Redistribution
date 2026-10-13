import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Minimize2, 
  Phone, 
  Mail, 
  MessageSquare, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
  UtensilsCrossed
} from 'lucide-react';

// Contact constants
const CONTACT_PHONE = '9336206973';
const CONTACT_PHONE_FORMATTED = '+91 9336206973';
const CONTACT_EMAIL = 'roushanchoubey@gmail.com';
const CONTACT_NAME = 'Roushan Choubey';

// Intelligent Knowledge Engine
const KNOWLEDGE_RESPONSES = [
  {
    keywords: ['contact', 'phone', 'call', 'number', 'mobile', 'email', 'mail', 'roushan', 'choubey', 'support', 'helpdesk', 'reach', 'talk to person', 'human'],
    title: 'Direct Platform Contact & Helpline',
    response: `You can reach our team lead **${CONTACT_NAME}** directly anytime!

📞 **Phone / WhatsApp:** [${CONTACT_PHONE_FORMATTED}](tel:+91${CONTACT_PHONE})
✉️ **Email:** [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL})
🕒 **Availability:** 24/7 for urgent food pickups and emergency support.

Whether you have surplus banquet food ready right now, need NGO onboarding help, or have questions, feel free to call or email directly!`,
    actions: [
      { label: `Call ${CONTACT_PHONE}`, type: 'tel', value: `+91${CONTACT_PHONE}` },
      { label: 'WhatsApp', type: 'link', value: `https://wa.me/91${CONTACT_PHONE}?text=Hi%20Roushan%2C%20I%20have%20an%20inquiry%20regarding%20Annapurna%20Food%20Rescue` },
      { label: 'Send Email', type: 'mailto', value: CONTACT_EMAIL }
    ]
  },
  {
    keywords: ['urgent', 'emergency', 'now', 'tonight', 'midnight', 'wedding', 'banquet', 'spoil', 'expir', 'immediate', 'fast'],
    title: 'Emergency Food Rescue Protocol',
    response: `⚡ **Have immediate perishable surplus tonight?**

1. **Quick Post:** Go to the **Donor Portal** and list the food with approximate kg and expiry countdown (takes < 2 minutes).
2. **Direct Helpline:** Call **${CONTACT_NAME}** immediately at **[${CONTACT_PHONE_FORMATTED}](tel:+91${CONTACT_PHONE})** for expedited volunteer dispatch.
3. **Instant Alert:** Our system broadcasts live notifications to verified NGOs within an 8-15 km radius.
4. **Safety Rule:** Keep hot food insulated and refrigerated items chilled until our courier arrives.`,
    actions: [
      { label: `Emergency Call: ${CONTACT_PHONE}`, type: 'tel', value: `+91${CONTACT_PHONE}` },
      { label: 'Go to Donor Portal', type: 'navigate', value: 'donor' }
    ]
  },
  {
    keywords: ['donate', 'donor', 'give food', 'surplus', 'leftover', 'banquet', 'hotel', 'restaurant', 'caterer', 'how to donate', 'listing'],
    title: 'How Food Donors Contribute',
    response: `Donating surplus food on **Annapurna.Rescue** takes less than 2 minutes:

1. **Sign in / Register** as a Food Donor (Hotels, Banquets, Weddings, Caterers, or Citizens).
2. Click **"+ Post Food Surplus"** on your dashboard.
3. Fill in:
   • Food title (e.g. *Rice, Dal Makhani & Paneer*)
   • Quantity in kilograms and estimated people it can feed
   • Dietary classification (Pure Veg 🥬 or Non-Veg 🍗)
   • Consumption safe-window / expiry time (e.g. 4-6 hours)
   • Pickup location in Lucknow
4. Nearby verified NGOs are instantly notified and can lock the pickup!`,
    actions: [
      { label: 'Try Donor Demo', type: 'demo', value: 'DONOR' },
      { label: 'Register as Donor', type: 'navigate', value: 'register' }
    ]
  },
  {
    keywords: ['ngo', 'claim', 'shelter', 'orphanage', 'receive', 'get food', 'distribute', 'verify', 'document'],
    title: 'NGO Reservation & Claiming Process',
    response: `Verified NGOs and shelter homes feed communities through real-time rescue:

1. **Browse Nearby Listings:** View available donations filtered by distance radius (km), food type (Veg/Non-Veg), and expiry urgency.
2. **1-Click Reservation:** Claiming instantly locks the batch to prevent duplicate pickups.
3. **Delivery Coordination:** You can pick up directly or have a volunteer courier dispatch to your shelter address.
4. **Verification Required:** NGOs submit official registration documents (Trust Deed, 80G/12A or Society Reg) verified by Platform Admin for hygiene and transparency.`,
    actions: [
      { label: 'Try NGO Demo', type: 'demo', value: 'NGO_VERIFIED' },
      { label: 'Register New NGO', type: 'navigate', value: 'register' }
    ]
  },
  {
    keywords: ['volunteer', 'rider', 'courier', 'delivery', 'transport', 'bike', 'pick up', 'route'],
    title: 'Volunteer Delivery Network',
    response: `Volunteers are the backbone of rapid food redistribution:

• **Receive Route Tasks:** View open rescue runs near your location.
• **Turn-by-Turn GPS:** 1-click Google Maps navigation directly to the banquet/donor and destination shelter.
• **Status Timestamps:** Mark when collected and delivered for end-to-end accountability.
• **Impact Badges:** Track how many kilograms of food and people you helped feed!`,
    actions: [
      { label: 'Try Volunteer Demo', type: 'demo', value: 'VOLUNTEER' },
      { label: 'Join Volunteer Network', type: 'navigate', value: 'register' }
    ]
  },
  {
    keywords: ['safety', 'hygiene', 'quality', 'fssai', 'safe', 'fresh', 'rule', 'temperature', 'pack'],
    title: 'Food Safety & Hygiene Guidelines',
    response: `We take food quality and safety extremely seriously:

• **Freshly Prepared:** Food must be cooked on the same day and unconsumed/untouched.
• **Safe Consumption Window:** Most hot cooked food must be delivered and consumed within **4 to 6 hours** of prep.
• **Clean Packaging:** Food should be stored in clean food-grade foil containers, buckets, or pots.
• **No Spoiled Food:** If food has foul aroma, sour texture, or was left exposed for over 6 hours at room temperature, it cannot be listed.`,
    actions: [
      { label: 'Ask a Safety Question', type: 'chip', value: 'Can we donate cooked meat or dairy?' }
    ]
  },
  {
    keywords: ['who are you', 'what are you', 'bot', 'annapurna', 'about', 'system', 'mission', 'aim'],
    title: 'About Annapurna Food Rescue System',
    response: `I am **Annapurna AI**, an intelligent digital assistant designed to eliminate edible food waste and alleviate local hunger in real-time.

Our platform connects:
1. **Donors:** Wedding halls, hotels, restaurants with surplus cooked food.
2. **NGOs:** Verified shelters and community kitchens in need of nutrition.
3. **Volunteers:** Local delivery heroes providing rapid logistics.
4. **Admins:** Ensuring regulatory compliance, audit logs, and food safety.

Lead & Developer: **${CONTACT_NAME}** (Helpline: [${CONTACT_PHONE_FORMATTED}](tel:+91${CONTACT_PHONE}))`,
    actions: [
      { label: `Call Lead (${CONTACT_PHONE})`, type: 'tel', value: `+91${CONTACT_PHONE}` },
      { label: 'Sign In / Register', type: 'navigate', value: 'login' }
    ]
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'namaste', 'morning', 'evening'],
    title: 'Welcome to Annapurna Rescue',
    response: `Namaste! 🙏 Welcome to **Annapurna Food Rescue**.

I'm your 24/7 AI guide. How can I help you today?
• Rescuing surplus food from an event or wedding
• Claiming meals for your NGO or shelter
• Volunteering as a delivery courier
• Contacting team lead **${CONTACT_NAME}** directly (${CONTACT_PHONE_FORMATTED})`,
    actions: [
      { label: '🍲 How to Donate', type: 'chip', value: 'How do I donate food?' },
      { label: '⚡ Urgent Pickup', type: 'chip', value: 'Urgent surplus food tonight' },
      { label: '📞 Contact Support', type: 'chip', value: 'Show contact details' }
    ]
  }
];

// Fallback response generator
function getFallbackResponse(query) {
  return {
    title: 'Annapurna Assistant Help',
    response: `Thank you for your question: *"${query}"*.

I am optimized to help you with:
• **Donating surplus banquet or restaurant food**
• **NGO claim & verification workflows**
• **Volunteer pickup and GPS delivery**
• **Emergency surplus helpline**

For specialized inquiries or immediate assistance, please contact our coordinator **${CONTACT_NAME}** directly:
📞 **Phone:** [${CONTACT_PHONE_FORMATTED}](tel:+91${CONTACT_PHONE})
✉️ **Email:** [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL})`,
    actions: [
      { label: `Call ${CONTACT_PHONE}`, type: 'tel', value: `+91${CONTACT_PHONE}` },
      { label: 'Email Roushan', type: 'mailto', value: CONTACT_EMAIL },
      { label: '🍲 How to donate', type: 'chip', value: 'How do I donate food?' },
      { label: '🏢 NGO process', type: 'chip', value: 'How can NGOs claim food?' }
    ]
  };
}

// Find best matching response
function findAnswer(query) {
  const normalized = query.toLowerCase().trim();
  
  // Check exact/keyword matches with scores
  let bestMatch = null;
  let highestScore = 0;

  for (const item of KNOWLEDGE_RESPONSES) {
    let score = 0;
    for (const kw of item.keywords) {
      if (normalized.includes(kw)) {
        score += kw.length; // weight longer keywords more
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (highestScore > 0 && bestMatch) {
    return bestMatch;
  }

  return getFallbackResponse(query);
}

export default function AIAssistantBot({ onNavigate, onDemoLogin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadBubble, setUnreadBubble] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedText, setCopiedText] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Web Audio subtle sound effects (zero external files needed)
  const playChime = (type = 'receive') => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'receive') {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        osc.frequency.setValueAtTime(440, now); // A4
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      // AudioContext may be restricted by autoplay policy
    }
  };

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Hello! 👋 I'm **Annapurna AI**, your dedicated assistant for food rescue and surplus redistribution.

Have surplus wedding food, need NGO meals, or want to reach our team lead **${CONTACT_NAME}**? Ask me anything or choose an option below!`,
      actions: [
        { label: '🍲 How to donate food', type: 'chip', value: 'How do I donate food?' },
        { label: '⚡ Urgent surplus tonight', type: 'chip', value: 'Urgent surplus food tonight' },
        { label: '🏢 How NGOs claim meals', type: 'chip', value: 'How can NGOs claim food?' },
        { label: '📞 Contact Roushan Choubey', type: 'chip', value: 'Show contact details' }
      ]
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Global listener so other buttons can trigger open the AI bot
  useEffect(() => {
    const handleOpenBotEvent = (e) => {
      setIsOpen(true);
      setIsMinimized(false);
      setUnreadBubble(false);
      if (e.detail?.initialPrompt) {
        handleSendMessage(e.detail.initialPrompt);
      }
    };

    window.addEventListener('open-ai-bot', handleOpenBotEvent);
    return () => window.removeEventListener('open-ai-bot', handleOpenBotEvent);
  }, []);

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    playChime('send');

    // Add user message
    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking and reply
    setTimeout(() => {
      const match = findAnswer(text);
      const botMsg = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: match.title,
        text: match.response,
        actions: match.actions || []
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
      playChime('receive');
    }, 450);
  };

  const handleActionClick = (action) => {
    if (action.type === 'chip') {
      handleSendMessage(action.value);
    } else if (action.type === 'navigate' && onNavigate) {
      onNavigate(action.value);
    } else if (action.type === 'demo' && onDemoLogin) {
      onDemoLogin(action.value);
    } else if (action.type === 'tel') {
      window.location.href = `tel:${action.value}`;
    } else if (action.type === 'mailto') {
      window.location.href = `mailto:${action.value}`;
    } else if (action.type === 'link') {
      window.open(action.value, '_blank', 'noopener,noreferrer');
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset-' + Date.now(),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Chat cleared! How else can I assist you with food rescue today? Feel free to ask about donating, claiming, or reach **${CONTACT_NAME}** at **${CONTACT_PHONE_FORMATTED}**.`,
        actions: [
          { label: '🍲 How to donate food', type: 'chip', value: 'How do I donate food?' },
          { label: '📞 Contact Roushan Choubey', type: 'chip', value: 'Show contact details' }
        ]
      }
    ]);
  };

  // Helper to render bold markdown text and links
  const renderFormattedText = (raw) => {
    if (!raw) return null;
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      // Basic markdown bold & link replacement
      let formatted = line;
      // Bold
      const parts = [];
      let temp = formatted;
      
      return (
        <p key={idx} style={{ margin: line === '' ? '6px 0' : '2px 0', lineHeight: 1.55 }}>
          {line}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1050,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px'
        }}
      >
        {/* Unread Welcome Speech Bubble (if unopened) */}
        {!isOpen && unreadBubble && (
          <div 
            className="animate-fade-in"
            style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid var(--accent-emerald)',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '12px 16px',
              maxWidth: '280px',
              fontSize: '0.85rem',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              setUnreadBubble(false);
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={16} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-emerald-light)' }}>
                Annapurna AI Assistant
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                Questions? Need pickup or contact info? Chat here!
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setUnreadBubble(false);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px'
              }}
              aria-label="Dismiss speech bubble"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          onClick={() => {
            setIsOpen(prev => !prev);
            setIsMinimized(false);
            setUnreadBubble(false);
          }}
          id="btn-ai-assistant-toggle"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 28px rgba(16, 185, 129, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative'
          }}
          title={isOpen ? 'Close AI Chat' : 'Chat with Annapurna AI Assistant'}
          aria-label="Toggle AI Assistant"
        >
          {isOpen ? (
            <X size={26} />
          ) : (
            <>
              <Bot size={28} />
              {/* Online Green Pulsing Dot */}
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '13px',
                height: '13px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: '2px solid #0f172a',
                boxShadow: '0 0 8px #10b981'
              }} />
            </>
          )}
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: isMinimized ? '96px' : '96px',
            right: '24px',
            width: 'clamp(320px, 92vw, 420px)',
            height: isMinimized ? '60px' : 'clamp(520px, 78vh, 640px)',
            background: 'rgba(17, 26, 40, 0.96)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '24px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65), 0 0 30px rgba(16, 185, 129, 0.15)',
            zIndex: 1060,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'height 0.25s ease'
          }}
          role="dialog"
          aria-label="Annapurna AI Chatbot Window"
        >
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                    Annapurna AI
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.7rem',
                    color: 'var(--accent-emerald-light)',
                    background: 'var(--accent-emerald-glow)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                    Active 24/7
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Food Rescue & Redistribution Assistant
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setSoundEnabled(prev => !prev)}
                title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: soundEnabled ? 'var(--accent-emerald-light)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px'
                }}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                onClick={handleClearChat}
                title="Restart Chat"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px'
                }}
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={() => setIsMinimized(prev => !prev)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px'
                }}
              >
                <Minimize2 size={16} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body if not minimized */}
          {!isMinimized && (
            <>
              {/* Emergency Banner at top of chat */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '8px 16px',
                fontSize: '0.78rem',
                color: 'var(--accent-amber-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} />
                  <span>Helpline: <strong>{CONTACT_PHONE_FORMATTED}</strong> ({CONTACT_NAME})</span>
                </div>
                <button
                  onClick={() => handleCopy(CONTACT_PHONE, 'phone-header')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    color: 'var(--text-main)',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  {copiedText === 'phone-header' ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Messages Container */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                scrollBehavior: 'smooth'
              }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      maxWidth: '88%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}>
                      {/* Bubble */}
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: msg.sender === 'user' 
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'rgba(28, 43, 66, 0.85)',
                        border: msg.sender === 'user'
                          ? '1px solid rgba(255, 255, 255, 0.2)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        color: msg.sender === 'user' ? '#fff' : 'var(--text-main)',
                        fontSize: '0.88rem',
                        lineHeight: 1.55,
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        {msg.title && (
                          <div style={{ 
                            fontWeight: 700, 
                            marginBottom: '6px', 
                            color: 'var(--accent-emerald-light)',
                            fontSize: '0.9rem' 
                          }}>
                            {msg.title}
                          </div>
                        )}
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                          {msg.text}
                        </div>
                      </div>

                      {/* Action buttons embedded in message */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                          marginTop: '4px'
                        }}>
                          {msg.actions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(act)}
                              style={{
                                background: act.type === 'tel' 
                                  ? 'var(--accent-emerald-glow)'
                                  : act.type === 'mailto' 
                                  ? 'var(--accent-amber-glow)'
                                  : 'rgba(255, 255, 255, 0.08)',
                                border: `1px solid ${
                                  act.type === 'tel' 
                                    ? 'var(--accent-emerald)' 
                                    : act.type === 'mailto' 
                                    ? 'var(--accent-amber)' 
                                    : 'rgba(255, 255, 255, 0.15)'
                                }`,
                                borderRadius: 'var(--radius-full)',
                                padding: '5px 12px',
                                fontSize: '0.78rem',
                                color: act.type === 'tel' 
                                  ? 'var(--accent-emerald-light)' 
                                  : act.type === 'mailto' 
                                  ? 'var(--accent-amber-light)' 
                                  : 'var(--text-main)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {act.type === 'tel' && <Phone size={12} />}
                              {act.type === 'mailto' && <Mail size={12} />}
                              {act.type === 'link' && <ExternalLink size={12} />}
                              {act.type === 'navigate' && <ArrowRight size={12} />}
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      <span style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        padding: '0 4px',
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                      }}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(28, 43, 66, 0.7)',
                    padding: '10px 16px',
                    borderRadius: '18px 18px 18px 4px',
                    width: 'fit-content',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '4px' }}>
                      Annapurna AI is typing
                    </span>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald-light)', animation: 'pulseGlow 1s infinite' }} />
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald-light)', animation: 'pulseGlow 1s infinite 0.2s' }} />
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-emerald-light)', animation: 'pulseGlow 1s infinite 0.4s' }} />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Topic Chips (above input) */}
              <div style={{
                padding: '8px 14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none'
              }}>
                <button
                  className="role-chip"
                  onClick={() => handleSendMessage('How do I donate food?')}
                  style={{ fontSize: '0.75rem', padding: '3px 10px' }}
                >
                  🍲 Donate Food
                </button>
                <button
                  className="role-chip"
                  onClick={() => handleSendMessage('How can NGOs claim food?')}
                  style={{ fontSize: '0.75rem', padding: '3px 10px' }}
                >
                  🏢 NGO Claiming
                </button>
                <button
                  className="role-chip"
                  onClick={() => handleSendMessage('How do volunteers help?')}
                  style={{ fontSize: '0.75rem', padding: '3px 10px' }}
                >
                  🚚 Volunteers
                </button>
                <button
                  className="role-chip"
                  onClick={() => handleSendMessage('Show contact details and phone number')}
                  style={{ fontSize: '0.75rem', padding: '3px 10px' }}
                >
                  📞 Contact Team
                </button>
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(15, 23, 42, 0.95)',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about food rescue, pickups, contact..."
                  className="input-field"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    fontSize: '0.85rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)'
                  }}
                  id="ai-bot-input"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="btn btn-primary"
                  style={{
                    width: '38px',
                    height: '38px',
                    padding: 0,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    opacity: inputMessage.trim() ? 1 : 0.4,
                    cursor: inputMessage.trim() ? 'pointer' : 'default'
                  }}
                  id="btn-ai-send"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
