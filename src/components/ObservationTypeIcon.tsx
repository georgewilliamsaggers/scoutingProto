"use client";

import { OBSERVATION_TYPES, ObservationType } from "@/lib/observations";

export function getObservationTypeConfig(type: ObservationType) {
  return OBSERVATION_TYPES.find((entry) => entry.id === type);
}

export function ObservationTypeBadge({
  type,
  size = "md",
}: {
  type: ObservationType;
  size?: "sm" | "md";
}) {
  const config = getObservationTypeConfig(type);
  if (!config) return null;

  const sizeClasses =
    size === "sm"
      ? "h-9 w-9 rounded-xl text-lg"
      : "h-10 w-10 rounded-xl text-xl";

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center justify-center",
        sizeClasses,
        config.iconContainerClass,
      ].join(" ")}
      aria-hidden="true"
    >
      {config.emoji ?? (
        <ObservationIcon type={type} className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
      )}
    </span>
  );
}

export function ObservationIcon({
  type,
  className = "h-5 w-5",
}: {
  type: ObservationType;
  className?: string;
}) {
  const config = getObservationTypeConfig(type);

  return (
    <svg
      className={[className, config?.iconClass ?? "text-navy"].join(" ")}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {observationIconPaths[type]}
    </svg>
  );
}

const observationIconPaths: Record<ObservationType, React.ReactNode> = {
  disease: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2.5" />
      <path d="M12 19.5V22" />
      <path d="m4.5 4.5 1.8 1.8" />
      <path d="m17.7 17.7 1.8 1.8" />
      <path d="M2 12h2.5" />
      <path d="M19.5 12H22" />
      <path d="m4.5 19.5 1.8-1.8" />
      <path d="m17.7 6.3 1.8-1.8" />
    </>
  ),
  pest: (
    <>
      <ellipse cx="12" cy="13" rx="5" ry="6" />
      <circle cx="12" cy="7" r="2.5" />
      <path d="M7 11 4 9" />
      <path d="M17 11l3-2" />
      <path d="M7 16 4 18" />
      <path d="M17 16l3 2" />
      <path d="M9 7 7 4" />
      <path d="M15 7l2-3" />
    </>
  ),
  weed: (
    <>
      <path d="M12 22V11" />
      <path d="M12 11C12 7.5 8.5 4 5 4c0 3.5 3.5 7 7 7" />
      <path d="M12 11c0-3.5 3.5-7 7-7 0 3.5-3.5 7-7 7" />
      <path d="M12 11c0-2 1.5-4 3.5-5" />
    </>
  ),
  moisture: (
    <>
      <path d="M12 2.69c2.5 3 5 6.5 5 9.5a5 5 0 0 1-10 0c0-3 2.5-6.5 5-9.5Z" />
      <path d="M7 14.5h10" />
    </>
  ),
  other: (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </>
  ),
  population: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 16V11" />
      <path d="M12 16V8" />
      <path d="M16 16v-4" />
    </>
  ),
  voice_note: (
    <>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
    </>
  ),
};
