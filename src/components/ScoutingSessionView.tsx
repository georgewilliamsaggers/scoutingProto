"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { HoldToEndButton } from "@/components/HoldToEndButton";
import { DiseaseObservationFlow } from "@/components/DiseaseObservationFlow";
import { PestObservationFlow } from "@/components/PestObservationFlow";
import { MoistureObservationFlow } from "@/components/MoistureObservationFlow";
import { WeedObservationFlow } from "@/components/WeedObservationFlow";
import { ObservationMapOverlay } from "@/components/ObservationMapOverlay";
import { LogObservationSheet } from "@/components/LogObservationSheet";
import { ObservationLogPage } from "@/components/ObservationLogPage";
import { VoiceNoteOverlay } from "@/components/VoiceNoteOverlay";
import { MobileShell } from "@/components/MobileShell";
import { getFieldById } from "@/lib/fields";
import {
  createObservation,
  DiseaseObservationDetails,
  formatVoiceNoteSummary,
  getObservationLabel,
  OBSERVATION_TYPES,
  MoistureObservationDetails,
  ObservationType,
  OtherObservationDetails,
  PestObservationDetails,
  ScoutingObservation,
  VoiceNoteDetails,
  WeedObservationDetails,
} from "@/lib/observations";
import { ScoutingTask } from "@/lib/scouting-tasks";

interface ScoutingSessionViewProps {
  task: ScoutingTask;
}

