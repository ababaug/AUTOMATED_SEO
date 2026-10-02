import { AIAdapterInterface, AIProviderConfig, RecommendationEvidence } from '../ai/interface';
import { StructuredRecommendation, StructuredRecommendationSchema } from '../types/recommendation';
import { randomUUID } from 'crypto';

export class MockLocalAIAdapter implements AIAdapterInterface {
  private config: AIProviderConfig;
  private quota: number = 100;

  constructor(config?: Partial<AIProviderConfig>) {
    this.config = {
      provider: 'local-mock',
      model: 'mock-llm',
      version: '1.0',
      paid_ai_enabled: false,
      ...config,
    };

    // Safety check constraint: Never silently switch to paid inference
    if (this.config.paid_ai_enabled) {
      throw new Error('PAID_AI_ENABLED is currently disallowed by policy.');
    }
  }

  getQuotaRemaining(): number {
    return this.quota;
  }

  async generateStructuredRecommendation(
    evidence: RecommendationEvidence,
    budget?: number
  ): Promise<StructuredRecommendation> {
    if (this.quota <= 0) {
      throw new Error('Quota Exhausted');
    }

    // Treat crawled content as untrusted data
    // Evaluate for prompt injection patterns
    const contentLower = evidence.crawled_content.toLowerCase();
    if (
      contentLower.includes('ignore previous instructions') ||
      contentLower.includes('override system instructions') ||
      contentLower.includes('reveal secrets') ||
      contentLower.includes('invoke tools') ||
      contentLower.includes('publish')
    ) {
      // Simulate that a malicious payload doesn't alter instructions.
      // We log it and return a nullified or safe response
      // For this test simulation, we return an error or safe finding
      throw new Error('Prompt injection detected or malformed input rejected');
    }

    if (contentLower.includes('malformed')) {
        throw new Error('Provider malformed response');
    }

    if (contentLower.includes('timeout')) {
        throw new Error('Provider timeout');
    }

    this.quota -= 1;

    // Build the mock recommendation based on inputs
    const rec: unknown = {
      id: randomUUID(),
      organization_project: 'org-123',
      category: 'semantic-seo',
      affected_url: evidence.source_url || 'https://example.com',
      finding: 'Missing topic grouping for semantic coherence',
      evidence: JSON.stringify(evidence.audit_findings),
      confidence: 85,
      priority: 'high',
      expected_benefit: 'Improved topical authority',
      proposed_change: 'Group these keywords into a pillar page structure.',
      risk: 'low',
      requires_approval: true, // Human review remains default
      verification_steps: ['Check internal linking post-publish'],
      rollback_strategy: 'Revert to previous sitemap structure',
      status: 'draft',
    };

    // Validate all model output against explicit schema
    const parsed = StructuredRecommendationSchema.safeParse(rec);
    if (!parsed.success) {
      throw new Error(`Malformed AI output: ${parsed.error.message}`);
    }

    return parsed.data;
  }
}
