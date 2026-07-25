// src/components/smart-map/WorkerMarkers.tsx
import React from "react";
import { Marker } from "react-leaflet";
import { WorkerMapItem } from "./types";
import { buildWorkerIcon } from "./utils";
import { WorkerPopupCard } from "./PopupCard";

interface WorkerMarkersProps {
  workers: WorkerMapItem[];
  selectedWorkerId?: string | null;
  onSelectWorker?: (id: string) => void;
}

export default function WorkerMarkers({
  workers,
  selectedWorkerId,
  onSelectWorker,
}: WorkerMarkersProps) {
  return (
    <>
      {workers.map((w) => (
        <Marker
          key={w.id}
          position={[w.latitude, w.longitude]}
          icon={buildWorkerIcon(w.id === selectedWorkerId)}
          eventHandlers={{
            click: () => onSelectWorker?.(w.id),
          }}
        >
          <WorkerPopupCard worker={w} />
        </Marker>
      ))}
    </>
  );
}
