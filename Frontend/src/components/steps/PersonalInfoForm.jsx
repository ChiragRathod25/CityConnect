import React from "react";
import { FormInput } from "../common/FormComponents";
import { User, Phone, Mail } from "lucide-react";

const PersonalInfoForm = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold mb-4">Personal Information</h2>
    <div className="grid md:grid-cols-2 gap-6">
      <FormInput
        label="Full Name"
        icon={User}
        value={data.fullName}
        onChange={(e) => onChange("fullName", e.target.value)}
        error={errors.fullName}
      />
      <FormInput
        label="Contact Number"
        icon={Phone}
        type="tel"
        value={data.contactNumber}
        onChange={(e) => onChange("contactNumber", e.target.value)}
        error={errors.contactNumber}
      />
      <FormInput
        label="Email Address"
        icon={Mail}
        type="email"
        value={data.email}
        onChange={(e) => onChange("email", e.target.value)}
        error={errors.email}
      />
    </div>
  </div>
);

export default PersonalInfoForm;
