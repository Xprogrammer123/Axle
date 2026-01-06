// API Configuration
const API_ORIGIN = 'https://axle-api-q8oa.onrender.com';
const API_BASE_URL = `${API_ORIGIN.replace(/\/$/, '')}/api/v1`;

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

  getBaseUrl() {
    return this.baseURL;
  }

  getOrigin() {
    return this.baseURL.replace(/\/api\/v\d+\/?$/, '');
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
      if (response.status === 401) {
        clearToken();
      }

      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await response.json().catch(() => null)
        : await response.text().catch(() => '');

      const message =
        (payload && typeof payload === 'object' && 'error' in payload && (payload as any).error)
          ? String((payload as any).error)
          : typeof payload === 'string' && payload
            ? payload
            : `HTTP ${response.status}`;

      throw new Error(message);
    }

    return response.json();
  }

  // Auth
  async register(email: string, password: string, name?: string) {
    const data = await this.request<{ accessToken: string; user: any }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }
    );
    setToken(data.accessToken);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<{ accessToken: string; user: any }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    setToken(data.accessToken);
    return data;
  }

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

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      clearToken();
    }
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
    return this.request<{ authUrl: string }>(`/integrations/${provider}/connect`);
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

  async streamMessage(
    message: string,
    onEvent: (event: any) => void
  ) {
    const token = getToken();
    const response = await fetch(`${this.baseURL}/chatbot/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    if (!response.body) throw new Error('No response body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE frames are separated by a blank line
      while (true) {
        const idx = buffer.indexOf('\n\n');
        if (idx === -1) break;
        const rawEvent = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);

        // Collect all data: lines (SSE can send multiple)
        const dataLines = rawEvent
          .split(/\r?\n/)
          .filter((l) => l.startsWith('data:'))
          .map((l) => l.replace(/^data:\s?/, ''))
          .filter(Boolean);

        if (!dataLines.length) continue;

        const payload = dataLines.join('\n');
        if (!payload || payload === '[DONE]') continue;

        try {
          onEvent(JSON.parse(payload));
        } catch {
          // ignore malformed payload (likely partial JSON)
        }
      }
    }
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

  async getTemplates() {
    return this.request<{ templates: any[]; categories: string[] }>('/dashboard/templates');
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

  async getWebhookProviders() {
    return this.request<{ providers: { provider: string; label: string }[] }>('/webhooks/providers');
  }

  async getWebhookEvents() {
    return this.request<{ events: any[] }>('/webhooks/events');
  }
}

export const api = new ApiClient(API_BASE_URL);
export { getToken, setToken, clearToken };
