"use client";

import {
  formatMoistureLevelValue,
  getMoistureDepth,
  getMoistureLevelForValue,
  MOISTURE_DEPTHS,
  MOISTURE_LEVELS,
} from "@/lib/observations";

interface MoistureCheckPageProps {
  activeDepthId: string;
  level: number;
  confirmedDepthIds: string[];
  onSelectDepth: (depthId: string) => void;
  onLevelChange: (level: number) => void;
  onSaveDepth: () => void;
  onFinish: () => void;
  onClose: () => void;
}

export function MoistureCheckPage({
  activeDepthId,
  level,
  confirmedDepthIds,
  onSelectDepth,
  onLevelChange,
  onSaveDepth,
  onFinish,
  onClose,
}: MoistureCheckPageProps) {
  const activeDepth = getMoistureDepth(activeDepthId) ?? MOISTURE_DEPTHS[0];
  const selectedLevel = getMoistureLevelForValue(level);
  const fillPercent = ((level - 1) / 4) * 100;
  const confirmedCount = confirmedDepthIds.length;
  const canFinish = confirmedCount > 0;

  return (
    <div className="absolute inset-0 z-50 flex flex-col overflow-hidden bg-surface-elevated">
      <div className="flex shrink-0 items-center justify-end px-5 pb-1 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-navy"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        <h1 className="text-[1.625rem] font-bold leading-tight text-navy">
          How wet is the soil?
        </h1>
        <p className="mt-2 text-sm text-muted">
          Feel the soil from{" "}
          <span className="font-semibold text-navy">{activeDepth.label}</span>, then tap
          what looks right.
        </p>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {MOISTURE_DEPTHS.map((depth) => {
            const isActive = depth.id === activeDepthId;
            const isConfirmed = confirmedDepthIds.includes(depth.id);

            return (
              <button
                key={depth.id}
                type="button"
                onClick={() => onSelectDepth(depth.id)}
                aria-pressed={isActive}
                className={[
                  "relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border-2 text-left transition-all active:scale-[0.98]",
                  isActive
                    ? "border-teal bg-[#c4a060] shadow-[0_0_0_3px_rgba(0,168,181,0.35)]"
                    : isConfirmed
                      ? "border-transparent bg-[#e8dcc8]"
                      : "border-transparent bg-[#b8a898]",
                ].join(" ")}
              >
                <span
                  className={[
                    "absolute left-2 top-2 text-lg font-bold tabular-nums",
                    isActive ? "text-white/90" : isConfirmed ? "text-navy/50" : "text-white/70",
                  ].join(" ")}
                >
                  {depth.step}
                </span>

                {isConfirmed && !isActive && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-[#6fa300]">
                    <CheckIcon />
                  </span>
                )}

                <div className="flex flex-1 flex-col justify-end p-2">
                  {isActive && (
                    <span className="mb-1.5 inline-flex self-start rounded-md bg-white/95 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-navy">
                      Check now
                    </span>
                  )}
                  <span
                    className={[
                      "text-[11px] font-bold leading-tight",
                      isActive ? "text-white" : isConfirmed ? "text-navy/70" : "text-white/90",
                    ].join(" ")}
                  >
                    {depth.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-lime/40 bg-[#f3f8ee] px-4 py-3.5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${selectedLevel.swatch}33`, color: selectedLevel.accent }}
          >
            <MoistureLevelIcon level={selectedLevel.value} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Selected
            </p>
            <p className="text-base font-bold text-navy">{selectedLevel.label}</p>
            <p className="text-sm text-muted">{selectedLevel.subtitle}</p>
          </div>
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color: selectedLevel.accent }}
          >
            {formatMoistureLevelValue(level)}
          </span>
        </div>

        <div className="relative mt-6 px-1 py-4">
          <div
            className="pointer-events-none relative h-3 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, #c4845c 0%, #84bd00 45%, #5eb8c4 75%, #2d6a7a 100%)",
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/20"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={0.5}
            value={level}
            onChange={(e) => onLevelChange(Number(e.target.value))}
            className="moisture-scale-slider absolute inset-x-0 top-1/2 h-10 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent"
            aria-label="Soil moisture level"
            aria-valuetext={`${selectedLevel.label}: ${selectedLevel.subtitle}`}
          />
        </div>

        <div className="mt-1 flex justify-between gap-1">
          {MOISTURE_LEVELS.map((option) => {
            const isSelected = Math.round(level) === option.value;

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => onLevelChange(option.value)}
                aria-pressed={isSelected}
                className={[
                  "flex flex-1 flex-col items-center gap-1.5 rounded-xl px-1 py-2 transition-all",
                  isSelected ? "bg-white shadow-md ring-1 ring-border/60" : "bg-transparent",
                ].join(" ")}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: option.swatch, color: option.value >= 4 ? "#fff" : "#1a2744" }}
                >
                  <MoistureLevelIcon level={option.value} small />
                </span>
                <span className="text-center text-[10px] font-semibold leading-tight text-navy">
                  {option.label}
                </span>
                <span className="text-[10px] font-medium tabular-nums text-muted">
                  {option.value}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 space-y-3 border-t border-border/60 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onSaveDepth}
          className="flex h-12 w-full items-center justify-between rounded-xl bg-navy px-5 text-base font-semibold text-white transition-all active:scale-[0.98]"
        >
          <span>Save {activeDepth.label}</span>
          <ArrowRightIcon />
        </button>

        <button
          type="button"
          onClick={onFinish}
          disabled={!canFinish}
          className="flex w-full flex-col items-center rounded-xl border border-border bg-surface-elevated px-5 py-3.5 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-base font-bold text-navy">Finish moisture check now</span>
          <span className="mt-0.5 text-sm text-muted">
            {confirmedCount} of {MOISTURE_DEPTHS.length} depths saved
          </span>
        </button>
      </div>
    </div>
  );
}

function MoistureLevelIcon({ level, small }: { level: number; small?: boolean }) {
  const size = small ? 18 : 22;

  switch (level) {
    case 1:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 16c2-4 4-6 6-10 2 4 4 6 6 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M8 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 2:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 3:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
      );
    case 4:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3c-3 4-6 6-6 10a6 6 0 0 0 12 0c0-4-3-6-6-10Z"
            fill="currentColor"
            opacity="0.85"
          />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 14c2 2 4.5 3 8 3s6-1 8-3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 17c2 1.5 4 2 6 2s4-.5 6-2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
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

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}
