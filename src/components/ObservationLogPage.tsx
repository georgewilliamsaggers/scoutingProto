"use client";

import { useMemo, useState } from "react";
import { formatDuration } from "@/hooks/useVoiceRecorder";
import {
  DiseaseObservationDetails,
  FIELD_PREVALENCE_LABELS,
  getDiseaseDisplayName,
  getDiseaseSpecificType,
  getMoistureCollapsedSummary,
  getMoistureDepth,
  getMoistureLevelForValue,
  getObservationLabel,
  getPestDisplayName,
  getPestSpecificType,
  getWeedDisplayName,
  MoistureObservationDetails,
  OBSERVATION_TYPES,
  PestObservationDetails,
  PLANTS_AFFECTED_LABELS,
  SEVERITY_SCALE_LABELS,
  ScoutingObservation,
  VoiceNoteDetails,
  WEED_DENSITY_OPTIONS,
  WEED_SIZE_OPTIONS,
  WeedObservationDetails,
} from "@/lib/observations";

interface ObservationLogPageProps {
  observations: ScoutingObservation[];
  onOpenMap: () => void;
}

export function ObservationLogPage({
  observations,
  onOpenMap,
}: ObservationLogPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const groupedObservations = useMemo(
    () =>
      OBSERVATION_TYPES.map((type) => ({
        type: type.id,
        label: type.label,
        items: observations
          .filter((observation) => observation.type === type.id)
          .slice()
          .reverse(),
      })).filter((group) => group.items.length > 0),
    [observations]
  );

  return (
    <div className="flex h-full flex-col px-7 pt-3 pb-4">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <h2 className="text-[1.625rem] font-bold leading-tight text-navy">Field log</h2>
        <button
          type="button"
          onClick={onOpenMap}
          disabled={observations.length === 0}
          className="flex h-9 items-center gap-1.5 rounded-full bg-surface px-3 text-xs font-semibold text-navy ring-1 ring-border transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <MapToggleIcon />
          Map
        </button>
      </div>

      {observations.length === 0 ? (
        <p className="text-sm text-muted">
          Observations you log during this session will appear here.
        </p>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto -mx-1 px-1">
          <div className="space-y-5 pb-2">
            {groupedObservations.map((group) => (
              <section key={group.type}>
                <h3 className="mb-2 text-base font-bold text-navy">{group.label}</h3>
                <ul className="space-y-2">
                  {group.items.map((observation) => {
                    const expanded = expandedId === observation.id;

                    return (
                      <li key={observation.id}>
                        <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-sm">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(expanded ? null : observation.id)
                            }
                            className="flex w-full items-start gap-2 px-3.5 py-3 text-left transition-colors hover:bg-surface"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-sm font-semibold text-navy">
                                  {getObservationTitle(observation)}
                                </p>
                                <time
                                  dateTime={observation.createdAt}
                                  className="shrink-0 text-[11px] font-medium tabular-nums text-muted"
                                >
                                  {formatLogTime(observation.createdAt)}
                                </time>
                              </div>
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
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getObservationTitle(observation: ScoutingObservation): string {
  if (observation.type === "disease" && observation.diseaseDetails) {
    return getDiseaseDisplayName(observation.diseaseDetails);
  }

  if (observation.type === "pest" && observation.pestDetails) {
    return getPestDisplayName(observation.pestDetails);
  }

  if (observation.type === "weed" && observation.weedDetails) {
    return getWeedDisplayName(observation.weedDetails);
  }

  if (observation.type === "moisture" && observation.moistureDetails) {
    return getMoistureCollapsedSummary(observation.moistureDetails);
  }

  if (observation.note.trim()) {
    return observation.note.trim();
  }

  return getObservationLabel(observation.type);
}

function CollapsedSummary({ observation }: { observation: ScoutingObservation }) {
  if (observation.type === "disease" && observation.diseaseDetails) {
    return <DiseaseCollapsedSummary details={observation.diseaseDetails} />;
  }

  if (observation.type === "pest" && observation.pestDetails) {
    return <PestCollapsedSummary details={observation.pestDetails} />;
  }

  if (observation.type === "weed" && observation.weedDetails) {
    return <WeedCollapsedSummary details={observation.weedDetails} />;
  }

  if (observation.type === "moisture" && observation.moistureDetails) {
    return null;
  }

  if (observation.note) {
    const title = getObservationTitle(observation);
    if (observation.note.trim() === title) {
      return null;
    }

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
  const plantsAffected =
    details.plantsAffectedScale > 0
      ? PLANTS_AFFECTED_LABELS[details.plantsAffectedScale - 1]
      : details.plantsAffectedPercent.trim();

  return (
    <div className="mt-1.5 space-y-2">
      {plantsAffected && (
        <p className="text-sm text-muted">{plantsAffected} plants affected</p>
      )}
      {details.flaggedForFollowUp && (
        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
          Flagged for follow up
        </span>
      )}
      {details.needsAction && (
        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-red-200">
          Needs action
        </span>
      )}
    </div>
  );
}

function PestCollapsedSummary({
  details,
}: {
  details: PestObservationDetails;
}) {
  const countLabel =
    details.pestCountScale > 0
      ? PLANTS_AFFECTED_LABELS[details.pestCountScale - 1]
      : null;

  return (
    <div className="mt-1.5 space-y-2">
      {countLabel && <p className="text-sm text-muted">{countLabel}</p>}
      {details.flaggedForFollowUp && (
        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
          Flagged for follow up
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
  const sizeLabel = WEED_SIZE_OPTIONS[details.sizeScale - 1]?.label;
  const densityLabel = WEED_DENSITY_OPTIONS[details.densityScale - 1]?.label;
  const parts = [
    sizeLabel && sizeLabel.toLowerCase(),
    densityLabel && `${densityLabel.toLowerCase()} density`,
  ].filter(Boolean);

  return (
    <div className="mt-1.5 space-y-2">
      {parts.length > 0 && (
        <p className="text-sm text-muted">{parts.join(" · ")}</p>
      )}
      {details.flaggedForFollowUp && (
        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
          Flagged for follow up
        </span>
      )}
    </div>
  );
}

function ExpandedDetails({ observation }: { observation: ScoutingObservation }) {
  if (observation.type === "disease" && observation.diseaseDetails) {
    return <DiseaseExpandedDetails details={observation.diseaseDetails} />;
  }

  if (observation.type === "pest" && observation.pestDetails) {
    return <PestExpandedDetails details={observation.pestDetails} />;
  }

  if (observation.type === "weed" && observation.weedDetails) {
    return <WeedExpandedDetails details={observation.weedDetails} />;
  }

  if (observation.type === "moisture" && observation.moistureDetails) {
    return <MoistureExpandedDetails details={observation.moistureDetails} />;
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
        {details.diseaseCategoryLabel && (
          <DetailRow label="Category" value={details.diseaseCategoryLabel} />
        )}
        {details.diseaseSpecificTypeId && (
          <DetailRow
            label="Specific type"
            value={
              getDiseaseSpecificType(details.diseaseSpecificTypeId)?.label ??
              details.diseaseLabel
            }
          />
        )}
        {details.plantLocations.length > 0 && (
          <DetailRow
            label="Plant location"
            value={details.plantLocations.join(", ")}
          />
        )}
        {details.fieldPrevalence > 0 && (
          <DetailRow
            label="Field prevalence"
            value={FIELD_PREVALENCE_LABELS[details.fieldPrevalence - 1]}
          />
        )}
        {details.plantsAffectedScale > 0 && (
          <DetailRow
            label="Plants affected"
            value={PLANTS_AFFECTED_LABELS[details.plantsAffectedScale - 1]}
          />
        )}
        {details.severityScale > 0 && (
          <DetailRow
            label="Severity"
            value={SEVERITY_SCALE_LABELS[details.severityScale - 1]}
          />
        )}
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

      {details.voiceNote && (
        <VoiceNotePlayer voiceNote={details.voiceNote} />
      )}

      {details.media.length > 0 && <MediaGrid items={details.media} />}
    </>
  );
}

function PestExpandedDetails({
  details,
}: {
  details: PestObservationDetails;
}) {
  return (
    <>
      <dl className="space-y-1.5 text-sm">
        {details.pestCategoryLabel && (
          <DetailRow label="Category" value={details.pestCategoryLabel} />
        )}
        {details.pestSpecificTypeId && (
          <DetailRow
            label="Specific type"
            value={
              getPestSpecificType(details.pestSpecificTypeId)?.label ??
              details.pestLabel
            }
          />
        )}
        {details.infectedParts.length > 0 && (
          <DetailRow
            label="Infected part"
            value={details.infectedParts.join(", ")}
          />
        )}
        {details.fieldPrevalence > 0 && (
          <DetailRow
            label="Field prevalence"
            value={FIELD_PREVALENCE_LABELS[details.fieldPrevalence - 1]}
          />
        )}
        {details.pestCountScale > 0 && (
          <DetailRow
            label="Pest count"
            value={PLANTS_AFFECTED_LABELS[details.pestCountScale - 1]}
          />
        )}
        {details.damageSeverityScale > 0 && (
          <DetailRow
            label="Damage severity"
            value={SEVERITY_SCALE_LABELS[details.damageSeverityScale - 1]}
          />
        )}
        {details.otherNotes && (
          <div>
            <dt className="font-medium text-navy/70">Other notes</dt>
            <dd className="mt-0.5 leading-relaxed text-navy">{details.otherNotes}</dd>
          </div>
        )}
      </dl>

      {details.voiceNote && (
        <VoiceNotePlayer voiceNote={details.voiceNote} />
      )}

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
  const sizeLabel = WEED_SIZE_OPTIONS[details.sizeScale - 1];
  const densityLabel = WEED_DENSITY_OPTIONS[details.densityScale - 1];

  return (
    <>
      <dl className="space-y-1.5 text-sm">
        {weedName && <DetailRow label="Weed" value={weedName} />}
        {details.weedCategoryLabel && (
          <DetailRow label="Type" value={details.weedCategoryLabel} />
        )}
        {sizeLabel && (
          <DetailRow
            label="Size"
            value={`${sizeLabel.label} — ${sizeLabel.subtitle}`}
          />
        )}
        {densityLabel && (
          <DetailRow
            label="Density"
            value={`${densityLabel.label} — ${densityLabel.subtitle}`}
          />
        )}
        {details.flaggedForFollowUp && (
          <DetailRow label="Follow up" value="Flagged" />
        )}
        {details.otherNotes.trim() && (
          <DetailRow label="Notes" value={details.otherNotes.trim()} />
        )}
      </dl>
      {details.voiceNote && (
        <VoiceNotePlayer voiceNote={details.voiceNote} />
      )}
      {details.media.length > 0 && <MediaGrid items={details.media} />}
    </>
  );
}

function MoistureExpandedDetails({
  details,
}: {
  details: MoistureObservationDetails;
}) {
  return (
    <dl className="space-y-1.5 text-sm">
      {details.readings.map((reading) => {
        const depth = getMoistureDepth(reading.depthId);
        const level = getMoistureLevelForValue(reading.level);

        return (
          <DetailRow
            key={reading.depthId}
            label={depth?.label ?? reading.depthId}
            value={`${level.label} — ${level.subtitle}`}
          />
        );
      })}
    </dl>
  );
}

function VoiceNotePlayer({ voiceNote }: { voiceNote: VoiceNoteDetails }) {
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-xs font-medium text-navy/70">
        Voice note · {formatDuration(voiceNote.durationSeconds)}
      </p>
      <audio
        src={voiceNote.audioUrl}
        controls
        playsInline
        className="w-full"
      />
    </div>
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
    <div className="mt-3 grid grid-cols-2 gap-2">
      {items.map((item) =>
        item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.id}
            src={item.url}
            alt={item.name}
            className="aspect-[4/3] w-full rounded-lg object-cover ring-1 ring-border"
          />
        ) : (
          <div
            key={item.id}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-lg ring-1 ring-border"
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

function MapToggleIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
