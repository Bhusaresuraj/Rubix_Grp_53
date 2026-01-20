"use client";

import React from 'react';
import { Pane, Circle, Popup } from 'react-leaflet';

export default function EmissionLayer({ locations = [], active = true, getHotspotOptions = () => ({}), onSelect = () => {} }) {
  if (!active) return null;

  return (
    <Pane name="emissionPane" style={{ zIndex: 450 }}>
      {locations.map((loc) => {
        const lat = parseFloat(loc.latitude);
        const lng = parseFloat(loc.longitude);
        if (!lat || !lng) return null;
        const opts = getHotspotOptions(loc.emission_intensity);
        return (
          <Circle key={`em-${loc.id}`} center={[lat, lng]} pathOptions={{ color: opts.color || 'red', fillColor: opts.fillColor || '#f03', fillOpacity: opts.fillOpacity ?? 0.25 }} radius={opts.radius || 600} eventHandlers={{ click: () => onSelect(loc) }}>
            <Popup>
              <div style={{ width: 220 }}>
                <strong>{loc.name || 'Location'}</strong>
                <div>Emission level: <strong style={{ color: opts.color }}>{loc.emission_intensity || 'unknown'}</strong></div>
                <div>Major source: {loc.emission_source || loc.major_emission_source || 'Unknown'}</div>
                <div>Est. annual emissions: {(loc.estimated_emissions || 0).toLocaleString()} tCO₂/year</div>
              </div>
            </Popup>
          </Circle>
        );
      })}
    </Pane>
  );
}
