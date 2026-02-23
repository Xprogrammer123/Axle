
const PLAN_TIERS = ['free', 'pro', 'premium', 'custom'] as const;
type PlanTier = (typeof PLAN_TIERS)[number];

function tier(plan: string): PlanTier {
    const p = plan?.toLowerCase() as PlanTier;
    return PLAN_TIERS.includes(p) ? p : 'free';
}

// ── Agent limits ──

/** Max agents the user can create on their plan. */
export function getAgentLimit(plan: string): number {
    const t = tier(plan);
    if (t === 'free') return 2;
    if (t === 'pro') return 10;
    if (t === 'premium') return 50;
    return Infinity; // custom
}

/** Human-friendly label for the agent limit. */
export function getAgentLimitLabel(plan: string): string {
    const limit = getAgentLimit(plan);
    if (limit === Infinity) return 'Unlimited agents';
    const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
    return `${limit} agent${limit === 1 ? '' : 's'} on ${planName} plan`;
}

// ── Schedule trigger limits ──

/** Max schedule triggers allowed *per agent* for the given plan. */
export function getScheduleLimit(plan: string): number {
    const t = tier(plan);
    if (t === 'free') return 1;
    if (t === 'pro') return 5;
    if (t === 'premium') return 20;
    return Infinity; // custom
}

/** Human-friendly label for the schedule limit. */
export function getScheduleLimitLabel(plan: string): string {
    const limit = getScheduleLimit(plan);
    if (limit === Infinity) return 'Unlimited schedules';
    return `${limit} schedule${limit === 1 ? '' : 's'} on ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan`;
}

// ── Webhook access ──

/** Whether the given plan can use webhook triggers. */
export function canUseWebhooks(plan: string): boolean {
    return tier(plan) !== 'free';
}

/** Max webhook triggers allowed *per agent* for the given plan. */
export function getWebhookLimit(plan: string): number {
    const t = tier(plan);
    if (t === 'free') return 0;
    if (t === 'pro') return 5;
    if (t === 'premium') return 20;
    return Infinity; // custom
}

/** Next upgrade tier name (for upgrade prompts). */
export function getNextTierName(plan: string): string {
    const t = tier(plan);
    if (t === 'free') return 'Pro';
    if (t === 'pro') return 'Premium';
    return 'Custom';
}

// ── Credit purchase limits ──

/** Max credits a user can have on their plan. */
export function getCreditLimit(plan: string): number {
    const t = tier(plan);
    if (t === 'free') return 100;
    if (t === 'pro') return 2500;
    if (t === 'premium') return 5000;
    return 10000; // custom limit is 10k by default
}
