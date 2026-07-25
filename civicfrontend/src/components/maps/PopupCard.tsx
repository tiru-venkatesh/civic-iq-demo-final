// src/components/smart-map/PopupCard.tsx
import React from "react";
import { Popup } from "react-leaflet";
import { ComplaintMapItem, WorkerMapItem } from "./types";
import { SEVERITY_COLORS, SEVERITY_LABELS } from "./constants";
import { formatEta } from "./utils";

interface ComplaintPopupProps {
  complaint: ComplaintMapItem;
  onAssign?: (id: string) => void;
  onNavigate?: (id: string) => void;
}

export function ComplaintPopupCard({ complaint, onAssign, onNavigate }: ComplaintPopupProps) {
  const color = SEVERITY_COLORS[complaint.severity];

  return (
    <Popup>
      <div style={{ minWidth: 220, fontFamily: "inherit" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>{complaint.id}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color,
              background: `${color}1a`,
              border: `1px solid ${color}55`,
              borderRadius: 999,
              padding: "2px 8px",
            }}
          >
            {SEVERITY_LABELS[complaint.severity]}
          </span>
        </div>

        <h4 style={{ fontSize: 13, fontWeight: 700, margin: "2px 0 6px", color: "#0f172a" }}>
          {complaint.title}
        </h4>

        <p style={{ fontSize: 11, color: "#475569", margin: "0 0 8px" }}>{complaint.address}</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            fontSize: 10,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: 8,
            marginBottom: 8,
          }}
        >
          <div>
            <span style={{ color: "#94a3b8", display: "block" }}>AI Priority</span>
            <strong style={{ color: "#0f172a" }}>{complaint.priorityScore}/100</strong>
          </div>
          <div>
            <span style={{ color: "#94a3b8", display: "block" }}>Department</span>
            <strong style={{ color: "#0f172a" }}>{complaint.department}</strong>
          </div>
          <div>
            <span style={{ color: "#94a3b8", display: "block" }}>ETA</span>
            <strong style={{ color: "#0f172a" }}>{formatEta(complaint.etaMinutes)}</strong>
          </div>
          <div>
            <span style={{ color: "#94a3b8", display: "block" }}>Status</span>
            <strong style={{ color: "#0f172a" }}>{complaint.status}</strong>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onAssign?.(complaint.id)}
            style={{
              flex: 1,
              fontSize: 11,
              fontWeight: 700,
              padding: "6px 8px",
              borderRadius: 8,
              background: "#2563eb",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Assign Worker
          </button>
          <button
            onClick={() => onNavigate?.(complaint.id)}
            style={{
              flex: 1,
              fontSize: 11,
              fontWeight: 700,
              padding: "6px 8px",
              borderRadius: 8,
              background: "#f1f5f9",
              color: "#0f172a",
              border: "1px solid #cbd5e1",
              cursor: "pointer",
            }}
          >
            Navigate
          </button>
        </div>
      </div>
    </Popup>
  );
}

interface WorkerPopupProps {
  worker: WorkerMapItem;
}

export function WorkerPopupCard({ worker }: WorkerPopupProps) {
  return (
    <Popup>
      <div style={{ minWidth: 180 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>{worker.id}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#2563eb",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 999,
              padding: "2px 8px",
            }}
          >
            {worker.status}
          </span>
        </div>
        <h4 style={{ fontSize: 13, fontWeight: 700, margin: "2px 0 2px", color: "#0f172a" }}>
          👷 {worker.name}
        </h4>
        <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>{worker.role}</p>
        {worker.assignedComplaintId && (
          <p style={{ fontSize: 11, color: "#2563eb", marginTop: 6, fontWeight: 600 }}>
            Assigned to {worker.assignedComplaintId}
          </p>
        )}
      </div>
    </Popup>
  );
}
