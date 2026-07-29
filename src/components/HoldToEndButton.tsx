"use client";

import { useEffect, useRef, useState } from "react";

const HOLD_DURATION_MS = 3000;

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
  const frameRef = useRef<number | null>(null);
  const endedRef = useRef(false);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);

  function clearFrame() {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }

  function resetHold() {
    clearFrame();
    setIsHolding(false);
    setProgress(0);
    endedRef.current = false;
  }

  function completeHold() {
    if (endedRef.current) return;

    endedRef.current = true;
    clearFrame();
    setIsHolding(false);
    setProgress(0);
    onEnd();
  }

  useEffect(() => clearFrame, []);

  function tick() {
    const elapsed = Date.now() - holdStartRef.current;
    const nextProgress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
    setProgress(nextProgress);

    if (nextProgress >= 100) {
      completeHold();
      return;
    }

    frameRef.current = window.requestAnimationFrame(tick);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    buttonRef.current?.setPointerCapture(e.pointerId);
    endedRef.current = false;
    holdStartRef.current = Date.now();
    setIsHolding(true);
    setProgress(0);
    clearFrame();
    frameRef.current = window.requestAnimationFrame(tick);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    buttonRef.current?.releasePointerCapture(e.pointerId);
    if (!endedRef.current) {
      resetHold();
    }
  }

  function handlePointerCancel() {
    if (!endedRef.current) {
      resetHold();
    }
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onContextMenu={(e) => e.preventDefault()}
        className={[
          "relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl text-base font-medium transition-colors select-none touch-none",
          isHolding
            ? "bg-red-100 text-red-800"
            : "bg-slate-100 text-slate-600 active:bg-slate-200",
        ].join(" ")}
      >
        {isHolding && (
          <span
            className="absolute inset-y-0 left-0 bg-red-500"
            style={{ width: `${progress}%` }}
          />
        )}
        <span
          className={[
            "relative z-10 transition-colors",
            isHolding && progress > 35 ? "text-white" : "",
          ].join(" ")}
        >
          {label}
        </span>
      </button>
    </div>
  );
}
