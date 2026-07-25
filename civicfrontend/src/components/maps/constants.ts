// src/components/smart-map/constants.ts
import { ComplaintSeverity } from "./types";

// Default map center: Mumbai
export const DEFAULT_CENTER: [number, number] = [19.0760, 72.8777];
export const DEFAULT_ZOOM = 12;

// Fixed color system — never use random colors for markers
export const SEVERITY_COLORS: Record<ComplaintSeverity, string> = {
  Critical: "#ef4444", // red-500
  High: "#f97316",     // orange-500
  Medium: "#eab308",   // yellow-500
  Resolved: "#22c55e", // green-500
};

export const SEVERITY_LABELS: Record<ComplaintSeverity, string> = {
  Critical: "🔴 Critical",
  High: "🟠 High",
  Medium: "🟡 Medium",
  Resolved: "🟢 Resolved",
};

export const WORKER_COLOR = "#3b82f6"; // blue-500
export const SELECTED_COLOR = "#ffffff"; // white ring for selected marker

// Light (premium government-grade) tile theme — Carto Voyager style, free, no API key
export const TILE_LIGHT = {
  url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
};

// Dark theme tile — for "Command Center" premium feel
export const TILE_DARK = {
  url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
};
