"use client";

import { useMemo, useState } from "react";
import { ObservationMapView } from "@/components/ObservationMapView";
import {
  OBSERVATION_FILTER_OPTIONS,
  ObservationFilter,
  ScoutingObservation,
} from "@/lib/observations";

interface ObservationMapOverlayProps {
  observations: ScoutingObservation[];
  fieldId: string;
  onClose: () => void;
}

export function ObservationMapOverlay({
  observations,
  fieldId,
  onClose,
}: ObservationMapOverlayProps) {
  const [activeFilter, setActiveFilter] = useState<ObservationFilter>("all");
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

  const filteredObservations = useMemo(() => {
    if (activeFilter === "all") return observations;
    return observations.filter((observation) => observation.type === activeFilter);
  }, [activeFilter, observations]);

  const filterCounts = useMemo(() => {
    const counts: Partial<Record<ObservationFilter, number>> = {
      all: observations.length,
    };

    for (const observation of observations) {
      counts[observation.type] = (counts[observation.type] ?? 0) + 1;
    }

    return counts;
  }, [observations]);

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-surface-elevated">
      <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h2 className="text-lg font-bold text-navy">Field map</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-navy"
          aria-label="Close map"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="shrink-0 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2">
          {OBSERVATION_FILTER_OPTIONS.map((option) => {
            const count = filterCounts[option.id] ?? 0;
            if (option.id !== "all" && count === 0) return null;

            const selected = activeFilter === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setActiveFilter(option.id);
                  setSelectedMapId(null);
                }}
                aria-pressed={selected}
                className={[
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-[0.98]",
                  selected
                    ? "bg-navy text-white shadow-sm"
                    : "bg-surface-elevated text-muted ring-1 ring-border",
                ].join(" ")}
              >
                {option.label}
                <span
                  className={[
                    "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                    selected ? "bg-white/15 text-white" : "bg-surface text-navy/70",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {filteredObservations.length > 0 ? (
          <ObservationMapView
            observations={filteredObservations}
            fieldId={fieldId}
            selectedId={selectedMapId}
            onSelect={setSelectedMapId}
            fullPage
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-4 py-8 text-center">
            <p className="text-sm text-muted">
              No observations match this filter on the map.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
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
