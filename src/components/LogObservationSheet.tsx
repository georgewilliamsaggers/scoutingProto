"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CameraCaptureView } from "@/components/CameraCaptureView";
import {
  DiseaseObservationDetails,
  EMPTY_OTHER_DETAILS,
  formatOtherSummary,
  getObservationLabel,
  ObservationMediaItem,
  ObservationType,
  OtherObservationDetails,
  formatMediaUploadTime,
} from "@/lib/observations";

interface LogObservationSheetProps {
  open: boolean;
  type: ObservationType | null;
  onClose: () => void;
  onSave: (
    type: ObservationType,
    note: string,
    diseaseDetails?: DiseaseObservationDetails,
    otherDetails?: OtherObservationDetails
  ) => void;
}

export function LogObservationSheet({
  open,
  type,
  onClose,
  onSave,
}: LogObservationSheetProps) {
  const [note, setNote] = useState("");
  const [otherDetails, setOtherDetails] =
    useState<OtherObservationDetails>(EMPTY_OTHER_DETAILS);
  const [cameraTarget, setCameraTarget] = useState<"other" | null>(null);

  useEffect(() => {
    if (open) {
      setNote("");
      setOtherDetails(EMPTY_OTHER_DETAILS);
      setCameraTarget(null);
    }
  }, [open, type]);

  if (!open || !type) return null;

  function revokeMedia(media: ObservationMediaItem[]) {
    media.forEach((item) => URL.revokeObjectURL(item.url));
  }

  function handleClose() {
    revokeMedia(otherDetails.media);
    onClose();
  }

  function handleSave() {
    if (!type) return;

    if (type === "other") {
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

    if (cameraTarget === "other") {
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
        {type === "other" ? (
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
  photoMissing = false,
}: {
  uploadInputId: string;
  media: ObservationMediaItem[];
  onMediaChange: (media: ObservationMediaItem[]) => void;
  onOpenCamera: () => void;
  label?: string;
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
