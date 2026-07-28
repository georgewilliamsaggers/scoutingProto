import { ReactNode } from "react";

export type CropType =
  | "wheat"
  | "barley"
  | "soy"
  | "corn"
  | "rapeseed"
  | "oats"
  | "default";

export function getCropType(crop: string): CropType {
  const lower = crop.toLowerCase();

  if (lower.includes("wheat")) return "wheat";
  if (lower.includes("barley")) return "barley";
  if (lower.includes("soy")) return "soy";
  if (lower.includes("corn") || lower.includes("maize")) return "corn";
  if (lower.includes("rape") || lower.includes("canola")) return "rapeseed";
  if (lower.includes("oat")) return "oats";

  return "default";
}

interface CropIconProps {
  crop: string;
  size?: number;
  className?: string;
}

export function CropIcon({ crop, size = 24, className = "" }: CropIconProps) {
  const type = getCropType(crop);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {icons[type]}
    </svg>
  );
}

const icons: Record<CropType, ReactNode> = {
  wheat: (
    <>
      <path
        d="M12 3v18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 6c0 1.5 1.2 2.5 3 2.5S15 7.5 15 6M8 9.5c0 1.8 1.8 3 4 3s4-1.2 4-3M7.5 13.5c0 2 2.2 3.5 4.5 3.5s4.5-1.5 4.5-3.5M8 17.5c0 1.6 1.8 2.8 4 2.8s4-1.2 4-2.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="9" cy="6" r="1" fill="currentColor" />
      <circle cx="15" cy="6" r="1" fill="currentColor" />
      <circle cx="8" cy="9.5" r="1" fill="currentColor" />
      <circle cx="16" cy="9.5" r="1" fill="currentColor" />
      <circle cx="7.5" cy="13.5" r="1" fill="currentColor" />
      <circle cx="16.5" cy="13.5" r="1" fill="currentColor" />
    </>
  ),
  barley: (
    <>
      <path
        d="M12 4v17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9.5 7l-1.5-2M14.5 7l1.5-2M9 10.5l-2-2.5M15 10.5l2-2.5M8.5 14.5l-2.5-2M15.5 14.5l2.5-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse cx="9.5" cy="7.5" rx="1.2" ry="2" fill="currentColor" />
      <ellipse cx="14.5" cy="7.5" rx="1.2" ry="2" fill="currentColor" />
      <ellipse cx="9" cy="11.5" rx="1.2" ry="2" fill="currentColor" />
      <ellipse cx="15" cy="11.5" rx="1.2" ry="2" fill="currentColor" />
      <ellipse cx="8.5" cy="15.5" rx="1.2" ry="2" fill="currentColor" />
      <ellipse cx="15.5" cy="15.5" rx="1.2" ry="2" fill="currentColor" />
    </>
  ),
  soy: (
    <>
      <path
        d="M8 8c2-3 6-3 8 0 2 3 0 8-4 10-4-2-6-7-4-10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="11.5" r="1.4" fill="currentColor" />
      <circle cx="14.5" cy="13" r="1.4" fill="currentColor" />
      <circle cx="12.5" cy="15.5" r="1.4" fill="currentColor" />
      <path
        d="M12 18v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  corn: (
    <>
      <path
        d="M12 20V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8.5 10c-2 1.5-2.5 4-1 6M15.5 10c2 1.5 2.5 4 1 6M7 13c-2.5 1-3 4-1.5 6M17 13c2.5 1 3 4 1.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10.5 6c0-1.5 1.5-2.5 1.5-2.5s1.5 1 1.5 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="10"
        y="8"
        width="4"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M11 10.5h2M11 13h2M11 15.5h2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </>
  ),
  rapeseed: (
    <>
      <circle cx="12" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="13" r="2" fill="currentColor" />
      <circle cx="16" cy="13" r="2" fill="currentColor" />
      <circle cx="10" cy="16.5" r="2" fill="currentColor" />
      <circle cx="14" cy="16.5" r="2" fill="currentColor" />
      <path
        d="M12 13.5V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  oats: (
    <>
      <path
        d="M12 4v16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10 8c-1.5 0-2.5 1-2.5 2s1 2 2.5 2M14 8c1.5 0 2.5 1 2.5 2s-1 2-2.5 2M9.5 13c-1.8 0-3 1.2-3 2.8s1.2 2.8 3 2.8M14.5 13c1.8 0 3 1.2 3 2.8s-1.2 2.8-3 2.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
  default: (
    <>
      <path
        d="M12 20c-4-3-6-7-4-11 1.2-2.5 4-3.5 4-3.5s2.8 1 4 3.5c2 4 0 8-4 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 20V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
};
