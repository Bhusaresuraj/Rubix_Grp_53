"use client";

import dynamic from "next/dynamic";

const MapLeaflet = dynamic(() => import("./MapLeaflet"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "80vh", width: "100%", borderRadius: "12px", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "white" }}>Loading Map...</p>
    </div>
  ),
});

export default MapLeaflet;