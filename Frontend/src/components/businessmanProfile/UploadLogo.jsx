import { useState } from 'react';
import { Upload, AlertCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function BusinessmanLogoUpload() {
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setError('');

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-50 py-10 sm:pb-20 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border-2 shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Upload Your Business Logo
          </h1>
          <p className="text-gray-600 text-sm">
            Please upload a professional logo for your business.
          </p>
        </div>

        <FileUpload
          label="business-logo"
          accept="image/*"
          onChange={handleImageUpload}
          icon={User}
          description="PNG, JPG or JPEG (max. 5MB)"
          preview={imagePreview}
          error={error}
        />

        {imagePreview && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            onClick={() => alert('Image saved successfully!')}
          >
            Save Business Logo
          </motion.button>
        )}
      </div>
    </div>
  );
}