"use client";

interface MoistureApproachStepProps {
  includePlantCondition: boolean;
  includeSoilMoisture: boolean;
  onTogglePlant: () => void;
  onToggleSoil: () => void;
}

export function MoistureApproachStep({
  includePlantCondition,
  includeSoilMoisture,
  onTogglePlant,
  onToggleSoil,
}: MoistureApproachStepProps) {
  return (
    <>
      <p className="text-sm leading-relaxed text-muted">
        Choose plant condition, soil moisture, or both. Use what makes sense for this
        crop and growth stage.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <ApproachCard
          title="Plant condition"
          description="Wilt, leaf burning and visible growth"
          selected={includePlantCondition}
          onClick={onTogglePlant}
          icon={<PlantIcon />}
        />
        <ApproachCard
          title="Soil moisture"
          description="Check only the depths that matter today"
          selected={includeSoilMoisture}
          onClick={onToggleSoil}
          icon={<SoilIcon />}
        />
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-lime/10 px-4 py-3.5">
        <span className="shrink-0 rounded-full bg-lime/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-lime">
          And / or
        </span>
        <p className="text-sm leading-relaxed text-navy/80">
          One check is valid. Selecting both creates one combined moisture observation.
        </p>
      </div>
    </>
  );
}

function ApproachCard({
  title,
  description,
  selected,
  onClick,
  icon,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "flex min-h-[10.5rem] flex-col rounded-2xl border p-4 text-left transition-all active:scale-[0.98]",
        selected
          ? "border-lime bg-lime/5 ring-2 ring-lime/25"
          : "border-border/80 bg-surface-elevated shadow-sm",
      ].join(" ")}
    >
      <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-lime/10 text-lime">
        {icon}
      </span>
      <p className="text-sm font-bold leading-tight text-navy">{title}</p>
      <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted">{description}</p>
      <span className="mt-3 inline-flex self-start rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold text-muted">
        Optional
      </span>
    </button>
  );
}

function PlantIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M12 12C10 10 8 8 7 6c2 1 3.5 3 5 5"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M12 12c2-2 4-4 5-6-2 1-3.5 3-5 5"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

function SoilIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
    </svg>
  );
}
