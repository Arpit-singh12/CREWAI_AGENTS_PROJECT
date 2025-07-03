import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agent Services
export const agentService = {
  querySupportAgent: async (query: string, context?: Record<string, unknown>) => {
    const response = await api.post('/agents/support/query', { query, context });
    return response.data;
  },

  queryDashboardAgent: async (query: string, context?: any) => {
    const response = await api.post('/agents/dashboard/query', { query, context });
    return response.data;
  },

  getAgentStatus: async () => {
    const response = await api.get('/agents/status');
    return response.data;
  },
};

// Client Services
export const clientService = {
  getClients: async (skip = 0, limit = 100, status?: string) => {
    const params = new URLSearchParams({ skip: skip.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    const response = await api.get(`/clients?${params}`);
    return response.data;
  },

  createClient: async (clientData: any) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  getClient: async (clientId: string) => {
    const response = await api.get(`/clients/${clientId}`);
    return response.data;
  },
};

// Order Services
export const orderService = {
  getOrders: async (skip = 0, limit = 100, status?: string) => {
    const params = new URLSearchParams({ skip: skip.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    const response = await api.get(`/orders?${params}`);
    return response.data;
  },

  createOrder: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
};

// Analytics Services
export const analyticsService = {
  getRevenueAnalytics: async () => {
    const response = await api.get('/analytics/revenue');
    return response.data;
  },

  getClientAnalytics: async () => {
    const response = await api.get('/analytics/clients');
    return response.data;
  },

  getCourseAnalytics: async () => {
    const response = await api.get('/analytics/courses');
    return response.data;
  },
};

export default api;