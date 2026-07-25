// src/components/smart-map/ComplaintMarkers.tsx
import React from "react";
import { Marker } from "react-leaflet";
import { ComplaintMapItem } from "./types";
import { buildComplaintIcon } from "./utils";
import { ComplaintPopupCard } from "./PopupCard";

interface ComplaintMarkersProps {
  complaints: ComplaintMapItem[];
  selectedComplaintId?: string | null;
  onSelectComplaint?: (id: string) => void;
  onAssign?: (id: string) => void;
  onNavigate?: (id: string) => void;
}

export default function ComplaintMarkers({
  complaints,
  selectedComplaintId,
  onSelectComplaint,
  onAssign,
  onNavigate,
}: ComplaintMarkersProps) {
  return (
    <>
      {complaints.map((c) => (
        <Marker
          key={c.id}
          position={[c.latitude, c.longitude]}
          icon={buildComplaintIcon(c.severity, c.id === selectedComplaintId)}
          eventHandlers={{
            click: () => onSelectComplaint?.(c.id),
          }}
        >
          <ComplaintPopupCard complaint={c} onAssign={onAssign} onNavigate={onNavigate} />
        </Marker>
      ))}
    </>
  );
}
