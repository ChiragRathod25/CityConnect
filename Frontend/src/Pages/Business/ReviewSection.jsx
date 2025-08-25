import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { translateText } from "../../utils/translateService"; 
import { useSelector } from "react-redux";
const ReviewSection = ({ reviews, onAddReview }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    
  },[reviews])
  const { language } = useSelector((state) => state.user);
  useEffect(() => {
    const translateReviews = async () => {
      const translatedReviews = await Promise.all(
        reviews.map(async (review) => ({
          ...review,
          comment: await translateText(review.comment, language),
        }))
      );
  
      reviews = translateReviews;
    };
  
    translateReviews();
  }, [language]);
  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!newReview.comment.trim() || newReview.rating === 0) return;

    onAddReview(newReview); 
    setNewReview({ rating: 0, comment: "" });
    setShowReviewForm(false);
  };
  console.log(reviews);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          {showReviewForm ? "Cancel" : "Add Review"}
        </motion.button>
      </div>

      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-4">
          <div className="mb-2">
            <label className="block text-gray-700">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={`text-5xl cursor-pointer ${
                    num <= newReview.rating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  onClick={() => setNewReview({ ...newReview, rating: num })}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Review
          </motion.button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 font-semibold text-xl mb-2" >{review.comment}</p>
                <span>{review.createdAt ? new Date(review.createdAt).toLocaleString() : "Date of Review"}</span>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
