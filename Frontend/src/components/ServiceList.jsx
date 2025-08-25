import React, { useState } from "react";
import axios from "axios";
import axiosClient from "../utils/axiosClient";
import { toast } from "react-toastify";

const ServicesList = ({ business, userRole }) => {
  const [statuses, setStatuses] = useState(
    business?.services.reduce((acc, service) => {
      acc[service._id] = service.status;
      return acc;
    }, {})
  );

  const sellerAllowedTransitions = {
    pending: ["approved", "rejected"],
    approved: ["progress", "rejected"],
    progress: ["completed"],
    completed: ["progress"],
    rejected: [],
  };

  const userAllowedTransitions = {
    pending: [],
    approved: ["completed"],
    progress: ["completed"],
    completed: ["progress"],
    rejected: [],
  };

  const allowedTransitions =
    userRole === "seller" ? sellerAllowedTransitions : userAllowedTransitions;

  const handleStatusChange = async (serviceId, newStatus) => {
    if (!allowedTransitions[statuses[serviceId]]?.includes(newStatus)) {
      alert(
        `Invalid status transition from '${statuses[serviceId]}' to '${newStatus}'`
      );
      return;
    }

    try {
      const response = await axiosClient.put(`/service/${serviceId}/status`, {
        status: newStatus,
      });
      setStatuses((prev) => ({ ...prev, [serviceId]: newStatus }));
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="max-w-5xl max-h-screen overflow-y-auto mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🔧 Services Offered
      </h1>
      {business?.services.length === 0 ? (
        <p className="text-center text-gray-500">No services available.</p>
      ) : (
        <div className="grid min-h-screen overflow-y-auto md:grid-cols-2 lg:grid-cols-3 gap-8">
          {business?.services.map((service) => (
            <div
              key={service._id}
              className="bg-white p-6 shadow-lg rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-6 mb-4">
                <img
                  src={service.owner?.image || "https://via.placeholder.com/50"}
                  alt={service.owner?.username || "User"}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {service.owner?.username || "Unknown Owner"}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {service.owner?.email || "No Email"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-700 font-semibold">
                  Status: {service.status}
                </p>
                <p className="text-gray-600 text-sm mt-4">
                  <strong>Created At:</strong>{" "}
                  {new Date(service.createdAt).toDateString()}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  <strong>Expires At:</strong>{" "}
                  {new Date(service.expiresAt).toDateString()}
                </p>
                <div className="mt-4 flex justify-between items-center gap-4">
                  <select
                    className="p-2 border rounded-md w-full"
                    value={statuses[service._id]}
                    onChange={(e) =>
                      handleStatusChange(service._id, e.target.value)
                    }
                  >
                    <option value={statuses[service._id]} disabled>
                      {statuses[service._id]}
                    </option>
                    {allowedTransitions[statuses[service._id]]?.map(
                      (status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      )
                    )}
                  </select>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesList;
