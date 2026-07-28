"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { HoldToEndButton } from "@/components/HoldToEndButton";
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
  ObservationType,
  OtherObservationDetails,
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
    weedDetails?: WeedObservationDetails
  ) {
    setObservations((prev) => [
      ...prev,
      createObservation(
        type,
        note || `Logged ${getObservationLabel(type).toLowerCase()}.`,
        diseaseDetails,
        otherDetails,
        weedDetails
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
        details
      ),
    ]);
  }

  function handleObservationSelect(type: ObservationType) {
    if (type === "voice_note") {
      setVoiceNoteOpen(true);
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
    setActivePage(page);
  }

  function goToPage(page: number) {
    const container = pageScrollRef.current;
    if (!container) return;

    container.scrollTo({
      left: page * container.clientWidth,
      behavior: "smooth",
    });
    setActivePage(page);
  }

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

        <div
          ref={pageScrollRef}
          onScroll={handlePageScroll}
          className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <main className="flex h-full w-full shrink-0 snap-start flex-col overflow-y-auto px-7 pt-3 pb-4">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-navy">Log an observation</h2>
            </div>

            <div className="grid flex-1 auto-rows-fr grid-cols-2 gap-3">
              {OBSERVATION_TYPES.map((observation) => (
                <button
                  key={observation.id}
                  type="button"
                  onClick={() => handleObservationSelect(observation.id)}
                  className={[
                    "flex h-full min-h-[4.25rem] items-center gap-2.5 rounded-2xl px-4 py-3 text-left ring-1 transition-all active:scale-[0.98]",
                    observation.tileClass,
                  ].join(" ")}
                >
                  <span
                    className={[
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      observation.iconClass,
                    ].join(" ")}
                  >
                    <ObservationIcon type={observation.id} />
                  </span>
                  <span className="text-base font-semibold leading-tight text-navy">
                    {observation.label}
                  </span>
                </button>
              ))}
            </div>
          </main>

          <div className="h-full w-full shrink-0 snap-start overflow-hidden">
            <ObservationLogPage observations={observations} />
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
        open={activeObservationType !== null}
        type={activeObservationType}
        onClose={() => setActiveObservationType(null)}
        onSave={handleSaveObservation}
      />

      <VoiceNoteOverlay
        open={voiceNoteOpen}
        onClose={() => setVoiceNoteOpen(false)}
        onSubmit={handleSubmitVoiceNote}
      />
    </MobileShell>
  );
}

function ObservationIcon({ type }: { type: ObservationType }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
    </>
  ),
  pest: (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M12 6c-3 0-5 2-5 5v5h10v-5c0-3-2-5-5-5Z" />
      <path d="M8 11H3" />
      <path d="M21 11h-5" />
    </>
  ),
  weed: (
    <>
      <path d="M12 22V12" />
      <path d="M12 12C12 8 8 4 4 4c0 4 4 8 8 8" />
      <path d="M12 12c0-4 4-8 8-8 0 4-4 8-8 8" />
    </>
  ),
  nutrition: (
    <>
      <path d="M12 3v18" />
      <path d="M8 7h8" />
      <path d="M9 12h6" />
      <path d="M10 17h4" />
    </>
  ),
  moisture: (
    <>
      <path d="M12 2.69c2.5 3 5 6.5 5 9.5a5 5 0 0 1-10 0c0-3 2.5-6.5 5-9.5Z" />
    </>
  ),
  chemical_injury: (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  post_treatment_check: (
    <>
      <path d="M20 6 9 17l-5-5" />
    </>
  ),
  trap: (
    <>
      <path d="M4 4h16v4H4z" />
      <path d="M8 8v12" />
      <path d="M16 8v12" />
      <path d="M6 20h12" />
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
