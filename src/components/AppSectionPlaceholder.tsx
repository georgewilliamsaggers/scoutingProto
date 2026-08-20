import { AppSection, getAppSectionLabel } from "@/lib/app-sections";

interface AppSectionPlaceholderProps {
  section: AppSection;
}

export function AppSectionPlaceholder({ section }: AppSectionPlaceholderProps) {
  const label = getAppSectionLabel(section);

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal/10 text-teal">
        <PlaceholderIcon />
      </div>
      <h2 className="text-xl font-bold text-navy">{label}</h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
        This section is coming soon. Switch to Scouting to continue using the
        field observation workflow.
      </p>
    </div>
  );
}

function PlaceholderIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}
