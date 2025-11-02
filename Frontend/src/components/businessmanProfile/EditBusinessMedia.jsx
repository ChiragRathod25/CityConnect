import React, { useState } from 'react';
import { ImageIcon, Upload, Trash2, AlertCircle, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MoveBackButton from '../ui/MoveBackButton';

const FileUpload = ({
  label,
  accept,
  onChange,
  icon: Icon,
  description,
  preview,
  error,
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
      {Icon && <Icon size={16} className="text-gray-500" />}
      {label}
    </label>
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
        error
          ? "border-red-500 bg-red-50"
          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
        id={label.replace(/\s+/g, "-").toLowerCase()}
      />
      <label
        htmlFor={label.replace(/\s+/g, "-").toLowerCase()}
        className="cursor-pointer block"
      >
        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 mx-auto rounded-lg object-cover shadow-md"
            />
            <p className="text-sm text-green-600 font-medium">
              File uploaded successfully
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-10 h-10 text-gray-400 mx-auto" />
            <div>
              <p className="text-gray-600 font-medium">Click to upload</p>
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
          </div>
        )}
      </label>
    </div>
    {error && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1 text-red-500 text-xs"
      >
        <AlertCircle size={12} />
        {error}
      </motion.div>
    )}
  </div>
);

const MediaUploadEditor = ({onBack}) => {
  const [logo, setLogo] = useState(null);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, logo: "File size must be less than 5MB" });
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, logo: "Invalid file type. Use JPG, PNG, or WebP" });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result);
      const newErrors = { ...errors };
      delete newErrors.logo;
      setErrors(newErrors);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = [];
    let hasError = false;

    for (const file of files) {
      if (file.size > maxSize) {
        setErrors({ ...errors, images: "One or more files exceed 5MB" });
        hasError = true;
        break;
      }
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, images: "Invalid file type detected" });
        hasError = true;
        break;
      }
      validFiles.push(file);
    }

    if (hasError) return;

    // Create previews for all valid files
    const readerPromises = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readerPromises).then((results) => {
      setImages([...images, ...results]);
      const newErrors = { ...errors };
      delete newErrors.images;
      setErrors(newErrors);
      setSaved(false);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setSaved(false);
  };

  const removeLogo = () => {
    setLogo(null);
    setSaved(false);
  };

  const handleSave = () => {
    console.log("Saving media:", { logo, images: images.length });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="relative z-10 pb-4 sm:pb-0">
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <MoveBackButton onClick={onBack} />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl p-4 sm:p-6 lg:p-8"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="text-white animate-bounce" size={30} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Business Media Editor</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-2">Upload your business logo and images</p>
          </div>

          {/* Media Upload Section */}
          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
              <div className="relative">
                <FileUpload
                  label="Business Logo"
                  icon={ImageIcon}
                  accept=".jpg,.jpeg,.png,.webp"
                  description="Upload your business logo (JPG, PNG, WebP - Max 5MB)"
                  onChange={handleLogoUpload}
                  preview={logo}
                  error={errors.logo}
                />
                
                {logo && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={removeLogo}
                    className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    type="button"
                  >
                    <X size={16} />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Multiple Images Upload */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 sm:p-6 border-2 border-gray-200">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <ImageIcon size={16} className="text-gray-500" />
                  Business Images
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 hover:bg-gray-50 transition-all">
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
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative group"
                      >
                        <img
                          src={image}
                          alt={`Business ${index + 1}`}
                          className="w-full h-24 sm:h-28 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full  transition-opacity shadow-lg"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </motion.div>
                    ))}
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
              </div>
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full mt-6 bg-gradient-to-r from-gray-600 to-slate-600 text-white font-semibold py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Save size={20} />
            Save Media
          </motion.button>

          {/* Success Message */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-center text-sm sm:text-base font-medium"
              >
                ✓ Media saved successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default MediaUploadEditor;