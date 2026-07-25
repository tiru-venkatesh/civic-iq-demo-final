// src/components/smart-map/SmartMap.tsx
import React, { useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { SmartMapProps } from "./types";
import { DEFAULT_CENTER, DEFAULT_ZOOM, TILE_LIGHT, TILE_DARK } from "./constants";
import ComplaintMarkers from "./ComplaintMarkers";
import WorkerMarkers from "./WorkerMarkers";
import Legend from "./Legend";

/**
 * SmartMap — Civic-IQ premium "Command Center" map.
 * Built on Leaflet + OpenStreetMap (Carto tiles). No API key, no billing.
 *
 * Usage:
 *   <SmartMap complaints={complaints} workers={workers} />
 */
export default function SmartMap({
  complaints,
  workers = [],
  selectedComplaintId = null,
  onSelectComplaint,
  onSelectWorker,
  heightClass = "h-[500px]",
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  darkMode = true,
  showLegend = true,
}: SmartMapProps) {
  const [isDark, setIsDark] = useState(darkMode);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const tile = isDark ? TILE_DARK : TILE_LIGHT;

  const criticalCount = complaints.filter((c) => c.severity === "Critical").length;

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-800 shadow-xl`}>
      {/* Pulse animation for critical markers */}
      <style>{`
        @keyframes smartmap-pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.55); }
          70% { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        .smartmap-pulse {
          animation: smartmap-pulse-ring 1.8s infinite;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 14px !important;
          padding: 4px !important;
        }
        .leaflet-popup-content {
          margin: 10px 12px !important;
        }
      `}</style>

      {/* Top status bar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live</span>
          {criticalCount > 0 && (
            <span className="ml-1 text-red-300">• {criticalCount} Critical</span>
          )}
        </div>

        <button
          onClick={() => setIsDark((d) => !d)}
          className="pointer-events-auto bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-lg cursor-pointer transition-colors"
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        style={{ height: "100%", width: "100%", background: isDark ? "#0f172a" : "#e2e8f0" }}
      >
        <TileLayer attribution={tile.attribution} url={tile.url} />
        <ZoomControl position="bottomright" />

        <ComplaintMarkers
          complaints={complaints}
          selectedComplaintId={selectedComplaintId}
          onSelectComplaint={onSelectComplaint}
        />

        <WorkerMarkers
          workers={workers}
          selectedWorkerId={selectedWorkerId}
          onSelectWorker={(id) => {
            setSelectedWorkerId(id);
            onSelectWorker?.(id);
          }}
        />
      </MapContainer>

      {showLegend && <Legend />}
    </div>
  );
}
