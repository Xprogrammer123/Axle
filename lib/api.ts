// API Configuration
const API_BASE_URL = 'https://axle-api-q8oa.onrender.com/api/v1';

// Token storage
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('axle_access_token');
};

const setToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('axle_access_token', token);
};

const clearToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('axle_access_token');
};

// API Client - FIXED to match actual backend
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async sendMagicLink(email: string) {
    return this.request('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyMagicLink(token: string) {
    const data = await this.request<{ accessToken: string; user: any }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    setToken(data.accessToken);
    return data;
  }

  // Agents - FIXED
  async getAgents() {
    return this.request<{ agents: any[] }>('/agents');
  }

  async getAgentStats() {
    return this.request<{
      totalAgents: number;
      activeAgents: number;
      executionsToday: number;
      errorsToday: number;
    }>('/agents/stats');
  }

  async getAgent(id: string) {
    return this.request<{ agent: any }>(`/agents/${id}`);
  }

  async createAgent(data: { name: string; instructions: string; description?: string }) {
    return this.request<{ agent: any }>('/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAgent(id: string, data: Partial<any>) {
    return this.request(`/agents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteAgent(id: string) {
    return this.request(`/agents/${id}`, { method: 'DELETE' });
  }

  async runAgent(id: string, payload: any) {
    return this.request(`/agents/${id}/run`, {
      method: 'POST',
      body: JSON.stringify({ payload }),
    });
  }

  async previewAgent(id: string, payload: any) {
    return this.request(`/agents/${id}/preview`, {
      method: 'POST',
      body: JSON.stringify({ payload }),
    });
  }

  // Triggers - NEW
  async getTriggers(agentId?: string) {
    const query = agentId ? `?agentId=${agentId}` : '';
    return this.request<{ triggers: any[] }>(`/triggers${query}`);
  }

  async createTrigger(data: any) {
    return this.request('/triggers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTrigger(id: string, data: any) {
    return this.request(`/triggers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTrigger(id: string) {
    return this.request(`/triggers/${id}`, { method: 'DELETE' });
  }

  // Executions - FIXED
  async getExecutions(params?: {
    agentId?: string;
    status?: string;
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{
      executions: any[];
      total: number;
      limit: number;
      offset: number;
    }>(`/executions${query ? `?${query}` : ''}`);
  }

  async getExecution(id: string) {
    const res = await this.request<{ execution: any }>(`/executions/${id}`);
    return res.execution;
  }

  async retryExecution(id: string) {
    return this.request(`/executions/${id}/retry`, { method: 'POST' });
  }

  // Integrations
  async getIntegrations() {
    return this.request<{ integrations: any[] }>('/integrations');
  }

  async getIntegrationHealth() {
    return this.request<any>('/integrations/health');
  }

  async connectIntegration(provider: string) {
    return this.request<{ url: string }>(`/integrations/${provider}/connect`);
  }

  async disconnectIntegration(provider: string) {
    return this.request(`/integrations/${provider}`, { method: 'DELETE' });
  }

  // Billing
  async getSubscription() {
    return this.request<any>('/billing/subscription');
  }

  async createCheckout(plan: string) {
    return this.request<{ url: string }>('/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  }

  async getPortalLink() {
    return this.request<{ url: string }>('/billing/portal', { method: 'POST' });
  }

  async getInvoices() {
    return this.request<{ invoices: any[] }>('/billing/invoices');
  }

  async getPlans() {
    return this.request<{ plans: any[] }>('/billing/plans');
  }

  // Chatbot - FIXED
  async sendMessage(message: string) {
    return this.request('/chatbot/message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getChatHistory() {
    return this.request<{ messages: any[] }>('/chatbot/history');
  }

  async clearChatHistory() {
    return this.request('/chatbot/history', { method: 'DELETE' });
  }

  // Platform - NEW
  async getPlatforms() {
    return this.request<{ platforms: any[] }>('/platform');
  }

  async syncPlatform(provider: string) {
    return this.request(`/platform/${provider}/sync`, { method: 'POST' });
  }

  // Dashboard - FIXED
  async getDashboardOverview() {
    return this.request<any>('/dashboard/overview');
  }

  async getAnalytics(days: number = 30) {
    return this.request<any>(`/dashboard/analytics?days=${days}`);
  }

  async getInsights() {
    return this.request<any>('/dashboard/insights');
  }

  async getLiveDashboardData() {
    return this.request<{
      activeExecutions: any[];
      recentActivity: any[];
      nextTriggers: any[];
    }>('/dashboard/live');
  }

  async getNotifications() {
    // Note: Assuming /dashboard/notifications structure for now based on backend change
    return this.request<{ notifications: any[] }>('/dashboard/notifications');
  }

  // Profile
  async getProfile() {
    return this.request('/profile');
  }

  async updateProfile(data: any) {
    return this.request('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Webhooks
  async getWebhooks() {
    return this.request<{ webhooks: any[] }>('/webhooks');
  }
}

export const api = new ApiClient(API_BASE_URL);
export { getToken, setToken, clearToken };
