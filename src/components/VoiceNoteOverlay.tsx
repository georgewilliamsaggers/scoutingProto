"use client";

import { useEffect, useState } from "react";
import { CameraCaptureView } from "@/components/CameraCaptureView";
import { formatDuration, useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { ObservationMediaItem, VoiceNoteDetails } from "@/lib/observations";

const MAX_VOICE_NOTE_PHOTOS = 3;

interface VoiceNoteOverlayProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (details: VoiceNoteDetails) => void;
}

export function VoiceNoteOverlay({ open, onClose, onSubmit }: VoiceNoteOverlayProps) {
  const [photos, setPhotos] = useState<ObservationMediaItem[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);

  const {
    isRecording,
    isPaused,
    canPause,
    durationSeconds,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    reRecord,
    discardRecording,
    reset,
    takeAudioUrl,
  } = useVoiceRecorder();

  useEffect(() => {
    if (!open) return;

    setPhotos((prev) => {
      prev.forEach((photo) => URL.revokeObjectURL(photo.url));
      return [];
    });
    setCameraOpen(false);
    void startRecording();

    return () => {
      reset();
    };
  }, [open, reset, startRecording]);

  if (!open) return null;

  const isReview = !isRecording && !!audioUrl;
  const canAddPhoto = (isRecording || isReview) && photos.length < MAX_VOICE_NOTE_PHOTOS;
  const showCamera = isRecording || isReview;

  function revokePhotos(items: ObservationMediaItem[]) {
    items.forEach((item) => URL.revokeObjectURL(item.url));
  }

  function handleCancel() {
    revokePhotos(photos);
    setPhotos([]);
    discardRecording();
    onClose();
  }

  function handleSubmit() {
    const url = takeAudioUrl();
    if (!url) return;

    const submittedPhotos = photos;
    setPhotos([]);

    onSubmit({
      audioUrl: url,
      durationSeconds: Math.max(durationSeconds, 1),
      media: submittedPhotos.length > 0 ? submittedPhotos : undefined,
    });
    onClose();
  }

  function handleCameraCapture(item: Omit<ObservationMediaItem, "id">) {
    if (item.type !== "image" || photos.length >= MAX_VOICE_NOTE_PHOTOS) return;

    setPhotos((prev) => [
      ...prev,
      {
        ...item,
        id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      },
    ]);
    setCameraOpen(false);
  }

  function handleRemovePhoto(id: string) {
    setPhotos((prev) => {
      const photo = prev.find((item) => item.id === id);
      if (photo) URL.revokeObjectURL(photo.url);
      return prev.filter((item) => item.id !== id);
    });
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-surface-elevated">
      <div className="flex shrink-0 flex-col items-center border-b border-border/60 px-7 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <h2 className="text-lg font-bold text-navy">Voice note</h2>
        <p className="mt-1 text-center text-sm text-muted">
          Record a voice note of your observation
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-7 py-8">
        {isRecording && (
          <span
            className={[
              "mb-6 flex items-center gap-2 text-sm font-medium",
              isPaused ? "text-muted" : "text-red-600",
            ].join(" ")}
          >
            {!isPaused && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
            )}
            {isPaused ? "Paused" : "Recording"}
          </span>
        )}

        {isReview && (
          <p className="mb-6 text-sm font-medium text-teal">Review your recording</p>
        )}

        {isRecording && canPause && (
          <button
            type="button"
            onClick={isPaused ? resumeRecording : pauseRecording}
            className={[
              "relative mb-6 flex h-28 w-28 items-center justify-center rounded-full transition-all active:scale-95",
              isPaused
                ? "gradient-brand shadow-lg shadow-teal/25"
                : "bg-red-500 shadow-lg shadow-red-500/30",
            ].join(" ")}
            aria-label={isPaused ? "Resume recording" : "Pause recording"}
          >
            {!isPaused && (
              <span className="absolute inset-0 animate-ping rounded-full bg-red-400/40" />
            )}
            <span className="relative">
              {isPaused ? <PlayIcon /> : <PauseIcon />}
            </span>
          </button>
        )}

        {isRecording && !canPause && (
          <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/30">
            <span className="absolute inset-0 animate-ping rounded-full bg-red-400/40" />
            <span className="relative">
              <MicIcon />
            </span>
          </div>
        )}

        <p className="text-4xl font-bold tabular-nums text-navy">
          {formatDuration(durationSeconds)}
        </p>

        {showCamera && (
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            disabled={!canAddPhoto}
            className="mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface text-navy shadow-sm transition-all hover:bg-surface-elevated active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Add photo"
          >
            <CameraIcon />
          </button>
        )}

        {error && (
          <p className="mt-4 max-w-xs text-center text-sm text-red-600">{error}</p>
        )}

        {isReview && (
          <div className="mt-8 w-full max-w-sm">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio src={audioUrl} controls className="w-full" />
            <button
              type="button"
              onClick={() => void reRecord()}
              className="mt-4 w-full text-center text-sm font-medium text-muted transition-colors hover:text-navy"
            >
              Re-record
            </button>
          </div>
        )}
      </div>

      {photos.length > 0 && (
        <div className="flex shrink-0 justify-center px-7 pb-3">
          <div className="flex items-center">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative -ml-3 first:ml-0"
                style={{ zIndex: index + 1 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="h-14 w-14 rounded-xl object-cover ring-2 ring-surface-elevated shadow-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-white shadow"
                  aria-label="Remove photo"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="shrink-0 space-y-3 border-t border-border/60 px-7 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {isRecording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-red-500 text-base font-semibold text-white shadow-lg shadow-red-500/25 transition-all active:scale-[0.98]"
          >
            Stop recording
          </button>
        ) : isReview ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary-block"
          >
            Submit recording
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="flex h-12 w-full items-center justify-center rounded-xl bg-red-500 text-base font-semibold text-white opacity-50"
          >
            Stop recording
          </button>
        )}

        <button
          type="button"
          onClick={handleCancel}
          className="w-full text-center text-sm font-medium text-muted transition-colors hover:text-navy"
        >
          Cancel recording
        </button>
      </div>

      <CameraCaptureView
        open={cameraOpen}
        photoOnly
        onClose={() => setCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
}

function PauseIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l10.15-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
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

function CloseIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
