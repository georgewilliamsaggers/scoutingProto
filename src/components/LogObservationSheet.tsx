"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CameraCaptureView } from "@/components/CameraCaptureView";
import {
  canSaveDiseaseObservation,
  canSaveWeedObservation,
  DISEASE_TYPES,
  DiseaseObservationDetails,
  EMPTY_DISEASE_DETAILS,
  EMPTY_OTHER_DETAILS,
  EMPTY_WEED_DETAILS,
  formatDiseaseSummary,
  formatOtherSummary,
  formatWeedSummary,
  getObservationLabel,
  isDiseasePhotoRequired,
  ObservationMediaItem,
  ObservationType,
  OtherObservationDetails,
  formatMediaUploadTime,
  WEED_DENSITY_CLASSES,
  WEED_DISTRIBUTION_PATTERNS,
  WEED_GROUPS,
  WEED_GROWTH_STAGES,
  WEED_TYPES,
  WeedObservationDetails,
} from "@/lib/observations";

interface LogObservationSheetProps {
  open: boolean;
  type: ObservationType | null;
  onClose: () => void;
  onSave: (
    type: ObservationType,
    note: string,
    diseaseDetails?: DiseaseObservationDetails,
    otherDetails?: OtherObservationDetails,
    weedDetails?: WeedObservationDetails
  ) => void;
}

