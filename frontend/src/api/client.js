// API Client with Live Backend Connection + Seamless Demo State Engine

const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('annapurna_token');
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('annapurna_token', token);
  else localStorage.removeItem('annapurna_token');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('annapurna_user');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  if (user) localStorage.setItem('annapurna_user', JSON.stringify(user));
  else localStorage.removeItem('annapurna_user');
};

// Demo pre-seeded accounts matching backend DataInitializer
export const DEMO_ACCOUNTS = {
  ADMIN: {
    email: 'admin@foodrescue.org',
    password: 'admin123',
    name: 'Platform Admin',
    role: 'ADMIN',
    verified: true,
    phone: '9998887770',
    address: 'Lucknow Central Office'
  },
  DONOR: {
    email: 'rohit.wedding@lucknow.com',
    password: 'password123',
    name: 'Rohit Verma (Wedding Organizer)',
    role: 'DONOR',
    verified: true,
    phone: '9876543210',
    address: 'Awadh Convention Center, Gomti Nagar, Lucknow'
  },
  NGO_VERIFIED: {
    email: 'ngo.hope@foodrescue.org',
    password: 'password123',
    name: 'Hope Foundation Lucknow',
    role: 'NGO',
    verified: true,
    phone: '9876501234',
    address: 'Hazratganj Community Hall, Lucknow'
  },
  NGO_UNVERIFIED: {
    email: 'ngo.care@foodrescue.org',
    password: 'password123',
    name: 'Care & Share Shelter Trust',
    role: 'NGO',
    verified: false,
    phone: '9822334455',
    address: 'Alambagh Shelter Home, Lucknow'
  },
  VOLUNTEER: {
    email: 'amit.volunteer@foodrescue.org',
    password: 'password123',
    name: 'Amit Kumar',
    role: 'VOLUNTEER',
    verified: true,
    phone: '9712345678',
    address: 'Indira Nagar Sector 14, Lucknow'
  }
};

// Generic HTTP request helper
async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      // Token expired or invalid
      // setAuthToken(null);
      // setCurrentUser(null);
    }

    if (!res.ok) {
      let errorMsg = `Error ${res.status}`;
      try {
        const errJson = await res.json();
        errorMsg = errJson.message || errJson.error || errorMsg;
      } catch (e) {
        errorMsg = await res.text();
      }
      throw new Error(errorMsg || 'Request failed');
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return await res.text();
  } catch (err) {
    // If backend is not currently running, raise error so UI can handle or fallback
    throw err;
  }
}

export const api = {
  // Auth
  login: async (email, password) => {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (data) => {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMe: async () => {
    return await request('/auth/me');
  },

  // Donations
  createDonation: async (data) => {
    return await request('/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyDonations: async () => {
    return await request('/donations/my');
  },

  getAvailableDonations: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.lat) query.append('lat', params.lat);
    if (params.lng) query.append('lng', params.lng);
    if (params.radius) query.append('radius', params.radius);
    if (params.type) query.append('type', params.type);
    if (params.minQty) query.append('minQty', params.minQty);
    return await request(`/donations/available?${query.toString()}`);
  },

  getDonationById: async (id) => {
    return await request(`/donations/${id}`);
  },

  updateDonation: async (id, data) => {
    return await request(`/donations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  cancelDonation: async (id) => {
    return await request(`/donations/${id}`, {
      method: 'DELETE',
    });
  },

  acceptDonation: async (id, collectionMethod = 'VOLUNTEER_REQUEST') => {
    return await request(`/donations/${id}/accept`, {
      method: 'POST',
      body: JSON.stringify({ collectionMethod }),
    });
  },

  // Pickups
  getOpenPickups: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.lat) query.append('lat', params.lat);
    if (params.lng) query.append('lng', params.lng);
    return await request(`/pickups/open?${query.toString()}`);
  },

  acceptPickup: async (id) => {
    return await request(`/pickups/${id}/accept`, {
      method: 'POST',
    });
  },

  markCollected: async (id) => {
    return await request(`/pickups/${id}/collected`, {
      method: 'PATCH',
    });
  },

  markDelivered: async (id) => {
    return await request(`/pickups/${id}/delivered`, {
      method: 'PATCH',
    });
  },

  completePickup: async (id, peopleServedActual) => {
    return await request(`/pickups/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ peopleServedActual }),
    });
  },

  getMyPickups: async () => {
    return await request('/pickups/my');
  },

  // Admin
  getUsers: async (search = '') => {
    return await request(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },

  toggleUserStatus: async (userId, isActive) => {
    return await request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  },

  getPendingNgos: async () => {
    return await request('/admin/ngos/pending');
  },

  verifyNgo: async (ngoId, verified) => {
    return await request(`/admin/ngos/${ngoId}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ verified }),
    });
  },

  getAdminStats: async () => {
    return await request('/admin/stats');
  },

  getAllDonations: async () => {
    return await request('/admin/donations');
  },

  exportReportCsv: async () => {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE}/admin/reports?format=csv`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    return await res.text();
  },

  // Notifications
  getNotifications: async () => {
    return await request('/notifications');
  },

  markNotificationRead: async (id) => {
    return await request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }
};
