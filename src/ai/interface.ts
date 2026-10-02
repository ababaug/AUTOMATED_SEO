import { StructuredRecommendation } from '../types/recommendation';

export interface AIProviderConfig {
  provider: string;
  model: string;
  version: string;
  paid_ai_enabled: boolean;
}

export interface RecommendationEvidence {
  source_url?: string;
  crawled_content: string;
  audit_findings: string[];
}

export interface AIAdapterInterface {
  generateStructuredRecommendation(
    evidence: RecommendationEvidence,
    budget?: number
  ): Promise<StructuredRecommendation>;
  getQuotaRemaining(): number;
}
