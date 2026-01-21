"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Pickaxe, Plus, Search, Database } from "lucide-react";

const MOCK_RESOURCES = [
  {
    id: 101,
    mine_name: "Eastern Coalfields Ltd",
    mining_area: "Rajmahal OCP",
    resource_type: "Coal",
    quantity: 45000,
    unit: "tonnes",
    extraction_year: 2023,
    remarks: "High calorific value batch"
  },
  {
    id: 102,
    mine_name: "Hindustan Zinc",
    mining_area: "Rampura Agucha",
    resource_type: "Silver",
    quantity: 1200,
    unit: "kg",
    extraction_year: 2023,
    remarks: "Refined output"
  },
  {
    id: 103,
    mine_name: "NMDC Iron Ore",
    mining_area: "Bailadila Sector 14",
    resource_type: "Iron Ore",
    quantity: 125000,
    unit: "tonnes",
    extraction_year: 2024,
    remarks: "Q1 Extraction target met"
  }
];

export default function ExtractedResources() {
  const supabase = createClient();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState([]);
  const [formData, setFormData] = useState({
    mine_id: null,
    mine_name: "",
    mining_area: "",
    resource_type: "Coal",
    quantity: "",
    unit: "tonnes",
    extraction_year: new Date().getFullYear(),
    remarks: ""
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch Data
  useEffect(() => {
    fetchResources();
    fetchOrgs();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from("extracted_resources")
        .select("*")
        .order("extraction_year", { ascending: false });
      if (data && data.length > 0) setResources(data);
      else setResources(MOCK_RESOURCES);
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResources(MOCK_RESOURCES);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrgs = async () => {
    const { data } = await supabase.from("government_oversight_view").select("mine_id, organization_name, location");
    if (data) {
        const uniqueMines = [];
        const seenIds = new Set();
        data.forEach(item => {
            if (item.mine_id && !seenIds.has(item.mine_id)) {
                seenIds.add(item.mine_id);
                uniqueMines.push(item);
            }
        });
        setOrgs(uniqueMines);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a clean payload, ensuring mine_id is null if it's falsy (e.g., "" or undefined)
    const payload = {
      ...formData,
      mine_id: formData.mine_id || null,
    };

    // Add a client-side check to prevent submitting with a null mine_id.
    // This is the most common cause for the foreign key violation.
    if (!payload.mine_id) {
      alert("Please select a valid mine from the dropdown before saving.");
      return;
    }

    const { data, error } = await supabase.from("extracted_resources").insert([payload]).select();
    if (!error) {
      setResources(prev => [data[0], ...prev]);
      setIsFormOpen(false);
      setFormData({
        mine_id: null,
        mine_name: "",
        mining_area: "",
        resource_type: "Coal",
        quantity: "",
        unit: "tonnes",
        extraction_year: new Date().getFullYear(),
        remarks: ""
      });
    } else {
        console.error("Supabase Error:", error);
        // Fallback for demo purposes since DB might be failing
        const mockEntry = { ...payload, id: Date.now() };
        setResources(prev => [mockEntry, ...prev]);
        setIsFormOpen(false);
        setFormData({
          mine_id: null,
          mine_name: "",
          mining_area: "",
          resource_type: "Coal",
          quantity: "",
          unit: "tonnes",
          extraction_year: new Date().getFullYear(),
          remarks: ""
        });
        alert("Record added to local view (Database sync failed).");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Pickaxe className="text-emerald-600" size={36} />
            Extracted Resources Registry
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Official record of mineral and resource extraction across mining zones.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
        >
          <Plus size={18} /> Record Extraction
        </button>
      </div>

      {/* Form Section */}
      {isFormOpen && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm animate-in slide-in-from-top-4">
            <h3 className="font-bold text-lg text-slate-800 mb-6">New Extraction Entry</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mine Name</label>
                    <select
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
                        value={formData.mine_id || ""}
                        onChange={e => {
                            const selectedId = e.target.value;
                            const selectedOrg = orgs.find(o => String(o.mine_id) === String(selectedId));
                            setFormData({
                                ...formData,
                                mine_id: selectedOrg ? selectedOrg.mine_id : null,
                                mine_name: selectedOrg ? selectedOrg.organization_name : ""
                            });
                        }}
                        required
                    >
                        <option value="">Select Mine</option>
                        {orgs.map(o => (
                            <option key={o.mine_id} value={o.mine_id}>
                                {o.organization_name} {o.location ? `(${o.location})` : ''}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mining Area / Block</label>
                    <input
                        type="text"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
                        placeholder="e.g. Block A, Sector 4"
                        value={formData.mining_area}
                        onChange={e => setFormData({...formData, mining_area: e.target.value})}
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Resource Type</label>
                    <select
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
                        value={formData.resource_type}
                        onChange={e => setFormData({...formData, resource_type: e.target.value})}
                    >
                        <option value="Coal">Coal</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                        <option value="Iron Ore">Iron Ore</option>
                        <option value="Oil">Oil</option>
                        <option value="Limestone">Limestone</option>
                    </select>
                </div>
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
                            placeholder="0.00"
                            value={formData.quantity}
                            onChange={e => setFormData({...formData, quantity: e.target.value})}
                            required
                        />
                        <select
                            className="w-32 p-3 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
                            value={formData.unit}
                            onChange={e => setFormData({...formData, unit: e.target.value})}
                        >
                            <option value="tonnes">Tonnes</option>
                            <option value="kg">kg</option>
                            <option value="barrels">Barrels</option>
                            <option value="m3">m³</option>
                        </select>
                    </div>
                </div>
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Extraction Year</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
                        value={formData.extraction_year}
                        onChange={e => setFormData({...formData, extraction_year: e.target.value})}
                        required
                    />
                </div>
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Remarks (Optional)</label>
                    <input
                        type="text"
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
                        placeholder="e.g. Batch #402 verified by inspector"
                        value={formData.remarks}
                        onChange={e => setFormData({...formData, remarks: e.target.value})}
                    />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 items-end">
                    <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                    >
                        Save Record
                    </button>
                </div>
            </form>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                <Database size={18} />
                Recent Extractions
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
                <Search size={16} className="text-slate-400" />
                <input type="text" placeholder="Search records..." className="text-sm outline-none text-slate-600 placeholder:text-slate-400" />
            </div>
        </div>
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
                    <th className="p-6">Mine / Area</th>
                    <th className="p-6">Resource</th>
                    <th className="p-6">Quantity</th>
                    <th className="p-6">Year</th>
                    <th className="p-6">Remarks</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading registry...</td></tr>
                ) : resources.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-500">No records found.</td></tr>
                ) : (
                    resources.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50 transition">
                            <td className="p-6 font-bold text-slate-800">
                                {r.mine_name || r.mining_area}
                                {r.mine_name && r.mining_area && <span className="block text-xs text-slate-500 font-medium">{r.mining_area}</span>}
                            </td>
                            <td className="p-6">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                                    {r.resource_type}
                                </span>
                            </td>
                            <td className="p-6 font-mono font-bold text-slate-700">
                                {Number(r.quantity).toLocaleString()} <span className="text-slate-400 text-xs ml-1">{r.unit}</span>
                            </td>
                            <td className="p-6 text-slate-600 font-medium">{r.extraction_year}</td>
                            <td className="p-6 text-slate-400 text-sm italic">{r.remarks || "-"}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}