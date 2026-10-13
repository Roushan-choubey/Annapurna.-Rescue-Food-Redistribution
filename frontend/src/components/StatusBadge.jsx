import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  Package, 
  MapPin, 
  XCircle, 
  AlertTriangle,
  Award
} from 'lucide-react';

export default function StatusBadge({ status, size = 'normal' }) {
  if (!status) return null;

  const getBadgeDetails = (st) => {
    switch (st.toUpperCase()) {
      case 'AVAILABLE':
        return {
          label: 'Available',
          className: 'badge-available',
          icon: <Clock size={size === 'small' ? 12 : 14} />
        };
      case 'ACCEPTED':
        return {
          label: 'Accepted by NGO',
          className: 'badge-accepted',
          icon: <CheckCircle size={size === 'small' ? 12 : 14} />
        };
      case 'ASSIGNED':
        return {
          label: 'Volunteer Assigned',
          className: 'badge-assigned',
          icon: <Truck size={size === 'small' ? 12 : 14} />
        };
      case 'COLLECTED':
        return {
          label: 'Food Collected',
          className: 'badge-collected',
          icon: <Package size={size === 'small' ? 12 : 14} />
        };
      case 'DELIVERED':
        return {
          label: 'Delivered to NGO',
          className: 'badge-delivered',
          icon: <MapPin size={size === 'small' ? 12 : 14} />
        };
      case 'COMPLETED':
        return {
          label: 'Rescue Completed',
          className: 'badge-completed',
          icon: <Award size={size === 'small' ? 12 : 14} />
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          className: 'badge-cancelled',
          icon: <XCircle size={size === 'small' ? 12 : 14} />
        };
      case 'EXPIRED':
        return {
          label: 'Expired',
          className: 'badge-expired',
          icon: <AlertTriangle size={size === 'small' ? 12 : 14} />
        };
      default:
        return {
          label: st,
          className: 'badge-available',
          icon: null
        };
    }
  };

  const details = getBadgeDetails(status);

  return (
    <span className={`badge ${details.className} ${size === 'small' ? 'text-xs' : ''}`}>
      {details.icon}
      <span>{details.label}</span>
    </span>
  );
}
