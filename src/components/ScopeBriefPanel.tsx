"use client";

import { useScopeBrief } from "@/components/ScopeBriefContext";
import { getScopeBriefSection } from "@/lib/scope-brief";

interface ScopeBriefPanelProps {
  onClose?: () => void;
}

export function ScopeBriefPanel({ onClose }: ScopeBriefPanelProps) {
  const { activeSectionId } = useScopeBrief();
  const activeSection = getScopeBriefSection(activeSectionId);

  if (!activeSection) {
    return null;
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      {onClose && (
        <div className="flex shrink-0 justify-end px-4 pt-4 xl:hidden">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close scope brief"
            className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-navy"
          >
            <CloseIcon />
          </button>
        </div>
      )}

      <div className="shrink-0 border-b border-border/60 px-6 py-5">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border-2 border-teal/30 bg-teal/5 px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal">
              Current screen
            </p>
            <h2 className="mt-1 text-xl font-bold text-navy">
              {activeSection.title}
            </h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-navy/90">
              {activeSection.defaultContent}
            </p>
          </div>
        </div>
      </div>

      {activeSection.dataContent && (
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-xl border border-border bg-surface-elevated px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/60">
                Data
              </p>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-navy/90">
                {activeSection.dataContent}
              </pre>
              {activeSection.dataOfflineNote && (
                <div className="mt-4 rounded-lg border-2 border-amber-300/80 bg-amber-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-900">
                    Offline
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-amber-950/90">
                    {activeSection.dataOfflineNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
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
