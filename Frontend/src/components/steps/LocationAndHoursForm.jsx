import React from "react";
import { TimeSelect, FormSelect } from "../common/FormComponents";
import MapComponent from "../map/DeliveryMap"
import { CreditCard, Clock, Calendar } from "lucide-react";

const LocationAndHoursForm = ({ data, onChange, errors }) => {
  const weekDays = [
    { value: "", label: "Select weekly off" },
    { value: "sunday", label: "Sunday" },
    { value: "monday", label: "Monday" },
    { value: "none", label: "No weekly off" },
  ];

  const paymentOptions = ["Cash", "UPI", "Card", "Net Banking"];

  const togglePayment = (method) => {
    const updated = data.paymentMethods.includes(method)
      ? data.paymentMethods.filter((m) => m !== method)
      : [...data.paymentMethods, method];
    onChange("paymentMethods", updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Location & Hours</h2>

      <MapComponent
        onLocationSelect={(loc) => onChange("location", loc)}
        selectedLocation={data.location}
        error={errors.location}
      />

      <div className="grid md:grid-cols-3 gap-6">
        <TimeSelect
          label="Opening Time"
          icon={Clock}
          value={data.openingTime}
          onChange={(e) => onChange("openingTime", e.target.value)}
          error={errors.openingTime}
        />
        <TimeSelect
          label="Closing Time"
          icon={Clock}
          value={data.closingTime}
          onChange={(e) => onChange("closingTime", e.target.value)}
          error={errors.closingTime}
        />
        <FormSelect
          label="Weekly Off Day"
          icon={Calendar}
          options={weekDays}
          value={data.weeklyOff}
          onChange={(e) => onChange("weeklyOff", e.target.value)}
          error={errors.weeklyOff}
        />
      </div>

      <div>
        <label className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <CreditCard size={16} /> Payment Methods
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {paymentOptions.map((method) => (
            <button
              key={method}
              onClick={() => togglePayment(method)}
              className={`p-3 rounded-xl border-2 transition ${
                data.paymentMethods.includes(method)
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationAndHoursForm;
