import React from "react";
import { FormInput, FormSelect } from "../common/FormComponents";

import { Building2, Store, Target, FileText, Calendar } from "lucide-react";

const BusinessDetailsForm = ({ data, onChange, errors }) => {
  const businessTypes = [
    { value: "", label: "Select Business Type" },
    { value: "product", label: "Products Only" },
    { value: "service", label: "Services Only" },
    { value: "both", label: "Both Products & Services" },
  ];

  const businessCategories = [
    { value: "", label: "Select Category" },
    { value: "tailor", label: "Tailor & Clothing" },
    { value: "restaurant", label: "Restaurant & Food" },
    { value: "grocery", label: "Grocery & General Store" },
    { value: "salon", label: "Beauty & Salon" },
    { value: "other", label: "Other" },
  ];

  const yearsOptions = [
    { value: "", label: "Select Experience" },
    { value: "0-1", label: "Less than 1 year" },
    { value: "1-3", label: "1-3 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "5-10", label: "5-10 years" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Business Details</h2>

      <FormInput
        label="Business Name"
        icon={Store}
        value={data.businessName}
        onChange={(e) => onChange("businessName", e.target.value)}
        error={errors.businessName}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <FormSelect
          label="Business Type"
          icon={Building2}
          options={businessTypes}
          value={data.businessType}
          onChange={(e) => onChange("businessType", e.target.value)}
          error={errors.businessType}
        />
        <FormSelect
          label="Business Category"
          icon={Target}
          options={businessCategories}
          value={data.businessCategory}
          onChange={(e) => onChange("businessCategory", e.target.value)}
          error={errors.businessCategory}
        />
      </div>

      <FormSelect
        label="Years in Business"
        icon={Calendar}
        options={yearsOptions}
        value={data.yearsInBusiness}
        onChange={(e) => onChange("yearsInBusiness", e.target.value)}
        error={errors.yearsInBusiness}
      />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <FileText className="inline mr-1" size={16} />
          Business Description
        </label>
        <textarea
          rows={4}
          className="w-full border rounded-xl p-3"
          placeholder="Describe your business"
          value={data.businessDescription}
          onChange={(e) => onChange("businessDescription", e.target.value)}
        />
        {errors.businessDescription && (
          <p className="text-sm text-red-500 mt-1">{errors.businessDescription}</p>
        )}
      </div>
    </div>
  );
};

export default BusinessDetailsForm;
