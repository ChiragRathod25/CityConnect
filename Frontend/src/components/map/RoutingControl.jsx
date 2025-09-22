import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

const RoutingControl = ({ from, to,onRoutesFound }) => {
  const map = useMap();

  useEffect(() => {
    const control = L.Routing.control({
      waypoints: [L.latLng(from), L.latLng(to)],
      routeWhileDragging: true,
      show: true,
      addWaypoints: true,
      draggableWaypoints: true,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 5 }],
        addWaypoints: true,
      },
      createMarker: function (i, wp, nWps) {
        return L.marker(wp.latLng).bindPopup(
          i === 0
            ? `
             <div className="popup-content">
                <h4>Your location</h4>
                <p>
                  Lat: ${from[0]}<br />
                  Lng: ${from[1]}
                </p>
              </div>
              `
            : i === nWps - 1
              ? `

              <div className="popup-content">
                <h4>Destination</h4>
                <p>
                  Lat: ${to[0]}<br />
                  Lng: ${to[1]}
                </p>
              </div>
              `
              : `Waypoint ${i + 1}`
        );
      },
    }).addTo(map);

     // Handle successful route calculation
    control.on("routesfound", function (e) {
      console.log('Route found:', e);
      const route = e.routes[0];
      const summary = route.summary;
      const distance = (summary.totalDistance / 1000).toFixed(1); // km
      const time = Math.ceil(summary.totalTime / 60); // minutes
      
      console.log(`Distance: ${distance} km, Time: ${time} mins`);

      // Process step-by-step instructions
      const steps = route.instructions.map((inst, index) => ({
        text: inst.text || `Step ${index + 1}`,
        distance: inst.distance || 0,
        type: inst.type || 'straight'
      }));

      // // Call parent callback with route data
      if (onRoutesFound) {
        onRoutesFound({
          steps,
          distance,
          time,
          coordinates: route.coordinates
        });
      }
    });

    // Handle routing errors
    control.on('routingerror', function (e) {
      console.error('Routing error:', e);
      
      // Create fallback straight line
      const fallbackLine = L.polyline([from, to], {
        color: '#ef4444',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10'
      }).addTo(map);

      // Provide basic fallback route info
      const distance = (map.distance(from, to) / 1000).toFixed(1);
      const estimatedTime = Math.ceil(distance * 2); // Rough estimate

      if (onRoutesFound) {
        onRoutesFound({
          steps: [{ text: `Direct route to destination (${distance} km)`, distance: distance * 1000 }],
          distance,
          time: estimatedTime,
          isEstimate: true
        });
      }
    });
    

    return () => map.removeControl(control);
  }, [from, to, map]);

  return null;
};

export default RoutingControl;
