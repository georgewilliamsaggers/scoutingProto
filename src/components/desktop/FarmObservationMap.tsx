"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fields, getFieldById } from "@/lib/fields";
import { ObservationIcon } from "@/components/ObservationTypeIcon";
import {
  getFarmMapBounds,
  getFieldMapBounds,
  getObservationLabel,
  locationToFarmMapPoint,
  OBSERVATION_MAP_COLORS,
  ScoutingObservation,
} from "@/lib/observations";
import {
  getScoutingSessionById,
  getSessionDisplayTitle,
} from "@/lib/scouting-tasks";

interface FarmObservationMapProps {
  observations: ScoutingObservation[];
  fieldIds: string[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  fromDate: string;
  toDate: string;
  emptyMessage?: string;
}

const MAP_SIZE = 860;
const PLAYBACK_MS = 14000;

export function FarmObservationMap({
  observations,
  fieldIds,
  selectedId,
  onSelect,
  fromDate,
  toDate,
  emptyMessage,
}: FarmObservationMapProps) {
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [progress, setProgress] = useState(1);
  const [playing, setPlaying] = useState(false);

  const rangeStart = useMemo(
    () => new Date(`${fromDate}T00:00:00.000Z`).getTime(),
    [fromDate]
  );
  const rangeEnd = useMemo(
    () => new Date(`${toDate}T23:59:59.999Z`).getTime(),
    [toDate]
  );
  const rangeSpan = Math.max(1, rangeEnd - rangeStart);
  const playhead = rangeStart + progress * rangeSpan;

  useEffect(() => {
    setProgress(1);
    setPlaying(false);
  }, [fromDate, toDate, fieldIds.join("|")]);

  useEffect(() => {
    if (!playing) return;

    let frame = 0;
    let last = performance.now();

    function tick(now: number) {
      const delta = now - last;
      last = now;
      setProgress((current) => {
        const next = current + delta / PLAYBACK_MS;
        if (next >= 1) {
          setPlaying(false);
          return 1;
        }
        return next;
      });
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const visibleObservations = useMemo(
    () =>
      observations.filter(
        (observation) => new Date(observation.createdAt).getTime() <= playhead
      ),
    [observations, playhead]
  );

  useEffect(() => {
    if (!selectedId) return;
    const stillVisible = visibleObservations.some((entry) => entry.id === selectedId);
    if (!stillVisible) onSelect(null);
  }, [onSelect, selectedId, visibleObservations]);

  const clampScale = useCallback((scale: number) => {
    return Math.min(2.8, Math.max(0.7, scale));
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

  function togglePlayback() {
    if (progress >= 1) {
      setProgress(0);
    }
    setPlaying((current) => !current);
  }

  const selectedObservation = visibleObservations.find((entry) => entry.id === selectedId);
  const farmBounds = getFarmMapBounds(fieldIds);
  const visibleFields = fields.filter((field) => fieldIds.includes(field.id));

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-stone-200 bg-[#dfe8d6]">
      {fieldIds.length === 0 ? (
        <div className="flex h-full items-center justify-center p-6 text-sm text-stone-600">
          Select at least one field to plot observations on the map.
        </div>
      ) : observations.length === 0 && emptyMessage ? (
        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-stone-600">
          {emptyMessage}
        </div>
      ) : (
        <div
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
            <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
              <rect width="100" height="100" fill="#cfd9c4" />
              {visibleFields.map((field) => {
                const bounds = getFieldMapBounds(field.id);
                const center = locationToFarmMapPoint(
                  { latitude: bounds.centerLat, longitude: bounds.centerLng },
                  fieldIds
                );
                const width = (bounds.spanLng / farmBounds.spanLng) * 100;
                const height = (bounds.spanLat / farmBounds.spanLat) * 100;

                return (
                  <g key={field.id}>
                    <ellipse
                      cx={center.x}
                      cy={center.y}
                      rx={Math.max(6, width * 0.55)}
                      ry={Math.max(5, height * 0.55)}
                      fill="#8fb56e"
                      stroke="#6b8f4e"
                      strokeWidth="0.6"
                    />
                    <text
                      x={center.x}
                      y={center.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#1a3340"
                      fontSize="2.4"
                      fontWeight="600"
                    >
                      {field.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {visibleObservations.map((observation) => {
              if (!observation.location || !observation.fieldId) return null;

              const point = locationToFarmMapPoint(observation.location, fieldIds);
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
                    "observation-pin absolute z-10 -translate-x-1/2 -translate-y-full",
                    selected ? "z-20 scale-110" : "",
                  ].join(" ")}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  aria-label={`${getObservationLabel(observation.type)} observation`}
                >
                  <span
                    className={[
                      "flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-md",
                      selected ? "ring-2 ring-[#1a4a4e]/30" : "",
                    ].join(" ")}
                    style={{ backgroundColor: color }}
                  >
                    <ObservationIcon
                      type={observation.type}
                      className="h-3.5 w-3.5"
                      colorClass="text-white"
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {fieldIds.length > 0 && observations.length > 0 && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-stone-700 shadow-sm">
              {visibleObservations.length} of {observations.length} shown · Drag map to pan
            </span>
            <button
              type="button"
              onClick={() => {
                setTransform({ x: 0, y: 0, scale: 1 });
                onSelect(null);
              }}
              className="pointer-events-auto rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-stone-700 shadow-sm"
            >
              Reset
            </button>
          </div>

          {selectedObservation && (
            <div className="absolute inset-x-3 bottom-[5.75rem] rounded-xl border border-stone-200 bg-white/95 p-3 shadow-lg">
              <div className="flex items-start gap-3">
                <ObservationIcon
                  type={selectedObservation.type}
                  className="mt-0.5 h-4 w-4 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-stone-900">
                    {getObservationLabel(selectedObservation.type)}
                  </p>
                  <p className="text-xs text-stone-500">
                    {getFieldById(selectedObservation.fieldId ?? "")?.name ?? "Unknown field"} ·{" "}
                    {formatTimelineDate(selectedObservation.createdAt)}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    {sessionLabelForObservation(selectedObservation)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-stone-600">
                    {selectedObservation.note}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelect(null)}
                  className="shrink-0 rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                  aria-label="Close details"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <ObservationTimeline
            observations={observations}
            rangeStart={rangeStart}
            rangeSpan={rangeSpan}
            progress={progress}
            playing={playing}
            playhead={playhead}
            onTogglePlay={togglePlayback}
            onScrub={(next) => {
              setPlaying(false);
              setProgress(next);
            }}
          />
        </>
      )}
    </div>
  );
}

function ObservationTimeline({
  observations,
  rangeStart,
  rangeSpan,
  progress,
  playing,
  playhead,
  onTogglePlay,
  onScrub,
}: {
  observations: ScoutingObservation[];
  rangeStart: number;
  rangeSpan: number;
  progress: number;
  playing: boolean;
  playhead: number;
  onTogglePlay: () => void;
  onScrub: (progress: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function progressFromClientX(clientX: number) {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    onScrub(progressFromClientX(event.clientX));
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    onScrub(progressFromClientX(event.clientX));
  }

  return (
    <div
      className="absolute inset-x-3 bottom-3 z-30 rounded-xl border border-stone-200 bg-white/95 px-3 py-2.5 shadow-lg"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onTogglePlay}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a4a4e] text-white hover:bg-[#163c40]"
          aria-label={playing ? "Pause timeline" : "Play timeline"}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-stone-500">
            <span>{formatTimelineDate(rangeStart)}</span>
            <span className="text-stone-800">{formatTimelineDate(playhead)}</span>
            <span>{formatTimelineDate(rangeStart + rangeSpan)}</span>
          </div>
          <div
            ref={trackRef}
            className="relative h-6 cursor-ew-resize"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(event) => event.currentTarget.releasePointerCapture(event.pointerId)}
          >
            <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-stone-200" />
            <div
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#1a4a4e]"
              style={{ width: `${progress * 100}%` }}
            />
            {observations.map((observation) => {
              const created = new Date(observation.createdAt).getTime();
              const tick = (created - rangeStart) / rangeSpan;
              if (tick < 0 || tick > 1) return null;

              return (
                <span
                  key={observation.id}
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
                  style={{
                    left: `${tick * 100}%`,
                    backgroundColor: OBSERVATION_MAP_COLORS[observation.type],
                    opacity: created <= playhead ? 1 : 0.28,
                  }}
                />
              );
            })}
            <div
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#1a4a4e] shadow"
              style={{ left: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function sessionLabelForObservation(observation: ScoutingObservation) {
  if (!observation.sessionId) return "Not from a scouting session";
  const session = getScoutingSessionById(observation.sessionId);
  if (!session) return "Scouting session";
  return getSessionDisplayTitle(session);
}

function formatTimelineDate(value: number | string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
