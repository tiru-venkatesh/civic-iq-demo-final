// src/components/smart-map/Legend.tsx
import React from "react";
import { SEVERITY_COLORS, SEVERITY_LABELS, WORKER_COLOR } from "./constants";
import { ComplaintSeverity } from "./types";

const ORDER: ComplaintSeverity[] = ["Critical", "High", "Medium", "Resolved"];

export default function Legend() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 14,
        left: 14,
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.92)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        padding: "10px 12px",
        color: "white",
        fontSize: 11,
        boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, color: "#94a3b8", marginBottom: 6 }}>
        Legend
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {ORDER.map((sev) => (
          <div key={sev} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: SEVERITY_COLORS[sev],
                display: "inline-block",
                border: "1.5px solid white",
              }}
            />
            <span>{SEVERITY_LABELS[sev].replace(/^[^\s]+\s/, "")}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 5 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: WORKER_COLOR,
              display: "inline-block",
              border: "1.5px solid white",
            }}
          />
          <span>Field Worker</span>
        </div>
      </div>
    </div>
  );
}
