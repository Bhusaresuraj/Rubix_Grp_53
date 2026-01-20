"use client";

import React from 'react';
import { Circle, Popup } from 'react-leaflet';

export default function NetImpactLayer({ locations = [], active = true, SEQUESTRATION_RATE = 2.5, EMISSION_VALUES = {}, getNetImpactColor = () => '#999', adjustedRadii = {}, onSelect = () => {} }) {
  if (!active) return null;

  return (
    <>
      {locations.map((loc) => {
        const lat = parseFloat(loc.latitude);
        const lng = parseFloat(loc.longitude);
        if (!lat || !lng) return null;

        const isPlantationCandidate = ['stopped', 'completed'].includes(loc.work_status);
        const emissions = isPlantationCandidate ? 0 : (EMISSION_VALUES[loc.emission_intensity] || (loc.estimated_emissions || 0));
        const sequestration = (loc.land_area || 0) * SEQUESTRATION_RATE;
        const netImpact = emissions - sequestration;
        const color = getNetImpactColor(netImpact);
        const radius = adjustedRadii[loc.id] || Math.sqrt((loc.land_area || 0) * 10000 / Math.PI) * 2 || 120;

        return (
          <Circle key={`ni-${loc.id}`} center={[lat, lng]} pathOptions={{ color: color, fillColor: color, fillOpacity: 0.28 }} radius={radius} eventHandlers={{ click: () => onSelect(loc) }}>
            <Popup>
              <div style={{ width: 260 }}>
                <strong>{loc.name || 'Location'}</strong>
                <div>Emissions: {emissions.toFixed(2)} tCO₂/yr</div>
                <div>Sequestration: {sequestration.toFixed(2)} tCO₂/yr</div>
                <div><strong>Net impact: {netImpact.toFixed(2)} tCO₂/yr</strong></div>
                <div>Status: <strong style={{ color }}>{netImpact > 0 ? 'Carbon Positive' : netImpact < 0 ? 'Carbon Negative' : 'Near Neutral'}</strong></div>
              </div>
            </Popup>
          </Circle>
        );
      })}
    </>
  );
}
