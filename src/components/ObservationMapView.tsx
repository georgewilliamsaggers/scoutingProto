"use client";

import { useCallback, useRef, useState } from "react";
import {
  getObservationLabel,
  OBSERVATION_MAP_COLORS,
  observationLocationToMapPoint,
  ScoutingObservation,
} from "@/lib/observations";

interface ObservationMapViewProps {
  observations: ScoutingObservation[];
  fieldId: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  fullPage?: boolean;
}

const MAP_SIZE = 720;

export function ObservationMapView({
  observations,
  fieldId,
  selectedId,
  onSelect,
  fullPage = false,
}: ObservationMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  const clampScale = useCallback((scale: number) => {
    return Math.min(2.5, Math.max(0.75, scale));
  }, []);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("[data-map-marker]")) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: transform.x,
      originY: transform.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    setTransform((prev) => ({
      ...prev,
      x: drag.originX + (event.clientX - drag.startX),
      y: drag.originY + (event.clientY - drag.startY),
    }));
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.08 : 0.08;
    setTransform((prev) => ({
      ...prev,
      scale: clampScale(prev.scale + delta),
    }));
  }

  function resetView() {
    setTransform({ x: 0, y: 0, scale: 1 });
    onSelect(null);
  }

  const selectedObservation = observations.find((entry) => entry.id === selectedId);

  return (
    <div
      className={[
        "relative min-h-0 flex-1 overflow-hidden bg-[#dfe8d6]",
        fullPage ? "h-full rounded-none border-0" : "rounded-2xl border border-border",
      ].join(" ")}
    >
      <div
        ref={containerRef}
        className="h-full w-full touch-none overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <div
          className="absolute left-1/2 top-1/2 origin-center will-change-transform"
          style={{
            width: MAP_SIZE,
            height: MAP_SIZE,
            transform: `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px)) scale(${transform.scale})`,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full rounded-[1.75rem] shadow-inner ring-1 ring-black/5"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="fieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b8d4a0" />
                <stop offset="100%" stopColor="#8fb56e" />
              </linearGradient>
            </defs>
            <path
              d="M8 18 C18 8, 38 6, 58 10 C78 14, 92 24, 94 44 C96 64, 86 84, 64 92 C42 98, 20 92, 10 72 C4 52, 2 32, 8 18 Z"
              fill="url(#fieldGradient)"
              stroke="#6b8f4e"
              strokeWidth="1.2"
            />
            <path
              d="M14 24 C24 18, 42 16, 60 20"
              stroke="#ffffff"
              strokeOpacity="0.25"
              strokeWidth="0.8"
              fill="none"
            />
            <path
              d="M18 72 C34 78, 56 80, 78 70"
              stroke="#ffffff"
              strokeOpacity="0.18"
              strokeWidth="0.8"
              fill="none"
            />
          </svg>

          {observations.map((observation) => {
            if (!observation.location) return null;

            const point = observationLocationToMapPoint(observation.location, fieldId);
            const selected = observation.id === selectedId;
            const color = OBSERVATION_MAP_COLORS[observation.type];

            return (
              <button
                key={observation.id}
                type="button"
                data-map-marker
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(selected ? null : observation.id);
                }}
                className={[
                  "absolute -translate-x-1/2 -translate-y-full transition-transform active:scale-95",
                  selected ? "z-20 scale-110" : "z-10",
                ].join(" ")}
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                }}
                aria-label={`${getObservationLabel(observation.type)} observation`}
              >
                <span
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-md",
                    selected ? "ring-2 ring-navy/30" : "",
                  ].join(" ")}
                  style={{ backgroundColor: color }}
                >
                  <MapPinIcon />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-navy shadow-sm ring-1 ring-border/60">
          Drag to pan · Pinch or scroll to zoom
        </span>
        <button
          type="button"
          onClick={resetView}
          className="pointer-events-auto rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-navy shadow-sm ring-1 ring-border/60 transition-colors active:bg-white"
        >
          Reset
        </button>
      </div>

      {selectedObservation && (
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-border bg-surface-elevated/95 p-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: OBSERVATION_MAP_COLORS[selectedObservation.type] }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy">
                {getObservationLabel(selectedObservation.type)}
              </p>
              <p className="mt-0.5 line-clamp-2 text-sm text-muted">
                {selectedObservation.note}
              </p>
              <p className="mt-1 text-[11px] tabular-nums text-muted">
                {new Date(selectedObservation.createdAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="shrink-0 rounded-full p-1 text-muted transition-colors hover:bg-surface hover:text-navy"
              aria-label="Close details"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden="true"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