export function LogObservationSheet({
  open,
  type,
  onClose,
  onSave,
}: LogObservationSheetProps) {
  const [note, setNote] = useState("");
  const [diseaseDetails, setDiseaseDetails] =
    useState<DiseaseObservationDetails>(EMPTY_DISEASE_DETAILS);
  const [otherDetails, setOtherDetails] =
    useState<OtherObservationDetails>(EMPTY_OTHER_DETAILS);
  const [weedDetails, setWeedDetails] =
    useState<WeedObservationDetails>(EMPTY_WEED_DETAILS);
  const [cameraTarget, setCameraTarget] = useState<"disease" | "other" | "weed" | null>(
    null
  );

  useEffect(() => {
    if (open) {
      setNote("");
      setDiseaseDetails(EMPTY_DISEASE_DETAILS);
      setOtherDetails(EMPTY_OTHER_DETAILS);
      setWeedDetails(EMPTY_WEED_DETAILS);
      setCameraTarget(null);
    }
  }, [open, type]);

  if (!open || !type) return null;

  function revokeMedia(media: ObservationMediaItem[]) {
    media.forEach((item) => URL.revokeObjectURL(item.url));
  }

  function handleClose() {
    revokeMedia(otherDetails.media);
    revokeMedia(diseaseDetails.media);
    revokeMedia(weedDetails.media);
    onClose();
  }

  function handleSave() {
    if (!type) return;

    if (type === "disease" && !canSaveDiseaseObservation(diseaseDetails)) return;
    if (type === "weed" && !canSaveWeedObservation(weedDetails)) return;

    if (type === "disease") {
      onSave(type, formatDiseaseSummary(diseaseDetails), diseaseDetails);
    } else if (type === "weed") {
      onSave(type, formatWeedSummary(weedDetails), undefined, undefined, weedDetails);
    } else if (type === "other") {
      onSave(type, formatOtherSummary(note, otherDetails), undefined, otherDetails);
    } else {
      onSave(type, note.trim());
    }

    onClose();
  }

  function handleCameraCapture(item: Omit<ObservationMediaItem, "id">) {
    const mediaItem: ObservationMediaItem = {
      ...item,
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };

    if (cameraTarget === "disease") {
      setDiseaseDetails((prev) => ({
        ...prev,
        media: [...prev.media, mediaItem],
      }));
    } else if (cameraTarget === "weed") {
      setWeedDetails((prev) => ({
        ...prev,
        media: [...prev.media, mediaItem],
      }));
    } else if (cameraTarget === "other") {
      setOtherDetails((prev) => ({
        media: [...prev.media, mediaItem],
      }));
    }

    setCameraTarget(null);
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-surface-elevated">
      <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-7 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <h2 className="text-lg font-bold text-navy">
          Log {getObservationLabel(type)}
        </h2>
        <button
          type="button"
          onClick={handleClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-navy"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-7 py-4">
        {type === "disease" ? (
          <DiseaseObservationForm
            details={diseaseDetails}
            onChange={setDiseaseDetails}
            onOpenCamera={() => setCameraTarget("disease")}
          />
        ) : type === "weed" ? (
          <WeedObservationForm
            details={weedDetails}
            onChange={setWeedDetails}
            onOpenCamera={() => setCameraTarget("weed")}
          />
        ) : type === "other" ? (
          <OtherObservationForm
            note={note}
            details={otherDetails}
            onNoteChange={setNote}
            onDetailsChange={setOtherDetails}
            onOpenCamera={() => setCameraTarget("other")}
          />
        ) : (
          <>
            <label
              htmlFor="observation-note"
              className="mb-1.5 block text-sm font-medium text-navy"
            >
              Observation details
            </label>
            <textarea
              id="observation-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Describe what you observed…"
              className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-navy outline-none transition-all placeholder:text-muted/60 focus:border-lime focus:ring-2 focus:ring-lime/20"
            />
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-border/60 px-7 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handleSave}
          disabled={
            (type === "disease" && !canSaveDiseaseObservation(diseaseDetails)) ||
            (type === "weed" && !canSaveWeedObservation(weedDetails))
          }
          className="gradient-brand flex h-12 w-full items-center justify-center rounded-xl text-base font-semibold text-white shadow-lg shadow-lime/25 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          Save observation
        </button>
      </div>

      <CameraCaptureView
        open={cameraTarget !== null}
        onClose={() => setCameraTarget(null)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
}

function DiseaseObservationForm({
  details,
  onChange,
  onOpenCamera,
}: {
  details: DiseaseObservationDetails;
  onChange: (details: DiseaseObservationDetails) => void;
  onOpenCamera: () => void;
}) {
  function updateField<K extends keyof DiseaseObservationDetails>(
    key: K,
    value: DiseaseObservationDetails[K]
  ) {
    onChange({ ...details, [key]: value });
  }

  function handleDiseaseChange(value: string) {
    onChange({
      ...details,
      disease: value,
      diseaseOther: value === "Other" ? details.diseaseOther : "",
    });
  }

  const photoRequired = isDiseasePhotoRequired(details);
  const photoMissing = photoRequired && !details.media.some((item) => item.type === "image");

  return (
    <div className="space-y-4">
      <FormField label="Disease">
        <select
          value={details.disease}
          onChange={(e) => handleDiseaseChange(e.target.value)}
          className={inputClassName}
        >
          <option value="">Select disease…</option>
          {DISEASE_TYPES.map((disease) => (
            <option key={disease} value={disease}>
              {disease}
            </option>
          ))}
        </select>
        {details.disease === "Unknown" && (
          <p className="mt-2 text-sm leading-relaxed text-teal">
            Please ensure you capture an image of the disease for identification
          </p>
        )}
      </FormField>

      {details.disease === "Other" && (
        <FormField label="Specify disease">
          <input
            type="text"
            value={details.diseaseOther}
            onChange={(e) => updateField("diseaseOther", e.target.value)}
            placeholder="Enter disease name…"
            className={inputClassName}
          />
        </FormField>
      )}

      <FormField label="Symptom location">
        <input
          type="text"
          value={details.symptomLocation}
          onChange={(e) => updateField("symptomLocation", e.target.value)}
          placeholder="e.g. Lower canopy, flag leaf"
          className={inputClassName}
        />
      </FormField>

      <FormField label="Lesion type">
        <input
          type="text"
          value={details.lesionType}
          onChange={(e) => updateField("lesionType", e.target.value)}
          placeholder="e.g. Necrotic spots, pustules"
          className={inputClassName}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="% plants affected">
          <input
            type="number"
            min="0"
            max="100"
            value={details.plantsAffectedPercent}
            onChange={(e) => updateField("plantsAffectedPercent", e.target.value)}
            placeholder="0–100"
            className={inputClassName}
          />
        </FormField>

        <FormField label="Severity">
          <select
            value={details.severity}
            onChange={(e) => updateField("severity", e.target.value)}
            className={inputClassName}
          >
            <option value="">Select…</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </FormField>
      </div>

      <FormField label="Estimated area affected (%)">
        <input
          type="number"
          min="0"
          max="100"
          value={details.areaAffectedPercent}
          onChange={(e) => updateField("areaAffectedPercent", e.target.value)}
          placeholder="0–100"
          className={inputClassName}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <ToggleField
          label="Sample taken"
          checked={details.sampleTaken}
          onChange={(checked) => updateField("sampleTaken", checked)}
        />
        <ToggleField
          label="Needs action"
          checked={details.needsAction}
          onChange={(checked) => updateField("needsAction", checked)}
        />
      </div>

      <FormField label="Other notes">
        <textarea
          value={details.otherNotes}
          onChange={(e) => updateField("otherNotes", e.target.value)}
          rows={6}
          placeholder="Any additional observations…"
          className={`${inputClassName} min-h-[9rem] resize-none py-3`}
        />
      </FormField>

      <ObservationMediaSection
        uploadInputId="disease-media-upload"
        media={details.media}
        onMediaChange={(media) => updateField("media", media)}
        onOpenCamera={onOpenCamera}
        label={photoRequired ? "Media (photo required)" : "Media"}
        photoRequired={photoRequired}
        photoMissing={photoMissing}
      />
    </div>
  );
}

function WeedObservationForm({
  details,
  onChange,
  onOpenCamera,
}: {
  details: WeedObservationDetails;
  onChange: (details: WeedObservationDetails) => void;
  onOpenCamera: () => void;
}) {
  function updateField<K extends keyof WeedObservationDetails>(
    key: K,
    value: WeedObservationDetails[K]
  ) {
    onChange({ ...details, [key]: value });
  }

  function handleWeedChange(value: string) {
    onChange({
      ...details,
      weed: value,
      weedOther: value === "Other" ? details.weedOther : "",
    });
  }

  return (
    <div className="space-y-4">
      <FormField label="Weed">
        <select
          value={details.weed}
          onChange={(e) => handleWeedChange(e.target.value)}
          className={inputClassName}
        >
          <option value="">Select weed…</option>
          {WEED_TYPES.map((weed) => (
            <option key={weed} value={weed}>
              {weed}
            </option>
          ))}
        </select>
      </FormField>

      {details.weed === "Other" && (
        <FormField label="Specify weed">
          <input
            type="text"
            value={details.weedOther}
            onChange={(e) => updateField("weedOther", e.target.value)}
            placeholder="Enter weed name…"
            className={inputClassName}
          />
        </FormField>
      )}

      <FormField label="Weed group">
        <select
          value={details.weedGroup}
          onChange={(e) => updateField("weedGroup", e.target.value)}
          className={inputClassName}
        >
          <option value="">Select weed group…</option>
          {WEED_GROUPS.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Weed growth stage">
        <select
          value={details.weedGrowthStage}
          onChange={(e) => updateField("weedGrowthStage", e.target.value)}
          className={inputClassName}
        >
          <option value="">Select growth stage…</option>
          {WEED_GROWTH_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Density class">
        <select
          value={details.densityClass}
          onChange={(e) => updateField("densityClass", e.target.value)}
          className={inputClassName}
        >
          <option value="">Select density class…</option>
          {WEED_DENSITY_CLASSES.map((density) => (
            <option key={density} value={density}>
              {density}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Distribution pattern">
        <select
          value={details.distributionPattern}
          onChange={(e) => updateField("distributionPattern", e.target.value)}
          className={inputClassName}
        >
          <option value="">Select distribution pattern…</option>
          {WEED_DISTRIBUTION_PATTERNS.map((pattern) => (
            <option key={pattern} value={pattern}>
              {pattern}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Height min (cm)">
          <input
            type="number"
            min="0"
            value={details.heightMinCm}
            onChange={(e) => updateField("heightMinCm", e.target.value)}
            placeholder="e.g. 5"
            className={inputClassName}
          />
        </FormField>

        <FormField label="Height max (cm)">
          <input
            type="number"
            min="0"
            value={details.heightMaxCm}
            onChange={(e) => updateField("heightMaxCm", e.target.value)}
            placeholder="e.g. 30"
            className={inputClassName}
          />
        </FormField>
      </div>

      <ObservationMediaSection
        uploadInputId="weed-media-upload"
        media={details.media}
        onMediaChange={(media) => updateField("media", media)}
        onOpenCamera={onOpenCamera}
      />
    </div>
  );
}

function OtherObservationForm({
  note,
  details,
  onNoteChange,
  onDetailsChange,
  onOpenCamera,
}: {
  note: string;
  details: OtherObservationDetails;
  onNoteChange: (note: string) => void;
  onDetailsChange: (details: OtherObservationDetails) => void;
  onOpenCamera: () => void;
}) {
  return (
    <div className="space-y-4">
      <FormField label="Observation details">
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={8}
          placeholder="Describe what you observed…"
          className="min-h-[12rem] w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-navy outline-none transition-all placeholder:text-muted/60 focus:border-lime focus:ring-2 focus:ring-lime/20"
        />
      </FormField>

      <ObservationMediaSection
        uploadInputId="other-media-upload"
        media={details.media}
        onMediaChange={(media) => onDetailsChange({ media })}
        onOpenCamera={onOpenCamera}
      />
    </div>
  );
}

function ObservationMediaSection({
  uploadInputId,
  media,
  onMediaChange,
  onOpenCamera,
  label = "Media",
  photoRequired = false,
  photoMissing = false,
}: {
  uploadInputId: string;
  media: ObservationMediaItem[];
  onMediaChange: (media: ObservationMediaItem[]) => void;
  onOpenCamera: () => void;
  label?: string;
  photoRequired?: boolean;
  photoMissing?: boolean;
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
    <>
      <FormField label={label}>
        <div
          className={[
            "flex items-center gap-2 rounded-xl",
            photoMissing ? "ring-2 ring-red-200" : "",
          ].join(" ")}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id={uploadInputId}
          />
          <label
            htmlFor={uploadInputId}
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
            <span className="mt-1.5 text-center text-xs">Capture photo or video</span>
          </button>
        </div>
        {photoMissing && (
          <p className="mt-2 text-xs text-red-600">
            A photo is required when the disease is unknown.
          </p>
        )}
      </FormField>

      {media.length > 0 && (
        <div className="space-y-3">
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
                  className="h-36 w-full object-cover"
                />
              ) : (
                <div className="relative">
                  <video
                    src={item.url}
                    controls
                    playsInline
                    className="h-36 w-full object-cover"
                  />
                  {item.pendingAnalysis && (
                    <span className="absolute left-3 top-3 rounded-full bg-navy/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Pending analysis
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between px-3 py-2">
                <p className="truncate text-xs text-muted">{item.name}</p>
                <button
                  type="button"
                  onClick={() => removeMedia(item.id)}
                  className="text-xs font-medium text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">{label}</label>
      {children}
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "flex h-11 items-center justify-between rounded-xl border px-3 text-sm font-medium transition-colors",
        checked
          ? "border-teal bg-teal/10 text-teal"
          : "border-border bg-surface text-muted",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "flex h-5 w-5 items-center justify-center rounded-full border-2",
          checked ? "border-teal bg-teal" : "border-border bg-surface-elevated",
        ].join(" ")}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
    </button>
  );
}

const inputClassName =
  "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-navy outline-none transition-all placeholder:text-muted/60 focus:border-lime focus:ring-2 focus:ring-lime/20";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="m7 8 5-5 5 5" />
      <path d="M5 21h14" />
    </svg>
  );
}
