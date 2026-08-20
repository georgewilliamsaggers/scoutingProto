"use client";

import {
  getMoistureLevelForValue,
  MOISTURE_DEPTHS,
  MOISTURE_LEVELS,
  MoistureDepthReading,
} from "@/lib/observations";

interface MoistureSoilStepProps {
  readings: MoistureDepthReading[];
  onReadingsChange: (readings: MoistureDepthReading[]) => void;
}

export function MoistureSoilStep({
  readings,
  onReadingsChange,
}: MoistureSoilStepProps) {
  const readingMap = Object.fromEntries(
    readings.map((reading) => [reading.depthId, reading.level])
  );

  function getLevel(depthId: string): number {
    return readingMap[depthId] ?? 3;
  }

  function toggleDepth(depthId: string) {
    if (readingMap[depthId] !== undefined) {
      onReadingsChange(readings.filter((reading) => reading.depthId !== depthId));
      return;
    }

    onReadingsChange([...readings, { depthId, level: 3 }]);
  }

  function updateLevel(depthId: string, level: number) {
    onReadingsChange(
      readings.map((reading) =>
        reading.depthId === depthId ? { ...reading, level } : reading
      )
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {MOISTURE_LEVELS.map((level) => (
          <div key={level.label} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: level.swatch }}
            />
            <span className="text-xs font-medium text-muted">{level.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2.5">
        {MOISTURE_DEPTHS.map((depth) => {
          const isActive = readingMap[depth.id] !== undefined;
          const level = getLevel(depth.id);
          const levelInfo = getMoistureLevelForValue(level);
          const fillPercent = ((level - 1) / 4) * 100;

          return (
            <div
              key={depth.id}
              className={[
                "overflow-hidden rounded-2xl border transition-all",
                isActive
                  ? "border-sky-300 bg-sky-50/60"
                  : "border-border/80 bg-surface-elevated",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => toggleDepth(depth.id)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                <span
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isActive
                      ? "border-sky-500 bg-sky-500 text-white"
                      : "border-border bg-surface text-muted",
                  ].join(" ")}
                >
                  {isActive ? <CheckIcon /> : <PlusIcon />}
                </span>
                <span className="flex-1 text-base font-bold text-navy">{depth.label}</span>
                {isActive ? (
                  <span className="text-sm font-semibold text-navy">{levelInfo.label}</span>
                ) : (
                  <span className="text-sm text-muted">Tap to test</span>
                )}
              </button>

              {isActive && (
                <div className="border-t border-sky-200/80 px-4 pb-4 pt-3">
                  <div className="relative px-0.5">
                    <div className="relative h-2.5 rounded-full bg-border/60">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-teal transition-all duration-200"
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={level}
                      onChange={(e) => updateLevel(depth.id, Number(e.target.value))}
                      className="disease-scale-slider absolute inset-0 h-2.5 w-full cursor-pointer appearance-none bg-transparent"
                      aria-label={`Moisture at ${depth.label}`}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
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

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
