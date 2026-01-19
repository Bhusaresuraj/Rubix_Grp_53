"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const CoalContext = createContext();

export const CoalProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch data once when the app loads
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("emission_logs")
      .select("*")
      .order("recorded_at", { ascending: false });
    
    if (!error) setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <CoalContext.Provider value={{ logs, setLogs, fetchData, loading }}>
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