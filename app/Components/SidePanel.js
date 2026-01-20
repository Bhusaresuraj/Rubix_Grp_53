"use client";

import React from 'react';

export default function SidePanel({ selectedLocation, SEQUESTRATION_RATE = 2.5, EMISSION_VALUES = {} }) {
  const style = {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1200,
    width: 360,
    padding: 18,
    borderRadius: 12,
    background: 'rgba(12,17,23,0.6)',
    backdropFilter: 'blur(8px)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.06)'
  };

  if (!selectedLocation) {
    return (
      <div style={style}>
        <h3 style={{ margin: 0 }}>Decision Summary</h3>
        <p style={{ color: '#cbd5e1' }}>Click a location or hover a plantation zone to see recommendations, net impact and suggested actions.</p>
        
        <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 15 }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: 13, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Map Legend</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12, color: '#cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: 'orange', border: '1px solid rgba(255,255,255,0.2)' }}></span> Ongoing Work</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: 'red', border: '1px solid rgba(255,255,255,0.2)' }}></span> Stopped Work</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', opacity: 0.6 }}></span> Plantation Zone</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f03', opacity: 0.6 }}></span> Emission Hotspot</div>
          </div>
        </div>
      </div>
    );
  }

  const land = selectedLocation.land_area || 0;
  const isPlantationCandidate = ['stopped', 'completed'].includes(selectedLocation.work_status);
  const emissions = isPlantationCandidate ? 0 : (EMISSION_VALUES[selectedLocation.emission_intensity] || (selectedLocation.estimated_emissions || 0));
  const sequestration = land * SEQUESTRATION_RATE;
  const netImpact = emissions - sequestration;

  // Years to neutrality heuristic
  let yearsToNeutral = null;
  if (netImpact > 0 && sequestration > 0) yearsToNeutral = Math.max(1, Math.ceil(netImpact / sequestration));

  return (
    <div style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{selectedLocation.name}</h3>
        <div style={{ fontSize: 12, color: '#a3e635' }}>{selectedLocation.work_status}</div>
      </div>

      <div style={{ marginTop: 10, color: '#cbd5e1' }}>
        <div>Area: <strong>{land.toFixed(2)} ha</strong></div>
        <div>Emissions: <strong>{emissions.toFixed(2)} tCO₂/yr</strong></div>
        <div>Sequestration: <strong>{sequestration.toFixed(2)} tCO₂/yr</strong></div>
        <div style={{ marginTop: 8 }}><strong>Net impact:</strong> <span style={{ marginLeft: 6 }}>{netImpact.toFixed(2)} tCO₂/yr</span></div>
        <div style={{ marginTop: 6 }}><strong>Neutrality status:</strong> <span style={{ marginLeft: 6 }}>{netImpact > 0 ? 'Carbon Positive' : netImpact < 0 ? 'Carbon Negative' : 'Near Neutral'}</span></div>

        {yearsToNeutral && (
          <div style={{ marginTop: 8 }}><strong>Est. years to neutrality:</strong> <span style={{ marginLeft: 6 }}>{yearsToNeutral} year(s)</span></div>
        )}

        <div style={{ marginTop: 12, padding: 10, borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
          <h4 style={{ margin: '0 0 6px 0' }}>Recommendation</h4>
          {isPlantationCandidate ? (
            <div>Eligible for afforestation. Recommended action: prepare planting plan, source saplings, protect site from grazing and disturbances.</div>
          ) : (
            <div>Not yet eligible. Consider operational changes to cut emissions, and plan future afforestation where possible.</div>
          )}
        </div>
      </div>
    </div>
  );
}
