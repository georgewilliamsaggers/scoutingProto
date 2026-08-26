"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HoldToEndButton } from "@/components/HoldToEndButton";
import { DiseaseObservationFlow } from "@/components/DiseaseObservationFlow";
import { PestObservationFlow } from "@/components/PestObservationFlow";
import { MoistureObservationFlow } from "@/components/MoistureObservationFlow";
import { PopulationObservationFlow } from "@/components/PopulationObservationFlow";
import { WeedObservationFlow } from "@/components/WeedObservationFlow";
import { ObservationMapOverlay } from "@/components/ObservationMapOverlay";
import { LogObservationSheet } from "@/components/LogObservationSheet";
import { ObservationLogPage } from "@/components/ObservationLogPage";
import { ObservationIcon } from "@/components/ObservationTypeIcon";
import { useAppHeader } from "@/components/AppHeaderContext";
import { VoiceNoteOverlay } from "@/components/VoiceNoteOverlay";
import { useScopeBriefOptional } from "@/components/ScopeBriefContext";
import { Field } from "@/lib/fields";
import {
  createObservation,
  DiseaseObservationDetails,
  formatVoiceNoteSummary,
  getObservationLabel,
  LOG_OBSERVATION_TILE_TYPES,
  MoistureObservationDetails,
  ObservationType,
  OtherObservationDetails,
  PestObservationDetails,
  PopulationCountMethod,
  PopulationObservationDetails,
  ScoutingObservation,
  VoiceNoteDetails,
  WeedObservationDetails,
} from "@/lib/observations";

interface ScoutingSessionViewProps {
  field: Field;
  onEndSession: (observations: ScoutingObservation[]) => void;
}

