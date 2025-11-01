import React from "react";
import { CheckCircle } from "lucide-react";

const ReviewAndSubmit = ({ data, onSubmit }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
      <CheckCircle size={20} className="text-green-600" /> Review & Submit
    </h2>

    <p className="text-gray-600">
      Review your information before submitting your business registration.
    </p>

    <button
      onClick={onSubmit}
      className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
    >
      Submit Registration
    </button>
  </div>
);

export default ReviewAndSubmit;
