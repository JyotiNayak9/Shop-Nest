import httpService from "./http.service";

class ReviewService extends httpService {
  // Get all reviews for a product
  async getReviews(slug: string) {
    return this.getRequest(`/product/getproductbyslug/${slug}/review`);
  }

  // Add a new review
  async addReview(slug: string, reviewData: any) {
    return this.postRequest(`/product/getproductbyslug/${slug}/review`, reviewData, { auth: true });
  }

  // Update a review
  async updateReview(slug: string, reviewId: string, reviewData: any) {
    return this.patchRequest(`/product/getproductbyslug/${slug}/review/${reviewId}`, reviewData, { auth: true });
  }

  // Delete a review
  async deleteReview(slug: string, reviewId: string) {
    return this.deleteRequest(`/product/getproductbyslug/${slug}/review/${reviewId}`, { auth: true });
  }
}

const ReviewSvc = new ReviewService();
export default ReviewSvc;
