"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export { formatDuration };

function getSupportedAudioMimeType() {
  if (typeof MediaRecorder === "undefined") return "";

  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/aac",
  ];

  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function supportsRecorderPause() {
  return (
    typeof MediaRecorder !== "undefined" &&
    typeof MediaRecorder.prototype.pause === "function"
  );
}

interface UseVoiceRecorderOptions {
  onError?: (message: string) => void;
}

export function useVoiceRecorder({ onError }: UseVoiceRecorderOptions = {}) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const segmentStartRef = useRef(0);
  const mimeTypeRef = useRef("");
  const audioUrlRef = useRef<string | null>(null);
  const sessionRef = useRef(0);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [canPause, setCanPause] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const revokeAudio = useCallback((url: string | null) => {
    if (url) URL.revokeObjectURL(url);
  }, []);

  const setOwnedAudioUrl = useCallback((url: string | null) => {
    audioUrlRef.current = url;
    setAudioUrl(url);
  }, []);

  const takeAudioUrl = useCallback(() => {
    const url = audioUrlRef.current;
    audioUrlRef.current = null;
    setAudioUrl(null);
    return url;
  }, []);

  const syncDuration = useCallback(() => {
    if (!segmentStartRef.current) return;
    setDurationSeconds(
      elapsedRef.current +
        Math.floor((Date.now() - segmentStartRef.current) / 1000)
    );
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    segmentStartRef.current = Date.now();
    timerRef.current = window.setInterval(syncDuration, 250);
  }, [clearTimer, syncDuration]);

  const pauseTimer = useCallback(() => {
    if (segmentStartRef.current) {
      elapsedRef.current += Math.floor(
        (Date.now() - segmentStartRef.current) / 1000
      );
      setDurationSeconds(elapsedRef.current);
    }
    clearTimer();
    segmentStartRef.current = 0;
  }, [clearTimer]);

  const finalizeElapsed = useCallback(() => {
    if (segmentStartRef.current) {
      elapsedRef.current += Math.floor(
        (Date.now() - segmentStartRef.current) / 1000
      );
      setDurationSeconds(elapsedRef.current);
    }
    clearTimer();
    segmentStartRef.current = 0;
  }, [clearTimer]);

  const stopActiveRecorder = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        // Recorder may already be stopping.
      }
    }
    mediaRecorderRef.current = null;
  }, []);

  const reset = useCallback(() => {
    sessionRef.current += 1;
    clearTimer();
    stopActiveRecorder();
    stopStream();
    chunksRef.current = [];
    elapsedRef.current = 0;
    segmentStartRef.current = 0;
    mimeTypeRef.current = "";
    setIsRecording(false);
    setIsPaused(false);
    setDurationSeconds(0);
    if (audioUrlRef.current) {
      revokeAudio(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioUrl(null);
    setError(null);
  }, [clearTimer, revokeAudio, stopActiveRecorder, stopStream]);

  useEffect(() => {
    setCanPause(supportsRecorderPause());

    return () => {
      clearTimer();
      stopActiveRecorder();
      stopStream();
    };
  }, [clearTimer, stopActiveRecorder, stopStream]);

  const startRecording = useCallback(async () => {
    const session = ++sessionRef.current;
    setError(null);
    setIsPaused(false);
    elapsedRef.current = 0;
    setDurationSeconds(0);
    if (audioUrlRef.current) {
      revokeAudio(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioUrl(null);

    stopActiveRecorder();
    stopStream();
    chunksRef.current = [];

    try {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        throw new Error("unsupported");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (session !== sessionRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      const mimeType = getSupportedAudioMimeType();
      mimeTypeRef.current = mimeType;

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        if (session !== sessionRef.current) return;

        const blob = new Blob(chunksRef.current, {
          type: mimeTypeRef.current || "audio/webm",
        });
        chunksRef.current = [];
        stopStream();

        if (blob.size === 0) return;

        setOwnedAudioUrl(URL.createObjectURL(blob));
      };

      recorder.start();
      setIsRecording(true);
      startTimer();
    } catch {
      if (session !== sessionRef.current) return;

      const message =
        "Microphone access is unavailable. Check permissions and try again.";
      setError(message);
      onError?.(message);
      stopActiveRecorder();
      stopStream();
      setIsRecording(false);
    }
  }, [
    onError,
    revokeAudio,
    setOwnedAudioUrl,
    startTimer,
    stopActiveRecorder,
    stopStream,
  ]);

  const stopRecording = useCallback(() => {
    finalizeElapsed();
    setIsRecording(false);
    setIsPaused(false);
    stopActiveRecorder();
  }, [finalizeElapsed, stopActiveRecorder]);

  const pauseRecording = useCallback(() => {
    if (!canPause) {
      const message = "Pause is not supported in this browser.";
      setError(message);
      onError?.(message);
      return;
    }

    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "recording") return;

    try {
      recorder.pause();
      pauseTimer();
      setIsPaused(true);
    } catch {
      const message = "Unable to pause recording.";
      setError(message);
      onError?.(message);
    }
  }, [canPause, onError, pauseTimer]);

  const resumeRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== "paused") return;

    try {
      recorder.resume();
      startTimer();
      setIsPaused(false);
      setError(null);
    } catch {
      const message = "Unable to resume recording.";
      setError(message);
      onError?.(message);
    }
  }, [onError, startTimer]);

  const reRecord = useCallback(async () => {
    reset();
    await startRecording();
  }, [reset, startRecording]);

  return {
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
    discardRecording: reset,
    reset,
    takeAudioUrl,
  };
};
