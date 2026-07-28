"use client";

import { useRef, useState } from "react";

const HOLD_DURATION_MS = 800;

interface HoldToEndButtonProps {
  onEnd: () => void;
  label?: string;
}

export function HoldToEndButton({
  onEnd,
  label = "Hold to end scouting",
}: HoldToEndButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const holdStartRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    buttonRef.current?.setPointerCapture(e.pointerId);
    completedRef.current = false;
    holdStartRef.current = Date.now();
    setIsHolding(true);
    setProgress(0);

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const nextProgress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      setProgress(nextProgress);
      if (nextProgress >= 100) {
        completedRef.current = true;
      }
    }, 50);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    buttonRef.current?.releasePointerCapture(e.pointerId);
    clearTimer();
    setIsHolding(false);
    setProgress(0);

    if (completedRef.current) {
      onEnd();
    }
    completedRef.current = false;
  }

  function handlePointerCancel() {
    clearTimer();
    setIsHolding(false);
    setProgress(0);
    completedRef.current = false;
  }

  return (
    <div className="relative">
      {isHolding && (
        <p className="mb-2 text-center text-xs font-medium text-muted">
          {progress >= 100 ? "Release to end session" : "Keep holding…"}
        </p>
      )}
      <button
        ref={buttonRef}
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onContextMenu={(e) => e.preventDefault()}
        className={[
          "relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl text-base font-semibold transition-all select-none touch-none",
          isHolding
            ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
            : "bg-navy text-white shadow-md active:scale-[0.98]",
        ].join(" ")}
      >
        {isHolding && (
          <span
            className="absolute inset-y-0 left-0 bg-red-600/80 transition-[width] duration-75"
            style={{ width: `${progress}%` }}
          />
        )}
        <span className="relative z-10">{label}</span>
      </button>
    </div>
  );
}
