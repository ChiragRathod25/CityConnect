import { useState } from 'react';
import { Upload, AlertCircle, Image, Trash2, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MultipleImagesUpload() {
  const [formData, setFormData] = useState({
    images: []
  });
  const [errors, setErrors] = useState({});

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setErrors({});

    // Validate each file
    const validFiles = [];
    let hasError = false;

    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors({ images: 'Please upload only image files' });
        hasError = true;
        break;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ images: 'Each image must be less than 5MB' });
        hasError = true;
        break;
      }

      validFiles.push(file);
    }

    if (hasError) return;

    // Check total images count (max 10 images)
    if (formData.images.length + validFiles.length > 10) {
      setErrors({ images: 'Maximum 10 images allowed' });
      return;
    }

    // Convert files to preview URLs
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (formData.images.length === 0) {
      setErrors({ images: 'Please upload at least one image' });
      return;
    }
    alert(`Successfully uploaded ${formData.images.length} image(s)!`);
  };

  return (
    <div className="bg-gray-50 flex items-center py-10 sm:pb-20 justify-center px-4">
      <div className="bg-white rounded-2xl border-2 shadow-xl p-8 w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Upload Business Images
          </h1>
          <p className="text-gray-600 text-sm">
            Showcase your business with multiple photos
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Image size={16} className="text-gray-500" />
            Business Images (Max 10)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition-all">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="business-images"
            />
            <label
              htmlFor="business-images"
              className="cursor-pointer block text-center"
            >
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Click to upload images</p>
              <p className="text-xs text-gray-500 mt-1">
                Upload multiple images of your business (Max 5MB each)
              </p>
            </label>
          </div>

          {/* Display uploaded images */}
          {formData.images.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                {formData.images.length} image(s) uploaded
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group"
                  >
                    <img
                      src={image}
                      alt={`Business ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {errors.images && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-red-500 text-xs"
            >
              <AlertCircle size={12} />
              {errors.images}
            </motion.div>
          )}

          {formData.images.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              onClick={handleSubmit}
            >
              Save Images ({formData.images.length})
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}