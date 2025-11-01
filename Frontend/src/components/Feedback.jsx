import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackComponent = () => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [review, setReview] = useState('');
  const [images, setImages] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 5));
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0 && review.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setReview('');
        setImages([]);
      }, 3000);
    }
  };

  const StarIcon = ({ filled, index }) => (
    <motion.div
      className="relative"
      onMouseEnter={() => setHoveredStar(index)}
      onMouseLeave={() => setHoveredStar(0)}
      onClick={() => setRating(index)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 15
      }}
    >
      <motion.svg
        className={`w-8 h-8 md:w-12 md:h-12 cursor-pointer transition-colors duration-200 ${
          filled ? 'text-yellow-400' : 'text-gray-600'
        }`}
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        animate={filled ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        } : { scale: 1, rotate: 0 }}
        transition={filled ? { 
          duration: 0.6,
          ease: "easeInOut"
        } : {}}
        whileHover={{ 
          scale: 1.2,
          y: -5
        }}
        whileTap={{ scale: 0.9 }}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </motion.svg>
      {filled && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
        >
          <svg
            className="w-8 h-8 md:w-12 md:h-12 text-yellow-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-20 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-3xl bg-white border-2 rounded-3xl shadow-lg p-6 md:p-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="feedback-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                  Share Your Feedback
                </h2>
                <p className="text-gray-500 text-base md:text-lg">
                  We'd love to hear about your experience
                </p>
              </div>

              <div className="space-y-8">
                {/* Rating Section */}
                <div className="space-y-4">
                  <label className="block text-gray-700 font-semibold text-lg md:text-xl text-center">
                    Rate Your Experience
                  </label>
                  <div className="flex justify-center gap-3 md:gap-5 bg-gray-100 rounded-2xl p-6 md:p-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        filled={star <= (hoveredStar || rating)}
                        index={star}
                      />
                    ))}
                  </div>
                  {rating > 0 && (
                    <motion.p
                      className="text-center text-gray-700 text-base md:text-lg font-semibold"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {rating === 1 && "😞 Poor"}
                      {rating === 2 && "😐 Fair"}
                      {rating === 3 && "🙂 Good"}
                      {rating === 4 && "😊 Very Good"}
                      {rating === 5 && "🤩 Excellent"}
                    </motion.p>
                  )}
                </div>

                {/* Review Section */}
                <div className="space-y-3">
                  <label className="block text-gray-700 font-semibold text-base md:text-lg">
                    Write Your Review
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full h-32 md:h-40 bg-gray-50 text-gray-800 rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all text-sm md:text-base placeholder-gray-400 border border-gray-200"
                  />
                </div>

                {/* Image Upload Section */}
                <div className="space-y-3">
                  <label className="block text-gray-700 font-semibold text-base md:text-lg">
                    Add Photos (Optional)
                  </label>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={images.length >= 5}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center justify-center gap-2 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-2xl p-5 cursor-pointer transition-all border-2 border-dashed border-gray-300 ${
                        images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm md:text-base font-medium">
                        {images.length >= 5 ? 'Maximum 5 images reached' : 'Upload Images (Max 5)'}
                      </span>
                    </label>
                  </div>

                  {/* Image Preview Grid */}
                  {images.length > 0 && (
                    <motion.div
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {images.map((image, index) => (
                        <motion.div
                          key={image.id}
                          className="relative group rounded-xl overflow-hidden shadow-md bg-gray-200"
                          style={{ paddingBottom: '100%' }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 md:group-hover:bg-opacity-30 transition-all" />
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            className="absolute top-2 right-2 bg-white hover:bg-red-50 text-red-500 rounded-full p-1.5 md:opacity-0 md:group-hover:opacity-100 transition-all shadow-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 md:py-5 rounded-2xl transition-all text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={rating === 0 || !review.trim()}
                >
                  Submit Feedback
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="text-center py-16 md:py-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-20 h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <motion.svg 
                  className="w-10 h-10 md:w-12 md:h-12 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </motion.svg>
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Thank You!</h3>
              <p className="text-gray-500 text-base md:text-lg">Your feedback has been submitted successfully</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FeedbackComponent;