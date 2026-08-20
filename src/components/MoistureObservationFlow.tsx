"use client";

import { useEffect, useMemo, useState } from "react";
import { useScopeBriefOptional } from "@/components/ScopeBriefContext";
import { MoistureApproachStep } from "@/components/MoistureApproachPage";
import { MoisturePlantStep } from "@/components/MoisturePlantPage";
import { MoistureSoilStep } from "@/components/MoistureSoilPage";
import {
  EMPTY_MOISTURE_DETAILS,
  formatMoistureSummary,
  MoistureObservationDetails,
} from "@/lib/observations";

type FlowStep = "approach" | "plant" | "soil";

interface MoistureObservationFlowProps {
  open: boolean;
  onClose: () => void;
  onSave: (note: string, details: MoistureObservationDetails) => void;
}

function getFlowSteps(details: MoistureObservationDetails): FlowStep[] {
  const steps: FlowStep[] = ["approach"];
  if (details.includePlantCondition) steps.push("plant");
  if (details.includeSoilMoisture) steps.push("soil");
  return steps;
}

const STEP_HEADERS: Record<
  FlowStep,
  { eyebrow: string; title: string; subtitle?: string }
> = {
  approach: {
    eyebrow: "Moisture check",
    title: "What do you want to record?",
  },
  plant: {
    eyebrow: "Plant observation",
    title: "What does the crop look like?",
    subtitle: "Record visible stress and how much of the field is showing it.",
  },
  soil: {
    eyebrow: "Soil check",
    title: "Which depths matter today?",
    subtitle:
      "For young crops, the top 0–10 cm may be enough. Add deeper layers only when useful.",
  },
};

export function MoistureObservationFlow({
  open,
  onClose,
  onSave,
}: MoistureObservationFlowProps) {
  const [details, setDetails] = useState<MoistureObservationDetails>(
    EMPTY_MOISTURE_DETAILS
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [lockedSteps, setLockedSteps] = useState<FlowStep[] | null>(null);
  const scopeBrief = useScopeBriefOptional();

  const previewSteps = useMemo(() => getFlowSteps(details), [details]);
  const steps = lockedSteps ?? previewSteps;
  const currentStep = steps[stepIndex] ?? "approach";
  const header = STEP_HEADERS[currentStep];
  const isLastStep = stepIndex === steps.length - 1;
  const canContinueFromApproach =
    details.includePlantCondition || details.includeSoilMoisture;
  const canConfirmSoil = details.readings.length > 0;

  useEffect(() => {
    if (open) {
      setDetails(EMPTY_MOISTURE_DETAILS);
      setStepIndex(0);
      setLockedSteps(null);
    }
  }, [open]);

  useEffect(() => {
    if (stepIndex >= steps.length) {
      setStepIndex(Math.max(0, steps.length - 1));
    }
  }, [stepIndex, steps.length]);

  useEffect(() => {
    if (!open || !scopeBrief) return;

    const sectionId =
      currentStep === "approach"
        ? "moisture-approach"
        : currentStep === "plant"
          ? "moisture-plant"
          : "moisture-check";

    scopeBrief.setActiveSectionId(sectionId);
  }, [open, scopeBrief, currentStep]);

  if (!open) return null;

  function updateDetails(patch: Partial<MoistureObservationDetails>) {
    setDetails((prev) => ({ ...prev, ...patch }));
  }

  function goBack() {
    if (stepIndex === 0) {
      onClose();
      return;
    }

    const nextIndex = stepIndex - 1;
    if (nextIndex === 0) {
      setLockedSteps(null);
    }
    setStepIndex(nextIndex);
  }

  function goToStep(targetIndex: number) {
    if (targetIndex < 0 || targetIndex >= steps.length) return;
    if (targetIndex > stepIndex) return;
    if (targetIndex === 0) {
      setLockedSteps(null);
    }
    setStepIndex(targetIndex);
  }

  function goNext() {
    if (stepIndex === 0) {
      const nextSteps = getFlowSteps(details);
      setLockedSteps(nextSteps);
      setStepIndex(1);
      return;
    }
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  }

  function handlePrimaryAction() {
    if (isLastStep) {
      handleSave();
      return;
    }
    goNext();
  }

  function handleSave() {
    onSave(formatMoistureSummary(details), details);
    onClose();
  }

  const primaryDisabled =
    currentStep === "approach"
      ? !canContinueFromApproach
      : currentStep === "soil"
        ? !canConfirmSoil
        : false;

  const primaryLabel =
    currentStep === "approach"
      ? "Continue"
      : isLastStep
        ? "Confirm observation"
        : currentStep === "plant" && details.includeSoilMoisture
          ? "Continue to soil"
          : "Continue";

  return (
    <div className="absolute inset-0 z-50 flex flex-col overflow-hidden bg-surface-elevated">
      <div className="shrink-0 border-b border-border/60 px-5 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="mb-4 flex items-center justify-between">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1 text-sm font-semibold text-navy transition-colors active:text-teal"
            >
              <ChevronLeftIcon />
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-navy"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lime">
          {header.eyebrow}
        </p>
        <h1 className="mt-1 text-[1.625rem] font-bold leading-tight text-navy">
          {header.title}
        </h1>
        {header.subtitle && (
          <p className="mt-2 text-sm text-muted">{header.subtitle}</p>
        )}
      </div>

      <StepProgress
        currentStep={stepIndex + 1}
        totalSteps={steps.length}
        onStepSelect={(stepNumber) => goToStep(stepNumber - 1)}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          key={currentStep}
          className="step-enter min-h-0 flex-1 overflow-y-auto px-5 py-4"
        >
          {currentStep === "approach" && (
            <MoistureApproachStep
              includePlantCondition={details.includePlantCondition}
              includeSoilMoisture={details.includeSoilMoisture}
              onTogglePlant={() =>
                updateDetails({
                  includePlantCondition: !details.includePlantCondition,
                })
              }
              onToggleSoil={() =>
                updateDetails({
                  includeSoilMoisture: !details.includeSoilMoisture,
                })
              }
            />
          )}

          {currentStep === "plant" && (
            <MoisturePlantStep
              plantConditionScale={details.plantConditionScale}
              areaAffectedScale={details.areaAffectedScale}
              onPlantConditionChange={(value) =>
                updateDetails({ plantConditionScale: value })
              }
              onAreaAffectedChange={(value) =>
                updateDetails({ areaAffectedScale: value })
              }
            />
          )}

          {currentStep === "soil" && (
            <MoistureSoilStep
              readings={details.readings}
              onReadingsChange={(readings) => updateDetails({ readings })}
            />
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border/60 px-5 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handlePrimaryAction}
          disabled={primaryDisabled}
          className="btn-primary-block disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}

function StepProgress({
  currentStep,
  totalSteps,
  onStepSelect,
}: {
  currentStep: number;
  totalSteps: number;
  onStepSelect: (step: number) => void;
}) {
  return (
    <div className="shrink-0 border-b border-border/40 bg-surface px-5 py-3">
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isReached = stepNumber <= currentStep;

          return (
            <button
              key={index}
              type="button"
              onClick={() => isReached && onStepSelect(stepNumber)}
              disabled={!isReached}
              aria-label={`Go to step ${stepNumber}`}
              aria-current={stepNumber === currentStep ? "step" : undefined}
              className={[
                "h-1 flex-1 rounded-full transition-colors duration-300",
                isReached ? "bg-teal" : "bg-border",
                isReached ? "cursor-pointer hover:bg-teal-deep/80" : "cursor-default",
              ].join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
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
