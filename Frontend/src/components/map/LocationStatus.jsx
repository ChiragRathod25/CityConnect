import React from "react";
import "../../styles/LocationStatus.css";

const LocationStatus = ({
  userPosition,
  isLoadingLocation,
  locationError,
  onRetryLocation,
}) => {
  if (isLoadingLocation) {
    return (
      <div className="location-status loading">
        <div className="status-icon">
          <div className="location-spinner"></div>
        </div>
        <div className="status-content">
          <h4>Finding your location...</h4>
          <p>Please allow location access for better routing</p>
        </div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="location-status error">
        <div className="status-icon">⚠️</div>
        <div className="status-content">
          <h4>Location access denied</h4>
          <p>Using default location (Vadodara)</p>
          <button className="retry-btn" onClick={onRetryLocation}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  if (userPosition) {
    return (
      <div className="location-status success">
        <div
          className="instruction-overlay"
        >

        <div className="status-icon">📍</div>
        <div className="status-content">
          <h4>Location found</h4>
          <p>Ready to find routes from your location</p>
        </div>
        </div>
        <div className="instruction-overlay">
          <div className="instruction-content">
            <div className="instruction-icon">📍</div>
            <div>Click anywhere on the map to set your destination</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LocationStatus;