export function ScoutingSessionView({
  field,
  onEndSession,
}: ScoutingSessionViewProps) {
  const scopeBrief = useScopeBriefOptional();
  const { setHeaderConfig } = useAppHeader();

  const [observations, setObservations] = useState<ScoutingObservation[]>([]);
  const [sessionKey, setSessionKey] = useState(0);
  const [activeObservationType, setActiveObservationType] =
    useState<ObservationType | null>(null);
  const [diseaseFlowOpen, setDiseaseFlowOpen] = useState(false);
  const [pestFlowOpen, setPestFlowOpen] = useState(false);
  const [weedFlowOpen, setWeedFlowOpen] = useState(false);
  const [moistureFlowOpen, setMoistureFlowOpen] = useState(false);
  const [populationFlowOpen, setPopulationFlowOpen] = useState(false);
  const [populationMethod, setPopulationMethod] =
    useState<PopulationCountMethod>("square");
  const [mapOpen, setMapOpen] = useState(false);
  const [voiceNoteOpen, setVoiceNoteOpen] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const pageScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scopeBrief) return;

    if (diseaseFlowOpen) {
      return;
    }

    if (pestFlowOpen) {
      return;
    }

    if (weedFlowOpen) {
      return;
    }

    if (moistureFlowOpen) {
      return;
    }

    if (populationFlowOpen) {
      return;
    }

    if (activePage === 1) {
      scopeBrief.setActiveSectionId("flows");
      return;
    }

    scopeBrief.setActiveSectionId("log-observation");
  }, [
    activePage,
    diseaseFlowOpen,
    moistureFlowOpen,
    pestFlowOpen,
    populationFlowOpen,
    scopeBrief,
    weedFlowOpen,
  ]);

  useEffect(() => {
    setHeaderConfig({
      title: activePage === 1 ? "Field log" : "Log an observation",
      showBack: false,
    });
  }, [activePage, setHeaderConfig]);

  useEffect(() => {
    const start = Date.now();

    function updateSessionMinutes() {
      setSessionMinutes(Math.floor((Date.now() - start) / 60000));
    }

    updateSessionMinutes();
    const interval = window.setInterval(updateSessionMinutes, 10000);

    return () => window.clearInterval(interval);
  }, [sessionKey]);

  function handleSaveObservation(
    type: ObservationType,
    note: string,
    diseaseDetails?: DiseaseObservationDetails,
    otherDetails?: OtherObservationDetails,
    weedDetails?: WeedObservationDetails,
    pestDetails?: PestObservationDetails,
    moistureDetails?: MoistureObservationDetails,
    populationDetails?: PopulationObservationDetails
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
        populationDetails,
        field.id
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
        undefined,
        field.id
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

    if (type === "population") {
      setPopulationFlowOpen(true);
      return;
    }

    setActiveObservationType(type);
  }

  function closePopulationFlow() {
    setPopulationFlowOpen(false);
    setPopulationMethod((current) => (current === "square" ? "row" : "square"));
  }

  function handleEndSession() {
    onEndSession(observations);
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-border/60 bg-surface-elevated px-7 pb-4 pt-4">
          <div className="mb-0.5 flex items-center justify-between gap-4">
            <p className="min-w-0 truncate text-sm font-semibold text-navy">
              <span className="text-muted">Crop:</span> {field.crop}
            </p>
            <p className="shrink-0 text-sm font-semibold text-teal">
              {observations.length}{" "}
              {observations.length === 1 ? "observation" : "observations"}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p className="min-w-0 truncate text-sm font-semibold text-navy">
              <span className="text-muted">Field:</span> {field.name}
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
            <main className="relative z-10 flex h-full min-h-0 w-full shrink-0 snap-start touch-pan-y flex-col px-7 pt-3 pb-3">
              <div className="flex min-h-0 flex-1 flex-col gap-3.5">
                {Array.from(
                  { length: Math.ceil(LOG_OBSERVATION_TILE_TYPES.length / 2) },
                  (_, rowIndex) => {
                  const rowTiles = LOG_OBSERVATION_TILE_TYPES.slice(
                    rowIndex * 2,
                    rowIndex * 2 + 2
                  );

                  if (rowTiles.length === 0) return null;

                  const isCompactRow = rowTiles.every(
                    (tile) => tile.id === "other"
                  );

                  return (
                  <div
                    key={rowIndex}
                    className={[
                      "grid grid-cols-2 gap-3",
                      isCompactRow ? "shrink-0" : "min-h-0 flex-1",
                    ].join(" ")}
                  >
                    {rowTiles.map(
                      (observation) => {
                        const count = observationCounts[observation.id] ?? 0;
                        const isCompact = observation.id === "other";

                        return (
                          <button
                            key={observation.id}
                            type="button"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={() => handleObservationSelect(observation.id)}
                            className={[
                              "relative flex min-h-0 cursor-pointer touch-manipulation overflow-hidden rounded-2xl text-left shadow-sm transition-all active:scale-[0.98] active:shadow-md",
                              isCompact
                                ? "items-center gap-3 px-4 py-3"
                                : "h-full flex-col p-4",
                              observation.tileClass,
                              observation.borderClass,
                              rowTiles.length === 1 ? "col-span-2" : "",
                            ].join(" ")}
                          >
                            {count > 0 && (
                              <span
                                className={[
                                  "pointer-events-none z-10 flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold",
                                  isCompact
                                    ? "relative ml-auto shrink-0"
                                    : "absolute right-3 top-3",
                                  observation.badgeClass,
                                ].join(" ")}
                              >
                                {count}
                              </span>
                            )}
                            <span
                              className={[
                                "pointer-events-none relative z-10 inline-flex shrink-0 items-center justify-center rounded-xl text-xl",
                                isCompact ? "h-9 w-9" : "h-10 w-10",
                                observation.iconContainerClass,
                              ].join(" ")}
                            >
                              {observation.emoji ?? (
                                <ObservationIcon
                                  type={observation.id}
                                  className="h-5 w-5"
                                />
                              )}
                            </span>
                            <span
                              className={[
                                "pointer-events-none relative z-10 min-w-0",
                                isCompact
                                  ? "flex flex-1 items-baseline gap-2"
                                  : "mt-3",
                              ].join(" ")}
                            >
                              <span
                                className={[
                                  "block text-[0.9375rem] font-bold leading-tight",
                                  observation.textClass,
                                ].join(" ")}
                              >
                                {observation.label}
                              </span>
                              {observation.supportText && (
                                <span
                                  className={[
                                    "text-xs leading-snug text-muted",
                                    isCompact
                                      ? "min-w-0 truncate"
                                      : "mt-1 block",
                                  ].join(" ")}
                                >
                                  {observation.supportText}
                                </span>
                              )}
                            </span>
                            <span
                              className={[
                                "pointer-events-none absolute z-0 rounded-full",
                                isCompact
                                  ? "-bottom-4 -right-4 h-14 w-14"
                                  : "-bottom-5 -right-5 h-20 w-20",
                                observation.accentClass,
                              ].join(" ")}
                              aria-hidden="true"
                            />
                          </button>
                        );
                      }
                    )}
                  </div>
                  );
                })}
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

      <LogObservationSheet
        open={
          activeObservationType !== null &&
          activeObservationType !== "disease" &&
          activeObservationType !== "pest" &&
          activeObservationType !== "weed" &&
          activeObservationType !== "moisture" &&
          activeObservationType !== "population"
        }
        type={activeObservationType}
        onClose={() => setActiveObservationType(null)}
        onSave={handleSaveObservation}
      />

      <DiseaseObservationFlow
        open={diseaseFlowOpen}
        commodity={field.crop}
        onClose={() => setDiseaseFlowOpen(false)}
        onSave={(note, details) => handleSaveObservation("disease", note, details)}
      />

      <PestObservationFlow
        open={pestFlowOpen}
        commodity={field.crop}
        onClose={() => setPestFlowOpen(false)}
        onSave={(note, details) =>
          handleSaveObservation("pest", note, undefined, undefined, undefined, details)
        }
      />

      <WeedObservationFlow
        open={weedFlowOpen}
        commodity={field.crop}
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

      <PopulationObservationFlow
        open={populationFlowOpen}
        method={populationMethod}
        onClose={closePopulationFlow}
        onSave={(note, details) =>
          handleSaveObservation(
            "population",
            note,
            undefined,
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
          fieldId={field.id}
          onClose={() => setMapOpen(false)}
        />
      )}

      <VoiceNoteOverlay
        open={voiceNoteOpen}
        onClose={() => setVoiceNoteOpen(false)}
        onSubmit={handleSubmitVoiceNote}
      />
    </div>
  );
}
