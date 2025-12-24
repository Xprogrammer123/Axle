export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Cookie helper functions
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// Token management - cookies are primary, localStorage as fallback
const getToken = () => {
  if (typeof window === "undefined") return null;
  // Try to get from cookie first (if available in client-side)
  // Note: HttpOnly cookies can't be read by JS, so we rely on the server
  // For client-side, we'll use localStorage as a fallback for Authorization header
  return localStorage.getItem("accessToken");
};

const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  // Store in localStorage as fallback for Authorization header
  // The actual secure token is in HTTP-only cookie set by backend
  localStorage.setItem("accessToken", token);
};

const removeToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  // Clear cookies by setting them to expire
  document.cookie =
    "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie =
    "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getToken();

  // Use a plain object for headers so we can safely assign Authorization
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers,
    });

    // Handle 401 and token refresh
    if (res.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const { token: newToken } = await refreshRes.json();
            setToken(newToken);

            // Retry original request
            const retryRes = await fetch(`${API_URL}${endpoint}`, {
              ...options,
              credentials: "include",
              headers: {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              },
            });

            const retryData = await retryRes.json();
            if (!retryRes.ok)
              throw new Error(retryData?.error || "Request failed");
            return retryData;
          } else {
            removeToken();
            window.location.href = "/auth";
            throw new Error("Session expired. Please log in again.");
          }
        } catch {
          removeToken();
          window.location.href = "/auth";
          throw new Error("Session expired. Please log in again.");
        }
      } else {
        removeToken();
        window.location.href = "/auth";
        throw new Error("Authentication required");
      }
    }

    let data: any;
    try {
      data = await res.json();
    } catch {
      const text = await res.text();
      data = text || {};
    }

    if (!res.ok) {
      throw new Error(data?.error || data?.message || "Request failed");
    }

    return data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Network error occurred";
    throw new Error(message);
  }
};



// Auth API
export const authAPI = {
  requestMagicLink: async (email: string) => {
    return apiRequest("/auth/magic-link", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyMagicLink: async (token: string) => {
    const data = await apiRequest("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    // Cookies are set by backend automatically via Set-Cookie header
    // Store tokens in localStorage as fallback for Authorization header
    if (data.accessToken) {
      setToken(data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
    }
    return data;
  },

  getCurrentUser: async () => {
    return apiRequest("/auth/me");
  },

  refreshToken: async (refreshToken: string) => {
    const data = await apiRequest("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
    // Cookie is set by backend automatically via Set-Cookie header
    // Store in localStorage as fallback
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  logout: async () => {
    try {
      // Call backend to clear cookies
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      // Even if backend call fails, clear local storage
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage and cookies
      removeToken();
    }
  },
};




// Types for agent data
export type AgentCreateData = {
  name: string;
  description?: string;
  systemPrompt?: string;
  tools?: string[];
  integrations?: Array<{ name: string; integrationId: string }>;
  schedule?: {
    enabled: boolean;
    intervalMinutes?: number;
    cron?: string;
  };
  model?: string;
};

export type AgentUpdateData = Partial<AgentCreateData>;

// ✅ Fixed: Type for agent response with `_id`
export type Agent = AgentCreateData & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export const agentsAPI = {
  list: async (): Promise<Agent[]> => {
    return apiRequest("/agents");
  },

  get: async (id: string): Promise<Agent> => {
    return apiRequest(`/agents/${id}`);
  },

  create: async (agentData: AgentCreateData): Promise<Agent> => {
    return apiRequest("/agents", {
      method: "POST",
      body: JSON.stringify(agentData),
    });
  },

  update: async (id: string, agentData: AgentUpdateData): Promise<Agent> => {
    return apiRequest(`/agents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(agentData),
    });
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest(`/agents/${id}`, {
      method: "DELETE",
    });
  },

  run: async (id: string): Promise<any> => {
    return apiRequest(`/agents/${id}/run`, {
      method: "POST",
    });
  },

  getStatus: async (id: string): Promise<{ status: string }> => {
    return apiRequest(`/agents/${id}/status`);
  },

  chat: async (
    id: string,
    message: string,
    threadId?: string
  ): Promise<any> => {
    return apiRequest(`/agents/${id}/chat`, {
      method: "POST",
      body: JSON.stringify({ message, threadId }),
    });
  },

  getConversations: async (id: string): Promise<any[]> => {
    return apiRequest(`/agents/${id}/conversations`);
  },

  getConversation: async (id: string, threadId: string): Promise<any> => {
    return apiRequest(`/agents/${id}/conversations/${threadId}`);
  },
};






// OAuth API
export const oauthAPI = {
  getAuthUrl: async (provider: string) => {
    return apiRequest(`/oauth/${provider}/auth-url`);
  },

  callback: async (provider: string, code: string) => {
    return apiRequest(`/oauth/${provider}/callback`, {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },

  listIntegrations: async () => {
    return apiRequest("/oauth/integrations");
  },

  disconnect: async (integrationId: string) => {
    return apiRequest(`/oauth/integrations/${integrationId}`, {
      method: "DELETE",
    });
  },
};




// Chat API (main agent chat)
export const chatAPI = {
  send: async (message: string) => {
    return apiRequest("/agents/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },
};

// Logs and Reports API
export const logsAPI = {
  getAgentLogs: async (agentId: string, limit: number = 50): Promise<any> => {
    return apiRequest(`/logs/agents/${agentId}/logs?limit=${limit}`);
  },

  getAllLogs: async (limit: number = 100): Promise<any> => {
    return apiRequest(`/logs/all?limit=${limit}`);
  },

  getAgentReport: async (agentId: string): Promise<any> => {
    return apiRequest(`/logs/agents/${agentId}/report`);
  },

  getAllReports: async (): Promise<any> => {
    return apiRequest("/logs/reports");
  },

  getInsights: async (agentId?: string): Promise<any> => {
    if (agentId) {
      return apiRequest(`/logs/insights?agentId=${agentId}`);
    }
    return apiRequest("/logs/insights");
  },

  clearAgentLogs: async (agentId: string): Promise<any> => {
    return apiRequest(`/logs/agents/${agentId}/logs`, {
      method: "DELETE",
    });
  },
};

export default apiRequest;
