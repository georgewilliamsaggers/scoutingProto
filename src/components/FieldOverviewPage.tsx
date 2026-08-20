"use client";

import { useMemo, useState } from "react";
import { ObservationMapView } from "@/components/ObservationMapView";
import { ObservationTypeBadge } from "@/components/ObservationTypeIcon";
import { formatHectares, getFieldById } from "@/lib/fields";
import {
  FIELD_OBSERVATION_FILTERS,
  FieldObservationFilter,
  filterFieldObservations,
  getFieldObservationsInLastDays,
} from "@/lib/field-observations";
import {
  generateObservationLocation,
  getObservationLabel,
  ScoutingObservation,
} from "@/lib/observations";

type ViewMode = "list" | "map";

interface FieldOverviewPageProps {
  fieldId: string;
  observations: ScoutingObservation[];
}

export function FieldOverviewPage({
  fieldId,
  observations,
}: FieldOverviewPageProps) {
  const field = getFieldById(fieldId);
  const [activeFilter, setActiveFilter] = useState<FieldObservationFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

  const recentObservations = useMemo(
    () => getFieldObservationsInLastDays(observations, 30),
    [observations]
  );

  const filteredObservations = useMemo(
    () => filterFieldObservations(recentObservations, activeFilter),
    [recentObservations, activeFilter]
  );

  const mapObservations = useMemo(
    () =>
      filteredObservations.map((observation) => ({
        ...observation,
        location:
          observation.location ??
          generateObservationLocation(fieldId, observation.id),
      })),
    [filteredObservations, fieldId]
  );

  if (!field) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border/60 px-7 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-snug text-navy">
              {field.crop} · {field.variety} · {formatHectares(field.hectares)}
            </p>
            <p className="mt-0.5 text-xs text-muted">Last 30 days</p>
          </div>
          <ViewModeToggle
            viewMode={viewMode}
            onChange={(mode) => {
              setViewMode(mode);
              setSelectedMapId(null);
            }}
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FIELD_OBSERVATION_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => {
                  setActiveFilter(filter.id);
                  setSelectedMapId(null);
                }}
                className={[
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  isActive
                    ? "bg-teal text-white"
                    : "bg-surface text-navy ring-1 ring-border hover:bg-surface-elevated",
                ].join(" ")}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {filteredObservations.length > 0 ? (
          viewMode === "list" ? (
            <div className="h-full overflow-y-auto px-7 py-4">
              <ul className="space-y-2.5">
                {filteredObservations.map((observation) => (
                  <ObservationHistoryRow
                    key={observation.id}
                    observation={observation}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex h-full min-h-0 flex-col px-5 py-4">
              <ObservationMapView
                observations={mapObservations}
                fieldId={fieldId}
                selectedId={selectedMapId}
                onSelect={setSelectedMapId}
                fullPage
              />
            </div>
          )
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-7 py-10 text-center">
            <p className="text-sm font-semibold text-navy">No observations found</p>
            <p className="mt-1 max-w-xs text-sm text-muted">
              {activeFilter === "all"
                ? "No observations have been logged for this field in the last 30 days."
                : `No ${FIELD_OBSERVATION_FILTERS.find((entry) => entry.id === activeFilter)?.label.toLowerCase()} observations in the last 30 days.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ViewModeToggle({
  viewMode,
  onChange,
}: {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div
      className="flex shrink-0 rounded-full bg-surface p-0.5 ring-1 ring-border"
      role="group"
      aria-label="View mode"
    >
      <ToggleButton
        label="List"
        selected={viewMode === "list"}
        onClick={() => onChange("list")}
      />
      <ToggleButton
        label="Map"
        selected={viewMode === "map"}
        onClick={() => onChange("map")}
      />
    </div>
  );
}

function ToggleButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
        selected
          ? "bg-teal text-white shadow-sm"
          : "text-muted hover:text-navy",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function ObservationHistoryRow({
  observation,
}: {
  observation: ScoutingObservation;
}) {
  return (
    <li className="rounded-xl border border-border/80 bg-surface-elevated px-4 py-3 shadow-sm">
      <div className="flex items-start gap-3">
        <ObservationTypeBadge type={observation.type} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-navy">
              {getObservationLabel(observation.type)}
            </p>
            <time
              dateTime={observation.createdAt}
              className="shrink-0 text-[11px] font-medium tabular-nums text-muted"
            >
              {formatHistoryDate(observation.createdAt)}
            </time>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted">{observation.note}</p>
        </div>
      </div>
    </li>
  );
}

function formatHistoryDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
