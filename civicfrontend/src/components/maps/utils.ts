// src/components/smart-map/utils.ts
import L from "leaflet";
import { SEVERITY_COLORS, WORKER_COLOR } from "./constants";
import { ComplaintSeverity } from "./types";

/**
 * Builds a custom circular divIcon for a complaint marker,
 * colored by severity, with an optional pulsing ring for Critical items
 * and an optional highlighted ring when selected.
 */
export function buildComplaintIcon(
  severity: ComplaintSeverity,
  isSelected: boolean = false
): L.DivIcon {
  const color = SEVERITY_COLORS[severity];
  const pulse = severity === "Critical" ? "smartmap-pulse" : "";
  const selectedRing = isSelected
    ? "box-shadow:0 0 0 4px rgba(255,255,255,0.9), 0 0 0 7px " + color + ";"
    : "box-shadow:0 2px 6px rgba(0,0,0,0.35);";

  const html = `
    <div class="smartmap-marker ${pulse}" style="
      width:22px;height:22px;border-radius:9999px;
      background:${color};
      border:2px solid white;
      ${selectedRing}
    "></div>
  `;

  return L.divIcon({
    html,
    className: "smartmap-icon-wrapper",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
}

/**
 * Builds a custom marker icon for a field worker (blue truck/person dot).
 */
export function buildWorkerIcon(isSelected: boolean = false): L.DivIcon {
  const selectedRing = isSelected
    ? "box-shadow:0 0 0 4px rgba(255,255,255,0.9), 0 0 0 7px " + WORKER_COLOR + ";"
    : "box-shadow:0 2px 6px rgba(0,0,0,0.35);";

  const html = `
    <div style="
      width:26px;height:26px;border-radius:9999px;
      background:${WORKER_COLOR};
      border:2px solid white;
      display:flex;align-items:center;justify-content:center;
      font-size:13px;
      ${selectedRing}
    ">👷</div>
  `;

  return L.divIcon({
    html,
    className: "smartmap-icon-wrapper",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -16],
  });
}

/** Simple helper to format ETA text */
export function formatEta(minutes?: number | null): string {
  if (minutes === undefined || minutes === null) return "Not dispatched";
  if (minutes <= 0) return "Arrived";
  return `~${minutes} min`;
}