export function ScoutingSessionView({ task }: ScoutingSessionViewProps) {
  const router = useRouter();
  const field = getFieldById(task.fieldId);

  const [observations, setObservations] = useState<ScoutingObservation[]>([]);
  const [activeObservationType, setActiveObservationType] =
    useState<ObservationType | null>(null);
  const [diseaseFlowOpen, setDiseaseFlowOpen] = useState(false);
  const [pestFlowOpen, setPestFlowOpen] = useState(false);
  const [weedFlowOpen, setWeedFlowOpen] = useState(false);
  const [moistureFlowOpen, setMoistureFlowOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [voiceNoteOpen, setVoiceNoteOpen] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const pageScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = Date.now();

    function updateSessionMinutes() {
      setSessionMinutes(Math.floor((Date.now() - start) / 60000));
    }

    updateSessionMinutes();
    const interval = window.setInterval(updateSessionMinutes, 10000);

    return () => window.clearInterval(interval);
  }, []);

  function handleSaveObservation(
    type: ObservationType,
    note: string,
    diseaseDetails?: DiseaseObservationDetails,
    otherDetails?: OtherObservationDetails,
    weedDetails?: WeedObservationDetails,
    pestDetails?: PestObservationDetails,
    moistureDetails?: MoistureObservationDetails
  ) {
    setObservations((prev) => [
      ...prev,
      createObservation(
        type,
        note || `Logged ${getObservationLabel(type).toLowerCase()}.`,
        diseaseDetails,
        otherDetails,
        weedDetails,
        undefined,
        pestDetails,
        moistureDetails,
        task.fieldId
      ),
    ]);
  }

  function handleSubmitVoiceNote(details: VoiceNoteDetails) {
    setObservations((prev) => [
      ...prev,
      createObservation(
        "voice_note",
        formatVoiceNoteSummary(details),
        undefined,
        undefined,
        undefined,
        details,
        undefined,
        undefined,
        task.fieldId
      ),
    ]);
  }

  function handleObservationSelect(type: ObservationType) {
    if (type === "voice_note") {
      setVoiceNoteOpen(true);
      return;
    }

    if (type === "disease") {
      setDiseaseFlowOpen(true);
      return;
    }

    if (type === "pest") {
      setPestFlowOpen(true);
      return;
    }

    if (type === "weed") {
      setWeedFlowOpen(true);
      return;
    }

    if (type === "moisture") {
      setMoistureFlowOpen(true);
      return;
    }

    setActiveObservationType(type);
  }

  function handleEndSession() {
    router.push("/dashboard");
  }

  function handlePageScroll() {
    const container = pageScrollRef.current;
    if (!container) return;

    const page = Math.round(container.scrollLeft / container.clientWidth);
    if (page !== activePage) {
      setActivePage(page);
    }
  }

  function goToPage(page: number) {
    setActivePage(page);

    const container = pageScrollRef.current;
    if (!container) return;

    container.scrollTo({
      left: page * container.clientWidth,
      behavior: "smooth",
    });
  }

  const observationCounts = useMemo(
    () =>
      observations.reduce<Partial<Record<ObservationType, number>>>((counts, observation) => {
        counts[observation.type] = (counts[observation.type] ?? 0) + 1;
        return counts;
      }, {}),
    [observations]
  );

  return (
    <MobileShell>
      <div className="gradient-brand h-1.5 w-full shrink-0" />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-border/60 bg-surface-elevated px-7 pb-4 pt-4">
          <div className="mb-0.5 flex items-center justify-between gap-4">
            <p className="min-w-0 truncate text-sm font-semibold text-navy">
              <span className="text-muted">Crop:</span> {task.commodity}
            </p>
            <p className="shrink-0 text-sm font-semibold text-teal">
              {observations.length}{" "}
              {observations.length === 1 ? "observation" : "observations"}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="min-w-0 truncate text-sm font-semibold text-navy">
              <span className="text-muted">Field:</span> {field?.name ?? task.location}
            </p>
            <p className="shrink-0 text-sm font-semibold text-teal">
              {sessionMinutes}{" "}
              {sessionMinutes === 1 ? "minute" : "minutes"}
            </p>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <div
            ref={pageScrollRef}
            onScroll={handlePageScroll}
            className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <main className="relative z-10 flex h-full min-h-0 w-full shrink-0 snap-start touch-pan-y flex-col px-7 pt-4 pb-3">
              <h2 className="mb-4 shrink-0 text-[1.625rem] font-bold leading-tight text-navy">
                Log an observation
              </h2>

              <div className="flex min-h-0 flex-1 flex-col gap-3.5">
                {[0, 1, 2].map((rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid min-h-0 flex-1 grid-cols-2 gap-3"
                  >
                    {OBSERVATION_TYPES.slice(rowIndex * 2, rowIndex * 2 + 2).map(
                      (observation) => {
                        const count = observationCounts[observation.id] ?? 0;

                        return (
                          <button
                            key={observation.id}
                            type="button"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={() => handleObservationSelect(observation.id)}
                            className={[
                              "relative flex h-full min-h-0 cursor-pointer touch-manipulation flex-col rounded-2xl px-3.5 py-5 text-left transition-all active:scale-[0.98]",
                              observation.tileClass,
                              observation.borderClass,
                            ].join(" ")}
                          >
                            {count > 0 && (
                              <span
                                className={[
                                  "pointer-events-none absolute right-2.5 top-2.5 flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold",
                                  observation.badgeClass,
                                ].join(" ")}
                              >
                                {count}
                              </span>
                            )}
                            <span className={["pointer-events-none", observation.iconClass].join(" ")}>
                              <ObservationIcon
                                type={observation.id}
                                className="h-10 w-10"
                              />
                            </span>
                            <span className="pointer-events-none mt-auto">
                              <span
                                className={[
                                  "block text-lg font-semibold leading-tight tracking-tight",
                                  observation.textClass,
                                ].join(" ")}
                              >
                                {observation.label}
                              </span>
                              {observation.supportText && (
                                <span
                                  className={[
                                    "mt-1 block text-xs font-normal leading-snug opacity-60",
                                    observation.textClass,
                                  ].join(" ")}
                                >
                                  {observation.supportText}
                                </span>
                              )}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                ))}
              </div>
            </main>

            <div className="relative z-10 h-full w-full shrink-0 snap-start overflow-hidden">
              <ObservationLogPage
                observations={observations}
                onOpenMap={() => setMapOpen(true)}
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-border/60 bg-surface-elevated px-7 pb-4 pt-3 shadow-[0_-4px_24px_rgba(26,39,68,0.06)] max-md:pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mb-3 flex items-center justify-center gap-2">
            {[0, 1].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                aria-label={page === 0 ? "Log observations" : "Field log"}
                className={[
                  "h-2 w-2 rounded-full transition-colors",
                  activePage === page ? "bg-teal" : "bg-border",
                ].join(" ")}
              />
            ))}
          </div>
          <HoldToEndButton onEnd={handleEndSession} />
        </div>
      </div>

      <LogObservationSheet
        open={
          activeObservationType !== null &&
          activeObservationType !== "disease" &&
          activeObservationType !== "pest" &&
          activeObservationType !== "weed" &&
          activeObservationType !== "moisture"
        }
        type={activeObservationType}
        onClose={() => setActiveObservationType(null)}
        onSave={handleSaveObservation}
      />

      <DiseaseObservationFlow
        open={diseaseFlowOpen}
        commodity={task.commodity}
        onClose={() => setDiseaseFlowOpen(false)}
        onSave={(note, details) => handleSaveObservation("disease", note, details)}
      />

      <PestObservationFlow
        open={pestFlowOpen}
        commodity={task.commodity}
        onClose={() => setPestFlowOpen(false)}
        onSave={(note, details) =>
          handleSaveObservation("pest", note, undefined, undefined, undefined, details)
        }
      />

      <WeedObservationFlow
        open={weedFlowOpen}
        commodity={task.commodity}
        onClose={() => setWeedFlowOpen(false)}
        onSave={(note, details) =>
          handleSaveObservation("weed", note, undefined, undefined, details)
        }
      />

      <MoistureObservationFlow
        open={moistureFlowOpen}
        onClose={() => setMoistureFlowOpen(false)}
        onSave={(note, details) =>
          handleSaveObservation(
            "moisture",
            note,
            undefined,
            undefined,
            undefined,
            undefined,
            details
          )
        }
      />

      {mapOpen && (
        <ObservationMapOverlay
          observations={observations}
          fieldId={task.fieldId}
          onClose={() => setMapOpen(false)}
        />
      )}

      <VoiceNoteOverlay
        open={voiceNoteOpen}
        onClose={() => setVoiceNoteOpen(false)}
        onSubmit={handleSubmitVoiceNote}
      />
    </MobileShell>
  );
}

function ObservationIcon({
  type,
  className = "h-10 w-10",
}: {
  type: ObservationType;
  className?: string;
}) {
  return (
    <svg
      className={[className, "pointer-events-none"].join(" ")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {observationIcons[type]}
    </svg>
  );
}

const observationIcons: Record<ObservationType, ReactNode> = {
  disease: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2.5" />
      <path d="M12 19.5V22" />
      <path d="m4.5 4.5 1.8 1.8" />
      <path d="m17.7 17.7 1.8 1.8" />
      <path d="M2 12h2.5" />
      <path d="M19.5 12H22" />
      <path d="m4.5 19.5 1.8-1.8" />
      <path d="m17.7 6.3 1.8-1.8" />
    </>
  ),
  pest: (
    <>
      <ellipse cx="12" cy="13" rx="5" ry="6" />
      <circle cx="12" cy="7" r="2.5" />
      <path d="M7 11 4 9" />
      <path d="M17 11l3-2" />
      <path d="M7 16 4 18" />
      <path d="M17 16l3 2" />
      <path d="M9 7 7 4" />
      <path d="M15 7l2-3" />
    </>
  ),
  weed: (
    <>
      <path d="M12 22V11" />
      <path d="M12 11C12 7.5 8.5 4 5 4c0 3.5 3.5 7 7 7" />
      <path d="M12 11c0-3.5 3.5-7 7-7 0 3.5-3.5 7-7 7" />
      <path d="M12 11c0-2 1.5-4 3.5-5" />
    </>
  ),
  moisture: (
    <>
      <path d="M12 2.69c2.5 3 5 6.5 5 9.5a5 5 0 0 1-10 0c0-3 2.5-6.5 5-9.5Z" />
      <path d="M7 14.5h10" />
    </>
  ),
  other: (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </>
  ),
  voice_note: (
    <>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
    </>
  ),
};
