import React, { useEffect, useState } from "react";
import "../../styles/BusinessLocationForm.css";

const BusinessLocationForm = ({
  onLocationSelect,
  onUseCurrentLocation,
  userPosition,
  selectedLocation,
}) => {
  const [address, setAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    setError("")
  }, [address, businessName,onLocationSelect]);

  const handleFindAddress = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError("Please enter a valid address");
      return;
    }

    setIsGeocoding(true);
    setError("");

    try {
      // Using Nominatim (OpenStreetMap) geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const location = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        onLocationSelect(location, {
          address: data[0].display_name,
          businessName: businessName || data[0].name || "Business Location",
        });
        setAddress(data[0].display_name);
        setBusinessName(businessName || data[0].name || "Business Location");

        setError("");
      } else {
        setError(
          "Address not found. Please try a different address or select on map."
        );
      }
    } catch (err) {
      setError("Failed to find address. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleUseCurrentLocation = async (e) => {
    if (userPosition) {
      onUseCurrentLocation(userPosition, {
        address:
          address ||
          `Coordinates: ${userPosition[0].toFixed(
            6
          )}, ${userPosition[1].toFixed(6)}`,
        businessName: businessName || "My Business",
      });
      setAddress(
        address ||
          `Coordinates: ${userPosition[0].toFixed(
            6
          )}, ${userPosition[1].toFixed(6)}`
      );
      setBusinessName(businessName || "My Business");
      setError("");
    } else {
      setError(
        "Current location not available. Please allow location access or select on map."
      );
    }
  };

  const handleClear = () => {
    setAddress("");
    setBusinessName("");
    setError("");
    onLocationSelect(null);
  };
  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    //TODO: submit data to the backend using api
    //get business name from businessName state
    //get address from address state
    //get coordinates from selectedLocation state
    if (!businessName.trim()) {
      setError("Please enter a business name");
      return;
    }
    if (!address.trim()) {
        setError("Please enter a business address",businessName);
        return;
    }
    if (!selectedLocation) {
      setError("Please select a location on the map");
      return;
    }

    const { lat, lng } = selectedLocation || {};
    const businessData = {
      name: businessName,
      address: address,
      coordinates: { lat, lng },
    };

    // TODO: Send businessData to the backend API
    alert("Business details submitted:\n" + JSON.stringify(businessData, null, 2));
  };

  return (
    <div className="business-location-form">
      <div className="form-header">
        <h3>Set Your Business Location</h3>
        <p>Enter your business address or select a location on the map</p>
      </div>

      <form onSubmit={handleAddressSubmit} className="location-form">
        <div className="form-group">
          <label htmlFor="businessName">Business Name</label>
          <input
            id="businessName"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter business name"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Business Address</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your business address"
            className="form-input"
          />
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="form-actions">
          {/* <button 
            type="button" 
            onClick={(e)=>handleFindAddress(e)}
            className="btn btn-primary"
            disabled={isGeocoding || !address.trim()}
          >
            {isGeocoding ? (
              <>
                <span className="spinner"></span>
                Finding Address...
              </>
            ) : (
              <>
                📍 Find Address
              </>
            )}
          </button> */}

          <div
            
            style={{ display: "flex", gap: "10px",minWidth:"100%" }}
          >
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="btn btn-secondary"
              disabled={!userPosition}
            >
              📱 Use Current Location
            </button>

            {selectedLocation && (
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-outline"
              >
                🗑️ Clear Location
              </button>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            ✅ Submit Business Details
          </button>
        </div>
      </form>

      {selectedLocation && (
        <div className="selected-location">
          <div className="location-preview">
            <h4>📍 Selected Location</h4>
            <p>
              <strong>Name:</strong>{" "}
              {businessName || selectedLocation.businessName}
            </p>
            <p>
              <strong>Address:</strong> {address || selectedLocation.address}
            </p>
            <p>
              <strong>Coordinates:</strong> {selectedLocation.lat.toFixed(6)},{" "}
              {selectedLocation.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}

      <div className="instruction-text">
        💡 <strong>Tip:</strong> You can also click anywhere on the map to set
        your business location
      </div>
    </div>
  );
};

export default BusinessLocationForm;
