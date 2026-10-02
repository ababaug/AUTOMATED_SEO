import { StructuredRecommendation } from '../types/recommendation';

export interface OwnerApprovedContext {
  business_name: string;
  credentials: string[];
  awards: string[];
  prices: Record<string, number>;
  service_areas: string[];
  locations: string[];
  testimonials: string[];
  years_of_experience: number;
}

export class FactualSafetyValidator {
  constructor(private context: OwnerApprovedContext) {}

  /**
   * Evaluates recommendation for unsupported factual claims
   * Do not invent or allow unsupported claims.
   */
  validate(recommendation: StructuredRecommendation): boolean {
    const textToCheck = `${recommendation.finding} ${recommendation.proposed_change}`.toLowerCase();

    // Naive check: if it proposes adding an award we don't have, reject it.
    if (textToCheck.includes('award') || textToCheck.includes('winner')) {
      const mentionsAward = this.context.awards.some(award =>
        textToCheck.includes(award.toLowerCase())
      );
      if (!mentionsAward) {
        return false; // Unsupported award claim
      }
    }

    // Check pricing: if it mentions a price, it better be an approved one.
    if (textToCheck.includes('$')) {
      const priceValues = Object.values(this.context.prices);
      const matchesApprovedPrice = priceValues.some(p => textToCheck.includes(`$${p}`));
      if (!matchesApprovedPrice) {
        return false; // Unsupported price claim
      }
    }

    // Check years of experience
    if (textToCheck.includes('years of experience') || textToCheck.includes('years experience')) {
        const expectedStr = `${this.context.years_of_experience} years`;
        if (!textToCheck.includes(expectedStr)) {
            return false;
        }
    }

    return true; // Passed factual checks
  }
}
