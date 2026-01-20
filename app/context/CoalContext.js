"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const CoalContext = createContext();

export const CoalProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
const [sinks, setSinks] = useState()
  // Fetch data once when the app loads
  // const fetchData = async () => {
  //   const { data, error } = await supabase
  //     .from("emission_logs")
  //     .select("*")
  //     .order("recorded_at", { ascending: false });
    
  //   if (!error) setLogs(data);
  //   setLoading(false);
  // };

  const fetchData = async () => {
  const { data: emissionData } = await supabase.from("emission_logs").select("*");
  const { data: sinkData } = await supabase.from("sinks").select("*");
  
  setLogs(emissionData || []);
  setSinks(sinkData || []); // Add a [sinks, setSinks] state to your context
  setLoading(false);
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

    // Optimistically update state or append new data
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
    <CoalContext.Provider value={{ logs, loading, fetchData, addLog, updateLog, deleteLog }}>
      {children}
    </CoalContext.Provider>
  );
};

// At the bottom of app/context/CoalContext.js
export const useCoal = () => {
  const context = useContext(CoalContext);
  if (context === undefined) {
    throw new Error('useCoal must be used within a CoalProvider');
  }
  return context;
};
// export const useCoal = () => useContext(CoalContext);