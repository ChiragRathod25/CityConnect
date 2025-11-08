import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

// Mock reviews data
const mockReviews = [
  {
    _id: "1",
    user: {
      name: "John Doe",
      image: "https://i.pravatar.cc/150?img=1",
    },
    rating: 5,
    comment: "Excellent service! The team was professional and delivered exactly what we needed. Highly recommend to anyone looking for quality work. The attention to detail was impressive and they were very responsive to our feedback.",
    images: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop",
    ],
    createdAt: "2024-11-05",
  },
  {
    _id: "2",
    user: {
      name: "Jane Smith",
      image: "https://i.pravatar.cc/150?img=5",
    },
    rating: 4,
    comment: "Very professional team. Great communication throughout the project. Would definitely work with them again. Minor delays but overall satisfied with the outcome.",
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    ],
    createdAt: "2024-11-03",
  },
  {
    _id: "3",
    user: {
      name: "Mike Johnson",
      image: "https://i.pravatar.cc/150?img=12",
    },
    rating: 5,
    comment: "Outstanding quality! Exceeded our expectations. The best service provider we've worked with. They went above and beyond to ensure we were completely satisfied.",
    images: [
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
    ],
    createdAt: "2024-11-01",
  },
  {
    _id: "4",
    user: {
      name: "Sarah Williams",
      image: "https://i.pravatar.cc/150?img=9",
    },
    rating: 5,
    comment: "Fantastic experience from start to finish! The quality of work is exceptional and the customer service was top-notch. They truly care about their clients.",
    images: [],
    createdAt: "2024-10-28",
  },
  {
    _id: "5",
    user: {
      name: "David Brown",
      image: "https://i.pravatar.cc/150?img=15",
    },
    rating: 4,
    comment: "Good service overall. The team was knowledgeable and helpful. A few minor issues but they were resolved quickly. Would recommend.",
    images: [
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop",
    ],
    createdAt: "2024-10-25",
  },
];

const ReviewSection = () => {
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);

  const reviews = mockReviews;
  const currentReview = reviews[currentReviewPage - 1];
  const totalReviewPages = reviews.length;

  const handleReviewPageChange = (page) => {
    if (page >= 1 && page <= totalReviewPages) {
      setCurrentReviewPage(page);
      setSelectedImageIndex(0);
    }
  };

  const openImageModal = (images, index) => {
    setModalImages(images);
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setModalImages([]);
    setSelectedImageIndex(0);
  };

  const nextModalImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % modalImages.length);
  };

  const prevModalImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + modalImages.length) % modalImages.length
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!currentReview) return null;

  return (
    <div className="mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h4
          className="text-2xl font-bold flex items-center space-x-2 mb-6"
          style={{ color: "#1f2937" }}
        >
          <div
            className="w-2 h-8 rounded-full"
            style={{ backgroundColor: "#1f2937" }}
          ></div>
          <span>Customer Reviews ({reviews.length})</span>
        </h4>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentReview._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl shadow-lg p-6 md:p-8"
            style={{ backgroundColor: "#ffffff" }}
          >
            {/* Reviewer Info */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="relative">
                {currentReview.user.image ? (
                  <img
                    src={currentReview.user.image}
                    alt={currentReview.user.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover ring-4 ring-gray-100"
                  />
                ) : (
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: "#e2e8f0" }}
                  >
                    <User className="w-8 h-8 md:w-10 md:h-10" style={{ color: "#6b7280" }} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h5 className="text-xl md:text-2xl font-bold mb-2" style={{ color: "#1f2937" }}>
                  {currentReview.user.name}
                </h5>
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(currentReview.rating)}
                  </div>
                  <div className="flex items-center space-x-2" style={{ color: "#6b7280" }}>
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(currentReview.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Comment */}
            <div className="mb-6">
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{ color: "#374151" }}
              >
                {currentReview.comment}
              </p>
            </div>

            {/* Review Images */}
            {currentReview.images && currentReview.images.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ImageIcon className="w-5 h-5" style={{ color: "#6b7280" }} />
                  <span className="font-semibold" style={{ color: "#1f2937" }}>
                    Photos ({currentReview.images.length})
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentReview.images.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="relative h-40 md:h-48 rounded-xl overflow-hidden cursor-pointer shadow-md"
                      onClick={() => openImageModal(currentReview.images, index)}
                    >
                      <img
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-200" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Pagination */}
            {totalReviewPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t-2" style={{ borderColor: "#e2e8f0" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReviewPageChange(currentReviewPage - 1)}
                  disabled={currentReviewPage === 1}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    currentReviewPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg"
                  }`}
                  style={{
                    backgroundColor: currentReviewPage === 1 ? "#e2e8f0" : "#1f2937",
                    color: currentReviewPage === 1 ? "#6b7280" : "#ffffff",
                  }}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous Review</span>
                </motion.button>

                <div
                  className="px-6 py-3 rounded-xl font-bold text-lg"
                  style={{ backgroundColor: "#f8fafc", color: "#1f2937" }}
                >
                  {currentReviewPage} / {totalReviewPages}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReviewPageChange(currentReviewPage + 1)}
                  disabled={currentReviewPage === totalReviewPages}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    currentReviewPage === totalReviewPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg"
                  }`}
                  style={{
                    backgroundColor:
                      currentReviewPage === totalReviewPages ? "#e2e8f0" : "#1f2937",
                    color: currentReviewPage === totalReviewPages ? "#6b7280" : "#ffffff",
                  }}
                >
                  <span>Next Review</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image */}
              <div className="relative">
                <img
                  src={modalImages[selectedImageIndex]}
                  alt={`Review image ${selectedImageIndex + 1}`}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
                />

                {/* Navigation Arrows */}
                {modalImages.length > 1 && (
                  <>
                    <button
                      onClick={prevModalImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md hover:scale-110 transition-all duration-200"
                      style={{ backgroundColor: "rgba(31, 41, 55, 0.8)", color: "#ffffff" }}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextModalImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full backdrop-blur-md hover:scale-110 transition-all duration-200"
                      style={{ backgroundColor: "rgba(31, 41, 55, 0.8)", color: "#ffffff" }}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl backdrop-blur-md"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", color: "#ffffff" }}
                >
                  <span className="text-sm font-medium">
                    {selectedImageIndex + 1} / {modalImages.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewSection;