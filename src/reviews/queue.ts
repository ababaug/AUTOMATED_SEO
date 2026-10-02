import { StructuredRecommendation, RecommendationStatus } from '../types/recommendation';

export class ReviewQueue {
  private queue: StructuredRecommendation[] = [];

  enqueue(recommendation: StructuredRecommendation) {
    this.queue.push(recommendation);
  }

  getQueue(): StructuredRecommendation[] {
    return this.queue;
  }

  getPendingReviews(): StructuredRecommendation[] {
    return this.queue.filter(
      (r) => r.status === 'draft' || r.status === 'needs_review'
    );
  }

  updateStatus(id: string, status: RecommendationStatus) {
    const rec = this.queue.find((r) => r.id === id);
    if (!rec) {
      throw new Error(`Recommendation ${id} not found.`);
    }
    rec.status = status;
    return rec;
  }

  approve(id: string) {
    return this.updateStatus(id, 'approved');
  }

  reject(id: string) {
    return this.updateStatus(id, 'rejected');
  }
}
