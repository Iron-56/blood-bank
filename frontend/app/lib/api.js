const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server returned non-JSON response');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

export const donorAPI = {
  getAll: (bloodType = null) => {
    const endpoint = bloodType ? `/donors?blood_type=${encodeURIComponent(bloodType)}` : '/donors';
    return apiRequest(endpoint);
  },

  getById: (id) => apiRequest(`/donors/${id}`),

  create: (donorData) => apiRequest('/donors', {
    method: 'POST',
    body: JSON.stringify(donorData),
  }),

  update: (id, donorData) => apiRequest(`/donors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(donorData),
  }),

  delete: (id) => apiRequest(`/donors/${id}`, {
    method: 'DELETE',
  }),
};

export const hospitalAPI = {
  getAll: () => apiRequest('/hospitals'),

  getById: (id) => apiRequest(`/hospitals/${id}`),

  create: (hospitalData) => apiRequest('/hospitals', {
    method: 'POST',
    body: JSON.stringify(hospitalData),
  }),

  update: (id, hospitalData) => apiRequest(`/hospitals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(hospitalData),
  }),

  delete: (id) => apiRequest(`/hospitals/${id}`, {
    method: 'DELETE',
  }),
};

export const donationAPI = {
  getAll: () => apiRequest('/donations'),

  getByDonor: (donorId) => apiRequest(`/donations?donor_id=${donorId}`),

  create: (donationData) => apiRequest('/donations', {
    method: 'POST',
    body: JSON.stringify(donationData),
  }),

  update: (id, donationData) => apiRequest(`/donations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(donationData),
  }),

  delete: (id) => apiRequest(`/donations/${id}`, {
    method: 'DELETE',
  }),
};

export const inventoryAPI = {
  getAll: (bloodType = null, status = null) => {
    let endpoint = '/inventory';
    const params = [];
    if (bloodType) params.push(`blood_type=${encodeURIComponent(bloodType)}`);
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (params.length > 0) endpoint += `?${params.join('&')}`;
    return apiRequest(endpoint);
  },

  getById: (id) => apiRequest(`/inventory/${id}`),

  create: (inventoryData) => apiRequest('/inventory', {
    method: 'POST',
    body: JSON.stringify(inventoryData),
  }),

  update: (id, inventoryData) => apiRequest(`/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(inventoryData),
  }),

  delete: (id) => apiRequest(`/inventory/${id}`, {
    method: 'DELETE',
  }),

  getExpired: () => apiRequest('/inventory?status=expired'),
};

export const requestAPI = {
  getAll: (status = null) => {
    const endpoint = status ? `/requests?status=${status}` : '/requests';
    return apiRequest(endpoint);
  },

  getById: (id) => apiRequest(`/requests/${id}`),

  create: (requestData) => apiRequest('/requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
  }),

  update: (id, requestData) => apiRequest(`/requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(requestData),
  }),

  delete: (id) => apiRequest(`/requests/${id}`, {
    method: 'DELETE',
  }),

  approve: (id, approvedBy) => apiRequest(`/requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ 
      status: 'approved',
      approvedBy: approvedBy
    }),
  }),

  reject: (id, rejectionReason) => apiRequest(`/requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ 
      status: 'rejected',
      rejectionReason: rejectionReason
    }),
  }),
};

export const transactionAPI = {
  getAll: () => apiRequest('/transactions'),

  getByRequest: (requestId) => apiRequest(`/transactions?request_id=${requestId}`),

  create: (transactionData) => apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  }),

  update: (id, transactionData) => apiRequest(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transactionData),
  }),

  delete: (id) => apiRequest(`/transactions/${id}`, {
    method: 'DELETE',
  }),
};

export const userAPI = {
  getAll: () => apiRequest('/users'),

  getById: (id) => apiRequest(`/users/${id}`),

  create: (userData) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  update: (id, userData) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  delete: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),

  login: (credentials) => apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
};

export const dashboardAPI = {
  getStats: () => apiRequest('/dashboard/stats'),
};

export const reportsAPI = {
  getStats: (days = 30) => apiRequest(`/reports/stats?days=${days}`),
  
  getBloodUsage: (months = 6) => apiRequest(`/reports/blood-usage?months=${months}`),
  
  getBloodTypeDistribution: (days = 180) => apiRequest(`/reports/blood-type-distribution?days=${days}`),
  
  getHospitalRequests: (days = 180, limit = 10) => apiRequest(`/reports/hospital-requests?days=${days}&limit=${limit}`),
  
  getDonationTrends: (months = 6) => apiRequest(`/reports/donation-trends?months=${months}`),
  
  getInventorySnapshot: () => apiRequest('/reports/inventory-snapshot'),
  
  getMonthlySummary: (year, month) => {
    const params = [];
    if (year) params.push(`year=${year}`);
    if (month) params.push(`month=${month}`);
    const query = params.length > 0 ? `?${params.join('&')}` : '';
    return apiRequest(`/reports/monthly-summary${query}`);
  },
  
  getDonorDemographics: () => apiRequest('/reports/donor-demographics'),
  
  getRequestStatusSummary: (days = 30) => apiRequest(`/reports/request-status-summary?days=${days}`),
  
  exportCSV: (type = 'donations') => apiRequest(`/reports/export/csv?type=${type}`),
};

export { API_BASE_URL };
