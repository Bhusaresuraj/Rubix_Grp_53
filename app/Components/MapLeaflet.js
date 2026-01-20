"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Pane, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLng } from "leaflet";
import { useCoal } from "@/app/context/CoalContext"; // Import the context hook
import AddLocationModal from "./AddLocationModal";

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

// Custom icons for different work statuses
const getStatusIcon = (status) => {
  const color = {
    ongoing: 'orange',
    stopped: 'red',
    completed: 'green'
  }[status] || 'grey';

  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32px" height="32px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    className: 'bg-transparent border-0',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};


// A small component to programmatically update the map's view
const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 13, {
      animate: true,
      duration: 1.5,
    });
  }, [position, map]);
  return null;
};

// Component to automatically fit map bounds to markers
const MapBoundsFitter = ({ locations }) => {
  const map = useMap();
  useEffect(() => {
    if (locations && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.latitude, loc.longitude]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [locations, map]);
  return null;
};

// Component to handle map clicks for adding new locations
const MapClickHandler = ({ isAdding, onMapClick }) => {
  const map = useMap();
  useEffect(() => {
    if (!isAdding) {
      map.getContainer().style.cursor = '';
      return;
    }
    map.getContainer().style.cursor = 'crosshair';
    const handler = (e) => {
      onMapClick(e.latlng);
    };
    map.on('click', handler);
    return () => {
      map.off('click', handler);
      map.getContainer().style.cursor = '';
    };
  }, [map, isAdding, onMapClick]);
  return null;
};

const MapLeaflet = () => {
  // --- STATE MANAGEMENT ---
  const { logs: mineLocations, loading, fetchData } = useCoal();
  const [mapCenter, setMapCenter] = useState([22.5726, 88.3639]); // Default center: India
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeLayers, setActiveLayers] = useState({
    workStatus: true,
    plantationZones: true,
    emissionHotspots: false,
  });

  // --- ADD LOCATION STATE ---
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newLocationModal, setNewLocationModal] = useState(null); // {lat, lng}

  // --- CONSTANTS ---
  const SEQUESTRATION_RATE = 2.5; // Metric tons of CO2 per hectare per year (example rate)

  // Estimated emissions based on intensity. In a real app, this would come from data.
  const EMISSION_VALUES = {
    high: 500,   // tCO2/year
    medium: 250, // tCO2/year
    low: 100,    // tCO2/year
  };

  // --- HELPERS ---
  const getNetImpactColor = (netImpact) => {
    if (netImpact > 100) return '#d73027'; // Red: High net emissions
    if (netImpact > 0) return '#fdae61';   // Orange: Moderate net emissions
    if (netImpact > -100) return '#fee08b';// Yellow: Near neutral
    return '#1a9850';                      // Green: Carbon negative
  };

  const getHotspotOptions = (intensity) => {
    switch (intensity) {
      case 'high': return { color: 'red', fillColor: '#f03', fillOpacity: 0.4, radius: 1500 };
      case 'medium': return { color: 'orange', fillColor: '#f90', fillOpacity: 0.3, radius: 1000 };
      case 'low': return { color: 'yellow', fillColor: '#ff0', fillOpacity: 0.2, radius: 500 };
      default: return { color: 'grey', radius: 200 };
    }
  };

  const handleSaveNewLocation = async (newLocation) => {
    if (fetchData) {
      await fetchData();
    }
    setNewLocationModal(null);
    setIsAddingMode(false);
    if (newLocation) {
      setSelectedLocation(newLocation);
      setMapCenter([newLocation.latitude, newLocation.longitude]);
    } else {
      // Handle case where newLocation is null after save if needed
    }
  };

  // --- STYLES ---
  const panelStyle = {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    zIndex: 1000,
    padding: '20px',
    background: 'rgba(30, 30, 30, 0.75)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    width: '350px',
    color: 'white',
    fontSize: '14px',
  };

  const togglePanelStyle = {
    ...panelStyle,
    bottom: 'auto',
    top: '20px',
    left: '20px',
    width: 'auto',
  };

  const toggleButtonStyle = (isActive) => ({
    padding: '8px 12px',
    margin: '0 5px',
    borderRadius: '8px',
    border: `1px solid ${isActive ? '#4CAF50' : 'rgba(255,255,255,0.3)'}`,
    background: isActive ? '#4CAF50' : 'rgba(0,0,0,0.3)',
    color: 'white',
    cursor: 'pointer',
  });

  const renderInfoPanelContent = () => {
    if (!selectedLocation) {
      return (
        <div>
          <h3 style={{ margin: '0 0 10px 0' }}>Decision Support Module</h3>
          <p>Click on a mine location to see details.</p>
          <h4 style={{ marginTop: '15px', borderTop: '1px solid #444', paddingTop: '10px' }}>Map Legend</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><strong style={{ display: 'block', marginTop: '10px' }}>Work Status Markers:</strong></li>
            <li><span style={{ color: 'orange', marginRight: '5px' }}>●</span> Ongoing Work</li>
            <li><span style={{ color: 'red', marginRight: '5px' }}>●</span> Stopped Work</li>
            <li><span style={{ color: 'green', marginRight: '5px' }}>●</span> Completed Work</li>
            <li><strong style={{ display: 'block', marginTop: '10px' }}>Net Impact Zones:</strong></li>
            <li>Colored circles show the net carbon impact for sites eligible for afforestation. Red indicates high emissions, while green indicates the site is carbon negative.</li>
          </ul>
        </div>
      );
    }

    const isRecommended = ['stopped', 'completed'].includes(selectedLocation.work_status);
    const estimatedOffset = selectedLocation.land_area * SEQUESTRATION_RATE;
    const emissions = isRecommended ? 0 : (EMISSION_VALUES[selectedLocation.emission_intensity] || 0);
    const netImpact = emissions - estimatedOffset;
    const neutralityStatus = netImpact <= 0 ? "Carbon Negative" : "Carbon Positive";

    return (
      <div>
        <h3 style={{ margin: '0 0 10px 0' }}>{selectedLocation.name}</h3>
        <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize', color: getStatusIcon(selectedLocation.work_status).options.html.match(/fill="([^"]+)"/)[1] }}>{selectedLocation.work_status}</span></p>
        
        {isRecommended && (
          <div style={{ marginTop: '15px', borderTop: '1px solid #444', paddingTop: '10px' }}>
            <h4 style={{ color: getNetImpactColor(netImpact) }}>Decision Summary</h4>
            <p><strong>Recommendation:</strong> Site is ideal for afforestation.</p>
            <p><strong>Est. Sequestration:</strong> {estimatedOffset.toFixed(2)} tCO₂/year</p>
            <p><strong>Net Carbon Impact:</strong> {netImpact.toFixed(2)} tCO₂/year</p>
            <p><strong>Neutrality Status:</strong> <span style={{ fontWeight: 'bold' }}>{neutralityStatus}</span></p>
          </div>
        )}
        {!isRecommended && (
          <div style={{ marginTop: '15px', borderTop: '1px solid #444', paddingTop: '10px' }}>
            <h4 style={{ color: '#fdae61' }}>Operational Analysis</h4>
            <p><strong>Recommendation:</strong> Monitor emissions. Plan for future afforestation post-closure.</p>
            <p><strong>Current Emissions:</strong> {emissions.toFixed(2)} tCO₂/year</p>
            <p><strong>Potential Sequestration:</strong> {estimatedOffset.toFixed(2)} tCO₂/year</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', height: "80vh", width: "100%", borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
      {/* --- LAYER TOGGLES --- */}
      <div style={togglePanelStyle}>
        <button style={toggleButtonStyle(activeLayers.workStatus)} onClick={() => setActiveLayers(p => ({...p, workStatus: !p.workStatus}))}>Work Status</button>
        <button style={toggleButtonStyle(activeLayers.plantationZones)} onClick={() => setActiveLayers(p => ({...p, plantationZones: !p.plantationZones}))}>Plantation Zones</button>
        <button style={toggleButtonStyle(activeLayers.emissionHotspots)} onClick={() => setActiveLayers(p => ({...p, emissionHotspots: !p.emissionHotspots}))}>Emission Hotspots</button>
        <button style={{...toggleButtonStyle(isAddingMode), marginLeft: 10, background: isAddingMode ? '#f59e0b' : 'rgba(245, 158, 11, 0.2)', color: isAddingMode ? 'white' : '#fcd34d', border: '1px solid #f59e0b'}} onClick={() => { setIsAddingMode(!isAddingMode); setNewLocationModal(null); }}>{isAddingMode ? 'Cancel Add' : '+ Add Location'}</button>
      </div>

      {/* --- INFO PANEL & LEGEND --- */}
      <div style={panelStyle}>{renderInfoPanelContent()}</div>

      {/* --- ADD LOCATION MODAL --- */}
      {newLocationModal && (
        <AddLocationModal
          location={newLocationModal}
          onClose={() => { setNewLocationModal(null); setIsAddingMode(false); }}
          onSave={handleSaveNewLocation}
        />
      )}

      {/* --- MAP CONTAINER --- */}
      <MapContainer center={mapCenter} zoom={7} style={{ height: "100%", width: "100%", background: '#1a1a1a' }}>
        <MapUpdater position={mapCenter} />
        {/* Define panes for layer stacking control */}
        <Pane name="emissionPane" style={{ zIndex: 450 }} />
        <Pane name="plantationPane" style={{ zIndex: 440 }} />

        <MapBoundsFitter locations={mineLocations} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Handle clicks for adding location */}
        <MapClickHandler isAdding={isAddingMode} onMapClick={(latlng) => { setNewLocationModal(latlng); }} />
        
        {!loading && mineLocations.length === 0 && (
           <div className="leaflet-bottom leaflet-right" style={{ pointerEvents: 'none', margin: '20px' }}>
             <div style={{ background: 'white', padding: '5px 10px', borderRadius: '4px', pointerEvents: 'auto' }}>
               No locations found
             </div>
           </div>
        )}

        {!loading && mineLocations.map(loc => {
          const lat = parseFloat(loc.latitude);
          const lng = parseFloat(loc.longitude);

          // --- CALCULATIONS ---
          const isPlantationCandidate = ['stopped', 'completed'].includes(loc.work_status);
          const emissions = isPlantationCandidate ? 0 : (EMISSION_VALUES[loc.emission_intensity] || 0);
          const sequestration = loc.land_area * SEQUESTRATION_RATE;
          const netImpact = emissions - sequestration;
          const netImpactColor = getNetImpactColor(netImpact);

          // Skip invalid coordinates
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
          <div key={loc.id}>
            {/* 1. Work Status Markers */}
            {activeLayers.workStatus && !isPlantationCandidate && (
              <Marker 
                position={[lat, lng]} 
                icon={getStatusIcon(loc.work_status)}
                eventHandlers={{ click: () => {
                  setSelectedLocation(loc);
                  // setMapCenter([lat, lng]); 
                }}}
              >
                <Popup>
                  <strong>{loc.name}</strong><br/>
                  Status: {loc.work_status}<br/>
                  Lat: {lat}, Lng: {lng}
                </Popup>
              </Marker>
            )}

            {/* 2. Net Impact & Afforestation Zone Layer */}
            {activeLayers.plantationZones && isPlantationCandidate && (
              <Circle 
                center={[lat, lng]} 
                pane="plantationPane"
                pathOptions={{ color: netImpactColor, fillColor: netImpactColor, fillOpacity: 0.5 }} 
                radius={Math.sqrt(loc.land_area * 10000 / Math.PI) * 2}
                eventHandlers={{ click: () => setSelectedLocation(loc) }}
              >
                <Popup>
                  <strong>Net Impact Analysis</strong><br/>
                  Emissions: {emissions.toFixed(2)} tCO₂/year<br/>
                  Sequestration: {sequestration.toFixed(2)} tCO₂/year<br/>
                  <strong>Net: {netImpact.toFixed(2)} tCO₂/year</strong>
                </Popup>
              </Circle>
            )}

            {/* 3. Emission Hotspot Layer */}
            {activeLayers.emissionHotspots && !isPlantationCandidate && (
              <Circle center={[lat, lng]} pane="emissionPane" {...getHotspotOptions(loc.emission_intensity)}>
                <Popup>Emission Intensity: {loc.emission_intensity}</Popup>
              </Circle>
            )}
          </div>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapLeaflet;