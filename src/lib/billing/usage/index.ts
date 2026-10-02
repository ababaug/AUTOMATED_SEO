import { UsageLedger } from '../../../types/billing';

export class UsageService {
  // In a real app, this would be a database connection
  private ledgers: UsageLedger[] = [];

  async consume(
    organizationId: string,
    resource: 'site' | 'audit' | 'ai_draft',
    amount: number,
    idempotencyKey: string,
    limit: number
  ): Promise<boolean> {
    // 1. Check idempotency
    const existing = this.ledgers.find((l) => l.idempotencyKey === idempotencyKey);
    if (existing) {
      return true; // Already processed
    }

    // 2. Calculate current usage
    const now = new Date();
    // Assuming monthly periods starting on the 1st
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const currentUsage = this.ledgers
      .filter(
        (l) =>
          l.organizationId === organizationId &&
          l.resource === resource &&
          l.action === 'consume' &&
          l.periodStart.getTime() === periodStart.getTime()
      )
      .reduce((sum, l) => sum + l.amount, 0);

    // 3. Check limit
    if (currentUsage + amount > limit) {
      return false;
    }

    // 4. Record usage
    this.ledgers.push({
      id: Math.random().toString(36).substring(7),
      organizationId,
      resource,
      amount,
      action: 'consume',
      periodStart,
      periodEnd,
      idempotencyKey,
      createdAt: now,
    });

    return true;
  }
}
