"use client";

import { useEffect, useRef } from "react";
import { formatDuration, useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { VoiceNoteDetails } from "@/lib/observations";

interface HoldToRecordVoiceNoteProps {
  value?: VoiceNoteDetails;
  onChange: (voiceNote: VoiceNoteDetails | undefined) => void;
}

export function HoldToRecordVoiceNote({
  value,
  onChange,
}: HoldToRecordVoiceNoteProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isRecordingRef = useRef(false);
  const {
    isRecording,
    durationSeconds,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    reset,
    takeAudioUrl,
  } = useVoiceRecorder();

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    if (isRecording || !audioUrl) return;

    const url = takeAudioUrl();
    if (!url) return;

    onChange({
      audioUrl: url,
      durationSeconds: Math.max(durationSeconds, 1),
    });
    reset();
  }, [audioUrl, durationSeconds, isRecording, onChange, reset, takeAudioUrl]);

  function clearVoiceNote() {
    if (value?.audioUrl) {
      URL.revokeObjectURL(value.audioUrl);
    }
    reset();
    onChange(undefined);
  }

  async function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    buttonRef.current?.setPointerCapture(e.pointerId);
    if (value?.audioUrl) {
      URL.revokeObjectURL(value.audioUrl);
      onChange(undefined);
    }
    await startRecording();
  }

  function handlePointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    buttonRef.current?.releasePointerCapture(e.pointerId);
    if (isRecordingRef.current) {
      stopRecording();
    }
  }

  return (
    <div className="mt-4">
      <button
        ref={buttonRef}
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
        className={[
          "flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl border text-sm font-medium transition-colors select-none touch-none",
          isRecording
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-indigo-200 bg-indigo-50 text-indigo-800 active:bg-indigo-100",
        ].join(" ")}
      >
        <MicIcon recording={isRecording} />
        <span>
          {isRecording
            ? `Recording ${formatDuration(durationSeconds)}…`
            : "Hold to record a voice note"}
        </span>
      </button>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {value && !isRecording && (
        <div className="mt-3 rounded-xl border border-border/80 bg-surface px-3 py-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-navy">
              Voice note · {formatDuration(value.durationSeconds)}
            </p>
            <button
              type="button"
              onClick={clearVoiceNote}
              className="text-xs font-medium text-red-600"
            >
              Remove
            </button>
          </div>
          <audio
            src={value.audioUrl}
            controls
            playsInline
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}

function MicIcon({ recording }: { recording: boolean }) {
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
      className={recording ? "animate-pulse" : ""}
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
    </svg>
  );
}
