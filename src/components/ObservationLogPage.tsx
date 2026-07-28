"use client";

import { useState } from "react";
import {
  DiseaseObservationDetails,
  getDiseaseDisplayName,
  getObservationLabel,
  getWeedDisplayName,
  ScoutingObservation,
  WeedObservationDetails,
} from "@/lib/observations";

interface ObservationLogPageProps {
  observations: ScoutingObservation[];
}

export function ObservationLogPage({ observations }: ObservationLogPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const timelineItems = [...observations].reverse();

  if (observations.length === 0) {
    return (
      <div className="flex h-full flex-col px-7 pt-3 pb-4">
        <h2 className="mb-2 text-xl font-bold text-navy">Field log</h2>
        <p className="text-sm text-muted">
          Observations you log during this session will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col px-7 pt-3 pb-4">
      <h2 className="mb-4 shrink-0 text-xl font-bold text-navy">Field log</h2>

      <div className="min-h-0 flex-1 overflow-y-auto -mx-1 px-1">
        <ul className="space-y-0 pb-2">
          {timelineItems.map((observation, index) => {
            const expanded = expandedId === observation.id;
            const typeLabel = getObservationLabel(observation.type);
            const isLast = index === timelineItems.length - 1;

            return (
              <li key={observation.id} className="relative flex gap-3">
                <div className="relative flex w-12 shrink-0 flex-col items-center pt-0.5">
                  {!isLast && (
                    <div
                      className="absolute top-[1.625rem] bottom-0 w-px bg-border"
                      aria-hidden="true"
                    />
                  )}
                  <time
                    dateTime={observation.createdAt}
                    className="text-[11px] font-medium tabular-nums text-muted"
                  >
                    {formatLogTime(observation.createdAt)}
                  </time>
                  <span
                    className="relative z-10 mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-teal bg-surface-elevated"
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0 flex-1 pb-4">
                  <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-sm">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(expanded ? null : observation.id)
                      }
                      className="flex w-full items-start gap-2 px-3.5 py-3 text-left transition-colors hover:bg-surface"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-navy">{typeLabel}</p>
                        {!expanded && (
                          <CollapsedSummary observation={observation} />
                        )}
                      </div>
                      <ChevronIcon expanded={expanded} />
                    </button>

                    {expanded && (
                      <div className="border-t border-border/60 bg-surface px-3.5 py-3">
                        <ExpandedDetails observation={observation} />
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function CollapsedSummary({ observation }: { observation: ScoutingObservation }) {
  if (observation.type === "disease" && observation.diseaseDetails) {
    return <DiseaseCollapsedSummary details={observation.diseaseDetails} />;
  }

  if (observation.type === "weed" && observation.weedDetails) {
    return <WeedCollapsedSummary details={observation.weedDetails} />;
  }

  if (observation.note) {
    return (
      <p className="mt-0.5 line-clamp-2 text-sm text-muted">{observation.note}</p>
    );
  }

  return null;
}

function DiseaseCollapsedSummary({
  details,
}: {
  details: DiseaseObservationDetails;
}) {
  const diseaseName = getDiseaseDisplayName(details);
  const plantsAffected = details.plantsAffectedPercent.trim();

  let summary: string | null = null;

  if (diseaseName && plantsAffected) {
    summary = `${diseaseName} affecting ${plantsAffected} percent of plants`;
  } else if (diseaseName) {
    summary = diseaseName;
  } else if (plantsAffected) {
    summary = `Affecting ${plantsAffected} percent of plants`;
  }

  return (
    <div className="mt-1.5 space-y-2">
      {summary && <p className="text-sm text-muted">{summary}</p>}
      {details.needsAction && (
        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-red-200">
          Needs action
        </span>
      )}
    </div>
  );
}

function WeedCollapsedSummary({
  details,
}: {
  details: WeedObservationDetails;
}) {
  const weedName = getWeedDisplayName(details);
  const parts = [
    weedName,
    details.densityClass && `${details.densityClass.toLowerCase()} density`,
    details.weedGrowthStage && details.weedGrowthStage.toLowerCase(),
  ].filter(Boolean);

  return (
    <p className="mt-1.5 text-sm text-muted">
      {parts.length > 0 ? parts.join(" · ") : "Weed observation logged"}
    </p>
  );
}

function ExpandedDetails({ observation }: { observation: ScoutingObservation }) {
  if (observation.type === "disease" && observation.diseaseDetails) {
    return <DiseaseExpandedDetails details={observation.diseaseDetails} />;
  }

  if (observation.type === "weed" && observation.weedDetails) {
    return <WeedExpandedDetails details={observation.weedDetails} />;
  }

  return (
    <>
      {observation.note && (
        <p className="text-sm leading-relaxed text-navy">{observation.note}</p>
      )}

      {observation.voiceNoteDetails && (
        <>
          <audio
            src={observation.voiceNoteDetails.audioUrl}
            controls
            className="mt-3 w-full"
          />
          {(observation.voiceNoteDetails.media ?? []).length > 0 && (
            <MediaGrid
              items={(observation.voiceNoteDetails.media ?? []).filter(
                (item) => item.type === "image"
              )}
            />
          )}
        </>
      )}

      {(observation.otherDetails?.media ?? []).length > 0 && (
        <MediaGrid items={observation.otherDetails?.media ?? []} />
      )}
    </>
  );
}

function DiseaseExpandedDetails({
  details,
}: {
  details: DiseaseObservationDetails;
}) {
  return (
    <>
      <dl className="space-y-1.5 text-sm">
        {details.severity && (
          <DetailRow label="Severity" value={details.severity} />
        )}
        {details.symptomLocation && (
          <DetailRow label="Symptom location" value={details.symptomLocation} />
        )}
        {details.lesionType && (
          <DetailRow label="Lesion type" value={details.lesionType} />
        )}
        {details.areaAffectedPercent && (
          <DetailRow
            label="Area affected"
            value={`${details.areaAffectedPercent}%`}
          />
        )}
        <DetailRow
          label="Sample taken"
          value={details.sampleTaken ? "Yes" : "No"}
        />
        {details.otherNotes && (
          <div>
            <dt className="font-medium text-navy/70">Other notes</dt>
            <dd className="mt-0.5 leading-relaxed text-navy">{details.otherNotes}</dd>
          </div>
        )}
      </dl>

      {details.media.length > 0 && <MediaGrid items={details.media} />}
    </>
  );
}

function WeedExpandedDetails({
  details,
}: {
  details: WeedObservationDetails;
}) {
  const weedName = getWeedDisplayName(details);
  const heightRange =
    details.heightMinCm && details.heightMaxCm
      ? `${details.heightMinCm}–${details.heightMaxCm} cm`
      : details.heightMinCm
        ? `${details.heightMinCm} cm min`
        : details.heightMaxCm
          ? `${details.heightMaxCm} cm max`
          : null;

  return (
    <>
      <dl className="space-y-1.5 text-sm">
        {weedName && <DetailRow label="Weed" value={weedName} />}
        {details.weedGroup && (
          <DetailRow label="Weed group" value={details.weedGroup} />
        )}
        {details.weedGrowthStage && (
          <DetailRow label="Growth stage" value={details.weedGrowthStage} />
        )}
        {details.densityClass && (
          <DetailRow label="Density class" value={details.densityClass} />
        )}
        {details.distributionPattern && (
          <DetailRow label="Distribution pattern" value={details.distributionPattern} />
        )}
        {heightRange && <DetailRow label="Height" value={heightRange} />}
      </dl>
      {details.media.length > 0 && <MediaGrid items={details.media} />}
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-navy/70">{label}</dt>
      <dd className="text-navy">{value}</dd>
    </div>
  );
}

function MediaGrid({
  items,
}: {
  items: { id: string; type: string; url: string; name: string; pendingAnalysis?: boolean }[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) =>
        item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.id}
            src={item.url}
            alt={item.name}
            className="h-24 w-24 rounded-lg object-cover ring-1 ring-border"
          />
        ) : (
          <div
            key={item.id}
            className="relative h-24 w-24 overflow-hidden rounded-lg ring-1 ring-border"
          >
            <video
              src={item.url}
              controls
              playsInline
              className="h-full w-full object-cover"
            />
            {item.pendingAnalysis && (
              <span className="absolute left-2 top-2 rounded-full bg-navy/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                Pending
              </span>
            )}
          </div>
        )
      )}
    </div>
  );
}

function formatLogTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
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
      className={[
        "mt-0.5 shrink-0 text-muted transition-transform",
        expanded ? "rotate-180" : "",
      ].join(" ")}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
