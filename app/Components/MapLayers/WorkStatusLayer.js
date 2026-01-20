"use client";

import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

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

export default function WorkStatusLayer({ locations = [], plantationZonesActive = false, onSelect = () => {} }) {
  return (
    <>
      {locations.map(loc => {
        const lat = parseFloat(loc.latitude);
        const lng = parseFloat(loc.longitude);
        if (isNaN(lat) || isNaN(lng)) return null;
        
        const isPlantationCandidate = ['stopped', 'completed'].includes(loc.work_status);
        
        // Only hide the work status marker if it's a plantation candidate AND the plantation layer is active.
        if (isPlantationCandidate && plantationZonesActive) return null;

        return (
          <Marker 
            key={loc.id}
            position={[lat, lng]} 
            icon={getStatusIcon(loc.work_status)}
            eventHandlers={{ click: () => onSelect(loc) }}
          >
            <Popup>
              <strong>{loc.name}</strong><br/>
              Status: {loc.work_status}<br/>
              Lat: {lat}, Lng: {lng}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
