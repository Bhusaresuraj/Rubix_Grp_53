"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const CoalContext = createContext();

export const CoalProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [sinks, setSinks] = useState([]); // Initialized as empty array
  const [plans, setPlans] = useState([]); // Initialized as empty array
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Optimized fetch to get all data in one function
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetching all three tables
      const { data: emissionData } = await supabase
        .from("emission_logs")
        .select("*")
        .order("recorded_at", { ascending: false });

      const { data: sinkData } = await supabase
        .from("sinks")
        .select("*")
        .order("recorded_at", { ascending: false });

      const { data: planData } = await supabase
        .from("afforestation_plans")
        .select("*")
        .order("target_year", { ascending: true });

      setLogs(emissionData || []);
      setSinks(sinkData || []);
      setPlans(planData || []);
    } catch (error) {
      console.error("Error fetching coal data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new log
  const addLog = async (newLog) => {
    const { data, error } = await supabase
      .from("emission_logs")
      .insert([newLog])
      .select();

    if (error) {
      console.error("Error adding log:", error);
      return { error };
    }

    if (data) setLogs((prev) => [data[0], ...prev]);
    return { data };
  };

  // Update an existing log
  const updateLog = async (id, updatedFields) => {
    const { data, error } = await supabase
      .from("emission_logs")
      .update(updatedFields)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating log:", error);
      return { error };
    }

    if (data) {
      setLogs((prev) => prev.map((log) => (log.id === id ? data[0] : log)));
    }
    return { data };
  };

  // Delete a log
  const deleteLog = async (id) => {
    const { error } = await supabase.from("emission_logs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting log:", error);
      return { error };
    }

    setLogs((prev) => prev.filter((log) => log.id !== id));
    return { error: null };
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <CoalContext.Provider 
      value={{ 
        logs, 
        sinks, 
        plans, 
        loading, 
        fetchData, 
        addLog, 
        updateLog, 
        deleteLog 
      }}
    >
      {children}
    </CoalContext.Provider>
  );
};

export const useCoal = () => {
  const context = useContext(CoalContext);
  if (context === undefined) {
    throw new Error('useCoal must be used within a CoalProvider');
  }
  return context;
};