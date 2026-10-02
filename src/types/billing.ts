export type SubscriptionStatus =
  | 'trial'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused';

export type PlanType = 'trial' | 'premium';

export interface Entitlements {
  maxSites: number;
  maxAuditsPerMonth: number;
  maxAiDrafts: number;
  autoPublishEnabled: boolean;
}

export interface Subscription {
  id: string;
  organizationId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: SubscriptionStatus;
  planId: string;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageLedger {
  id: string;
  organizationId: string;
  resource: 'site' | 'audit' | 'ai_draft';
  amount: number;
  action: 'consume' | 'reserve' | 'release';
  periodStart: Date;
  periodEnd: Date;
  idempotencyKey: string;
  createdAt: Date;
}

export interface WebhookEventLedger {
  id: string;
  stripeEventId: string;
  type: string;
  status: 'pending' | 'processed' | 'failed';
  processedAt: Date | null;
  errorMessage: string | null;
  createdAt: Date;
}
