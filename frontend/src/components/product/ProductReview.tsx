import React, { useState, useEffect, useContext } from "react";
import { Button } from "flowbite-react";
import { toast } from "react-toastify";
import AuthContext from "../../context/auth.context";
import { HiStar, HiPencilAlt, HiTrash } from "react-icons/hi";
import { useParams } from "react-router-dom";
import ProductSvc from "../../pages/Cms/product/product-service";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: {
    _id: string;
    name: string;
  };
  createdAt: string;
}



const ProductReview = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const { LoggedInUser } = useContext(AuthContext);

  const getReviews = async () => {
    try {
      const response : any = await ProductSvc.getRequest(`/product/getreview/:${slug}`);
      setReviews(response.result.reviews);
      setAverageRating(response.result.averageRating);
      setReviewCount(response.result.reviewCount);
    } catch (error) {
      toast.error("Failed to fetch reviews");
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!LoggedInUser) {
      toast.error("Please login to submit a review");
      return;
    }

    const currentRating = editingReviewId ? editRating : rating;
    const currentComment = editingReviewId ? editComment : comment;

    if (currentRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!currentComment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      setLoading(true);
      const reviewData = {
        rating: currentRating,
        comment: currentComment
      };
      
      if (editingReviewId) {
        await ProductSvc.patchRequest(
          `/product/updatereview/${slug}/${editingReviewId}`, 
          reviewData, 
          { auth: true }
        );
        toast.success("Review updated successfully");
        setEditingReviewId(null);
      } else {
        await ProductSvc.postRequest(
          `/product/addreview/${slug}`, 
          reviewData,
          { auth: true }
        );
        toast.success("Review submitted successfully");
      }
      
      setRating(0);
      setComment("");
      setEditComment("");
      // setEditRating(0);
      getReviews();
    } catch (exception: any) {
      if (exception.data?.result) {
        Object.keys(exception.data.result).forEach((field: any) => {
          toast.error(exception.data.message);
          console.error(`${field}: ${exception.data.result[field]}`);
        });
      } else {
        toast.error("An error occurred while processing your request");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReviews();
  }, [slug]);

  const handleEditReview = (review: Review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(0);
    setEditComment("");
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await ProductSvc.deleteRequest(`/product/deletereview/${slug}/${reviewId}`, { auth: true });
        toast.success("Review deleted successfully");
        getReviews();
      } catch (error) {
        toast.error("Failed to delete review");
        console.error("Error deleting review:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">
          {editingReviewId ? 'Edit Review' : 'Write a Review'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <HiStar
                key={star}
                onClick={() => editingReviewId ? setEditRating(star) : handleRatingChange(star)}
                className={`h-6 w-6 cursor-pointer ${
                  (editingReviewId ? editRating >= star : rating >= star) 
                    ? "text-yellow-400" 
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <textarea
            value={editingReviewId ? editComment : comment}
            onChange={(e) => 
              editingReviewId 
                ? setEditComment(e.target.value) 
                : setComment(e.target.value)
            }
            placeholder="Write your review here..."
            className="w-full p-2 border rounded-md min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {editingReviewId ? 'Update Review' : 'Submit Review'}
            </Button>
            {editingReviewId && (
              <Button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              console.log("Review:", review),
              <div
                key={review._id}
                className="border-b pb-4 last:border-b-0 relative group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{review.user.name}</h3>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <HiStar
                          key={star}
                          className={`h-4 w-4 ${
                            review.rating >= star ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    {LoggedInUser && LoggedInUser._id === review.user._id && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit review"
                        >
                          <HiPencilAlt className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete review"
                        >
                          <HiTrash className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReview;
