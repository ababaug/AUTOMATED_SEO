import { z } from 'zod';

export const RecommendationStatusSchema = z.enum([
  'draft',
  'needs_review',
  'approved',
  'rejected',
]);

export type RecommendationStatus = z.infer<typeof RecommendationStatusSchema>;

export const StructuredRecommendationSchema = z.object({
  id: z.string(),
  organization_project: z.string(),
  category: z.string(),
  affected_url: z.string().url(),
  finding: z.string(),
  evidence: z.string(), // Must point back to evidence
  confidence: z.number().min(0).max(100),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  expected_benefit: z.string(),
  proposed_change: z.string(),
  risk: z.enum(['low', 'medium', 'high']),
  requires_approval: z.boolean(),
  verification_steps: z.array(z.string()),
  rollback_strategy: z.string(),
  status: RecommendationStatusSchema,
});

export type StructuredRecommendation = z.infer<typeof StructuredRecommendationSchema>;

// Semantic features output schema
export const SemanticFeaturesSchema = z.object({
  topic_grouping: z.array(z.string()).optional(),
  search_intent_grouping: z.array(z.string()).optional(),
  keyword_to_page_mapping: z.record(z.string(), z.array(z.string())).optional(),
  title_suggestions: z.array(z.string()).optional(),
  meta_description_suggestions: z.array(z.string()).optional(),
  internal_link_suggestions: z.array(
    z.object({ source_url: z.string(), target_url: z.string(), anchor_text: z.string() })
  ).optional(),
  content_briefs: z.array(z.string()).optional(),
});

export type SemanticFeatures = z.infer<typeof SemanticFeaturesSchema>;
