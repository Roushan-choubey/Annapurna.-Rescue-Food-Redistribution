import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export default function CountdownTimer({ expiryTime }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    if (!expiryTime) return null;
    const diff = new Date(expiryTime) - new Date();
    if (diff <= 0) return { expired: true, text: 'Expired' };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const isUrgent = diff < 60 * 60 * 1000; // Less than 1 hour

    return {
      expired: false,
      hours,
      minutes,
      seconds,
      isUrgent,
      text: hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m ${seconds}s left`
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime]);

  if (!timeLeft) return null;

  if (timeLeft.expired) {
    return (
      <span className="badge badge-expired">
        <AlertCircle size={13} />
        <span>Time Expired</span>
      </span>
    );
  }

  return (
    <span className={`badge ${timeLeft.isUrgent ? 'badge-expired pulse-urgent' : 'badge-available'}`} title="Best before time remaining">
      <Clock size={13} />
      <span>{timeLeft.text}</span>
    </span>
  );
}
