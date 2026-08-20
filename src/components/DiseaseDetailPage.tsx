"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  DiseaseObservationDetails,
  DISEASE_SEVERITY_LABELS,
  DISEASE_SPREAD_LABELS,
  formatMediaUploadTime,
  getDiseaseDisplayName,
  ObservationMediaItem,
  PLANT_LOCATIONS,
} from "@/lib/observations";

type DetailStep = "plant-location" | "scales" | "notes";

const DETAIL_STEPS: DetailStep[] = ["plant-location", "scales", "notes"];

interface DiseaseDetailPageProps {
  commodity: string;
  details: DiseaseObservationDetails;
  onChange: (details: DiseaseObservationDetails) => void;
  onBack: () => void;
  onOpenCamera: () => void;
  onSave: () => void;
}

export function DiseaseDetailPage({
  commodity,
  details,
  onChange,
  onBack,
  onOpenCamera,
  onSave,
}: DiseaseDetailPageProps) {
  const [step, setStep] = useState<DetailStep>("plant-location");
  const stepIndex = DETAIL_STEPS.indexOf(step);

  const isOtherFlow = details.diseaseCategoryId === "other";
  const headerTitle = getDiseaseDisplayName(details);

  function updateField<K extends keyof DiseaseObservationDetails>(
    key: K,
    value: DiseaseObservationDetails[K]
  ) {
    onChange({ ...details, [key]: value });
  }

  function togglePlantLocation(location: string) {
    const selected = details.plantLocations.includes(location);
    updateField(
      "plantLocations",
      selected
        ? details.plantLocations.filter((entry) => entry !== location)
        : [...details.plantLocations, location]
    );
  }

  function goBack() {
    if (stepIndex === 0) {
      onBack();
      return;
    }
    setStep(DETAIL_STEPS[stepIndex - 1]);
  }

  function goNext() {
    if (stepIndex >= DETAIL_STEPS.length - 1) return;
    setStep(DETAIL_STEPS[stepIndex + 1]);
  }

  function goToStep(targetIndex: number) {
    if (targetIndex < 0 || targetIndex >= DETAIL_STEPS.length) return;
    if (targetIndex > stepIndex) return;
    setStep(DETAIL_STEPS[targetIndex]);
  }

  const canProceed =
    step === "plant-location"
      ? details.plantLocations.length > 0
      : step === "scales";

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-surface-elevated">
      <DiseaseDetailHeader
        commodity={commodity}
        details={details}
        headerTitle={headerTitle}
        onBack={goBack}
        onToggleFlag={() =>
          updateField("flaggedForFollowUp", !details.flaggedForFollowUp)
        }
      />

      <StepProgress
        currentStep={stepIndex + 1}
        totalSteps={DETAIL_STEPS.length}
        onStepSelect={(stepNumber) => goToStep(stepNumber - 1)}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div key={step} className="step-enter min-h-0 flex-1 overflow-y-auto px-5 pb-4">
          {step === "plant-location" && (
            <PlantLocationStep
              plantLocations={details.plantLocations}
              onToggle={togglePlantLocation}
            />
          )}

          {step === "scales" && (
            <ScalesStep
              fieldPrevalence={details.fieldPrevalence}
              severityScale={details.severityScale}
              onPrevalenceChange={(value) => updateField("fieldPrevalence", value)}
              onSeverityChange={(value) => updateField("severityScale", value)}
            />
          )}

          {step === "notes" && (
            <NotesStep
              details={details}
              isOtherFlow={isOtherFlow}
              onChange={onChange}
              onNotesChange={(value) => updateField("otherNotes", value)}
              onMediaChange={(media) => updateField("media", media)}
              onOpenCamera={onOpenCamera}
            />
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border/60 px-5 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {step === "notes" ? (
          <button
            type="button"
            onClick={onSave}
            disabled={details.plantLocations.length === 0}
            className="btn-primary-block disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            Confirm observation
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed}
            className="btn-primary-block disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

function DiseaseDetailHeader({
  commodity,
  details,
  headerTitle,
  onBack,
  onToggleFlag,
}: {
  commodity: string;
  details: DiseaseObservationDetails;
  headerTitle: string;
  onBack: () => void;
  onToggleFlag: () => void;
}) {
  return (
    <div className="shrink-0 border-b border-border/60 px-5 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="mb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-semibold text-navy transition-colors active:text-teal"
        >
          <ChevronLeftIcon />
          Back
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-surface">
          {details.diseaseImageSrc ? (
            details.diseaseImageSrc.startsWith("blob:") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={details.diseaseImageSrc}
                alt={headerTitle}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={details.diseaseImageSrc}
                alt={headerTitle}
                fill
                className="object-cover"
                sizes="64px"
              />
            )
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            {commodity} disease
          </p>
          <p className="truncate text-xl font-bold leading-tight text-navy">
            {headerTitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleFlag}
          aria-label={
            details.flaggedForFollowUp
              ? "Remove follow up flag"
              : "Flag for follow up"
          }
          aria-pressed={details.flaggedForFollowUp}
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
            details.flaggedForFollowUp
              ? "bg-amber-100 text-amber-700"
              : "text-muted hover:bg-surface hover:text-navy",
          ].join(" ")}
        >
          <FlagIcon filled={details.flaggedForFollowUp} />
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

function PlantLocationStep({
  plantLocations,
  onToggle,
}: {
  plantLocations: string[];
  onToggle: (location: string) => void;
}) {
  return (
    <section className="pt-2">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#e87722]">
        Plant location
      </p>
      <h2 className="mb-4 text-lg font-bold text-navy">Where do you see it?</h2>

      <div className="grid grid-cols-2 gap-2.5">
        {PLANT_LOCATIONS.map((location) => {
          const selected = plantLocations.includes(location);

          return (
            <button
              key={location}
              type="button"
              onClick={() => onToggle(location)}
              aria-pressed={selected}
              className={[
                "rounded-xl border px-3 py-3.5 text-sm font-semibold transition-all active:scale-[0.98]",
                selected
                  ? "border-teal bg-teal/10 text-teal"
                  : "border-border bg-surface-elevated text-muted",
              ].join(" ")}
            >
              {location}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ScalesStep({
  fieldPrevalence,
  severityScale,
  onPrevalenceChange,
  onSeverityChange,
}: {
  fieldPrevalence: number;
  severityScale: number;
  onPrevalenceChange: (value: number) => void;
  onSeverityChange: (value: number) => void;
}) {
  return (
    <section className="space-y-4 pt-2">
      <div className="mb-2">
        <h2 className="text-lg font-bold text-navy">How bad and how widespread?</h2>
        <p className="mt-1 text-sm text-muted">
          Severity describes the affected plant. Spread describes the field.
        </p>
      </div>

      <DiseaseScaleCard
        label="Severity"
        question="How bad is it on the plant?"
        value={severityScale}
        options={DISEASE_SEVERITY_LABELS}
        accentColor="#dc2626"
        trackColor="#fecaca"
        onChange={onSeverityChange}
      />
      <DiseaseScaleCard
        label="Spread"
        question="How far has it spread?"
        value={fieldPrevalence}
        options={DISEASE_SPREAD_LABELS}
        accentColor="#e87722"
        trackColor="#374151"
        onChange={onPrevalenceChange}
      />
    </section>
  );
}

function DiseaseScaleCard({
  label,
  question,
  value,
  options,
  accentColor,
  trackColor,
  onChange,
}: {
  label: string;
  question: string;
  value: number;
  options: readonly string[];
  accentColor: string;
  trackColor: string;
  onChange: (value: number) => void;
}) {
  const fillPercent = ((value - 1) / (options.length - 1)) * 100;

  return (
    <div className="rounded-2xl border border-border/80 bg-surface-elevated p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: accentColor }}
          >
            {label}
          </p>
          <h3 className="mt-1 text-base font-bold text-navy">{question}</h3>
        </div>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          {value}
        </span>
      </div>

      <div className="relative px-0.5">
        <div
          className="relative h-2 rounded-full"
          style={{ backgroundColor: trackColor }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-200"
            style={{ width: `${fillPercent}%`, backgroundColor: accentColor }}
          />
        </div>
        <input
          type="range"
          min={1}
          max={options.length}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="disease-scale-slider absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent"
          aria-label={question}
        />
      </div>

      <div className="mt-3 flex justify-between gap-1">
        {options.map((option, index) => {
          const optionValue = index + 1;
          const selected = value === optionValue;

          return (
            <div key={option} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  selected ? "opacity-100" : "opacity-0",
                ].join(" ")}
                style={{ backgroundColor: selected ? accentColor : "transparent" }}
              />
              <span
                className={[
                  "text-center text-[10px] leading-tight",
                  selected ? "font-bold text-navy" : "font-medium text-muted",
                ].join(" ")}
              >
                {option}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotesStep({
  details,
  isOtherFlow,
  onChange,
  onNotesChange,
  onMediaChange,
  onOpenCamera,
}: {
  details: DiseaseObservationDetails;
  isOtherFlow: boolean;
  onChange: (details: DiseaseObservationDetails) => void;
  onNotesChange: (value: string) => void;
  onMediaChange: (media: ObservationMediaItem[]) => void;
  onOpenCamera: () => void;
}) {
  return (
    <section className="space-y-6 pt-2">
      {isOtherFlow && (
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#e87722]">
            Disease name
          </p>
          <h2 className="mb-1 text-lg font-bold text-navy">What did you find?</h2>
          <p className="mb-4 text-sm text-muted">
            Optional — leave blank if you are not sure
          </p>
          <input
            type="text"
            value={details.diseaseOther}
            onChange={(e) => {
              const value = e.target.value;
              onChange({
                ...details,
                diseaseOther: value,
                diseaseLabel: value.trim() || "Disease",
              });
            }}
            placeholder="Enter disease name…"
            className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-navy outline-none transition-all placeholder:text-muted/60 focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>
      )}

      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#e87722]">
          Photos
        </p>
        <h2 className="mb-4 text-lg font-bold text-navy">Add supporting images</h2>
        <ObservationMediaSection
          media={details.media}
          onMediaChange={onMediaChange}
          onOpenCamera={onOpenCamera}
        />
      </div>

      <div>
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#e87722]">
          Notes
        </p>
        <h2 className="mb-4 text-lg font-bold text-navy">Anything else to add?</h2>
        <textarea
          value={details.otherNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={4}
          placeholder="Add any additional observations…"
          className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-navy outline-none transition-all placeholder:text-muted/60 focus:border-teal focus:ring-2 focus:ring-teal/20"
        />
      </div>
    </section>
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

function FlagIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 22V4" />
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    </svg>
  );
}

function ObservationMediaSection({
  media,
  onMediaChange,
  onOpenCamera,
}: {
  media: ObservationMediaItem[];
  onMediaChange: (media: ObservationMediaItem[]) => void;
  onOpenCamera: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newMedia = files.map((file) => ({
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: file.type.startsWith("video/") ? ("video" as const) : ("image" as const),
      url: URL.createObjectURL(file),
      name: formatMediaUploadTime(),
      pendingAnalysis: file.type.startsWith("video/") ? true : undefined,
    }));

    onMediaChange([...media, ...newMedia]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeMedia(id: string) {
    const item = media.find((entry) => entry.id === id);
    if (item) {
      URL.revokeObjectURL(item.url);
    }

    onMediaChange(media.filter((entry) => entry.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="disease-detail-media-upload"
        />
        <label
          htmlFor="disease-detail-media-upload"
          className="flex h-16 flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-teal/40 bg-teal/5 text-sm text-muted transition-colors active:bg-teal/10"
        >
          <UploadIcon />
          <span className="mt-1.5 text-center text-xs">Upload image or video</span>
        </label>
        <span className="shrink-0 text-xs font-medium text-muted">or</span>
        <button
          type="button"
          onClick={onOpenCamera}
          className="flex h-16 flex-1 flex-col items-center justify-center rounded-xl border border-teal/40 bg-teal/5 text-sm text-muted transition-colors active:bg-teal/10"
        >
          <CameraIcon />
          <span className="mt-1.5 text-center text-xs">Take photo or video</span>
        </button>
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {media.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              {item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt={item.name}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="relative aspect-[4/3] w-full">
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
              )}
              <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                <p className="truncate text-[10px] text-muted">{item.name}</p>
                <button
                  type="button"
                  onClick={() => removeMedia(item.id)}
                  className="shrink-0 text-[10px] font-medium text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadIcon() {
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
      <path d="M12 3v12" />
      <path d="m7 8 5-5 5 5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function CameraIcon() {
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
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
