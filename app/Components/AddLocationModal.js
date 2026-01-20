"use client";

import { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/client";

export default function AddLocationModal({ location, onClose, onSave }) {
    const [form, setForm] = useState({ 
        name: '', 
        status: 'ongoing',
        land_area: '',
        emission_intensity: 'low'
    });
    const [isSaving, setIsSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        if (location) {
            // Pre-fill with a random value for convenience, user can edit
            const estimated = (Math.random() * 200 + 20).toFixed(2);
            setForm(prev => ({ 
                ...prev, 
                name: `New Site (${location.lat.toFixed(2)}, ${location.lng.toFixed(2)})`,
                land_area: estimated 
            }));
        }
    }, [location]);

    const handleSave = async () => {
        if (!location) return;
        setIsSaving(true);
        
        const isOngoing = form.status === 'ongoing';
        const landArea = parseFloat(form.land_area) || 0;

        const newLocData = {
            name: form.name,
            latitude: location.lat,
            longitude: location.lng,
            work_status: form.status,
            land_area: landArea,
            emission_intensity: form.emission_intensity,
            estimated_emissions: isOngoing ? (landArea * (form.emission_intensity === 'high' ? 5 : 2)) : 0,
        };
        
        const { data, error } = await supabase.from('mine_locations').insert([newLocData]).select();

        setIsSaving(false);

        if (error) {
            console.error("Error saving location:", JSON.stringify(error, null, 2));
            alert(`Error saving location: ${error.message || 'Check console for details'}`);
        } else {
            onSave(data && data[0]);
        }
    };

    return (
        <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 2000, background: '#1e293b', padding: 24, borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            width: 320, color: 'white'
        }}>
            <h3 style={{ marginTop: 0, color: '#4ade80' }}>Add New Site</h3>
            
            <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 5, color: '#cbd5e1' }}>Site Name</label>
                <input 
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sector 4 West"
                    disabled={isSaving}
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 5, color: '#cbd5e1' }}>Land Area (Ha)</label>
                <input 
                    type="number"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                    value={form.land_area}
                    onChange={e => setForm({ ...form, land_area: e.target.value })}
                    placeholder="Estimated Area"
                    disabled={isSaving}
                />
            </div>

            <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 5, color: '#cbd5e1' }}>Operational Status</label>
                <select 
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    disabled={isSaving}
                >
                    <option value="ongoing">Ongoing Work</option>
                    <option value="stopped">Stopped / Abandoned</option>
                    <option value="completed">Completed / Closed</option>
                </select>
            </div>

            <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, marginBottom: 5, color: '#cbd5e1' }}>Emission Intensity</label>
                <select 
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, background: '#0f172a', border: '1px solid #334155', color: 'white' }}
                    value={form.emission_intensity}
                    onChange={e => setForm({ ...form, emission_intensity: e.target.value })}
                    disabled={isSaving}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
                <button 
                    onClick={onClose}
                    disabled={isSaving}
                    style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', cursor: 'pointer' }}
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ flex: 1, padding: '10px', borderRadius: 8, background: '#0ea5a4', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', opacity: isSaving ? 0.7 : 1 }}
                >
                    {isSaving ? 'Saving...' : 'Save Location'}
                </button>
            </div>
        </div>
    );
}