import React from "react";
import { FileUpload } from "../common/FormComponents";
import { CreditCard, Camera, Store, Award, User } from "lucide-react";

const DocumentsUploadForm = ({ data, onChange, errors }) => (
  <div className="space-y-8">
    <h2 className="text-xl font-bold mb-4">Documents Upload</h2>

    <div className="grid md:grid-cols-2 gap-6">
      <FileUpload
        label="Government ID Proof *"
        icon={CreditCard}
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => onChange("govtIdProof", e.target.files[0])}
        error={errors.govtIdProof}
      />
      <FileUpload
        label="Selfie with ID *"
        icon={Camera}
        accept=".jpg,.jpeg,.png,.webp"
        onChange={(e) => onChange("selfieWithId", e.target.files[0])}
        error={errors.selfieWithId}
      />
      <FileUpload
        label="Business License (Optional)"
        icon={Award}
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => onChange("businessLicense", e.target.files[0])}
        error={errors.businessLicense}
      />
      <FileUpload
        label="Business Photo *"
        icon={Store}
        accept=".jpg,.jpeg,.png"
        onChange={(e) => onChange("businessPhoto", e.target.files[0])}
        error={errors.businessPhoto}
      />
      <FileUpload
        label="Professional Profile Photo *"
        icon={User}
        accept=".jpg,.jpeg,.png"
        onChange={(e) => onChange("professionalPhoto", e.target.files[0])}
        error={errors.professionalPhoto}
      />
    </div>
  </div>
);

export default DocumentsUploadForm;
