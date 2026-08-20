"use client";

import { ReactNode } from "react";

interface ScoutingHomePageProps {
  onStartScouting: () => void;
  onExploreFields: () => void;
}

export function ScoutingHomePage({
  onStartScouting,
  onExploreFields,
}: ScoutingHomePageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-7 py-6">
      <div className="mb-8">
        <p className="text-sm leading-relaxed text-muted">
          Start a new scouting walk or review recent observations across your
          fields.
        </p>
      </div>

      <div className="space-y-3">
        <ActionCard
          title="Start scouting"
          description="Choose a field and begin logging observations"
          onClick={onStartScouting}
          icon={<StartScoutingIcon />}
        />
        <ActionCard
          title="Explore fields"
          description="View field history and recent observations"
          onClick={onExploreFields}
          icon={<ExploreIcon />}
        />
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  onClick,
  icon,
}: {
  title: string;
  description: string;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-border/80 bg-surface-elevated p-4 text-left shadow-sm transition-all active:scale-[0.98] active:bg-surface"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-navy">{title}</span>
        <span className="mt-0.5 block text-sm text-muted">{description}</span>
      </span>
      <ChevronRightIcon />
    </button>
  );
}

function StartScoutingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-muted">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
