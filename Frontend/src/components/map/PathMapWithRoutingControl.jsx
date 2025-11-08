import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import RoutingControl from "./RoutingControl";
import LocationStatus from "./LocationStatus";
import BusinessLocationForm from "./BusinessLocationForm";
import "../../styles/DeliveryMap.css";
import "../../styles/LeafletCustom.css";
import "../../styles/MapAnimations.css";

// Fix default marker icon (existing code)
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

// Custom icons (existing code)
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

const destinationIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadow,
  shadowSize: [41, 41],
  className: 'destination-marker'
});

const PathMapWithRoutingControl = ({ height = 30, width = 80, mode = "delivery", businessLocationData=null}) => {
  const defaultPosition = [22.3072, 73.1812];
  const [userPosition, setUserPosition] = useState(null);
  const [clickedMarkers, setClickedMarkers] = useState(businessLocationData);
  const [businessLocation, setBusinessLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState(null);

  // Determine routing points based on mode
  const getRoutingPoints = () => {
    console.log("Getting routing points with mode:", mode,businessLocationData);
    if (mode === "business") {
      return {
        from: userPosition || defaultPosition,
        to: businessLocation?.coordinates
      };
    } else {
      return {
        from: userPosition || defaultPosition,
        to: clickedMarkers
      };
    }
  };

  const { from, to } = getRoutingPoints(); // call it when then 

  useEffect(() => {
    handleMapClick(clickedMarkers);
  }, [from, to]);

  const handleMapClick = (pos) => {
    console.log('Map clicked at:', pos);
    if (mode === "business") {
      // In business mode, clicking sets business location
      handleBusinessLocationSelect(pos, {
        address: `Coordinates: ${pos[0].toFixed(6)}, ${pos[1].toFixed(6)}`,
        businessName: 'Selected Location'
      });
    } else {
      // Original delivery mode functionality
      setClickedMarkers(pos);
      setShowDirections(true);
    }
  };

  const handleBusinessLocationSelect = (coordinates, details) => {
    if (coordinates) {
      setBusinessLocation({
        coordinates,
        lat: coordinates[0],
        lng: coordinates[1],
        ...details
      });
      setShowDirections(true);
    } else {
      setBusinessLocation(null);
      setShowDirections(false);
    }
  };

  const handleUseCurrentLocation = (position, details) => {
    setBusinessLocation({
      coordinates: position,
      lat: position[0],
      lng: position[1],
      ...details
    });
    setShowDirections(true);
  };

  const handleRoutesFound = (routeData) => {
    console.log('Route data received:', routeData);
    setRouteInfo(routeData);
  };

  const closeDirections = () => {
    setShowDirections(false);
    setRouteInfo(null);
    if (mode === "delivery") {
      setClickedMarkers(null);
    }
  };

  const retryLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    getCurrentLocation();
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        console.log('User location found:', coords);
        setUserPosition(coords);
        setIsLoadingLocation(false);
        setLocationError(null);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError(`Unable to retrieve your location: ${error.message}`);
        setIsLoadingLocation(false);
        setUserPosition(defaultPosition);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="delivery-map-container">
     
   {/* <LocationStatus
        userPosition={userPosition}
        isLoadingLocation={isLoadingLocation}
        locationError={locationError}
        onRetryLocation={retryLocation}
      /> */}

      
      {mode === "business" && (
        <BusinessLocationForm
          onLocationSelect={handleBusinessLocationSelect}
          onUseCurrentLocation={handleUseCurrentLocation}
          userPosition={userPosition}
          selectedLocation={businessLocation}
        />
      )}
      

      <div className="map-wrapper">
        <MapContainer
          center={userPosition || defaultPosition}
          zoom={13}
          style={{ height: `${height}vh`, width: `${width}%` }}
          className="leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <ClickMarkerHandler onClick={handleMapClick} />
          <MapCenterHandler center={userPosition || defaultPosition} />

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

          {mode === "business" && businessLocation && (
            <Marker position={businessLocation.coordinates} icon={businessIcon}>
              <Popup>
                <div className="popup-content">
                  <h4>🏢 {businessLocation.businessName}</h4>
                  <p>{businessLocation.address}</p>
                  <p>Lat: {businessLocation.lat.toFixed(6)}</p>
                  <p>Lng: {businessLocation.lng.toFixed(6)}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {mode === "delivery" && clickedMarkers && (
            <Marker position={clickedMarkers} icon={destinationIcon}>
              <Popup>
                <div className="popup-content">
                  <h4>📍 Delivery Location</h4>
                  <p>Lat: {clickedMarkers[0].toFixed(6)}</p>
                  <p>Lng: {clickedMarkers[1].toFixed(6)}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {from && to && showDirections && (
            <RoutingControl from={from} to={to} onRoutesFound={handleRoutesFound} />
          )}
        </MapContainer>

        {showDirections && routeInfo && (
          <div className="directions-panel">
            <div className="directions-header">
              <div className="header-content">
                <h3>
                  {mode === "business" ? "🏢 Business Location Route" : "🚚 Delivery Route"}
                </h3>
                <div className="route-summary">
                  <div className="distance-badge">
                    📏 {routeInfo.distance}
                  </div>
                  <div className="time-badge">
                    ⏱️ {routeInfo.time}
                  </div>
                </div>
              </div>
              <button onClick={closeDirections} className="close-button">
                ✖
              </button>
            </div>

            <div className="directions-content">
              <ol className="directions-list">
                {routeInfo.steps.map((step, index) => (
                  <li key={index} className="direction-step step-slide-in">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <div className="step-instruction">{step.text}</div>
                      {step.distance > 0 && (
                        <div className="step-distance">
                          {step.distance > 1000 
                            ? `${(step.distance / 1000).toFixed(1)} km` 
                            : `${Math.round(step.distance)} m`}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="directions-footer">
              <button onClick={closeDirections} className="clear-route-btn">
                🗑️ Clear Route
              </button>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default PathMapWithRoutingControl;
