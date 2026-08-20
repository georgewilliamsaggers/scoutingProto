"use client";

import {
  PLANT_AREA_AFFECTED_LABELS,
  PLANT_CONDITION_LABELS,
} from "@/lib/observations";

interface MoisturePlantStepProps {
  plantConditionScale: number;
  areaAffectedScale: number;
  onPlantConditionChange: (value: number) => void;
  onAreaAffectedChange: (value: number) => void;
}

const PLANT_ACCENT = "#6fa300";
const AREA_ACCENT = "#c4a060";
const AREA_TRACK = "#374151";

export function MoisturePlantStep({
  plantConditionScale,
  areaAffectedScale,
  onPlantConditionChange,
  onAreaAffectedChange,
}: MoisturePlantStepProps) {
  return (
    <div className="space-y-4">
      <MoistureScaleCard
        label="Plant condition"
        question="How healthy do the plants look?"
        value={plantConditionScale}
        options={PLANT_CONDITION_LABELS}
        accentColor={PLANT_ACCENT}
        trackColor="#d1e7dd"
        onChange={onPlantConditionChange}
      />
      <MoistureScaleCard
        label="Area affected"
        question="How much of the field shows this?"
        value={areaAffectedScale}
        options={PLANT_AREA_AFFECTED_LABELS}
        accentColor={AREA_ACCENT}
        trackColor={AREA_TRACK}
        onChange={onAreaAffectedChange}
      />
    </div>
  );
}

function MoistureScaleCard({
  label,
  question,
  value,
  options,
  accentColor,
  trackColor,
  onChange,
}: {
  label: string;
  question: string;
  value: number;
  options: readonly string[];
  accentColor: string;
  trackColor: string;
  onChange: (value: number) => void;
}) {
  const clampedValue = Math.min(options.length, Math.max(1, value));
  const fillPercent = ((clampedValue - 1) / (options.length - 1)) * 100;

  return (
    <div className="rounded-2xl border border-border/80 bg-surface-elevated p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: accentColor }}
          >
            {label}
          </p>
          <h3 className="mt-1 text-base font-bold text-navy">{question}</h3>
        </div>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
        >
          {clampedValue}
        </span>
      </div>

      <div className="relative px-0.5">
        <div
          className="relative h-2 rounded-full"
          style={{ backgroundColor: trackColor }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-200"
            style={{ width: `${fillPercent}%`, backgroundColor: accentColor }}
          />
        </div>
        <input
          type="range"
          min={1}
          max={options.length}
          step={1}
          value={clampedValue}
          onChange={(e) => onChange(Number(e.target.value))}
          className="disease-scale-slider absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent"
          aria-label={question}
        />
      </div>

      <div className="mt-3 flex justify-between gap-0.5">
        {options.map((option, index) => {
          const optionValue = index + 1;
          const selected = clampedValue === optionValue;

          return (
            <div key={option} className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <span
                className={[
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  selected ? "opacity-100" : "opacity-0",
                ].join(" ")}
                style={{ backgroundColor: selected ? accentColor : "transparent" }}
              />
              <span
                className={[
                  "text-center text-[9px] leading-tight",
                  selected ? "font-bold text-navy" : "font-medium text-muted",
                ].join(" ")}
              >
                {option}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
