import { describe, expect, it, beforeEach } from '@jest/globals';
import { UsageService } from '../../lib/billing/usage';

describe('Usage Concurrency', () => {
    let usageService: UsageService;

    beforeEach(() => {
        usageService = new UsageService();
    });

    it('prevents concurrent usage from bypassing limits', async () => {
        const promises = [];

        // Attempt to consume 1 unit 15 times concurrently, with a limit of 10
        for (let i = 0; i < 15; i++) {
            promises.push(usageService.consume('org_1', 'ai_draft', 1, `idem_${i}`, 10));
        }

        const results = await Promise.all(promises);

        const successCount = results.filter(r => r === true).length;
        const failCount = results.filter(r => r === false).length;

        // Note: This test will pass with our simple in-memory implementation because
        // node is single threaded and our push is synchronous. In a real DB scenario
        // you would need transactions or locking to pass this test. We assume the
        // DB implementation will use standard row-locking or constraints.
        expect(successCount).toBe(10);
        expect(failCount).toBe(5);
    });
});
