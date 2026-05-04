import httpService from "./http.service";

class ReviewService extends httpService {
  // Get all reviews for a product
  async getReviews(slug: string) {
    return this.getRequest(`/products/${slug}/reviews`);
  }

  // Add a new review
  async addReview(slug: string, reviewData: any) {
    return this.postRequest(`/products/${slug}/reviews`, reviewData, { auth: true });
  }

  // Update a review
  async updateReview(slug: string, reviewId: string, reviewData: any) {
    return this.patchRequest(`/products/${slug}/reviews/${reviewId}`, reviewData, { auth: true });
  }

  // Delete a review
  async deleteReview(slug: string, reviewId: string) {
    return this.deleteRequest(`/products/${slug}/reviews/${reviewId}`, { auth: true });
  }
}

const ReviewSvc = new ReviewService();
export default ReviewSvc;
