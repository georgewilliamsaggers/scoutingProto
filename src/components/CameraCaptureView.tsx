"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatMediaUploadTime, ObservationMediaItem } from "@/lib/observations";

const HOLD_THRESHOLD_MS = 250;

interface CameraCaptureViewProps {
  open: boolean;
  onClose: () => void;
  onCapture: (item: Omit<ObservationMediaItem, "id">) => void;
  photoOnly?: boolean;
}

export function CameraCaptureView({
  open,
  onClose,
  onCapture,
  photoOnly = false,
}: CameraCaptureViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const holdTimerRef = useRef<number | null>(null);
  const isRecordingRef = useRef(false);
  const pointerActiveRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!open) {
      stopStream();
      setReady(false);
      setError(null);
      setIsRecording(false);
      setRecordingDuration(0);
      isRecordingRef.current = false;
      pointerActiveRef.current = false;
      clearHoldTimer();
      return;
    }

    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: true,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setReady(true);
        setError(null);
      } catch {
        setError("Camera access is unavailable. Check permissions and try again.");
        setReady(false);
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      clearHoldTimer();
      stopStream();
    };
  }, [open, stopStream, clearHoldTimer]);

  useEffect(() => {
    if (!isRecording) return;

    const interval = window.setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRecording]);

  function getVideoMimeType() {
    if (typeof MediaRecorder === "undefined") return "";

    const candidates = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4",
    ];

    return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
  }

  function capturePhoto() {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream || video.videoWidth === 0) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        onCapture({
          type: "image",
          url: URL.createObjectURL(blob),
          name: formatMediaUploadTime(),
        });
        onClose();
      },
      "image/jpeg",
      0.92
    );
  }

  function startRecording() {
    const stream = streamRef.current;
    if (!stream || isRecordingRef.current) return;

    const mimeType = getVideoMimeType();
    if (!mimeType) {
      setError("Video recording is not supported on this device.");
      return;
    }

    chunksRef.current = [];

    try {
      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];

        if (blob.size === 0) return;

        onCapture({
          type: "video",
          url: URL.createObjectURL(blob),
          name: formatMediaUploadTime(),
          pendingAnalysis: true,
        });
        onClose();
      };

      recorder.start();
      isRecordingRef.current = true;
      setIsRecording(true);
      setRecordingDuration(0);
    } catch {
      setError("Unable to start video recording.");
    }
  }

  function stopRecording() {
    if (!isRecordingRef.current || !recorderRef.current) return;

    if (recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }

    recorderRef.current = null;
    isRecordingRef.current = false;
    setIsRecording(false);
  }

  function handleShutterPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!ready || error) return;

    pointerActiveRef.current = true;
    (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);

    if (photoOnly) return;

    clearHoldTimer();
    holdTimerRef.current = window.setTimeout(() => {
      if (pointerActiveRef.current) {
        startRecording();
      }
    }, HOLD_THRESHOLD_MS);
  }

  function handleShutterPointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    pointerActiveRef.current = false;
    (e.currentTarget as HTMLButtonElement).releasePointerCapture(e.pointerId);
    clearHoldTimer();

    if (isRecordingRef.current) {
      stopRecording();
      return;
    }

    capturePhoto();
  }

  function handleShutterPointerCancel() {
    pointerActiveRef.current = false;
    clearHoldTimer();

    if (isRecordingRef.current) {
      stopRecording();
    }
  }

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-[60] flex flex-col bg-navy">
      <div className="flex shrink-0 items-center justify-between px-7 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <div>
          <h2 className="text-lg font-bold text-white">
            {photoOnly ? "Take photo" : "Capture media"}
          </h2>
          <p className="mt-0.5 text-xs text-white/70">
            {photoOnly ? "Tap shutter to capture" : "Tap for photo · Hold for video"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close camera"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col px-7 pb-4">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-black ring-1 ring-white/10">
          {error ? (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-white/80">
              {error}
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          )}

          {isRecording && (
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1.5 text-xs font-semibold text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              REC {formatDuration(recordingDuration)}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-center pt-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <p className="mb-4 text-center text-xs text-white/70">
            {photoOnly
              ? "Tap shutter to take a photo"
              : isRecording
                ? "Release to save video for analysis"
                : "Hold shutter to record video"}
          </p>
          <button
            type="button"
            disabled={!ready || !!error}
            onPointerDown={handleShutterPointerDown}
            onPointerUp={handleShutterPointerUp}
            onPointerCancel={handleShutterPointerCancel}
            onContextMenu={(e) => e.preventDefault()}
            className={[
              "relative flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all select-none touch-none disabled:opacity-40",
              isRecording
                ? "border-red-500 bg-red-500/20"
                : "border-white bg-white/10 active:scale-95",
            ].join(" ")}
            aria-label="Capture photo or hold to record video"
          >
            <span
              className={[
                "rounded-full transition-all",
                isRecording ? "h-8 w-8 bg-red-500" : "h-14 w-14 bg-white",
              ].join(" ")}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function CloseIcon() {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
