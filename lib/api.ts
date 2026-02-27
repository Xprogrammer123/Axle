// API Configuration
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_BASE_URL = `${API_ORIGIN.replace(/\/$/, "")}/api/v1`;

// Token storage
const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("axle_access_token");
};

const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("axle_access_token", token);
};

const clearToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("axle_access_token");
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
    return this.baseURL.replace(/\/api\/v\d+\/?$/, "");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = 2
  ): Promise<T> {
    const token = getToken();

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: "include",
    };

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        console.log("Fetch config:", config);
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            clearToken();
          }

          const contentType = response.headers.get("content-type") || "";
          const payload = contentType.includes("application/json")
            ? await response.json().catch(() => null)
            : await response.text().catch(() => "");

          const message =
            payload &&
              typeof payload === "object" &&
              "error" in payload &&
              (payload as any).error
              ? String((payload as any).error)
              : typeof payload === "string" && payload
                ? payload
                : `HTTP ${response.status}`;

          throw new Error(message);
        }

        return response.json();
      } catch (error: any) {

        const isNetworkError =
          error instanceof TypeError ||
          error?.name === "TypeError" ||
          error?.message?.includes("fetch") ||
          error?.message?.includes("Failed to fetch") ||
          error?.message?.includes("network") ||
          error?.name === "AbortError" ||
          error?.code === "ECONNREFUSED";

        if (isNetworkError) {
          // If this is the last attempt, throw the error
          if (attempt === retries) {
            throw new Error(
              "Error !"
            );
          }
          // Wait before retrying (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (attempt + 1))
          );
          continue;
        }
        // Re-throw other errors immediately
        throw error;
      }
    }

    // This should never be reached, but TypeScript needs it
    throw new Error("Request failed after retries");
  }

  // Auth
  async register(email: string, password: string, name?: string) {
    const data = await this.request<{ accessToken: string; user: any }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      }
    );
    setToken(data.accessToken);
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request<{ accessToken: string; user: any }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    setToken(data.accessToken);
    return data;
  }

  async sendMagicLink(email: string) {
    return this.request("/auth/magic-link", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async verifyMagicLink(token: string) {
    const data = await this.request<{ accessToken: string; user: any }>(
      "/auth/verify",
      {
        method: "POST",
        body: JSON.stringify({ token }),
      }
    );
    setToken(data.accessToken);
    return data;
  }

  async logout() {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } finally {
      clearToken();
    }
  }

  async forgotPassword(email: string) {
    return this.request<{ success: boolean }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request<{ success: boolean }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  }

  // Google OAuth authentication
  async getGoogleAuthUrl() {
    return this.request<{ authUrl: string }>("/auth/google");
  }

  async loginWithGoogle() {
    const { authUrl } = await this.getGoogleAuthUrl();
    window.location.href = authUrl;
  }

  // Agents - FIXED
  async getAgents() {
    return this.request<{ agents: any[] }>("/agents");
  }

  async getAgentStats() {
    return this.request<{
      totalAgents: number;
      activeAgents: number;
      executionsToday: number;
      errorsToday: number;
    }>("/agents/stats");
  }

  async getAgent(id: string) {
    return this.request<{ agent: any }>(`/agents/${id}`);
  }

  async createAgent(data: {
    name: string;
    instructions: string;
    description?: string;
  }) {
    return this.request<{ agent: any }>("/agents", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAgent(id: string, data: Partial<any>) {
    return this.request(`/agents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteAgent(id: string) {
    return this.request(`/agents/${id}`, { method: "DELETE" });
  }

  async runAgent(id: string, payload: any) {
    return this.request<{
      success: boolean;
      executionId: string;
      message: string;
    }>(`/agents/${id}/run`, {
      method: "POST",
      body: JSON.stringify({ payload }),
    });
  }

  // Threads
  async createThread(params: {
    agentId: string;
    title?: string;
    metadata?: any;
  }) {
    return this.request<{ thread: any }>(`/threads`, {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async getThread(id: string) {
    return this.request<{ thread: any }>(`/threads/${id}`);
  }

  async setThreadGithubRepo(
    id: string,
    params: {
      githubRepo: { owner: string; repo: string; ref?: string };
      requestedFiles?: string[];
    }
  ) {
    return this.request<{ thread: any }>(`/threads/${id}/github-repo`, {
      method: "PUT",
      body: JSON.stringify(params),
    });
  }

  async getThreads(agentId?: string) {
    const query = agentId ? `?agentId=${agentId}` : "";
    return this.request<{ threads: any[] }>(`/threads${query}`);
  }

  async updateThread(id: string, data: { title?: string; metadata?: any }) {
    return this.request<{ thread: any }>(`/threads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async cancelExecution(executionId: string) {
    return this.request<{ success: boolean }>(
      `/executions/${executionId}/cancel`,
      {
        method: "POST",
      }
    );
  }

  async previewAgent(id: string, payload: any) {
    return this.request(`/agents/${id}/preview`, {
      method: "POST",
      body: JSON.stringify({ payload }),
    });
  }

  // Triggers - NEW
  async getTriggers(agentId?: string) {
    const query = agentId ? `?agentId=${agentId}` : "";
    return this.request<{ triggers: any[] }>(`/triggers${query}`);
  }

  async createTrigger(data: any) {
    return this.request("/triggers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTrigger(id: string, data: any) {
    return this.request(`/triggers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async toggleTrigger(id: string) {
    return this.request(`/triggers/${id}/toggle`, {
      method: "PATCH",
    });
  }

  async deleteTrigger(id: string) {
    return this.request(`/triggers/${id}`, { method: "DELETE" });
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
    }>(`/executions${query ? `?${query}` : ""}`);
  }

  async getExecution(id: string) {
    const res = await this.request<{ execution: any }>(`/executions/${id}`);
    return res.execution;
  }

  async getExecutionEvents(id: string) {
    return this.request<{ events: any[] }>(`/executions/${id}/events`);
  }

  async getGithubRepos() {
    return this.request<{
      repos: Array<{
        id: number;
        name: string;
        full_name: string;
        owner: string;
        private: boolean;
        description?: string;
        updated_at: string;
      }>;
    }>("/integrations/github/repos");
  }

  async retryExecution(id: string) {
    return this.request(`/executions/${id}/retry`, { method: "POST" });
  }

  // Integrations
  async getIntegrations() {
    return this.request<{ integrations: any[] }>("/integrations");
  }

  async getIntegrationHealth() {
    return this.request<any>("/integrations/health");
  }

  async connectIntegration(provider: string) {
    return this.request<{ authUrl: string }>(
      `/integrations/${provider}/connect`
    );
  }

  async disconnectIntegration(provider: string) {
    return this.request(`/integrations/${provider}`, { method: "DELETE" });
  }

  // Billing
  async getSubscription() {
    return this.request<any>("/billing/subscription");
  }

  async getBillingStatus() {
    return this.request<{
      plan: string;
      subscriptionStatus: string;
      credits: number;
      creditsLimit: number;
      agentLimit: number;
      subscriptionCurrentPeriodEnd: string;
    }>("/billing/status");
  }

  async createCheckout(plan: string, discountCode?: string) {
    console.log("createCheckout payload:", { plan, discountCode });
    return this.request<{ url: string }>("/billing/checkout", {
      method: "POST",
      body: JSON.stringify({
        plan,
        ...(discountCode && { discountCode }),
      }),
    });
  }

  async getPortalLink() {
    return this.request<{ url: string }>("/billing/portal", { method: "POST" });
  }

  async getInvoices() {
    return this.request<{ invoices: any[] }>("/billing/invoices");
  }

  async getPlans() {
    return this.request<{ plans: any[] }>("/billing/plans");
  }

  async getDailyDigest() {
    return this.request<any>("/digest/today");
  }

  async getCreditPackages() {
    return this.request<{
      packages: {
        id: string;
        credits: number;
        price: number;
        label: string;
      }[];
    }>("/billing/credits/packages");
  }

  async createCreditsCheckout(packageId: string) {
    return this.request<{
      url: string;
      packageDetails: {
        credits: number;
        price: number;
        label: string;
      };
    }>("/billing/credits/checkout", {
      method: "POST",
      body: JSON.stringify({ packageId }),
    });
  }

  async getCreditHistory() {
    return this.request<{
      history: {
        id: string;
        amount: number;
        type: "purchase" | "usage" | "refund" | "bonus";
        description: string;
        createdAt: string;
      }[];
    }>("/billing/credits/history");
  }
  // Chatbot - FIXED
  async sendMessage(message: string) {
    return this.request("/chatbot/message", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  async streamMessage(message: string, onEvent: (event: any) => void) {
    const token = getToken();
    const response = await fetch(`${this.baseURL}/chatbot/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE frames are separated by a blank line
      while (true) {
        const idx = buffer.indexOf("\n\n");
        if (idx === -1) break;
        const rawEvent = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);

        // Collect all data: lines (SSE can send multiple)
        const dataLines = rawEvent
          .split(/\r?\n/)
          .filter((l) => l.startsWith("data:"))
          .map((l) => l.replace(/^data:\s?/, ""))
          .filter(Boolean);

        if (!dataLines.length) continue;

        const payload = dataLines.join("\n");
        if (!payload || payload === "[DONE]") continue;

        try {
          onEvent(JSON.parse(payload));
        } catch {
          // ignore malformed payload (likely partial JSON)
        }
      }
    }
  }

  async getChatHistory() {
    return this.request<{ messages: any[] }>("/chatbot/history");
  }

  async clearChatHistory() {
    return this.request("/chatbot/history", { method: "DELETE" });
  }

  // Platform - NEW
  async getPlatforms() {
    return this.request<{ platforms: any[] }>("/platform");
  }

  async syncPlatform(provider: string) {
    return this.request(`/platform/${provider}/sync`, { method: "POST" });
  }

  // Dashboard - FIXED
  async getDashboardOverview() {
    return this.request<any>("/dashboard/overview");
  }

  async getAnalytics(days: number = 30) {
    return this.request<any>(`/dashboard/analytics?days=${days}`);
  }

  async getInsights() {
    return this.request<any>("/dashboard/insights");
  }

  async getLiveDashboardData() {
    return this.request<{
      activeExecutions: any[];
      recentActivity: any[];
      nextTriggers: any[];
    }>("/dashboard/live");
  }

  async getNotifications() {
    // Note: Assuming /dashboard/notifications structure for now based on backend change
    return this.request<{ notifications: any[] }>("/dashboard/notifications");
  }

  async syncNotifications() {
    return this.request<{ notifications: any[] }>(
      "/dashboard/notifications/sync"
    );
  }

  async getTemplates() {
    return this.request<{ templates: any[]; categories: string[] }>(
      "/dashboard/templates"
    );
  }

  // Profile
  async getProfile() {
    return this.request("/profile");
  }

  async updateProfile(data: any) {
    return this.request("/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async getUploadSignature() {
    return this.request<{
      signature: string;
      timestamp: number;
      cloudName: string;
      apiKey: string;
    }>("/profile/upload-signature");
  }

  async changePassword(data: any) {
    return this.request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteAccount() {
    return this.request("/profile", {
      method: "DELETE",
    });
  }

  // Webhooks
  async getWebhooks() {
    return this.request<{ webhooks: any[] }>("/webhooks");
  }

  async getWebhookProviders() {
    return this.request<{ providers: { provider: string; label: string }[] }>(
      "/webhooks/providers"
    );
  }

  async getWebhookEvents() {
    return this.request<{ events: any[] }>("/webhooks/events");
  }
  // Feedback
  async getFeedbacks() {
    return this.request<{ feedbacks: any[] }>("/feedback");
  }

  async createFeedback(data: { type: string; title: string; description?: string }) {
    return this.request<{ feedback: any }>("/feedback", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Generic methods
  async get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export { getToken, setToken, clearToken };
