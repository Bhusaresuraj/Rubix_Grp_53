"use client";

import React from 'react';
import { Pane, Circle, Popup } from 'react-leaflet';

export default function PlantationLayer({ locations = [], active = true, adjustedRadii = {}, SEQUESTRATION_RATE = 2.5, onSelect = () => {} }) {
  if (!active) return null;

  return (
    <Pane name="plantationPane" style={{ zIndex: 440 }}>
      {locations.map((loc) => {
        const lat = parseFloat(loc.latitude);
        const lng = parseFloat(loc.longitude);
        if (!lat || !lng) return null;

        // Determine plantation type
        const type = loc.plantation_type || ((loc.work_status === 'stopped' || loc.work_status === 'completed') ? 'recommended' : (loc.has_plantation ? 'existing' : 'planned'));
        const baseRadius = adjustedRadii[loc.id] || Math.sqrt((loc.land_area || 0) * 10000 / Math.PI) * 2 || 100;

        const styleByType = {
          existing: { color: '#0f9d58', fillColor: '#34d399', fillOpacity: 0.35, dashArray: '' },
          planned: { color: '#60a5fa', fillColor: '#7dd3fc', fillOpacity: 0.22, dashArray: '4 6' },
          recommended: { color: '#10b981', fillColor: '#86efac', fillOpacity: 0.15, dashArray: '6 8' },
        };

        const opts = styleByType[type] || styleByType.recommended;

        return (
          <Circle key={`pl-${loc.id}`} center={[lat, lng]} pathOptions={{ color: opts.color, fillColor: opts.fillColor, fillOpacity: opts.fillOpacity, dashArray: opts.dashArray }} radius={baseRadius} eventHandlers={{ click: () => onSelect(loc) }}>
            <Popup>
              <div style={{ width: 240 }}>
                <strong>{loc.name || 'Location'}</strong>
                <div>Plantation: <strong style={{ color: opts.color }}>{type}</strong></div>
                <div>Area: {(loc.land_area || 0).toFixed(2)} ha</div>
                <div>Sequestration rate: {SEQUESTRATION_RATE} tCO₂/ha/yr</div>
                <div>Annual absorption: {((loc.land_area || 0) * SEQUESTRATION_RATE).toFixed(2)} tCO₂/yr</div>
              </div>
            </Popup>
          </Circle>
        );
      })}
    </Pane>
  );
}
