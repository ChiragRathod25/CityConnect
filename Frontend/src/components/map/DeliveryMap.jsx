import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocationStatus from "./LocationStatus";
import "../../styles/DeliveryMap.css";
import "../../styles/LeafletCustom.css";
import "../../styles/MapAnimations.css";

// Fix default marker icon
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import userIconImg from "../../assets/profile-user.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ClickMarkerHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const MapCenterHandler = ({ center, zoom = 13 }) => {
  const map = useMapEvents({});
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

// Custom icons
const userIcon = new L.Icon({
  iconUrl: userIconImg,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: 'user-location-marker'
});

const businessIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10b981" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: 'business-location-marker'
});

/**
 * DeliveryMap Component - Simplified for Business Registration Form
 * 
 * @param {number} height - Map height in viewport height (vh) - default 60
 * @param {number} width - Map width in percentage (%) - default 100
 * @param {string} businessName - Name of the business (for display)
 * @param {function} onLocationSelect - Callback when location is confirmed (returns { lat, lng })
 * 
 * Usage in BusinessForm.jsx Modal:
 * <DeliveryMap
 *   businessName="My Business"
 *   onLocationSelect={(coords) => {
 *     handleMapLocationSelect(coords);
 *   }}
 *   height={60}
 *   width={100}
 * />
 */

const DeliveryMap = ({ 
  height = 60, 
  width = 100, 
  businessName = "Business Location",
  onLocationSelect = null,
  initialLocation = null
}) => {
  const defaultPosition = [22.3072, 73.1812]; // Vadodara, Gujarat
  const [userPosition, setUserPosition] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState( initialLocation ? {
    coordinates: [initialLocation.lat, initialLocation.lng],
    lat: initialLocation.lat,
    lng: initialLocation.lng
  } : null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);

  const handleMapClick = (pos) => {
    setSelectedLocation({
      coordinates: pos,
      lat: pos[0],
      lng: pos[1]
    });
  };

  const handleUseCurrentLocation = () => {
    if (userPosition) {
      setSelectedLocation({
        coordinates: userPosition,
        lat: userPosition[0],
        lng: userPosition[1]
      });
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation && onLocationSelect) {
      onLocationSelect({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      });
    }
  };

  const handleClearLocation = () => {
    setSelectedLocation(null);
  };

  const retryLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    getCurrentLocation();
  };

  // const getCurrentLocation = () => {
  //   if (!navigator.geolocation) {
  //     setLocationError("Geolocation is not supported by your browser");
  //     setIsLoadingLocation(false);
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const coords = [position.coords.latitude, position.coords.longitude];
  //       console.log('User location found:', coords);
  //       setUserPosition(coords);
  //       setIsLoadingLocation(false);
  //       setLocationError(null);
  //     },
  //     (error) => {
  //       console.error('Geolocation error:', error);
  //       setLocationError(`Unable to retrieve your location: ${error.message}`);
  //       setIsLoadingLocation(false);
  //       setUserPosition(defaultPosition);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 10000,
  //       maximumAge: 300000
  //     }
  //   );
  // };

  // useEffect(() => {
  //   getCurrentLocation();
  // }, []);

  const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    setLocationError("Geolocation is not supported by your browser");
    setIsLoadingLocation(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = [position.coords.latitude, position.coords.longitude];
      console.log("User location found:", coords);
      setUserPosition(coords);
      setIsLoadingLocation(false);
      setLocationError(null);
    },
    (error) => {
      console.error("Geolocation error:", error);

      let msg = "Unable to retrieve your location.";
      if (error.code === error.PERMISSION_DENIED) msg = "Please allow location access.";
      else if (error.code === error.POSITION_UNAVAILABLE) msg = "Location info unavailable.";
      else if (error.code === error.TIMEOUT) msg = "Location request timed out.";

      setLocationError(msg);
      setIsLoadingLocation(false);
      setUserPosition(defaultPosition);
    },
    {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 0
    }
  );
};

useEffect(() => {
  getCurrentLocation();
}, []);


  return (
    <div className="delivery-map-container">
      {/* Location Status Component */}
      <LocationStatus
      style={{ height: 'auto' }}
        userPosition={userPosition}
        isLoadingLocation={isLoadingLocation}
        locationError={locationError}
        onRetryLocation={retryLocation}
      />

    

      {/* Use Current Location Button */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
        <button
          onClick={handleUseCurrentLocation}
          disabled={!userPosition}
          style={{
            flex: 1,
            padding: '12px 20px',
            background: userPosition ? '#3b82f6' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: userPosition ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          📱 Use My Current Location
        </button>
        
        {selectedLocation && (
          <button
            onClick={handleClearLocation}
            style={{
              padding: '12px 20px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗑️ Clear
          </button>
        )}
      </div>

      {/* Map Container */}
      <div className="map-wrapper" style={{ marginBottom: '16px' }}>
        <MapContainer
          center={userPosition || defaultPosition}
          zoom={13}
          style={{ 
            height: `${height}vh`, 
            width: `${width}%`,
            borderRadius: '12px',
            overflow: 'hidden'
          }}
          className="leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <ClickMarkerHandler onClick={handleMapClick} />
          <MapCenterHandler center={userPosition || defaultPosition} />

          {/* User Location Marker */}
          {userPosition && (
            <Marker position={userPosition} icon={userIcon}>
              <Popup>
                <div className="popup-content">
                  <h4>📱 Your Location</h4>
                  <p>Lat: {userPosition[0].toFixed(6)}</p>
                  <p>Lng: {userPosition[1].toFixed(6)}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Business Location Marker */}
          {selectedLocation && (
            <Marker position={selectedLocation.coordinates} icon={businessIcon}>
              <Popup>
                <div className="popup-content">
              
                  <p>Lat: {selectedLocation.lat.toFixed(6)}</p>
                  <p>Lng: {selectedLocation.lng.toFixed(6)}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div style={{
          padding: '16px',
          background: '#f0fdf4',
          border: '2px solid #86efac',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>✅</span>
            <span style={{ fontWeight: 'bold', color: '#166534' }}>
              Location Selected
            </span>
          </div>
          <div style={{ fontSize: '14px', color: '#15803d' }}>
            <p style={{ margin: '4px 0', fontFamily: 'monospace' }}>
              <strong>Coordinates:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleConfirmLocation}
          disabled={!selectedLocation}
          style={{
            flex: 1,
            padding: '14px 24px',
            background: selectedLocation ? '#10b981' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: selectedLocation ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (selectedLocation) {
              e.target.style.background = '#059669';
              e.target.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedLocation) {
              e.target.style.background = '#10b981';
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          <span style={{ fontSize: '18px' }}>✓</span>
          Confirm Location
        </button>
      </div>

      {/* Help Text */}
      {!selectedLocation && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#92400e',
          textAlign: 'center'
        }}>
          💡 <strong>Tip:</strong> Click anywhere on the map above to select your business location, 
          or use the "Use My Current Location" button
        </div>
      )}
    </div>
  );
};

export default DeliveryMap;