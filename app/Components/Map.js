"use client";

import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon missing in Leaflet with Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map = () => {
  // Jharia Coalfield Coordinates
  const position = [23.7485, 86.4111];

  // Green Overlay: Mock Afforestation Area Polygon
  const greenZone = [
    [23.7485, 86.4111],
    [23.7550, 86.4180],
    [23.7500, 86.4250],
    [23.7420, 86.4150],
  ];

  const greenOptions = { color: "green", fillColor: "#4caf50", fillOpacity: 0.5 };

  return (
    <div style={{ height: "500px", width: "100%", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marker for Jharia Coalfield */}
        <Marker position={position} icon={icon}>
          <Popup>
            <strong>Jharia Coalfield</strong> <br /> Major coal mining region.
          </Popup>
        </Marker>

        {/* Green Overlay for Afforestation */}
        <Polygon pathOptions={greenOptions} positions={greenZone}>
          <Popup>Afforestation Zone (Green Belt)</Popup>
        </Polygon>
      </MapContainer>
    </div>
  );
};

export default Map;