import { WebhookService } from '../../../lib/billing/webhooks';
import { STRIPE_WEBHOOK_SECRET } from '../../../lib/billing/stripe';
// Next.js API route wrapper (mock/conceptual for milestone implementation)

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const signature = req.headers['stripe-signature'];

  if (!signature) {
    return res.status(400).json({ error: 'Missing signature' });
  }

  let event;
  const webhookService = new WebhookService();

  try {
    // Read raw body (implementation depends on framework, mocking here)
    const rawBody = req.body || '';
    event = await webhookService.verifySignature(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).json({ error: 'Webhook Error: Invalid signature' });
  }

  try {
    await webhookService.processEvent(event);
    res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook handler failed.', err.message);
    // Even if it fails internally after verification, often you return 200 so Stripe
    // doesn't indefinitely retry if it's an unrecoverable logic error, but
    // 500 makes Stripe retry for temporary DB issues. We'll return 500 for demo.
    res.status(500).json({ error: 'Internal processing error' });
  }
}
