export interface User {
  _id: string;
  email: string;
  name?: string;
  plan: 'free' | 'starter' | 'pro' | 'team' | 'business';
  credits: number;
  createdAt: string;
}

export interface Agent {
  _id: string;
  name: string;
  description?: string;
  instructions?: string;
  status: 'active' | 'paused';
  brain: {
    model: string;
    temperature: number;
    maxTokens: number;
  };
  integrations: string[];
  actions: string[];
  memory?: Record<string, any>;
  createdAt: string;
  lastRunAt?: string;
}

export interface Execution {
  _id: string;
  agentId: string | Agent;
  agentName?: string;
  userId: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'canceled';
  statusExplained?: string;
  input: any;
  output?: any;
  reasoning?: string;
  summary?: string;
  actionsExecuted: ExecutionAction[];
  memory: Record<string, any>;
  error?: string;
  creditsUsed?: number;
  createdAt: string;
  createdAtHuman?: string;
  finishedAt?: string;
  finishedAtHuman?: string;
  durationHuman?: string;
}

export interface ExecutionAction {
  type: string;
  params: Record<string, any>;
  result?: Record<string, any>;
  error?: string;
  humanReadableStep?: string;
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
}

export interface Integration {
  _id: string;
  userId: string;
  provider: string;
  providerExplained?: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  scopes: string[];
  statusExplained?: string;
  createdAt: string;
  createdAtHuman?: string;
  lastUsedAt?: string;
  lastUsedHuman?: string;
}

export interface Template {
  name: string;
  description: string;
  category: string;
  actions: any[];
  requiredIntegrations: string[];
}

export interface Insight {
  type: 'pattern' | 'anomaly' | 'optimization' | 'cost' | 'reliability';
  icon: string;
  title: string;
  message: string;
  actionable: boolean;
  action?: string;
  actionUrl?: string;
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: 'reliability' | 'performance' | 'cost' | 'usage';
  title: string;
  description: string;
  impact: string;
  effort: string;
  cta: string;
  ctaUrl?: string;
}

export interface DashboardOverview {
  overview: {
    totalExecutions: number;
    totalExecutionsExplained: string;
    successRate: number;
    successRateExplained: string;
    creditsUsed: number;
    creditsRemaining: number;
    creditsLimit: number;
    creditsExplained: string;
    creditsResetDate: string;
    creditsResetHuman: string;
    avgExecutionTime: number;
    avgExecutionTimeExplained: string;
    mostUsedAgent: string;
    mostUsedAgentExplained: string;
    mostUsedIntegration: string;
    mostUsedIntegrationExplained: string;
    currentPlan: string;
    currentPlanExplained: string;
  };
}

export interface Analytics {
  metrics: {
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    successRate: number;
    totalCreditsUsed: number;
    avgExecutionTime: number;
    mostUsedAgent: string;
    mostUsedIntegration: string;
  };
  timeSeries: {
    date: string;
    executions: number;
    success: number;
    failed: number;
  }[];
  agentPerformance: {
    agentId: string;
    agentName: string;
    totalRuns: number;
    successRate: number;
    lastRun: string | null;
    lastRunHuman?: string;
    successRateExplained?: string;
  }[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  priceText: string;
  agentLimit: number;
  monthlyCredits: number;
  popular?: boolean;
  description: string;
  features: string[];
}

export interface Subscription {
  plan: string;
  planName: string;
  status: string;
  credits: number;
  creditsLimit: number;
  agentLimit: number;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  nextBillingDate?: string;
  summaryText?: string;
  statusText?: string;
  nextBillingText?: string;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  statusText: string;
  date: string;
  dateText: string;
  pdfUrl?: string;
  description: string;
}
