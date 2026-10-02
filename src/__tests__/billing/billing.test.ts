import { describe, expect, it, beforeEach } from "@jest/globals";
import { getEntitlements, PLANS } from '../../lib/billing/entitlements';
import { UsageService } from '../../lib/billing/usage';
import { WebhookService } from '../../lib/billing/webhooks';
import Stripe from 'stripe';

describe('Billing Systems', () => {
  describe('Entitlements', () => {
    it('grants premium entitlements for active status', () => {
      const entitlements = getEntitlements('premium', 'active');
      expect(entitlements).toEqual(PLANS['premium']);
    });

    it('grants trial entitlements for trial status', () => {
      const entitlements = getEntitlements('trial', 'trial');
      expect(entitlements).toEqual(PLANS['trial']);
    });

    it('denies entitlements for canceled status', () => {
      const entitlements = getEntitlements('premium', 'canceled');
      expect(entitlements).toBeNull();
    });

    it('allows access during past_due (grace period)', () => {
      const entitlements = getEntitlements('premium', 'past_due');
      expect(entitlements).toEqual(PLANS['premium']);
    });
  });

  describe('Usage Ledger', () => {
    let usageService: UsageService;
    beforeEach(() => {
      usageService = new UsageService();
    });

    it('allows usage within limits', async () => {
      const success = await usageService.consume('org_1', 'ai_draft', 1, 'idem_1', 10);
      expect(success).toBe(true);
    });

    it('blocks usage exceeding limits', async () => {
      await usageService.consume('org_1', 'ai_draft', 10, 'idem_1', 10);
      const success = await usageService.consume('org_1', 'ai_draft', 1, 'idem_2', 10);
      expect(success).toBe(false); // Should fail as it exceeds 10
    });

    it('is idempotent', async () => {
      const s1 = await usageService.consume('org_1', 'ai_draft', 5, 'idem_1', 10);
      const s2 = await usageService.consume('org_1', 'ai_draft', 5, 'idem_1', 10);

      expect(s1).toBe(true);
      expect(s2).toBe(true); // Returns true but shouldn't double charge

      const s3 = await usageService.consume('org_1', 'ai_draft', 2, 'idem_3', 10);
      expect(s3).toBe(true); // Because the second call was ignored, 5 + 2 <= 10
    });
  });

  describe('Webhooks', () => {
    let webhookService: WebhookService;
    beforeEach(() => {
      webhookService = new WebhookService();
    });

    it('processes valid subscription created event', async () => {
      const event = {
        id: 'evt_1',
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_1',
            customer: 'cus_1',
            status: 'active',
            items: { data: [{ price: { id: 'price_premium' } }] },
            current_period_end: Math.floor(Date.now() / 1000) + 86400,
            cancel_at_period_end: false
          }
        }
      } as unknown as Stripe.Event;

      await webhookService.processEvent(event);

      const subs = webhookService.getSubscriptions();
      expect(subs.length).toBe(1);
      expect(subs[0].status).toBe('active');
      expect(subs[0].planId).toBe('price_premium');
    });

    it('is idempotent for webhooks', async () => {
      const event = {
        id: 'evt_1',
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_1',
            customer: 'cus_1',
            status: 'active',
            items: { data: [{ price: { id: 'price_premium' } }] },
            current_period_end: Math.floor(Date.now() / 1000) + 86400,
            cancel_at_period_end: false
          }
        }
      } as unknown as Stripe.Event;

      await webhookService.processEvent(event);
      await webhookService.processEvent(event); // Replay

      const subs = webhookService.getSubscriptions();
      expect(subs.length).toBe(1); // Still only 1
    });

    it('handles out of order events by treating current state as authoritative (simulated)', async () => {
       // In a real implementation with DB, we'd check timestamps or just upsert.
       // Here we test updating state.
       const event1 = {
        id: 'evt_1',
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_1',
            customer: 'cus_1',
            status: 'trial',
            items: { data: [{ price: { id: 'price_trial' } }] },
            current_period_end: Math.floor(Date.now() / 1000) + 86400,
            cancel_at_period_end: false
          }
        }
      } as unknown as Stripe.Event;

      const event2 = {
        id: 'evt_2',
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: 'sub_1',
            customer: 'cus_1',
            status: 'active',
            items: { data: [{ price: { id: 'price_premium' } }] },
            current_period_end: Math.floor(Date.now() / 1000) + 86400,
            cancel_at_period_end: false
          }
        }
      } as unknown as Stripe.Event;

      await webhookService.processEvent(event1);
      await webhookService.processEvent(event2);

      const subs = webhookService.getSubscriptions();
      expect(subs[0].status).toBe('active');
    });
  });
});
