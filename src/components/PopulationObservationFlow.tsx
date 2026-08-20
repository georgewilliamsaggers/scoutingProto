"use client";

import { useEffect, useState } from "react";
import { useScopeBriefOptional } from "@/components/ScopeBriefContext";
import {
  createPopulationDetails,
  formatPopulationDensity,
  formatPopulationSquareLabel,
  formatPopulationSummary,
  PopulationCountMethod,
  PopulationObservationDetails,
} from "@/lib/observations";

interface PopulationObservationFlowProps {
  open: boolean;
  method: PopulationCountMethod;
  onClose: () => void;
  onSave: (note: string, details: PopulationObservationDetails) => void;
}

export function PopulationObservationFlow({
  open,
  method,
  onClose,
  onSave,
}: PopulationObservationFlowProps) {
  const [details, setDetails] = useState<PopulationObservationDetails>(
    createPopulationDetails(method)
  );
  const [countInput, setCountInput] = useState("");
  const scopeBrief = useScopeBriefOptional();

  useEffect(() => {
    if (!open) return;

    setDetails(createPopulationDetails(method));
    setCountInput("");
  }, [open, method]);

  useEffect(() => {
    if (!open || !scopeBrief) return;
    scopeBrief.setActiveSectionId("population-count");
  }, [open, scopeBrief]);

  if (!open) return null;

  const parsedCount = parsePlantCount(countInput);
  const previewDetails =
    parsedCount === null ? details : { ...details, plantCount: parsedCount };
  const density = parsedCount === null ? null : formatPopulationDensity(previewDetails);
  const canSave = parsedCount !== null;

  function handleCountChange(value: string) {
    if (value === "") {
      setCountInput("");
      return;
    }

    if (!/^\d+$/.test(value)) return;
    setCountInput(value);
  }

  function adjustCount(delta: number) {
    const current = parsedCount ?? 0;
    const next = Math.max(0, current + delta);
    setCountInput(String(next));
  }

  function handleSave() {
    if (parsedCount === null) return;

    const saved: PopulationObservationDetails = {
      ...details,
      plantCount: parsedCount,
    };

    onSave(formatPopulationSummary(saved), saved);
    onClose();
  }

  const isSquare = method === "square";

  return (
    <div className="absolute inset-0 z-50 flex flex-col overflow-hidden bg-surface-elevated">
      <div className="shrink-0 border-b border-border/60 px-5 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onClose}
          className="mb-4 flex items-center gap-1 text-sm font-semibold text-navy transition-colors active:text-teal"
        >
          <ChevronLeftIcon />
          Back
        </button>

        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lime">
          Population count
        </p>
        <h1 className="mt-1 text-[1.625rem] font-bold leading-tight text-navy">
          {isSquare ? "Count plants in the square" : "Count plants in a 10 m row"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {isSquare
            ? "Enter how many plants are inside the project quadrat."
            : "Enter how many plants you counted along a 10 metre row."}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="rounded-2xl border border-border/80 bg-surface-elevated p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lime">
            {isSquare ? "Project square" : "Project row"}
          </p>
          <p className="mt-1 text-base font-bold text-navy">
            {isSquare
              ? formatPopulationSquareLabel(details)
              : `${details.rowLengthMeters} m row`}
          </p>
          <p className="mt-1 text-xs text-muted">
            Size is set for this project and cannot be changed here.
          </p>

          <div className="mt-4 flex justify-center">
            {isSquare ? <SquarePreview details={details} /> : <RowPreview lengthMeters={details.rowLengthMeters} />}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border/80 bg-surface-elevated p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-lime">
            Plant count
          </p>
          <h2 className="mt-1 text-base font-bold text-navy">How many plants did you count?</h2>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => adjustCount(-1)}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-2xl font-semibold text-navy transition-colors active:bg-stone-100"
              aria-label="Decrease count"
            >
              −
            </button>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={countInput}
              onChange={(event) => handleCountChange(event.target.value)}
              placeholder="0"
              aria-label="Number of plants"
              className="h-14 min-w-0 flex-1 rounded-2xl border border-border bg-surface text-center text-3xl font-bold tabular-nums text-navy outline-none transition-all placeholder:text-muted/40 focus:border-lime focus:ring-2 focus:ring-lime/20"
            />
            <button
              type="button"
              onClick={() => adjustCount(1)}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface text-2xl font-semibold text-navy transition-colors active:bg-stone-100"
              aria-label="Increase count"
            >
              +
            </button>
          </div>

          {density && (
            <p className="mt-3 text-center text-sm font-semibold text-teal">
              {density}
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border/60 px-5 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="btn-primary-block disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          Save population count
        </button>
      </div>
    </div>
  );
}

function parsePlantCount(value: string): number | null {
  if (value.trim() === "") return null;
  if (!/^\d+$/.test(value)) return null;
  return Number.parseInt(value, 10);
}

function SquarePreview({ details }: { details: PopulationObservationDetails }) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-xl border-2 border-dashed border-lime/70 bg-lime/10">
          <span className="text-center text-xs font-semibold leading-snug text-navy">
            {formatPopulationSquareLabel(details)}
          </span>
        </div>
        <span className="mt-1.5 text-[11px] font-medium text-muted">
          {details.squareWidthMeters} m
        </span>
      </div>
      <span className="mb-6 text-[11px] font-medium text-muted">
        {details.squareHeightMeters} m
      </span>
    </div>
  );
}

function RowPreview({ lengthMeters }: { lengthMeters: number }) {
  return (
    <div className="w-full max-w-xs py-2">
      <div className="flex items-center gap-2">
        <span className="h-3 w-px bg-lime" />
        <div className="relative h-px flex-1 bg-lime">
          <span className="absolute left-1/4 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime" />
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime" />
          <span className="absolute left-3/4 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime" />
        </div>
        <span className="h-3 w-px bg-lime" />
      </div>
      <p className="mt-2 text-center text-[11px] font-medium text-muted">
        {lengthMeters} m
      </p>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
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
