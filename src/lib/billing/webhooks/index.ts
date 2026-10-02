import { WebhookEventLedger, Subscription, SubscriptionStatus, PlanType } from '../../../types/billing';
import { stripe } from '../stripe';
import Stripe from 'stripe';

export class WebhookService {
  private eventLedger: WebhookEventLedger[] = [];
  public subscriptions: Subscription[] = []; // In a real app, this is DB

  async verifySignature(payload: string | Buffer, signature: string, secret: string): Promise<Stripe.Event> {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  }

  async processEvent(event: Stripe.Event): Promise<void> {
    // 1. Idempotency Check
    const existing = this.eventLedger.find(e => e.stripeEventId === event.id);
    if (existing && existing.status === 'processed') {
      return; // Already processed
    }

    if(!existing) {
        this.eventLedger.push({
            id: Math.random().toString(36).substring(7),
            stripeEventId: event.id,
            type: event.type,
            status: 'pending',
            processedAt: null,
            errorMessage: null,
            createdAt: new Date()
        });
    }

    try {
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                const subscription = event.data.object as any;
                await this.handleSubscriptionUpdate(subscription);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Mark as processed
        const ledgerEntry = this.eventLedger.find(e => e.stripeEventId === event.id);
        if (ledgerEntry) {
            ledgerEntry.status = 'processed';
            ledgerEntry.processedAt = new Date();
        }
    } catch (error: any) {
        // Mark as failed
        const ledgerEntry = this.eventLedger.find(e => e.stripeEventId === event.id);
        if (ledgerEntry) {
            ledgerEntry.status = 'failed';
            ledgerEntry.errorMessage = error.message;
        }
        throw error;
    }
  }

  private async handleSubscriptionUpdate(stripeSub: any) {
    // Basic mapping logic
    const status = stripeSub.status as SubscriptionStatus;
    const planId = stripeSub.items.data[0].price.id; // Simplify
    const planType: PlanType = planId.includes('premium') ? 'premium' : 'trial';

    const existingSubIndex = this.subscriptions.findIndex(s => s.stripeSubscriptionId === stripeSub.id);

    if (existingSubIndex >= 0) {
        this.subscriptions[existingSubIndex] = {
            ...this.subscriptions[existingSubIndex],
            status,
            planId,
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
            updatedAt: new Date()
        };
    } else {
        // Find org by customer id (mocking)
        const orgId = "org_123";

        this.subscriptions.push({
            id: Math.random().toString(36).substring(7),
            organizationId: orgId,
            stripeCustomerId: stripeSub.customer as string,
            stripeSubscriptionId: stripeSub.id,
            status,
            planId,
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
  }

  // Helper for tests to read state
  public getSubscriptions() {
      return this.subscriptions;
  }
}
