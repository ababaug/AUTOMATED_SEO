import { Entitlements, PlanType, SubscriptionStatus } from '../../../types/billing';

export const PLANS: Record<PlanType, Entitlements> = {
  trial: {
    maxSites: 1,
    maxAuditsPerMonth: 1,
    maxAiDrafts: 10,
    autoPublishEnabled: false,
  },
  premium: {
    maxSites: 1,
    maxAuditsPerMonth: 10,
    maxAiDrafts: 100,
    autoPublishEnabled: true,
  },
};

export function getEntitlements(
  planType: PlanType,
  status: SubscriptionStatus
): Entitlements | null {
  // Only active, trial, and past_due (grace period) statuses grant access
  if (['active', 'trial', 'past_due'].includes(status)) {
    return PLANS[planType];
  }
  return null;
}
