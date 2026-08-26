"use client";

import { useMemo } from "react";
import { getFieldById } from "@/lib/fields";
import { sessionHasImportant } from "@/lib/field-observations";
import { ScoutingObservation } from "@/lib/observations";
import {
  getScoutName,
  getSessionDisplayTitle,
  ScoutingSession,
} from "@/lib/scouting-tasks";
import {
  FlagIcon,
  formatObservationTime,
  ObservationReviewSplit,
} from "@/components/desktop/ObservationReview";

interface ScoutingSessionOverviewPageProps {
  session: ScoutingSession;
  observations: ScoutingObservation[];
  onBack: () => void;
  onUpdateObservation: (id: string, patch: Partial<ScoutingObservation>) => void;
}

export function ScoutingSessionOverviewPage({
  session,
  observations,
  onBack,
  onUpdateObservation,
}: ScoutingSessionOverviewPageProps) {
  const sorted = useMemo(
    () =>
      [...observations].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [observations]
  );

  const field = getFieldById(session.fieldId);
  const importantCount = sorted.filter((observation) => observation.important).length;
  const sessionImportant = sessionHasImportant(sorted);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <header className="shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold text-[#1a4a4e] hover:underline"
        >
          ← Back to sessions
        </button>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-400">
              Scouting session
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
              {getSessionDisplayTitle(session)}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {formatSessionWhen(session)} · {field?.name ?? session.fieldId} ·{" "}
              {getScoutName(session.carriedOutBy)} · {sorted.length} observation
              {sorted.length === 1 ? "" : "s"}
            </p>
          </div>
          {sessionImportant && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
              <FlagIcon />
              {importantCount} important observation{importantCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </header>

      <ObservationReviewSplit
        observations={sorted}
        onUpdateObservation={onUpdateObservation}
        listFilters
        metaFor={(observation) => formatObservationTime(observation.createdAt)}
      />
    </div>
  );
}

function formatSessionWhen(session: ScoutingSession) {
  return new Date(session.startedAt).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
